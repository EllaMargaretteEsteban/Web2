import View from "./View.js";

const STATUS_TEXT = {
  empty: "Add a top-up to start",
  low: "Low – time to top up",
  healthy: "Daghan pa",
};

class HeroView extends View {
  constructor() {
    super(".hero");
  }

  render({ wallet, today, goal, networks }) {
    const chips = networks
      .map(
        n =>
          `<button class="chip-btn tag--${n.toLowerCase()}" type="button" data-quick="${this._escape(n)}">+ ${this._escape(n)}</button>`
      )
      .join("");

    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<div class="hero__card hero__card--balance">
        <span class="hero__label">Wallet Balance</span>
        <span class="hero__value">${this._money(wallet.balance)}</span>
        <div class="hero__row"><span>Low-balance alert at ${this._money(wallet.threshold)}</span><span>${STATUS_TEXT[wallet.status]}</span></div>
        <div class="bar"><div class="bar__fill" style="width:${wallet.percent}%"></div></div>
        <span class="hero__label hero__label--space">Quick sell</span>
        <div class="chips">${chips}</div>
      </div>
      <div class="hero__card hero__card--today">
        <span class="hero__label">Today's profit</span>
        <span class="hero__value">${this._money(today.profit)}</span>
        <span class="hero__meta">${today.count} sale${today.count === 1 ? "" : "s"} • sold ${this._money(today.sales)}</span>
        ${
          goal.target > 0
            ? `<div class="hero__row hero__row--space"><span>Daily goal ${this._money(goal.target)}</span><span>${goal.percent}%</span></div>
               <div class="bar"><div class="bar__fill" style="width:${goal.percent}%"></div></div>
               ${goal.percent >= 100 ? `<span class="hero__meta">🎉 Goal reached!</span>` : ""}`
            : `<span class="hero__meta hero__row--space">Set a daily goal in Settings.</span>`
        }
      </div>`
    );
  }

  addHandlerQuickSell(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest("[data-quick]");
      if (btn) handler(btn.dataset.quick);
    });
  }
}

export default new HeroView();
