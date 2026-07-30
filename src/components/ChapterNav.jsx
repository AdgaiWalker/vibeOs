export function ChapterNav({ chapters, activeChapter }) {
  const handleJump = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <nav className="chapter-nav" aria-label="页面章节">
      <span className="chapter-nav__track" aria-hidden="true" />
      {chapters.map((chapter, index) => (
        <button
          key={chapter.id}
          className={`chapter-nav__item ${
            activeChapter === chapter.id ? "is-active" : ""
          }`}
          type="button"
          onClick={() => handleJump(chapter.id)}
          aria-label={`前往${chapter.label}`}
          aria-current={activeChapter === chapter.id ? "step" : undefined}
        >
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        </button>
      ))}
    </nav>
  );
}
