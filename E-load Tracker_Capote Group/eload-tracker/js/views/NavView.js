import View from "./View.js";

const icon = paths =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const PAGES = [
  ["home", icon('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'), "Home"],
  ["add", icon('<path d="M12 5v14M5 12h14"/>'), "Add"],
  ["history", icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'), "History"],
  ["settings", icon('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>'), "Settings"],
];

class NavView extends View {
  constructor() {
    super(".nav");
  }

  render(active) {
    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      PAGES.map(
        ([id, svg, label]) => `
        <button class="nav__item ${id === active ? "nav__item--active" : ""}"
          type="button" data-nav="${id}" ${id === active ? 'aria-current="page"' : ""}>
          <span class="nav__icon">${svg}</span>
          <span class="nav__label">${label}</span>
        </button>`
      ).join("")
    );
  }

  addHandlerNavigate(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest("[data-nav]");
      if (btn) handler(btn.dataset.nav);
    });
  }
}

export default new NavView();
