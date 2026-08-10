import { useEffect, useRef, useState } from "react";
import { frameForPosition } from "../state/cinematicSequence";

const vertexShaderSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uFromImage;
  uniform sampler2D uToImage;
  uniform sampler2D uOrbitImage;
  uniform vec2 uResolution;
  uniform vec2 uFromResolution;
  uniform vec2 uToResolution;
  uniform vec2 uOrbitResolution;
  uniform vec2 uFromFocus;
  uniform vec2 uToFocus;
  uniform vec2 uPointer;
  uniform float uFromZoom;
  uniform float uToZoom;
  uniform float uPointerPresence;
  uniform float uTime;
  uniform float uSlide;
  uniform float uEdgeOffset;
  uniform float uMode;
  uniform float uMotion;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec2 coverUv(
    vec2 uv,
    vec2 textureResolution,
    vec2 focus,
    float zoom
  ) {
    float canvasAspect = uResolution.x / max(uResolution.y, 1.0);
    float textureAspect = textureResolution.x / max(textureResolution.y, 1.0);
    vec2 scale = vec2(1.0);

    if (canvasAspect > textureAspect) {
      scale.y = textureAspect / canvasAspect;
    } else {
      scale.x = canvasAspect / textureAspect;
    }

    return (uv - 0.5) * scale * zoom + focus;
  }

  void main() {
    vec2 pointerShift =
      (uPointer - 0.5) * 0.003 * uPointerPresence * uMotion;

    float slide = clamp(uSlide, 0.0, 1.0);
    vec2 fromViewport = vec2(vUv.x, vUv.y - slide - uEdgeOffset);
    vec2 toViewport = vec2(vUv.x, vUv.y + (1.0 - slide) - uEdgeOffset);

    vec2 fromUv = coverUv(
      fromViewport,
      uFromResolution,
      uFromFocus,
      uFromZoom
    );
    vec2 toUv = coverUv(
      toViewport,
      uToResolution,
      uToFocus,
      uToZoom
    );
    vec2 orbitUv = coverUv(vUv, uOrbitResolution, vec2(0.5), 1.0);

    vec3 orbitColor = texture2D(uOrbitImage, orbitUv).rgb;
    float orbitLuma = dot(orbitColor, vec3(0.2126, 0.7152, 0.0722));
    float orbitMask = smoothstep(0.075, 0.46, orbitLuma);
    float seamNoise =
      (orbitLuma - 0.5) * 0.008
      + sin(vUv.x * 9.0 + uTime * 0.35) * 0.002 * uMotion;
    float seam = slide + seamNoise;
    float transitionMask = 1.0 - smoothstep(
      seam - 0.012,
      seam + 0.012,
      vUv.y
    );
    transitionMask *= smoothstep(0.0, 0.018, slide);
    transitionMask = mix(
      transitionMask,
      1.0,
      smoothstep(0.982, 1.0, slide)
    );

    fromUv += pointerShift;
    toUv += pointerShift;

    vec3 fromColor = texture2D(uFromImage, fromUv).rgb;
    vec3 toColor = texture2D(uToImage, toUv).rgb;
    vec3 color = mix(fromColor, toColor, transitionMask);

    float edgeCover = 1.0;
    if (uEdgeOffset < 0.0) {
      float edge = 1.0 + uEdgeOffset;
      edgeCover = 1.0 - smoothstep(edge - 0.006, edge + 0.006, vUv.y);
    } else if (uEdgeOffset > 0.0) {
      edgeCover = smoothstep(
        uEdgeOffset - 0.006,
        uEdgeOffset + 0.006,
        vUv.y
      );
    }
    color = mix(vec3(0.016, 0.020, 0.027), color, edgeCover);

    color.b += orbitMask * 0.018 + uMode * 0.002;
    color.r *= 0.985;
    float vignette = smoothstep(1.02, 0.28, length(vUv - 0.5));
    color *= mix(0.77, 1.0, vignette);

    float grain = hash(
      gl_FragCoord.xy + floor(uTime * 12.0) * vec2(37.0, 17.0)
    ) - 0.5;
    color += grain * (0.012 + uMotion * 0.004);

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;

const imageCache = new Map();

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);

  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener(
      "error",
      () => reject(new Error(`Unable to load image: ${src}`)),
      { once: true },
    );
    image.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "Shader compilation failed");
  }
  return shader;
}

function createProgram(gl) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Program link failed");
  }
  return program;
}

function createTexture(gl, image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image,
  );
  return texture;
}

function visualSource(visual, mobile) {
  return mobile && visual.mobileSrc ? visual.mobileSrc : visual.src;
}

function visualFocus(visual, mobile) {
  return mobile && visual.mobileFocus ? visual.mobileFocus : visual.focus;
}

