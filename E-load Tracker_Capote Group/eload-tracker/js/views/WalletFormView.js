import View from "./View.js";

const AMOUNTS = [100, 200, 500, 1000];

class WalletFormView extends View {
  constructor() {
    super(".wallet-form");
  }

  render({ balance = 0 } = {}) {
    const chips = AMOUNTS.map(
      a => `<button class="chip-btn" type="button" data-amount="${a}">₱${a}</button>`
    ).join("");

    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<form class="form" novalidate>
        <div class="balance-box">
          <span class="balance-box__label">Current balance</span>
          <strong class="balance-box__value">${this._money(balance)}</strong>
        </div>
        <div class="form__group">
          <label class="form__label" for="topup-amount">Amount (₱)</label>
          <input class="form__input" id="topup-amount" name="amount"
            type="number" min="0" step="0.01" placeholder="e.g. 500" />
        </div>
        <div class="chips">${chips}</div>
        <div class="form__actions">
          <button class="btn" type="submit">Add Top-up</button>
        </div>
      </form>`
    );
  }

  showError(message) {
    this.clearError();
    const form = this._parentElement.querySelector(".form");
    form.insertAdjacentHTML(
      "afterbegin",
      `<p class="error">${this._escape(message)}</p>`
    );
  }

  clearError() {
    this._parentElement.querySelector(".error")?.remove();
  }

  addHandlerAddTopUp(handler) {
    this._parentElement.addEventListener("submit", e => {
      e.preventDefault();
      const amount = parseFloat(new FormData(e.target).get("amount"));
      handler({ amount });
    });

    this._parentElement.addEventListener("click", e => {
      const chip = e.target.closest("[data-amount]");
      if (!chip) return;
      this._parentElement.querySelector("[name=amount]").value = chip.dataset.amount;
    });
  }
}

export default new WalletFormView();
