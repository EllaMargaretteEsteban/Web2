import View from "./View.js";

class TopUpListView extends View {
  constructor() {
    super(".topup-list");
  }

  render(topUps) {
    this._clear();

    if (!topUps.length) {
      this._parentElement.insertAdjacentHTML(
        "afterbegin",
        `<div class="empty-state">No top-ups yet. Add your first wallet top-up above!</div>`
      );
      return;
    }

    const html = [...topUps]
      .reverse()
      .map(topUp => {
        const date = new Date(topUp.date).toLocaleString("en-PH", {
          dateStyle: "medium",
          timeStyle: "short",
        });
        return `
          <article class="sale">
            <div class="sale__main">
              <div>
                <h3 class="sale__title">${this._money(topUp.amount)}</h3>
                <p class="sale__date">${this._escape(date)}</p>
              </div>
            </div>
            <div class="sale__actions">
              <button class="btn btn--delete" type="button" data-delete-topup="${this._escape(topUp.id)}">Delete</button>
            </div>
          </article>`;
      })
      .join("");

    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest("[data-delete-topup]");
      if (!btn) return;
      if (confirm("Delete this top-up?")) handler(btn.dataset.deleteTopup);
    });
  }
}

export default new TopUpListView();
