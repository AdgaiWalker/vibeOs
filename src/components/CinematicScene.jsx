import { useRef } from "react";
import { FilmCanvas } from "./FilmCanvas";
import { useSceneProgress } from "../hooks/useSceneProgress";

export function CinematicScene({
  id,
  className = "",
  src,
  mobileSrc,
  mode,
  focus,
  mobileFocus,
  children,
}) {
  const sectionRef = useRef(null);
  const { progress, active } = useSceneProgress(sectionRef);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-chapter={id}
      className={`scene ${className}`}
    >
      <div className="scene__sticky">
        <FilmCanvas
          src={src}
          mobileSrc={mobileSrc}
          progress={progress}
          active={active}
          mode={mode}
          focus={focus}
          mobileFocus={mobileFocus}
        />
        {typeof children === "function"
          ? children({ progress, active })
          : children}
      </div>
    </section>
  );
}
