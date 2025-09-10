import { globalThis } from '../utils/server-safe-globals.js';
import { MediaUIAttributes } from '../constants.js';
import { MediaChromeMenuButton } from './media-chrome-menu-button.js';
import { getMediaController } from '../utils/element-utils.js';
import {
  areSubsOn,
  parseTextTracksStr,
  stringifyTextTrackList,
} from '../utils/captions.js';
import { TextTrackLike } from '../utils/TextTrackLike.js';
import { t } from '../utils/i18n.js';

const ccIconOn = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`;

const ccIconOff = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;

function getSlotTemplateHTML() {
  return /*html*/ `
    <style>
      :host([data-captions-enabled="true"]) slot[name=off] {
        display: none !important;
      }

      ${/* Double negative, but safer if display doesn't equal 'block' */ ''}
      :host(:not([data-captions-enabled="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${ccIconOn}</slot>
      <slot name="off">${ccIconOff}</slot>
    </slot>
  `;
}

function getTooltipContentHTML() {
  return t('Captions');
}

const updateAriaChecked = (el: HTMLElement): void => {
  el.setAttribute('data-captions-enabled', areSubsOn(el).toString());
};

const updateAriaLabel = (el: HTMLElement): void => {
  el.setAttribute('aria-label', t('closed captions'));
};

/**
 * @slot on - An element that will be shown while closed captions or subtitles are on.
 * @slot off - An element that will be shown while closed captions or subtitles are off.
 * @slot icon - An element for representing on and off states in a single icon
 *
 * @attr {string} mediasubtitleslist - (read-only) A list of all subtitles and captions.
 * @attr {string} mediasubtitlesshowing - (read-only) A list of the showing subtitles and captions.
 *
 * @cssproperty [--media-captions-menu-button-display = inline-flex] - `display` property of button.
 */
class MediaCaptionsMenuButton extends MediaChromeMenuButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
      MediaUIAttributes.MEDIA_LANG
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    updateAriaLabel(this);
    updateAriaChecked(this);
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string,
    newValue: string
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_SHOWING) {
      updateAriaChecked(this);
    }
    else if (attrName === MediaUIAttributes.MEDIA_LANG) {
      updateAriaLabel(this);
    }
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   * @return {HTMLElement | null}
   */
  get invokeTargetElement(): HTMLElement | null {
    if (this.invokeTarget != undefined) return super.invokeTargetElement;
    return getMediaController(this)?.querySelector('media-captions-menu');
  }

  /**
   * An array of TextTrack-like objects.
   * Objects must have the properties: kind, language, and label.
   */
  get mediaSubtitlesList(): TextTrackLike[] {
    return getSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_LIST);
  }

  set mediaSubtitlesList(list: TextTrackLike[]) {
    setSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_LIST, list);
  }

  /**
   * An array of TextTrack-like objects.
   * Objects must have the properties: kind, language, and label.
   */
  get mediaSubtitlesShowing(): TextTrackLike[] {
    return getSubtitlesListAttr(
      this,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
    );
  }

  set mediaSubtitlesShowing(list: TextTrackLike[]) {
    setSubtitlesListAttr(this, MediaUIAttributes.MEDIA_SUBTITLES_SHOWING, list);
  }
}

/**
 * @param el - Should be HTMLElement but issues with globalThis shim
 * @param attrName - The attribute name to get
 * @returns An array of TextTrack-like objects.
 */
const getSubtitlesListAttr = (
  el: HTMLElement,
  attrName: string
): TextTrackLike[] => {
  const attrVal = el.getAttribute(attrName);
  return attrVal ? parseTextTracksStr(attrVal) : [];
};

/**
 *
 * @param el - Should be HTMLElement but issues with globalThis shim
 * @param attrName - The attribute name to set
 * @param list - An array of TextTrack-like objects
 */
const setSubtitlesListAttr = (
  el: HTMLElement,
  attrName: string,
  list: TextTrackLike[]
): void => {
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

if (!globalThis.customElements.get('media-captions-menu-button')) {
  globalThis.customElements.define(
    'media-captions-menu-button',
    MediaCaptionsMenuButton
  );
}

export { MediaCaptionsMenuButton };
export default MediaCaptionsMenuButton;
