const abstracts = document.querySelectorAll("details.abstract");
const mobileQuery = window.matchMedia("(max-width: 700px)");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const chapters = document.querySelectorAll(".paper-chapter");

function setAbstractState(event) {
  const isMobile = event.matches;
  abstracts.forEach((abstract) => {
    abstract.open = !isMobile;
  });
}

setAbstractState(mobileQuery);
mobileQuery.addEventListener("change", setAbstractState);

let scrollFrame;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updatePresentation() {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;
  const viewportHeight = window.innerHeight;

  chapters.forEach((chapter) => {
    const rect = chapter.getBoundingClientRect();
    const travel = Math.max(1, rect.height - viewportHeight + headerHeight);
    const progress = clamp((headerHeight - rect.top) / travel, 0, 1);

    chapter.style.setProperty("--chapter-progress", progress.toFixed(4));
    chapter.style.setProperty("--image-scale", (1 + progress * 0.035).toFixed(4));
    chapter.style.setProperty("--title-shift", `${(-14 * progress).toFixed(2)}px`);
  });

  scrollFrame = undefined;
}

function requestPresentationUpdate() {
  if (scrollFrame || motionQuery.matches || mobileQuery.matches) return;
  scrollFrame = window.requestAnimationFrame(updatePresentation);
}

if (chapters.length) {
  if (!motionQuery.matches && !mobileQuery.matches) updatePresentation();
  window.addEventListener("scroll", requestPresentationUpdate, { passive: true });
  window.addEventListener("resize", requestPresentationUpdate);
  mobileQuery.addEventListener("change", requestPresentationUpdate);
  motionQuery.addEventListener("change", requestPresentationUpdate);
}
