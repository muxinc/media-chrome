export function defineCustomElement(name, element) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, element);
    window[element.name] = element;
  }
}
