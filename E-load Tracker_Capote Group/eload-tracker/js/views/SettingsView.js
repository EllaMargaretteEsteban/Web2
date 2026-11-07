import View from "./View.js";

class SettingsView extends View {
  constructor() {
    super(".settings");
  }

  render({ lowBalance, dailyGoal }) {
    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<form class="form settings__form" novalidate>
        <div class="form__group">
          <label class="form__label" for="low-balance">Low balance alert (₱)</label>
          <input class="form__input" id="low-balance" name="lowBalance" type="number"
            min="0" step="1" value="${this._escape(lowBalance)}" />
        </div>
        <div class="form__group">
          <label class="form__label" for="daily-goal">Daily profit goal (₱)</label>
          <input class="form__input" id="daily-goal" name="dailyGoal" type="number"
            min="0" step="1" value="${this._escape(dailyGoal)}" />
        </div>
        <div class="form__actions">
          <button class="btn" type="submit">Save</button>
          <button class="btn btn--delete" type="button" data-reset>Reset all data</button>
        </div>
      </form>`
    );
  }

  addHandlerSaveSettings(handler) {
    this._parentElement.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(e.target);
      handler({
        lowBalance: parseFloat(data.get("lowBalance")),
        dailyGoal: parseFloat(data.get("dailyGoal")),
      });
    });
  }

  addHandlerReset(handler) {
    this._parentElement.addEventListener("click", e => {
      if (!e.target.closest("[data-reset]")) return;
      if (confirm("This will permanently delete ALL top-ups and sales. Continue?"))
        handler();
    });
  }
}

export default new SettingsView();