function visualZoom(visual, mobile) {
  return mobile && visual.mobileZoom ? visual.mobileZoom : visual.zoom;
}

function FallbackPictures({ visuals, trackRef }) {
  return (
    <div
      ref={trackRef}
      className="film-canvas__fallback"
      aria-hidden="true"
    >
      {visuals.map((visual, index) => (
        <picture
          key={visual.id}
          style={{ transform: `translate3d(0, ${index * 100}%, 0)` }}
        >
          {visual.mobileSrc ? (
            <source media="(max-width: 700px)" srcSet={visual.mobileSrc} />
          ) : null}
          <img src={visual.src} alt="" />
        </picture>
      ))}
    </div>
  );
}

export function FilmCanvas({
  visuals,
  fallbackTrackRef,
  presenterRef,
  orbitSrc,
  orbitMobileSrc,
  visualPositionRef,
  paused,
  reducedMotion,
  manipulating,
  onReady,
  onRendererDegraded,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef({ paused, reducedMotion, manipulating });
  const degradedRef = useRef(onRendererDegraded);
  const readyRef = useRef(onReady);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  settingsRef.current = { paused, reducedMotion, manipulating };
  degradedRef.current = onRendererDegraded;
  readyRef.current = onReady;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    presenterRef.current = null;
    setReady(false);
    setFallback(false);

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setFallback(true);
      degradedRef.current?.("webgl-unavailable");
      readyRef.current?.();
      return undefined;
    }

    let program;
    try {
      program = createProgram(gl);
    } catch (error) {
      console.error(error);
      setFallback(true);
      degradedRef.current?.("shader-compilation");
      readyRef.current?.();
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      fromImage: gl.getUniformLocation(program, "uFromImage"),
      toImage: gl.getUniformLocation(program, "uToImage"),
      orbitImage: gl.getUniformLocation(program, "uOrbitImage"),
      resolution: gl.getUniformLocation(program, "uResolution"),
      fromResolution: gl.getUniformLocation(program, "uFromResolution"),
      toResolution: gl.getUniformLocation(program, "uToResolution"),
      orbitResolution: gl.getUniformLocation(program, "uOrbitResolution"),
      fromFocus: gl.getUniformLocation(program, "uFromFocus"),
      toFocus: gl.getUniformLocation(program, "uToFocus"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      fromZoom: gl.getUniformLocation(program, "uFromZoom"),
      toZoom: gl.getUniformLocation(program, "uToZoom"),
      pointerPresence: gl.getUniformLocation(program, "uPointerPresence"),
      time: gl.getUniformLocation(program, "uTime"),
      slide: gl.getUniformLocation(program, "uSlide"),
      edgeOffset: gl.getUniformLocation(program, "uEdgeOffset"),
      mode: gl.getUniformLocation(program, "uMode"),
      motion: gl.getUniformLocation(program, "uMotion"),
    };

    let destroyed = false;
    let animationFrame = 0;
    let lastTimestamp = 0;
    let ambientTime = 0;
    const pointer = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      presence: 0,
      targetPresence: 0,
    };
    let textures = [];
    let textureSizes = [];
    let orbitTexture = null;
    let orbitSize = [1, 1];
    let bounds = { left: 0, top: 0, width: 1, height: 1 };
    let resizeVersion = 0;
    let lastDrawPosition = Number.NaN;
    let lastDrawMotion = -1;
    let lastDrawResizeVersion = -1;
    let lastDrawGrainFrame = -1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      bounds = {
        left: rect.left,
        top: rect.top,
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      };
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.5);
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        resizeVersion += 1;
      }
    };

    const handlePointerMove = (event) => {
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.left + bounds.width &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.top + bounds.height;
      pointer.targetPresence = inside ? 1 : 0;
      if (!inside) return;
      pointer.targetX = (event.clientX - bounds.left) / bounds.width;
      pointer.targetY = 1 - (event.clientY - bounds.top) / bounds.height;
    };
    const handlePointerLeave = () => {
      pointer.targetPresence = 0;
    };

    const draw = (visualPosition, settings) => {
      const motion = settings.reducedMotion || settings.paused ? 0 : 1;
      if (textures.length === visuals.length && orbitTexture) {
        const grainFrame = Math.floor(ambientTime * 12);
        const shouldDraw =
          visualPosition !== lastDrawPosition ||
          motion !== lastDrawMotion ||
          resizeVersion !== lastDrawResizeVersion ||
          (motion > 0 && grainFrame !== lastDrawGrainFrame);

        if (!shouldDraw) {
          return;
        }

        const frame = frameForPosition(visualPosition, visuals.length);
        const fromVisual = visuals[frame.index];
        const toVisual = visuals[frame.nextIndex];
        const fromFocus = visualFocus(fromVisual, isMobile);
        const toFocus = visualFocus(toVisual, isMobile);

        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[frame.index]);
        gl.uniform1i(uniforms.fromImage, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[frame.nextIndex]);
        gl.uniform1i(uniforms.toImage, 1);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, orbitTexture);
        gl.uniform1i(uniforms.orbitImage, 2);

        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.fromResolution, ...textureSizes[frame.index]);
        gl.uniform2f(uniforms.toResolution, ...textureSizes[frame.nextIndex]);
        gl.uniform2f(uniforms.orbitResolution, ...orbitSize);
        gl.uniform2f(uniforms.fromFocus, ...fromFocus);
        gl.uniform2f(uniforms.toFocus, ...toFocus);
        gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
        gl.uniform1f(uniforms.fromZoom, visualZoom(fromVisual, isMobile));
        gl.uniform1f(uniforms.toZoom, visualZoom(toVisual, isMobile));
        gl.uniform1f(
          uniforms.pointerPresence,
          settings.manipulating ? pointer.presence : 0,
        );
        gl.uniform1f(uniforms.time, ambientTime);
        gl.uniform1f(uniforms.slide, frame.local);
        gl.uniform1f(uniforms.edgeOffset, frame.edgeOffset);
        gl.uniform1f(
          uniforms.mode,
          fromVisual.mode + (toVisual.mode - fromVisual.mode) * frame.local,
        );
        gl.uniform1f(uniforms.motion, motion);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        lastDrawPosition = visualPosition;
        lastDrawMotion = motion;
        lastDrawResizeVersion = resizeVersion;
        lastDrawGrainFrame = grainFrame;
      }
    };

    const present = (visualPosition) => {
      if (destroyed) return;
      draw(visualPosition, settingsRef.current);
    };
    presenterRef.current = present;

    const render = (timestamp) => {
      if (destroyed) return;
      const dt = lastTimestamp ? Math.min(0.05, (timestamp - lastTimestamp) / 1000) : 0;
      lastTimestamp = timestamp;

      const settings = settingsRef.current;
      const motion = settings.reducedMotion || settings.paused ? 0 : 1;
      if (motion > 0) {
        ambientTime += dt;
        const positionEase = 1 - Math.exp(-dt * 8.5);
        const presenceEase = 1 - Math.exp(-dt * 10.5);
        pointer.x += (pointer.targetX - pointer.x) * positionEase;
        pointer.y += (pointer.targetY - pointer.y) * positionEase;
        pointer.presence +=
          (pointer.targetPresence - pointer.presence) * presenceEase;
      }

      draw(visualPositionRef.current, settings);

      animationFrame = window.requestAnimationFrame(render);
    };

    const sources = visuals.map((visual) => visualSource(visual, isMobile));
    const selectedOrbit = isMobile && orbitMobileSrc ? orbitMobileSrc : orbitSrc;

    Promise.all([...sources.map(loadImage), loadImage(selectedOrbit)])
      .then((images) => {
        if (destroyed) return;
        const sceneImages = images.slice(0, visuals.length);
        const orbitImage = images[images.length - 1];
        textures = sceneImages.map((image) => createTexture(gl, image));
        textureSizes = sceneImages.map((image) => [
          image.naturalWidth,
          image.naturalHeight,
        ]);
        orbitTexture = createTexture(gl, orbitImage);
        orbitSize = [orbitImage.naturalWidth, orbitImage.naturalHeight];
        present(visualPositionRef.current);
        setReady(true);
        readyRef.current?.();
      })
      .catch((error) => {
        if (destroyed) return;
        console.error(error);
        setFallback(true);
        degradedRef.current?.("texture-load");
        readyRef.current?.();
      });

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(resize);
    resizeObserver?.observe(container);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointercancel", handlePointerLeave, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    resize();
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      destroyed = true;
      if (presenterRef.current === present) presenterRef.current = null;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointercancel", handlePointerLeave);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      resizeObserver?.disconnect();
      textures.forEach((texture) => gl.deleteTexture(texture));
      if (orbitTexture) gl.deleteTexture(orbitTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [
    isMobile,
    orbitMobileSrc,
    orbitSrc,
    presenterRef,
    visualPositionRef,
    visuals,
  ]);

  return (
    <div
      ref={containerRef}
      className={`film-canvas ${ready ? "is-ready" : ""} ${fallback ? "is-fallback" : ""}`}
      aria-hidden="true"
    >
      <FallbackPictures visuals={visuals} trackRef={fallbackTrackRef} />
      <canvas ref={canvasRef} className="film-canvas__surface" />
    </div>
  );
}
