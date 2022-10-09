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
};

const documentShim = {
  createElement: function () {
    return new windowShim.HTMLElement();
  },
};

export const isServer =
  typeof window === 'undefined' ||
  typeof window.customElements === 'undefined';

/**
  * @type { window & { WebKitPlaybackTargetAvailabilityEvent?,
  *   chrome?,
  * } |
  * {HTMLElement,
  * customElements,
  * CustomEvent,
  * addEventListener?,
  * removeEventListener?,
  * setTimeout?,
  * clearTimeout?,
  * localStorage?,
  * WebKitPlaybackTargetAvailabilityEvent?,
  * document?,
  * chrome?,
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
  * } }
  */
export const Document = isServer ? documentShim : window.document;
