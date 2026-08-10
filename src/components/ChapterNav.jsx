export function ChapterNav({ scenes, current, busy, onSelect }) {
  return (
    <nav className="chapter-nav" aria-label="六幕导航">
      {scenes.map((scene) => {
        const active = current === scene.index;
        return (
          <button
            key={scene.id}
            className={`chapter-nav__item ${active ? "is-active" : ""}`}
            type="button"
            onClick={(event) =>
              onSelect(
                scene.index,
                event.detail === 0 ? "keyboard" : "rail",
              )
            }
            aria-label={`第 ${scene.index + 1} 幕：${scene.label}`}
            aria-current={active ? "step" : undefined}
            data-pending={busy && !active ? "true" : undefined}
          >
            <span className="chapter-nav__number" aria-hidden="true">
              {String(scene.index + 1).padStart(2, "0")}
            </span>
            <span className="chapter-nav__line" aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
