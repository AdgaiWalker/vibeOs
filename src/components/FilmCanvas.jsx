import { useEffect, useRef, useState } from "react";

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
  uniform sampler2D uImage;
  uniform vec2 uResolution;
  uniform vec2 uTextureResolution;
  uniform vec2 uPointer;
  uniform vec2 uFocus;
  uniform float uPointerPresence;
  uniform float uTime;
  uniform float uProgress;
  uniform float uMode;
  uniform float uMotion;

  vec2 coverUv(vec2 uv) {
    float canvasAspect = uResolution.x / max(uResolution.y, 1.0);
    float textureAspect = uTextureResolution.x / max(uTextureResolution.y, 1.0);
    vec2 scale = vec2(1.0);

    if (canvasAspect > textureAspect) {
      scale.y = textureAspect / canvasAspect;
    } else {
      scale.x = canvasAspect / textureAspect;
    }

    return (uv - 0.5) * scale + uFocus;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 pointerDelta = vUv - uPointer;
    pointerDelta.x *= aspect;
    float distanceToPointer = length(pointerDelta);
    float influence = (1.0 - smoothstep(0.0, 0.34, distanceToPointer))
      * uPointerPresence
      * uMotion;

    float breath = sin(uTime * 0.34 + uv.y * 8.0 + uMode * 0.83);
    float crossBreath = cos(uTime * 0.23 + uv.x * 6.0 - uMode);
    vec2 ambientOffset = vec2(breath, crossBreath) * 0.0018 * uMotion;

    float wave = sin(distanceToPointer * 34.0 - uTime * 2.15 + uProgress * 4.0);
    vec2 localDirection = normalize(
      vec2(pointerDelta.x / max(aspect, 0.001), pointerDelta.y) + vec2(0.0001)
    );
    float modeStrength = 0.014 + mod(uMode, 3.0) * 0.003;
    vec2 localOffset = localDirection * wave * influence * modeStrength;

    vec2 chapterShift = vec2(
      cos(uMode * 1.7) * (uProgress - 0.5) * 0.012,
      sin(uMode * 1.3) * (uProgress - 0.5) * 0.008
    ) * uMotion;

    float zoom = 1.0 - uProgress * 0.018 * uMotion;
    uv = (uv - uFocus) * zoom + uFocus;
    uv += ambientOffset + chapterShift - localOffset;

    float aberration = influence * 0.0022;
    vec3 color;
    color.r = texture2D(uImage, uv + localDirection * aberration).r;
    color.g = texture2D(uImage, uv).g;
    color.b = texture2D(uImage, uv - localDirection * aberration).b;

    float vignette = smoothstep(0.96, 0.26, length(vUv - 0.5));
    color *= mix(0.84, 1.0, vignette);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      color = vec3(0.025, 0.028, 0.035);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

const pointerSubscribers = new Set();
let isGlobalPointerListenerActive = false;

function dispatchPointerEvent(event) {
  pointerSubscribers.forEach((subscriber) => subscriber(event));
}

function subscribeToPointer(subscriber) {
  pointerSubscribers.add(subscriber);

  if (!isGlobalPointerListenerActive) {
    window.addEventListener("pointermove", dispatchPointerEvent, {
      passive: true,
    });
    window.addEventListener("pointercancel", dispatchPointerEvent, {
      passive: true,
    });
    isGlobalPointerListenerActive = true;
  }

  return () => {
    pointerSubscribers.delete(subscriber);

    if (pointerSubscribers.size === 0 && isGlobalPointerListenerActive) {
      window.removeEventListener("pointermove", dispatchPointerEvent);
      window.removeEventListener("pointercancel", dispatchPointerEvent);
      isGlobalPointerListenerActive = false;
    }
  };
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
  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource,
  );
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Shader linking failed");
  }

  return program;
}

