import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Document as document,
} from './utils/server-safe-globals.js';

const isNil = (x) => x == undefined;
const DEFAULT_FORMATTER = (value) => `${value}`;
const DEFAULT_VALUE = '';

class MediaChromeListItem extends MediaTextDisplay {
  static get observedAttributes() {
    return ['value', 'selected'];
  }

  constructor({ format } = {}) {
    super();
    if (format) {
      this.format = format;
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'value' && oldValue !== newValue) {
      this.render();
    }
  }

  get format() {
    return this._format ?? DEFAULT_FORMATTER;
  }

  set format(value) {
    if (this.format === value) return;
    if (!isNil(value) && typeof value !== 'function') {
      console.error(
        'invalid format value for MediaChromeListItem. Must be a function, null, or undefined'
      );
      return;
    }
    this._format = value;
    this.render();
  }

  get value() {
    return this.getAttribute('value') ?? DEFAULT_VALUE;
  }

  set value(val) {
    if (val === this.value) return;
    this.setAttribute('value', val);
  }

  render() {
    this.container.innerHTML = this.format(this.value);
  }
}

defineCustomElement('media-chrome-list-item', MediaChromeListItem);

export default MediaChromeListItem;
