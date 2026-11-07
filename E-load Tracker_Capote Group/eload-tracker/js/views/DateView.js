import View from "./View.js";

class DateView extends View {
  constructor() {
    super(".topbar__date--today");
  }

  render(iso) {
    this._parentElement.textContent = new Date(iso).toLocaleDateString("en-PH", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
}

export default new DateView();
