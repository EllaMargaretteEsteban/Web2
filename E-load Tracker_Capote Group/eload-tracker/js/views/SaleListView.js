import View from "./View.js";

class SaleListView extends View {
  constructor() {
    super(".sale-list");
  }

  render(sales) {
    this._clear();

    if (!sales.length) {
      this._parentElement.insertAdjacentHTML(
        "afterbegin",
        `<div class="empty-state">No sales found. Add a sale above or change your filters.</div>`
      );
      return;
    }

    const html = [...sales]
      .reverse()
      .map(sale => this._renderSale(sale))
      .join("");
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  _renderSale(sale) {
    const profit = sale.price - sale.amount;
    const date = new Date(sale.date).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const tagClass = String(sale.network).toLowerCase();

    return `
      <article class="sale">
        <div class="sale__body">
          <div class="sale__main">
            <div>
              <h3 class="sale__title">E-load Sale</h3>
              <p class="sale__date">${this._escape(date)}</p>
            </div>
            <span class="tag tag--${this._escape(tagClass)}">${this._escape(sale.network)}</span>
          </div>
          <div class="sale__details">
            <div class="sale__detail">
              <span class="sale__detail-label">Wallet cost</span>
              <span class="sale__detail-value">${this._money(sale.amount)}</span>
            </div>
            <div class="sale__detail">
              <span class="sale__detail-label">Sold for</span>
              <span class="sale__detail-value">${this._money(sale.price)}</span>
            </div>
            <div class="sale__detail">
              <span class="sale__detail-label">Profit</span>
              <span class="sale__detail-value">${this._money(profit)}</span>
            </div>
          </div>
        </div>
        <div class="sale__actions">
          <button class="btn btn--edit" type="button" data-edit="${this._escape(sale.id)}">Edit</button>
          <button class="btn btn--delete" type="button" data-delete="${this._escape(sale.id)}">Delete</button>
        </div>
      </article>`;
  }

  addHandlerEdit(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest("[data-edit]");
      if (!btn) return;
      handler(btn.dataset.edit);
    });
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest("[data-delete]");
      if (!btn) return;
      if (confirm("Delete this sale?")) handler(btn.dataset.delete);
    });
  }
}

export default new SaleListView();
