class EventTarget {
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}

class ResizeObserver {
  observe() {}
}

const windowShim = {
  ResizeObserver,
  HTMLElement: class HTMLElement extends EventTarget {},
  DocumentFragment: class DocumentFragment extends EventTarget {},
  customElements: {
    get: function () {},
    define: function () {},
    whenDefined: function () {},
  },
  CustomEvent: function CustomEvent() {},
  getComputedStyle: function () {},
  // eslint-disable-next-line no-unused-vars
  requestAnimationFrame: function(_cb) {
    return 1;
  }
};

const documentShim = {
  createElement: function () {
    return new windowShim.HTMLElement();
  },
  addEventListener() {},
  removeEventListener() {},
};

export const isServer =
  typeof window === 'undefined' ||
  typeof window.customElements === 'undefined';

/**
  * @type { window & { WebKitPlaybackTargetAvailabilityEvent?,
  *   chrome?,
  *   DocumentFragment?,
  *   getComputedStyle,
  * } |
  * {HTMLElement,
  * customElements,
  * CustomEvent,
  * getComputedStyle,
  * addEventListener?,
  * removeEventListener?,
  * setTimeout?,
  * clearTimeout?,
  * localStorage?,
  * WebKitPlaybackTargetAvailabilityEvent?,
  * document?,
  * chrome?,
  * DocumentFragment?,
  * ResizeObserver?,
  * requestAnimationFrame,
  * } }
  * */
export const Window = isServer ? windowShim : window;
/**
  * @type { document & { webkitExitFullscreen? } |
  * {createElement,
  * fullscreenElement?,
  * webkitExitFullscreen?,
  * getElementById?,
  * pictureInPictureElement?,
  * exitPictureInPicture?,
  * pictureInPictureEnabled?,
  * requestPictureInPicture?,
  * addEventListener?,
  * removeEventListener?,
  * } }
  */
export const Document = isServer ? documentShim : window.document;

export { Window as window, Document as document };
