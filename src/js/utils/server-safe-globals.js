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

const globalThisShim = {
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
  },
  // eslint-disable-next-line no-unused-vars
  queueMicrotask: function(_cb) {
  },
};

const documentShim = {
  createElement: function () {
    return new globalThisShim.HTMLElement();
  },
  addEventListener() {},
  removeEventListener() {},
};

export const isServer =
  typeof window === 'undefined' ||
  typeof window.customElements === 'undefined';

/**
  * @type { globalThis & {
  *   WebKitPlaybackTargetAvailabilityEvent?,
  *   chrome?,
  *   DocumentFragment?,
  *   getComputedStyle,
  *   CastableVideoElement?
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
  * window?,
  * document?,
  * chrome?,
  * DocumentFragment?,
  * ResizeObserver?,
  * requestAnimationFrame,
  * queueMicrotask,
  * CastableVideoElement?
  * } }
  * */
export const GlobalThis = isServer ? globalThisShim : globalThis;

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

export {
  GlobalThis as globalThis,
  Document as document
};
