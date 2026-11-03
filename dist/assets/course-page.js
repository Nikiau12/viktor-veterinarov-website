(() => {
  const index = document.querySelector(".course-index");

  if (!index) return;

  const nav = index.querySelector("nav");
  const links = Array.from(index.querySelectorAll('a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!nav || !links.length || !sections.length) return;

  let activeId = "";
  let ticking = false;

  const setActive = (id) => {
    if (!id || id === activeId) return;

    activeId = id;

    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");

        if (nav.scrollWidth > nav.clientWidth) {
          const left = link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2;
          nav.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveSection = () => {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const indexHeight = window.innerWidth <= 900 ? index.offsetHeight : 0;
    const readingLine = headerHeight + indexHeight + Math.min(window.innerHeight * 0.26, 220);
    let current = sections[0];

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= readingLine) {
        current = section;
      }
    });

    const pageBottom = window.scrollY + window.innerHeight;
    const documentBottom = document.documentElement.scrollHeight - 2;

    if (pageBottom >= documentBottom) {
      current = sections[sections.length - 1];
    }

    setActive(current.id);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateActiveSection);
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      setActive(id);
    });
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateActiveSection();
})();
