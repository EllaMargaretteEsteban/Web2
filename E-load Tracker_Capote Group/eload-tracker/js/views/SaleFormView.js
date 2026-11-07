import View from "./View.js";

const PRICES = [10, 20, 50, 100];

class SaleFormView extends View {
  constructor() {
    super(".sale-form");
  }

  // values = what to show in the fields; earn = profit calculated by the model
  render({ networks, values = {}, isEditing = false, editingId = "", error = "", earn = 0 }) {
    const selected = values.network || networks[0];
    const show = n => (Number.isFinite(n) ? n : "");

    const networkChips = networks
      .map(
        n => `<label class="chip">
        <input type="radio" name="network" value="${n}" ${n === selected ? "checked" : ""} />
        <span class="tag tag--${n.toLowerCase()}">${n}</span>
      </label>`
      )
      .join("");

    const priceChips = PRICES.map(
      p => `<button class="chip-btn" type="button" data-price="${p}">₱${p}</button>`
    ).join("");

    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<form class="form" novalidate>
        ${error ? `<p class="error">${this._escape(error)}</p>` : ""}
        <input type="hidden" name="id" value="${this._escape(editingId)}" />

        <div class="form__group">
          <span class="form__label">Network</span>
          <div class="chips">${networkChips}</div>
        </div>

        <div class="form__pair">
          <div class="form__group">
            <label class="form__label" for="sale-amount">Wallet cost (₱)</label>
            <input class="form__input" id="sale-amount" name="amount" type="number"
              min="0" step="0.01" placeholder="e.g. 48"
              value="${this._escape(show(values.amount))}" />
          </div>
          <div class="form__group">
            <label class="form__label" for="sale-price">Sold for (₱)</label>
            <input class="form__input" id="sale-price" name="price" type="number"
              min="0" step="0.01" placeholder="e.g. 50"
              value="${this._escape(show(values.price))}" />
          </div>
        </div>

        <div class="chips">${priceChips}</div>

        <div class="earn">
          <span>You will earn</span>
          <strong data-earn></strong>
        </div>

        <div class="form__actions">
          <button class="btn" type="submit">${isEditing ? "Save Changes" : "Add Sale"}</button>
          ${isEditing ? `<button class="btn btn--secondary" type="button" data-cancel>Cancel</button>` : ""}
        </div>
      </form>`
    );

    this.showEarn(earn);
  }

  // Only displays the number the controller got from the model
  showEarn(profit) {
    const output = this._parentElement.querySelector("[data-earn]");
    if (!output) return;

    output.textContent = `${profit < 0 ? "−" : ""}${this._money(Math.abs(profit))}`;
    output.classList.toggle("earn__loss", profit < 0);
  }

  _readNumbers() {
    const form = this._parentElement.querySelector("form");
    return {
      amount: parseFloat(form.elements.amount.value),
      price: parseFloat(form.elements.price.value),
    };
  }

  addHandlerAddSale(handler) {
    this._parentElement.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(e.target);
      handler({
        id: data.get("id") || "",
        network: data.get("network"),
        ...this._readNumbers(),
      });
    });

    this._parentElement.addEventListener("click", e => {
      if (e.target.closest("[data-cancel]")) handler({ cancel: true });
    });
  }

  // Fires on typing and when a quick-price chip is tapped
  addHandlerPreview(handler) {
    this._parentElement.addEventListener("input", () => handler(this._readNumbers()));

    this._parentElement.addEventListener("click", e => {
      const chip = e.target.closest("[data-price]");
      if (!chip) return;
      this._parentElement.querySelector("[name=price]").value = chip.dataset.price;
      handler(this._readNumbers());
    });
  }
}

export default new SaleFormView();
