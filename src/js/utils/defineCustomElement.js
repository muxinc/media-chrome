import { isServer } from './browser-env.js';

export function defineCustomElement(name, element) {
  if (isServer()) {
    return;
  }
  if (!window.customElements.get(name)) {
    window.customElements.define(name, element);
    window[element.name] = element;
  }
}
