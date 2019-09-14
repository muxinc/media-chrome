const template = document.createElement('template');
// Could you get styles to apply by passing a global button from global to shadow?

// Map all native element properties to the custom element
// so that they're applied to the native element.
// Skipping HTMLElement because of things like "attachShadow"
// causing issues. Most of those props still need to apply to
// the custom element.
// Excluding HTMLElement, but includign EventTarget props
let nativeElProps = [];

// Can't check typeof directly on element prototypes without
// throwing Illegal Invocation errors, so creating an element
// to check on instead.
const nativeElTest = document.createElement('video');

// Deprecated props throw warnings if used, so exclude them
const deprecatedProps = [
  'webkitDisplayingFullscreen',
  'webkitSupportsFullscreen',
  // 'width',
  // 'height',
];

// Walk the prototype chain up to HTMLElement.
// This will grab all super class props in between.
// e.g. VideoElement and MediaElement
for (
  let proto = Object.getPrototypeOf(nativeElTest);
  proto && proto !== HTMLElement.prototype;
  proto = Object.getPrototypeOf(proto)
) {
  Object.keys(proto).forEach(key => {
    if (deprecatedProps.indexOf(key) === -1) {
      nativeElProps.push(key);
    }
  });
}

// For the video element we also want to pass through all event listeners.
nativeElProps = nativeElProps.concat(Object.keys(EventTarget.prototype));

template.innerHTML = `
<style>
  :host {
    all: initial;
    display: inline-block;
    box-sizing: border-box;

    position: relative;

    width: 300px;
    height: 150px;

    background-color: #ccc;
    border: 1px solid #900;
  }

  video {
    width: 100%;
    height: 100%;
  }
</style>
`;

class VideoElement extends HTMLElement {
  nativeEl = null;

  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const nativeEl = (this.nativeEl = document.createElement('video'));

    Array.prototype.forEach.call(this.attributes, attrNode => {
      this.attributeChangedCallback(attrNode.name, null, attrNode.value);
    });

    // Neither Chrome or Firefox support setting the muted attribute
    // after using document.createElement.
    // One way to get around this would be to build the tag as a string.
    // But just fixing it manually for now.
    // Apparently this may also be an issue with <input checked>
    if (nativeEl.defaultMuted) {
      nativeEl.muted = true;
    }

    this.nativeEl.addEventListener('loadedmetadata', e => {});

    this.shadowRoot.appendChild(nativeEl);
  }

  // Required for attributeChangedCallback
  // Needs to be the lowercase word, e.g. crossorigin, not crossOrigin
  static get observedAttributes() {
    let attrs = [];

    // Instead of manually creating a list of all observed attributes,
    // observe any getter/setter prop name (lowercased)
    Object.getOwnPropertyNames(this.prototype).forEach(propName => {
      let isFunc = false;

      // Non-func properties throw errors because it's not an instance
      try {
        if (typeof this.prototype[propName] === 'function') {
          isFunc = true;
        }
      } catch (e) {}

      // Exclude functions and constants
      if (!isFunc && propName !== propName.toUpperCase()) {
        attrs.push(propName.toLowerCase());
      }
    });

    // Include any attributes from the super class (recursive)
    const supAttrs = Object.getPrototypeOf(this).observedAttributes;

    if (supAttrs) {
      attrs = attrs.concat(supAttrs);
    }

    return attrs;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    // Find the matching prop for custom attributes
    const ownProps = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const propName = arrayFindAnyCase(ownProps, attrName);

    // Check if this is the original custom native elemnt or a subclass
    const isBaseElement =
      Object.getPrototypeOf(this.constructor)
        .toString()
        .indexOf('function HTMLElement') === 0;

    // If this is a custom attribute we want to set the
    // matching property.
    if (propName && !isBaseElement) {
      if (typeof this[propName] == 'boolean') {
        if (newValue === null) {
          this[propName] = false;
        } else {
          this[propName] = true;
        }
      } else {
        this[propName] = newValue;
      }

      // Just pass anything else through to the native el
    } else {
      if (newValue === null) {
        this.nativeEl.removeAttribute(attrName);
      } else {
        this.nativeEl.setAttribute(attrName, newValue);
      }
    }

    // if (this[attrName]) {
    //   propName = attrName;
    // } else {
    //   // Find the matching property (not lowercased)
    //   // Walk the prototype chain to find it
    //   for (
    //     let proto = Object.getPrototypeOf(this);
    //     proto;
    //     proto = Object.getPrototypeOf(proto)
    //   ) {
    //     Object.getOwnPropertyNames(proto).forEach(key => {
    //       if (key.toLowerCase() === attrName) {
    //         propName = key;
    //       }
    //     });
    //
    //     if (propName) {
    //       break;
    //     }
    //   }
    // }
    //
    // if (!propName) {
    //   // Not sure if it's an HTML requirement, but I'm not aware of
    //   // any attributes without a matching prop.
    //   console.warn(`No matching property for attribute: ${attrName}.`);
    //   return;
    // }
    //
    // if (newValue === null) {
    //   this.nativeEl.removeAttribute(attrName);
    // } else {
    //   this.nativeEl.setAttribute(attrName, newValue);
    // }
  }
}

// Proxy native el functions from the custom el to the native el
nativeElProps.forEach(prop => {
  const type = typeof nativeElTest[prop];

  if (type == 'function') {
    // Function
    VideoElement.prototype[prop] = function() {
      return this.nativeEl[prop].apply(this.nativeEl, arguments);
    };
  } else {
    // Getter
    let config = {
      get() {
        return this.nativeEl[prop];
      },
    };

    if (prop !== prop.toUpperCase()) {
      // Setter (not a CONSTANT)
      config.set = function(val) {
        this.nativeEl[prop] = val;
      };
    }

    Object.defineProperty(VideoElement.prototype, prop, config);
  }
});

function arrayFindAnyCase(arr, word) {
  let found = null;

  arr.forEach(item => {
    if (item.toLowerCase() == word.toLowerCase()) {
      found = item;
    }
  });

  return found;
}

window.customElements.define('video-element', VideoElement);
window.VideoElement = VideoElement;

export default VideoElement;
