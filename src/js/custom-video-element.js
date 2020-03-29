/**
 * Custom Video Element
 * The goal is to create an element that works just like the video element
 * but can be extended/sub-classed, because native elements cannot be
 * extended today across browsers.
 */

const template = document.createElement('template');
// Could you get styles to apply by passing a global button from global to shadow?

template.innerHTML = `
<style>
  :host {
    /* Supposed to reset styles. Need to understand the specific effects more */
    all: initial;

    /* display:inline (like the native el) makes it so you can't fill
      the container with the native el */
    display: inline-block;
    box-sizing: border-box;
    position: relative;

    /* Same default widths as the native el */
    width: 300px;
    height: 150px;
  }

  video {
    /* Fill the continer */
    width: 100%;
    height: 100%;
  }
</style>
`;

class CustomVideoElement extends HTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const nativeEl = (this.nativeEl = document.createElement('video'));

    // Initialize all the attribute properties
    Array.prototype.forEach.call(this.attributes, attrNode => {
      this.attributeChangedCallback(attrNode.name, null, attrNode.value);
    });

    // Neither Chrome or Firefox support setting the muted attribute
    // after using document.createElement.
    // One way to get around this would be to build the native tag as a string.
    // But just fixing it manually for now.
    // Apparently this may also be an issue with <input checked> for buttons
    if (nativeEl.defaultMuted) {
      nativeEl.muted = true;
    }

    this.shadowRoot.appendChild(nativeEl);
  }

  // observedAttributes is required to trigger attributeChangedCallback
  // for any attributes on the custom element.
  // Attributes need to be the lowercase word, e.g. crossorigin, not crossOrigin
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

  // We need to handle sub-class custom attributes differently from
  // attrs meant to be passed to the internal native el.
  attributeChangedCallback(attrName, oldValue, newValue) {
    // Find the matching prop for custom attributes
    const ownProps = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const propName = arrayFindAnyCase(ownProps, attrName);

    // Check if this is the original custom native elemnt or a subclass
    const isBaseElement =
      Object.getPrototypeOf(this.constructor)
        .toString()
        .indexOf('function HTMLElement') === 0;

    // If this is a subclass custom attribute we want to set the
    // matching property on the subclass
    if (propName && !isBaseElement) {
      // Boolean props should never start as null
      if (typeof this[propName] == 'boolean') {
        // null is returned when attributes are removed i.e. boolean attrs
        if (newValue === null) {
          this[propName] = false;
        } else {
          // The new value might be an empty string, which is still true
          // for boolean attributes
          this[propName] = true;
        }
      } else {
        this[propName] = newValue;
      }
    } else {
      // When this is the original Custom Element, or the subclass doesn't
      // have a matching prop, pass it through.
      if (newValue === null) {
        this.nativeEl.removeAttribute(attrName);
      } else {
        // Ignore a few that don't need to be passed through just in case
        // it creates unexpected behavior.
        if (['id', 'class'].indexOf(attrName) === -1) {
          this.nativeEl.setAttribute(attrName, newValue);
        }
      }
    }
  }
}

// Map all native element properties to the custom element
// so that they're applied to the native element.
// Skipping HTMLElement because of things like "attachShadow"
// causing issues. Most of those props still need to apply to
// the custom element.
// But includign EventTarget props because most events emit from
// the native element.
let nativeElProps = [];

// Can't check typeof directly on element prototypes without
// throwing Illegal Invocation errors, so creating an element
// to check on instead.
const nativeElTest = document.createElement('video');

// Deprecated props throw warnings if used, so exclude them
const deprecatedProps = [
  'webkitDisplayingFullscreen',
  'webkitSupportsFullscreen',
];

// Walk the prototype chain up to HTMLElement.
// This will grab all super class props in between.
// i.e. VideoElement and MediaElement
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

// For the video element we also want to pass through all event listeners
// because all the important events happen there.
nativeElProps = nativeElProps.concat(Object.keys(EventTarget.prototype));

// Passthrough native el functions from the custom el to the native el
nativeElProps.forEach(prop => {
  const type = typeof nativeElTest[prop];

  if (type == 'function') {
    // Function
    CustomVideoElement.prototype[prop] = function() {
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

    Object.defineProperty(CustomVideoElement.prototype, prop, config);
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

if (!window.customElements.get('custom-video')) {
  window.customElements.define('custom-video', CustomVideoElement);
  window.CustomVideoElement = CustomVideoElement;
}

export default CustomVideoElement;
