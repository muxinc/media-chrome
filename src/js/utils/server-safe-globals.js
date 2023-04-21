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
  createElementNS: function () {
    return new globalThisShim.HTMLElement();
  },
  addEventListener() {},
  removeEventListener() {},
  /**
   *
   * @param {Event} event
   * @returns {boolean}
   */
  dispatchEvent(event) { return false; }, // eslint-disable-line no-unused-vars
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
  localStorage: {
    /**
     * @param {string} key
     * @returns {string|null}
    */
    getItem(key) { return null; }, // eslint-disable-line no-unused-vars
    /**
     * @param {string} key
     * @param {string} value
     */
    setItem(key, value) {}, // eslint-disable-line no-unused-vars
    /**
     * @param {string} key
    */
    removeItem(key) {}, // eslint-disable-line no-unused-vars
  },
  CustomEvent: function CustomEvent() {},
  getComputedStyle: function () {},
  navigator: {
    languages: [],
    get userAgent() {
      return '';
    }
  },
  /**
   * @param {string} media
   */
  matchMedia(media) {
    return {
      matches: false,
      media,
    };
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
  * matchMedia,
  * } }
  * */
export const GlobalThis = isServer && !isShimmed ? globalThisShim : globalThis;

/**
  * @type { document & { webkitExitFullscreen? } |
  * {createElement,
  * createElementNS?,
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
