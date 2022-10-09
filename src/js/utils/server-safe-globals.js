const windowShim = {
  HTMLElement: function HTMLElement() {
    this.addEventListener = () => {};
    this.removeEventListener = () => {};
    this.dispatchEvent = () => {};
  },
  customElements: {
    get: function () {},
    define: function () {},
    whenDefined: function () {},
  },
  CustomEvent: function CustomEvent() {},
  addEventListener: function () {},
  removeEventListener: function () {},
};

const documentShim = {
  createElement: function () {
    return new windowShim.HTMLElement();
  },
};

export const isServer =
  typeof window === 'undefined' ||
  typeof window.customElements === 'undefined';

/** @type {window | {HTMLElement, customElements, CustomEvent, addEventListener, removeEventListener}} */
export const Window = isServer ? windowShim : window;
/** @type {document | {createElement}} */
export const Document = isServer ? documentShim : window.document;
