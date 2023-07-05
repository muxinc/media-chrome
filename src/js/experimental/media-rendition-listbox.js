import MediaChromeListbox from './media-chrome-listbox.js';
import { window, document } from '../utils/server-safe-globals.js';
import { stringifyRenditionList, parseRenditionList } from '../utils/utils.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <style>
    media-chrome-listitem {
      white-space: var(--media-rendition-listbox-white-space, nowrap);
    }
  </style>
`;

const getRenditionListAttr = (el, attrName) => {
  const attrVal = el.getAttribute(attrName);
  if (!attrVal) return [];

  return parseRenditionList(attrVal);
}

const setRenditionListAttr = (el, attrName, list) => {
  // null, undefined, and empty arrays are treated as "no value" here
  if (!list?.length) {
    el.removeAttribute(attrName);
    return;
  }

  // don't set if the new value is the same as existing
  const newValStr = stringifyRenditionList(list);
  const oldVal = el.getAttribute(attrName);
  if (oldVal === newValStr) return;

  el.setAttribute(attrName, newValStr);
}

/**
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 *
 * @cssproperty --media-rendition-listbox-white-space - `white-space` of playback rate list item.
 */
class MediaRenditionListbox extends MediaChromeListbox {
  #autoOption;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_LIST,
      MediaUIAttributes.MEDIA_RENDITION_ENABLED,
      MediaUIAttributes.MEDIA_RENDITION_ACTIVE,
    ];
  }

  constructor() {
    super({ slotTemplate });

    const autoOption = document.createElement('media-chrome-listitem');

    autoOption.part.add('listitem');
    autoOption.value = 'auto';
    autoOption.textContent = 'Auto';
    this.#autoOption = autoOption;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {

    if (attrName === MediaUIAttributes.MEDIA_RENDITION_ENABLED && oldValue !== newValue) {
      this.value = newValue;

    } else if (attrName === MediaUIAttributes.MEDIA_RENDITION_LIST && oldValue !== newValue) {
      this.#render();
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  connectedCallback() {
    this.addEventListener('change', this.#onChange);

    super.connectedCallback();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#onChange);

    super.disconnectedCallback();
  }

  get mediaRenditionList() {
    return getRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_LIST);
  }

  set mediaRenditionList(list) {
    setRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_LIST, list);
  }

  get mediaRenditionEnabled() {
    return getRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_ENABLED);
  }

  set mediaRenditionEnabled(list) {
    setRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_ENABLED, list);
  }

  get mediaRenditionActive() {
    return getRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_ACTIVE);
  }

  set mediaRenditionActive(list) {
    setRenditionListAttr(this, MediaUIAttributes.MEDIA_RENDITION_ACTIVE, list);
  }

  #render() {
    const renditionList = this.mediaRenditionList;

    const container = this.shadowRoot.querySelector('slot');
    container.textContent = '';

    if (!container.contains(this.#autoOption)) {
      container.append(this.#autoOption);
    }

    let isAuto = !this.hasAttribute(MediaUIAttributes.MEDIA_RENDITION_ENABLED);
    if (isAuto) {
      this.#autoOption.setAttribute('aria-selected', 'true');
      this.#autoOption.setAttribute('tabindex', '0');
    } else {
      this.#autoOption.setAttribute('aria-selected', 'false');
      this.#autoOption.setAttribute('tabindex', '-1');
    }

    for (const rendition of renditionList) {

      /** @type {HTMLOptionElement} */
      const option = document.createElement('media-chrome-listitem');
      option.part.add('listitem');
      option.value = `${rendition.id}:${rendition.height}`;
      option.textContent = `${rendition.height}p`;

      if (rendition.enabled && isAuto) {
        option.setAttribute('aria-selected', 'true');
      } else {
        option.setAttribute('aria-selected', 'false');
      }

      container.append(option);
    }
  }

  #onChange() {
    const selectedOption = this.selectedOptions[0]?.value?.split(':')[0];

    if (!selectedOption) return;

    const event = new window.CustomEvent(
      MediaUIEvents.MEDIA_RENDITION_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: selectedOption,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!window.customElements.get('media-rendition-listbox')) {
  window.customElements.define('media-rendition-listbox', MediaRenditionListbox);
}

export default MediaRenditionListbox;
