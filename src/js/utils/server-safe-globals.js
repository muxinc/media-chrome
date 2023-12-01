class EventTarget {
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const documentShim = {
  createElement: function () {
    return new globalThisShim.HTMLElement();
  },
  addEventListener() {},
  removeEventListener() {},
};

const globalThisShim = {
  ResizeObserver,
  document: documentShim,
  HTMLElement: class HTMLElement extends EventTarget {},
  DocumentFragment: class DocumentFragment extends EventTarget {},
  customElements: {
    get: function () {},
    define: function () {},
    whenDefined: function () {},
  },
  CustomEvent: function CustomEvent() {},
  getComputedStyle: function () {},
  navigator: {
    languages: []
  }
};

export const isServer =
  typeof window === 'undefined' ||
  typeof window.customElements === 'undefined';

const isShimmed = Object.keys(globalThisShim)
  .every(key => key in globalThis);

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
  * localStorage?,
  * WebKitPlaybackTargetAvailabilityEvent?,
  * window?,
  * document?,
  * chrome?,
  * DocumentFragment?,
  * ResizeObserver?,
  * CastableVideoElement?,
  * navigator?,
  * } }
  * */
export const GlobalThis = isServer && !isShimmed ? globalThisShim : globalThis;

/**
  * @type { document & { webkitExitFullscreen? } |
  * {createElement,
  * activeElement?,
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
export const Document = isServer && !isShimmed ? documentShim : globalThis.document;

export {
  GlobalThis as globalThis,
  Document as document
};
