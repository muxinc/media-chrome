import { isServer, Window } from './browser-env.js';

export function defineCustomElement(name, element) {
  if (isServer) {
    return;
  }
  if (!Window.customElements.get(name)) {
    Window.customElements.define(name, element);
    Window[element.name] = element;
  }
}
