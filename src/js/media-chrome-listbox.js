import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Document as document } from './utils/server-safe-globals.js';

const DEFAULT_LISTBOX_LABEL = 'listbox';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    [role="listbox"] {
        margin: 1em 0 0;
        padding: 0;
        min-height: 18em;
        border: 1px solid #aaa;
        background: white;
    }
    
    [role="listbox"] {
        max-height: 18em;
        overflow-y: auto;
    }
    
    [role="listbox"] + *,
    .listbox-label + * {
        margin-top: 1em;
    }
    
    [role="option"] {
        display: block;
        padding: 0 1em 0 1.5em;
        line-height: 1.8em;
    }
    
    :host(:focus) [role="option"].focused,
    :host(:focus-within) [role="option"].focused {
        background: #bde4ff;
    }
    
    [role="option"][aria-selected="true"]::before {
        left: 0.5em;
        content: "✓";
    }
  </style>
  <div>
    <span id="listbox-label" tabindex="-1" class="listbox-label">${DEFAULT_LISTBOX_LABEL}</span>
    <ul role="listbox" aria-labelledby="listbox-label">
    </ul>
  </div>
`;

const isNil = (x) => x == undefined;
const isIterable = (value) => {
  return Symbol.iterator in Object(value);
};
const isArraylike = (value) => {
  return (
    typeof value?.length === 'number' &&
    value.length >= 0 &&
    value.length <= 4294967295
  );
};
const identity = (x) => x;

const getClassName = (x) => {
  return x?.constructor?.name ?? 'UNKNOWN';
};

const DEFAULT_FORMAT = identity;
const DEFAULT_ITEM_RENDERER = 'li';

class MediaChromeListbox extends HTMLElement {
  static get observedAttributes() {
    // Discuss title (as attribute, as "baked in", as context for screen readers wrt A11Y)
    return ['title', MediaUIAttributes.MEDIA_CONTROLLER];
  }

  constructor({
    itemRenderer = DEFAULT_ITEM_RENDERER,
    format = DEFAULT_FORMAT,
    data = [],
  } = {}) {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.data = data;
    this._defaultFormat = format;
    this._defaultItemRenderer = itemRenderer;
    this.keysSoFar = '';
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemChange = function () {};
    this.registerEvents();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
      }
    }
    if (attrName === 'title') {
      console.log('title', newValue);
      this.listboxLabelElement.innerText = newValue ?? DEFAULT_LISTBOX_LABEL;
    }
  }

  connectedCallback() {
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', 0);

    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  get data() {
    return this._data;
  }

  set data(value) {
    if (value === this.data) return;
    if (isNil(value) && this.data?.length === 0) return;
    if (!(isNil(value) || isArraylike(value) || isIterable(value))) {
      console.error(
        `invalid value ${value} for ${getClassName(
          this
        )} data property. Must be an iterable, array-like, null, or undefined`
      );
      return;
    }
    this._data = value ?? [];
    this.render();
  }

  get itemRenderer() {
    return this._itemRenderer ?? this._defaultItemRenderer;
  }

  get format() {
    return this._format ?? this._defaultFormat;
  }

  set format(value) {
    if (value === this.format) return;
    if (!isNil(value) || typeof value !== 'function') {
      console.error(
        `invalid value ${value} for ${getClassName(
          this
        )} format property. Must be a function, null, or undefined`
      );
    }
  }

  get listboxLabelElement() {
    return this.shadowRoot.querySelector('.listbox-label');
  }

  get listboxElement() {
    return this.shadowRoot?.querySelector('[role="listbox"]');
  }

  get listItemElements() {
    return (
      Array.from(this.listboxElement.querySelectorAll('[role="option"]')) ?? []
    );
  }

  get activeDescendant() {
    return (
      this.listboxElement.getAttribute('aria-activedescendant') ?? undefined
    );
  }

  set activeDescendant(value) {
    if (value === this.activeDescendant) return;

    if (this.activeElement) {
      this.activeElement.classList.remove('focused');
    }

    if (isNil(value)) {
      this.listboxElement.removeAttribute('aria-activedescendant');
    } else {
      this.listboxElement.setAttribute('aria-activedescendant', value);
    }

    if (this.activeElement) {
      this.activeElement.classList.add('focused');
      this.activeElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }

  get activeElement() {
    return this.shadowRoot.getElementById(this.activeDescendant);
  }

  set activeElement(element) {
    if (element === this.activeElement) return;
    this.activeDescendant = element?.id;
  }

  get activeIndex() {
    const idx = this.listItemElements.indexOf(this.activeElement);
    return idx >= 0 ? idx : undefined;
  }

  set activeIndex(value) {
    if (value === this.activeIndex) return;
    if (!(isNil(value) || typeof value == 'number')) {
      console.error(
        `invalid value ${value} for ${getClassName(
          this
        )} activeIndex property. Must be a number, null, or undefined`
      );
      return;
    }
    const { listItemElements } = this;
    if (
      typeof value === 'number' &&
      (value < 0 || value > listItemElements.length - 1)
    ) {
      console.error(
        `invalid value ${value} for ${getClassName(
          this
        )} activeIndex property. Must be within the index range of data (0-${
          listItemElements.length - 1
        })`
      );
      return;
    }
    this.activeElement = listItemElements[value];
  }

  get selectedElement() {
    return this.listboxElement.querySelector('[aria-selected]') ?? undefined;
  }

  set selectedElement(element) {
    if (element === this.selectedElement) return;
    this.selectedElement?.removeAttribute('aria-selected');
    element?.setAttribute('aria-selected', 'true');
  }

  get selectedValue() {
    return this.selectedElement?.id ?? undefined;
  }

  set selectedValue(value) {
    if (value === this.selectedValue) return;
    this.selectedElement = this.shadowRoot.getElementById(value);
  }

  render() {
    const { selectedValue } = this;
    const listItemEls = Array.from(this.data).map((value) => {
      const listItemEl = document.createElement(this.itemRenderer);
      listItemEl.setAttribute('role', 'option');
      listItemEl.id = value;
      listItemEl.innerText = this.format(value);
      if (value === selectedValue) {
        this.selectedElement = listItemEl;
      }
      return listItemEl;
    });
    this.listboxElement.replaceChildren(...listItemEls);
  }

  /**
   * @description
   *  Register events for the listbox interactions
   */
  registerEvents() {
    this.addEventListener('focus', this.handleFocus);
    this.addEventListener('keydown', this.handleKeyPress);
    this.listboxElement.addEventListener('click', this.handleItemClick);
  }

  handleFocus(evt) {
    // this.listboxElement.focus();
    this.activeElement = this.selectedElement ?? this.listItemElements[0];
  }

  /**
   * @description
   *  Check if an item is clicked on. If so, set as both activeElement and selectedElement.
   * @param evt
   *  The click event object
   */
  handleItemClick(evt) {
    if (evt.target.getAttribute('role') !== 'option') return;
    this.selectedElement = evt.target;
    this.activeElement = evt.target;
  }

  /**
   * @description
   *  Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
   *  an item.
   * @param evt
   *  The keydown event object
   */
  handleKeyPress(evt) {
    const { key } = evt;
    const currentActiveIndex = this.activeIndex ?? -1;
    const length = this.listItemElements.length;
    switch (key) {
      case 'ArrowUp': {
        this.activeIndex = Math.max(currentActiveIndex - 1, 0);
        evt.preventDefault();
        break;
      }
      case 'ArrowDown': {
        this.activeIndex = Math.min(currentActiveIndex + 1, length - 1);
        evt.preventDefault();
        break;
      }
      case 'Home':
        evt.preventDefault();
        this.activeIndex = 0;
        break;
      case 'End':
        evt.preventDefault();
        this.activeIndex = length - 1;
        break;
      case ' ':
        evt.preventDefault();
        this.selectedElement = this.activeElement;
        break;
      // fall through
      default:
        var itemToFocus = this.findItemToFocus(key);
        if (itemToFocus) {
          this.activeElement = itemToFocus;
        }
        break;
    }
  }

  findItemToFocus(key) {
    const { listItemElements } = this;
    this.keysSoFar += key;
    this.clearKeysSoFarAfterDelay();

    const searchIndex = this.activeIndex ?? 0;
    return (
      this.findMatchInRange(listItemElements, searchIndex + 1) ??
      this.findMatchInRange(listItemElements, 0, searchIndex + 1)
    );
  }

  // Discuss making this more robust
  clearKeysSoFarAfterDelay() {
    if (this.keyClear) {
      clearTimeout(this.keyClear);
      this.keyClear = null;
    }
    this.keyClear = setTimeout(
      function () {
        this.keysSoFar = '';
        this.keyClear = null;
      }.bind(this),
      500
    );
  }

  findMatchInRange(list, startIndex, endIndex = list.length) {
    // Find the first item starting with the keysSoFar substring, searching in
    // the specified range of items
    return list.slice(startIndex, endIndex).find((listItemEl) => {
      const label = listItemEl.innerText;
      // Discuss internationalization and search complexities (tl;dr - unicode variations)
      return (
        label?.toUpperCase().startsWith(this.keysSoFar?.toUpperCase()) ?? false
      );
    });
  }
}

defineCustomElement('media-chrome-listbox', MediaChromeListbox);

export default MediaChromeListbox;
