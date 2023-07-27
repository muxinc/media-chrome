import { MediaChromeListbox, createOption } from './media-chrome-listbox.js';
import './media-chrome-option.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';
import { parseTextTracksStr, stringifyTextTrackList, formatTextTrackObj, toggleSubsCaps } from '../utils/captions.js';

const ccIcon = /*html*/`
<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
  <slot hidden name="captions-indicator">${ccIcon}</slot>
`;

/**
 * @param {any} el Should be HTMLElement but issues with globalThis shim
 * @param {string} attrName
 * @returns {Array<Object>} An array of TextTrack-like objects.
 */
const getSubtitlesListAttr = (el, attrName) => {
  const attrVal = el.getAttribute(attrName);
  return attrVal ? parseTextTracksStr(attrVal) : [];
};

/**
 *
 * @param {any} el Should be HTMLElement but issues with globalThis shim
 * @param {string} attrName
 * @param {Array<Object>} list An array of TextTrack-like objects
 */
const setSubtitlesListAttr = (el, attrName, list) => {
  // null, undefined, and empty arrays are treated as "no value" here
  if (!list?.length) {
    el.removeAttribute(attrName);
    return;
  }

  // don't set if the new value is the same as existing
  const newValStr = stringifyTextTrackList(list);
  const oldVal = el.getAttribute(attrName);
  if (oldVal === newValStr) return;

  el.setAttribute(attrName, newValStr);
};

/**
 * @attr {string} mediasubtitleslist - (read-only) A list of all subtitles and captions.
 * @attr {boolean} mediasubtitlesshowing - (read-only) A list of the showing subtitles and captions.
 *
 * @cssproperty --media-primary-color - Default color of icon.
 * @cssproperty --media-icon-color - `fill` color of icon.
 *
 * @cssproperty --media-captions-indicator-height - `height` of captions indicator.
 * @cssproperty --media-captions-indicator-vertical-align - `vertical-align` of captions indicator.
 * @cssproperty --media-captions-listbox-white-space - `white-space` of captions list item.
 */
class MediaCaptionsListbox extends MediaChromeListbox {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-multiselectable',
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  /** @type {Element} */
  #captionsIndicator;
  /** @type {Element} */
  #selectedIndicator;
  #prevState;

  constructor() {
    super({ slotTemplate });

    this.#selectedIndicator = this.getSlottedIndicator('selected-indicator');
    this.#captionsIndicator = this.getSlottedIndicator('captions-indicator');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_LIST && oldValue !== newValue) {
      this.#render();

    } else if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_SHOWING && oldValue !== newValue) {
      this.value = newValue;

    } else if (attrName === 'aria-multiselectable') {
      // diallow aria-multiselectable
      this.removeAttribute('aria-multiselectable');
      console.warn("Captions List doesn't currently support multiple selections. You can enable multiple items via the media.textTrack API.");
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this.#onChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#onChange);
  }

  /**
   * @type {Array<object>} An array of TextTrack-like objects.
   * Objects must have the properties: kind, language, and label.
   */
  get mediaSubtitlesList() {
    return getSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_LIST);
  }

  set mediaSubtitlesList(list) {
    setSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_LIST, list);
  }

  /**
   * @type {Array<object>} An array of TextTrack-like objects.
   * Objects must have the properties: kind, language, and label.
   */
  get mediaSubtitlesShowing() {
    return getSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_SHOWING);
  }

  set mediaSubtitlesShowing(list) {
    setSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_SHOWING, list);
  }

  #render() {
    if (this.#prevState === JSON.stringify(this.mediaSubtitlesList)) return;
    this.#prevState = JSON.stringify(this.mediaSubtitlesList);

    const container = this.shadowRoot.querySelector('slot');
    container.textContent = '';

    const isOff = !this.value;

    const option = createOption(this.formatOptionText('Off'), 'off', isOff);
    option.prepend(this.#selectedIndicator.cloneNode(true));
    container.append(option);

    const subtitlesList = this.mediaSubtitlesList;

    for (const subs of subtitlesList) {

      /** @type {HTMLOptionElement} */
      const option = createOption(
        this.formatOptionText(subs.label, subs),
        formatTextTrackObj(subs),
        this.value == formatTextTrackObj(subs),
      );
      option.prepend(this.#selectedIndicator.cloneNode(true));

      // add CC icon for captions
      const type = subs.kind ?? 'subs';
      if (type === 'captions') {
        option.append(this.#captionsIndicator.cloneNode(true));
      }

      container.append(option);
    }
  }

  #onChange() {
    const selectedOption = this.selectedOptions[0]?.value;

    // turn off currently selected tracks
    toggleSubsCaps(this, false);

    if (!selectedOption) return;

    const event = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: selectedOption,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!globalThis.customElements.get('media-captions-listbox')) {
  globalThis.customElements.define('media-captions-listbox', MediaCaptionsListbox);
}

export { MediaCaptionsListbox };
export default MediaCaptionsListbox;
