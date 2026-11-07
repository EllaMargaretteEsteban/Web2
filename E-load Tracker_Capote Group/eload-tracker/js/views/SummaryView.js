import View from "./View.js";

class SummaryView extends View {
  constructor() {
    super(".summary");
  }

  render({ capital, sales, profit }) {
    const profitClass = profit < 0 ? "loss" : "profit";
    const profitLabel = profit < 0 ? "Loss" : "Profit";

    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `${this._item("capital", "Capital", capital, "Total top-ups")}
       ${this._item("sales", "Total Sales", sales, "All time")}
       ${this._item(profitClass, profitLabel, profit, "All time")}`
    );
  }

  _item(modifier, label, value, sub) {
    return `
      <div class="summary__item summary__item--${modifier}">
        <span class="summary__label">${label}</span>
        <span class="summary__value">${this._money(value)}</span>
        <span class="summary__sub">${sub}</span>
      </div>`;
  }
}

export default new SummaryView();
