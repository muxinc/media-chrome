var canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

export function defineCustomElement(name, element) {
  if (!canUseDOM) {
    return;
  }

  if (!window.customElements.get(name)) {
    window.customElements.define(name, element);
    window[element.name] = element;
  }
}

export function createTemplateElement() {
  if (!canUseDOM) {
    return {

    }
  }

  return document.createElement('template');
}

export const BaseElement = canUseDOM ? HTMLElement : Object;
