import View from "./View.js";

class BreakdownView extends View {
  constructor() {
    super(".breakdown");
  }

  render(networks) {
    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      networks
        .map(
          n => `
          <div class="net-row">
            <span class="tag tag--${n.network.toLowerCase()}">${this._escape(n.network)}</span>
            <div class="bar bar--thin"><div class="bar__fill" style="width:${n.share}%"></div></div>
            <strong>${this._money(n.profit)}</strong>
          </div>`
        )
        .join("")
    );
  }
}

export default new BreakdownView();
