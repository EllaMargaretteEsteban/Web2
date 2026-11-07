import View from "./View.js";

class PagesView extends View {
  _lockUntil = 0;

  constructor() {
    super(".container");
  }

  scrollTo(page) {
    // Pause the scroll-spy while the smooth scroll is running
    this._lockUntil = Date.now() + 1000;
    this._parentElement
      .querySelector(`[data-page="${page}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Buttons inside the page (e.g. "+ New sale", "View all")
  addHandlerNavigate(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest("[data-nav]");
      if (btn) handler(btn.dataset.nav);
    });
  }

  // Tells the controller which section is on screen while scrolling
  addHandlerScroll(handler) {
    const sections = [...this._parentElement.querySelectorAll("[data-page]")];
    let waiting = false;

    window.addEventListener("scroll", () => {
      if (waiting || Date.now() < this._lockUntil) return;
      waiting = true;

      requestAnimationFrame(() => {
        waiting = false;
        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        const line = window.innerHeight * 0.4;
        const current = atBottom
          ? sections.at(-1)
          : sections.filter(s => s.getBoundingClientRect().top <= line).at(-1) || sections[0];

        handler(current.dataset.page);
      });
    });
  }
}

export default new PagesView();
