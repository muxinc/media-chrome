class EventTarget {
  addEventListener() { }
  removeEventListener() { }
  dispatchEvent() {
    return true;
  }
}

class Node extends EventTarget { }

class Element extends Node {
  attributes: NamedNodeMap;
  childNodes: NodeListOf<ChildNode>;
  role: string | null = null;
}

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

const documentShim = {
  createElement: function () {
    return new globalThisShim.HTMLElement();
  },
  createElementNS: function () {
    return new globalThisShim.HTMLElement();
  },
  addEventListener() { },
  removeEventListener() { },
  dispatchEvent(_event: Event) {
    return false;
  },
} as unknown as typeof globalThis['document'];

const globalThisShim = {
  ResizeObserver,
  document: documentShim,
  Node,
  Element,
  HTMLElement: class HTMLElement extends Element {
    innerHTML: string = '';
    get content() {
      return new globalThisShim.DocumentFragment();
    }
  },
  DocumentFragment: class DocumentFragment extends EventTarget { },
  customElements: {
    get: function () { },
    define: function () { },
    whenDefined: function () { },
  },
  localStorage: {
    getItem(_key: string) {
      return null;
    },
    setItem(_key: string, _value: string) { },
    removeItem(_key: string) { },
  },
  CustomEvent: function CustomEvent() { },
  getComputedStyle: function () { },
  navigator: {
    languages: [],
    get userAgent() {
      return '';
    },
  },
  matchMedia(media: string) {
    return {
      matches: false,
      media,
    };
  },
  DOMParser: class DOMParser {
    parseFromString(string: string, _contentType: string) {
      return {
        body: {
          textContent: string
        }
      };
    }
  },
} as unknown as typeof globalThis;

export const isServer =
  typeof window === 'undefined' || typeof window.customElements === 'undefined';

const isShimmed = Object.keys(globalThisShim).every((key) => key in globalThis);

export const GlobalThis: typeof globalThis =
  isServer && !isShimmed ? globalThisShim : globalThis;
export const Document: typeof globalThis['document'] &
  Partial<{
    webkitExitFullscreen: typeof globalThis['document']['exitFullscreen'];
  }> = isServer && !isShimmed ? documentShim : globalThis.document;

export { GlobalThis as globalThis, Document as document };
