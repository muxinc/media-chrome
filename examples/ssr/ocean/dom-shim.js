import { parseHTML } from 'linkedom';

const domShimSymbol = Symbol.for('dom-shim.defaultView');
const defaultGlobals = Object.freeze([
  'HTMLElement',
  'document',
  'customElements',
]);

const dontShimIfExists = new Set(['window']);

function init() {
  let s = new Shim([
    'customElements',
    'document',
    'window',
    'Document',
    'Element',
    'HTMLElement',
    'HTMLTemplateElement',
    'Node',
    'requestAnimationFrame',
    'Text',
    'MutationObserver',
  ]);
  s.shim();
}

class Shim {
  constructor(shimedGlobals = Object.freeze([])) {
    this.globals = shimedGlobals;
    this.setup();
  }

  setup() {
    let parsed = parseHTML(`
      <html lang="en">
      <head><title>Site</title></head>
      <body></body>
      </html>
    `);
    applyPatches(parsed);

    const window = parsed.document.defaultView;

    let shimValues = this.values = Object.create(null);
    for (let name of this.globals) {
      if (dontShimIfExists.has(name) && name in globalThis) {
        continue;
      }
      Reflect.set(shimValues, name, window[name]);
    }
  }

  apply() {
    Object.defineProperty(globalThis, domShimSymbol, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: this.values,
    });
  }

  shim() {
    if(!(domShimSymbol in globalThis))
      this.apply();

    Object.assign(globalThis, this.values);
  }

  unshim() {
    for (let name of this.globals) {
      if (globalThis[name] === this.values[name]) {
        delete globalThis[name];
      }
    }
  }
}

function patchText(window) {
  // Patch Text
  let aTextNode = window.document.createTextNode('');
  let ConstructibleText = aTextNode.constructor.bind(null, window.document);
  return ConstructibleText;
}

function patchNodeType(window, ConstructibleText) {
  // Patch Node
  const CharacterData = Object.getPrototypeOf(ConstructibleText);
  const Node = Object.getPrototypeOf(CharacterData);
  const EventTarget = Object.getPrototypeOf(Node);

  const ntSymbol = Symbol('dom-shim.nodeType');
  class PatchedNode extends EventTarget {
    constructor() {
      super();

      Object.defineProperty(this, 'nodeType', {
        get() {
          return this[ntSymbol];
        },
        set(val) {
          this[ntSymbol] = val;
        },
      });
    }
  }

  Object.setPrototypeOf(Node, PatchedNode);
  Object.setPrototypeOf(Node.prototype, PatchedNode.prototype);
}

function patchRAF() {
  // Patch requestAnimationFrame
  let lastTime = 0;
  function requestAnimationFrame(callback, _element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }
  return requestAnimationFrame;
}

function patchDefaultView(window, { requestAnimationFrame, Text }) {
  const dfDescriptor = Object.getOwnPropertyDescriptor(
    window.Document.prototype,
    'defaultView'
  );
  Object.defineProperty(window.Document.prototype, 'defaultView', {
    get() {
      let window = dfDescriptor.get.call(this);

      return new Proxy(window, {
        get(window, name) {
          switch (name) {
            case 'Text':
              return Text;
            case 'requestAnimationFrame':
              return requestAnimationFrame;
          }
          return window[name];
        },
      });
    },
  });
}

function applyPatches(window) {
  const ConstructibleText = patchText(window);
  patchNodeType(window, ConstructibleText);
  const requestAnimationFrame = patchRAF();

  patchDefaultView(window, {
    requestAnimationFrame,
    Text: ConstructibleText
  });

  // Patch HTMLElement
  delete window.HTMLElement.observedAttributes;
}

init();
