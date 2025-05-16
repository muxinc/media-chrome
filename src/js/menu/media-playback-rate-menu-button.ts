import { globalThis } from '../utils/server-safe-globals.js';
import { MediaUIAttributes } from '../constants.js';
import { MediaChromeMenuButton } from './media-chrome-menu-button.js';
import {
  getNumericAttr,
  setNumericAttr,
  getMediaController,
} from '../utils/element-utils.js';
import { t } from '../utils/i18n.js';

export const DEFAULT_RATE = 1;

function getSlotTemplateHTML(attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
      
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${attrs['mediaplaybackrate'] || DEFAULT_RATE}x</slot>
  `;
}

function getTooltipContentHTML() {
  return t('Playback rate');
}

/**
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 *
 * @cssproperty [--media-playback-rate-menu-button-display = inline-flex] - `display` property of button.
 */
class MediaPlaybackRateMenuButton extends MediaChromeMenuButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
    ];
  }

  container: HTMLSlotElement;

  constructor() {
    super();
    this.container = this.shadowRoot.querySelector('slot[name="icon"]');
    this.container.innerHTML = `${this.mediaPlaybackRate ?? DEFAULT_RATE}x`;
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      const newPlaybackRate = newValue ? +newValue : Number.NaN;
      const playbackRate = !Number.isNaN(newPlaybackRate)
        ? newPlaybackRate
        : DEFAULT_RATE;
      this.container.innerHTML = `${playbackRate}x`;
      this.setAttribute(
        'aria-label',
        t('Playback rate {playbackRate}', { playbackRate })
      );
    }
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   */
  get invokeTargetElement(): HTMLElement | null {
    if (this.invokeTarget != undefined) return super.invokeTargetElement;
    return getMediaController(this).querySelector('media-playback-rate-menu');
  }

  /**
   * The current playback rate
   */
  get mediaPlaybackRate(): number {
    return getNumericAttr(
      this,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      DEFAULT_RATE
    );
  }

  set mediaPlaybackRate(value: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
  }
}

if (!globalThis.customElements.get('media-playback-rate-menu-button')) {
  globalThis.customElements.define(
    'media-playback-rate-menu-button',
    MediaPlaybackRateMenuButton
  );
}

export { MediaPlaybackRateMenuButton };
export default MediaPlaybackRateMenuButton;
