if (!globalThis.customElements) {
  globalThis.customElements = {
    get() {},
    define(
      _name: string,
      _constructor: CustomElementConstructor,
      _options: ElementDefinitionOptions
    ) {},
    upgrade(_root: Node) {},
    whenDefined(_name: string) {
      return Promise.resolve();
    },
  };
}

if (!globalThis.CustomEvent) {
  class CustomEvent<T = undefined> implements CustomEvent<T> {
    readonly detail: T;
    constructor(typeArg: string, eventInitDict: CustomEventInit<T> = {}) {
      // super(typeArg, eventInitDict);
      // NOTE: Lazy fix for global env expectations
      this.detail = eventInitDict?.detail as T;
    }
    initCustomEvent(
      _typeArg: string,
      _canBubbleArg: boolean,
      _cancelableArg: boolean,
      _detailArg: T
    ) {}
  }
  // @ts-ignore
  globalThis.CustomEvent = CustomEvent;
}

if (!globalThis.EventTarget) {
  class EventTarget {
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent(_event: Event) {
      return true;
    }
  }

  globalThis.EventTarget = EventTarget;
}

if (!globalThis.HTMLElement) {
  class HTMLElement extends EventTarget {}

  // NOTE: Adding ts-ignore since `HTMLElement` typedef is much larger than what we're stubbing. Consider more robust TypeScript solution (e.g. downstream usage)
  // @ts-ignore
  globalThis.HTMLElement = HTMLElement;
}

if (!globalThis.document?.createElement) {
  const document = globalThis.document ?? {};
  (document.createElement = function createElement(
    _tagName: string,
    _options?: ElementCreationOptions
  ): HTMLElement {
    return new HTMLElement();
  }),
    // NOTE: Adding ts-ignore since `document` typedef is much larger than what we're stubbing. Consider more robust TypeScript solution (e.g. downstream usage)
    // @ts-ignore
    (globalThis.document = document);
}
