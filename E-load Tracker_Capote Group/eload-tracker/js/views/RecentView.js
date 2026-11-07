import View from "./View.js";

class RecentView extends View {
  constructor() {
    super(".recent");
  }

  render(sales) {
    this._clear();

    if (!sales.length) {
      this._parentElement.insertAdjacentHTML(
        "afterbegin",
        `<div class="empty-state">No sales yet. Tap “+ New sale” to start!</div>`
      );
      return;
    }

    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      sales
        .map(sale => {
          const time = new Date(sale.date).toLocaleString("en-PH", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
          const profit = sale.price - sale.amount;
          return `
          <div class="recent-row">
            <span class="tag tag--${this._escape(String(sale.network).toLowerCase())}">${this._escape(sale.network)}</span>
            <span class="recent-row__time">${this._escape(time)}</span>
            <strong>${profit >= 0 ? "+" : "−"}${this._money(Math.abs(profit))}</strong>
          </div>`;
        })
        .join("")
    );
  }
}

export default new RecentView();