export function FilmCanvas({
  src,
  mobileSrc,
  progress,
  active,
  mode = 0,
  focus = [0.5, 0.5],
  mobileFocus = focus,
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(progress);
  const activeRef = useRef(active);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isReady, setIsReady] = useState(false);
  const focusX = focus[0];
  const focusY = focus[1];
  const mobileFocusX = mobileFocus[0];
  const mobileFocusY = mobileFocus[1];

  progressRef.current = progress;
  activeRef.current = active;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const updateSource = () => {
      setCurrentSrc(media.matches && mobileSrc ? mobileSrc : src);
    };

    updateSource();
    media.addEventListener("change", updateSource);
    return () => media.removeEventListener("change", updateSource);
  }, [mobileSrc, src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    setIsReady(false);
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) return undefined;

    let program;
    try {
      program = createProgram(gl);
    } catch (error) {
      console.error(error);
      return undefined;
    }

    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name) => gl.getUniformLocation(program, name);
    const uniforms = {
      image: uniform("uImage"),
      resolution: uniform("uResolution"),
      textureResolution: uniform("uTextureResolution"),
      pointer: uniform("uPointer"),
      focus: uniform("uFocus"),
      pointerPresence: uniform("uPointerPresence"),
      time: uniform("uTime"),
      progress: uniform("uProgress"),
      mode: uniform("uMode"),
      motion: uniform("uMotion"),
    };

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const image = new Image();
    let imageLoaded = false;
    const textureSize = { width: 1, height: 1 };
    const pointer = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      presence: 0,
      targetPresence: 0,
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 700px)");

    const uploadImage = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      textureSize.width = image.naturalWidth;
      textureSize.height = image.naturalHeight;
      imageLoaded = true;
      setIsReady(true);
    };

    image.addEventListener("load", uploadImage);
    image.src = currentSrc;

    const handlePointerEvent = (event) => {
      if (!activeRef.current || event.type === "pointercancel") {
        pointer.targetPresence = 0;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      pointer.targetPresence = inside ? 1 : 0;
      if (!inside) return;

      pointer.targetX = (event.clientX - rect.left) / rect.width;
      pointer.targetY = 1 - (event.clientY - rect.top) / rect.height;
    };

    const unsubscribePointer = subscribeToPointer(handlePointerEvent);

    let animationFrame = 0;
    let lastDraw = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const render = (timestamp) => {
      animationFrame = window.requestAnimationFrame(render);
      if (!imageLoaded) return;

      const shouldDraw = motionQuery.matches
        ? timestamp - lastDraw > 900
        : activeRef.current || timestamp - lastDraw > 900;
      if (!shouldDraw) return;
      lastDraw = timestamp;

      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;
      pointer.presence +=
        (pointer.targetPresence - pointer.presence) * 0.085;

      const resolvedFocus = mobileQuery.matches
        ? [mobileFocusX, mobileFocusY]
        : [focusX, focusY];
      const motion = motionQuery.matches ? 0 : 1;

      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.image, 0);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(
        uniforms.textureResolution,
        textureSize.width,
        textureSize.height,
      );
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      gl.uniform2f(uniforms.focus, resolvedFocus[0], resolvedFocus[1]);
      gl.uniform1f(uniforms.pointerPresence, pointer.presence);
      gl.uniform1f(uniforms.time, timestamp / 1000);
      gl.uniform1f(uniforms.progress, progressRef.current);
      gl.uniform1f(uniforms.mode, mode);
      gl.uniform1f(uniforms.motion, motion);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      unsubscribePointer();
      image.removeEventListener("load", uploadImage);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [
    currentSrc,
    focusX,
    focusY,
    mobileFocusX,
    mobileFocusY,
    mode,
  ]);

  return (
    <div
      ref={containerRef}
      className={`film-canvas ${isReady ? "is-ready" : ""} ${className}`}
      aria-hidden="true"
    >
      <img src={currentSrc} alt="" className="film-canvas__fallback" />
      <canvas ref={canvasRef} className="film-canvas__surface" />
    </div>
  );
}
