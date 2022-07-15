import './media-chrome-list-item.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Document as document } from './utils/server-safe-globals.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
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
const DEFAULT_PARSER = (data) => data.split(' ');
const DEFAULT_DATA = [];
const DEFAULT_RENDERER = 'media-chrome-list-item';

class MediaChromeList extends HTMLElement {
  static get observedAttributes() {
    return ['data', 'selectedvalue', 'renderer'];
  }

  constructor({ parse, renderer, format } = {}) {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('#container');
    this._defaultRenderer = renderer ?? DEFAULT_RENDERER;
    this._defaultParse = parse ?? DEFAULT_PARSER;
    // For `format` default is `undefined` and defers to
    // item renderer's `format` method.
    this._defaultFormat = format;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'data' && oldValue !== newValue) {
      this.data = this.parse(newValue);
    } else if (attrName === 'selectedvalue' && newValue !== oldValue) {
        this.render();
    }
  }

  get renderer() {
    return this.getAttribute('renderer') ?? this._defaultRenderer;
  }

  set renderer(value) {
    if (!isNil(value) && typeof value !== 'string') {
      console.error(
        'invalid renderer value for MediaChromeList. Must be a string, null, or undefined'
      );
      return;
    }

    if (isNil(value)) {
      this.removeAttribute('renderer');
    } else {
      this.setAttribute('renderer', value);
    }
  }

  get selectedValue() {
    return this.getAttribute('selectedvalue') ?? undefined;
  }

  set selectedValue(value) {
    if (this.selectedValue === value) return;
    if (isNil(value)) {
        this.removeAttribute('selectedValue');
    } else {
        this.setAttribute('selectedvalue', value);
    }
  }

  get parse() {
    return this._parse ?? DEFAULT_PARSER;
  }

  set parse(value) {
    if (this.parse === value) return;
    if (!isNil(value) && typeof value !== 'function') {
      console.error(
        `invalid parse value, ${value}, for MediaChromeList. Must be a function, null, or undefined`
      );
      return;
    }
    this._parse = value;
    this.render();
  }

  get data() {
    return this._data ?? DEFAULT_DATA;
  }

  set data(value) {
    if (value === this.value) return;
    if (!(isNil(value) || isIterable(value) || isArraylike(value))) {
      console.error(
        `invalid data value, ${value}, for MediaChromeList. Must be an iterable, array-like, null, or undefined`
      );
      return;
    }
    this._data = value;
    this.render();
  }

  get format() {
    return this._format ?? this._defaultFormat;
  }

  set format(value) {
    if (this.format === value) return;
    if (!isNil(value) && typeof value !== 'function') {
      console.error(
        `invalid format value, ${value}, for MediaChromeList. Must be a function, null, or undefined`
      );
      return;
    }
    this._format = value;
    this.render();
  }

  render() {
    const selectedValue = this.getAttribute('selectedvalue') ?? undefined;
    const listItemEls = Array.from(this.data).map((value) => {
      const listItemEl = document.createElement(this.renderer);
      const parts = ['listitem'];
      listItemEl.value = value;
      if (!isNil(this.format)) {
        listItemEl.format = this.format;
      }
      if (value === selectedValue) {
        listItemEl.setAttribute('selected', '');
        parts.push('selected');
      }
      listItemEl.setAttribute('part', parts.join(' '));
      return listItemEl;
    });
    this.shadowRoot.replaceChildren(...listItemEls);
  }
}

defineCustomElement('media-chrome-list', MediaChromeList);

export default MediaChromeList;
