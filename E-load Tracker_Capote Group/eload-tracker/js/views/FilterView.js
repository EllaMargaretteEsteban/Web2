import View from "./View.js";

const PERIODS = [
  ["all", "All time"],
  ["today", "Today"],
  ["week", "Last 7 days"],
  ["month", "This month"],
];

class FilterView extends View {
  constructor() {
    super(".filter-bar");
  }

  render({ network, period }, { count, sales, profit }, networks) {
    const networkOptions = ["All", ...networks]
      .map(n => `<option value="${n}" ${n === network ? "selected" : ""}>${n === "All" ? "All networks" : n}</option>`)
      .join("");

    const periodOptions = PERIODS.map(
      ([value, label]) =>
        `<option value="${value}" ${value === period ? "selected" : ""}>${label}</option>`
    ).join("");

    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<div class="filters">
        <div class="form__group">
          <label class="form__label" for="filter-network">Network</label>
          <select class="form__input" id="filter-network" name="network">${networkOptions}</select>
        </div>
        <div class="form__group">
          <label class="form__label" for="filter-period">Period</label>
          <select class="form__input" id="filter-period" name="period">${periodOptions}</select>
        </div>
        <p class="filters__result">
          ${count} sale${count === 1 ? "" : "s"} • sold ${this._money(sales)} • profit ${this._money(profit)}
        </p>
        <button class="btn" type="button" data-export>Export CSV</button>
      </div>`
    );
  }

  addHandlerFilter(handler) {
    this._parentElement.addEventListener("change", () => {
      handler({
        network: this._parentElement.querySelector("[name=network]").value,
        period: this._parentElement.querySelector("[name=period]").value,
      });
    });
  }

  addHandlerExport(handler) {
    this._parentElement.addEventListener("click", e => {
      if (e.target.closest("[data-export]")) handler();
    });
  }

  download(content, filename) {
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export default new FilterView();
