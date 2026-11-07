export default class View {
  _parentElement;

  constructor(selector) {
    this._parentElement = document.querySelector(selector);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  _escape(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  _money(value) {
    return "₱" + Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
