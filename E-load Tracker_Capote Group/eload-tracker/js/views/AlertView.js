import View from "./View.js";

class AlertView extends View {
  constructor() {
    super(".low-balance");
  }

  render({ status, balance, threshold }) {
    this._clear();
    if (status !== "low") return;

    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert" role="alert">
        ⚠️ Low wallet balance: only ${this._money(balance)} left
        (alert set at ${this._money(threshold)}). Time to top up!
      </div>`
    );
  }
}

export default new AlertView();
