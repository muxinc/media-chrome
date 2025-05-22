import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { t } from './utils/i18n.js';
import {
  getStringAttr,
  setStringAttr,
  getBooleanAttr,
  setBooleanAttr,
} from './utils/element-utils.js';

const airplayIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;

function getSlotTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host([${
        MediaUIAttributes.MEDIA_IS_AIRPLAYING
      }]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      ${/* Double negative, but safer if display doesn't equal 'block' */ ''}
      :host(:not([${
        MediaUIAttributes.MEDIA_IS_AIRPLAYING
      }])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${MediaUIAttributes.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${
        MediaUIAttributes.MEDIA_IS_AIRPLAYING
      }])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${airplayIcon}</slot>
      <slot name="exit">${airplayIcon}</slot>
    </slot>
  `;
}

function getTooltipContentHTML() {
  return /*html*/ `
    <slot name="tooltip-enter">${t('start airplay')}</slot>
    <slot name="tooltip-exit">${t('stop airplay')}</slot>
  `;
}

const updateAriaLabel = (el: MediaAirplayButton): void => {
  const label = el.mediaIsAirplaying ? t('stop airplay') : t('start airplay');
  el.setAttribute('aria-label', label);
};

/**
 * @slot enter - An element shown when the media is not in AirPlay mode and pressing the button will open the AirPlay menu.
 * @slot exit - An element shown when the media is in AirPlay mode and pressing the button will open the AirPlay menu.
 * @slot icon - The element shown for the AirPlay button’s display.
 *
 * @attr {(unavailable|unsupported)} mediaairplayunavailable - (read-only) Set if AirPlay is unavailable.
 * @attr {boolean} mediaisairplaying - (read-only) Present if the media is airplaying.
 *
 * @cssproperty [--media-airplay-button-display = inline-flex] - `display` property of button.
 *
 * @event {CustomEvent} mediaairplayrequest
 */
class MediaAirplayButton extends MediaChromeButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_IS_AIRPLAYING,
      MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    updateAriaLabel(this);
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_IS_AIRPLAYING) {
      updateAriaLabel(this);
    }
  }

  /**
   * Are we currently airplaying
   */
  get mediaIsAirplaying(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_IS_AIRPLAYING);
  }

  set mediaIsAirplaying(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_IS_AIRPLAYING, value);
  }

  /**
   * Airplay unavailability state
   */
  get mediaAirplayUnavailable(): string | undefined {
    return getStringAttr(this, MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE);
  }

  set mediaAirplayUnavailable(value: string | undefined) {
    setStringAttr(this, MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE, value);
  }

  handleClick(): void {
    const evt = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_AIRPLAY_REQUEST,
      {
        composed: true,
        bubbles: true,
      }
    );
    this.dispatchEvent(evt);
  }
}

if (!globalThis.customElements.get('media-airplay-button')) {
  globalThis.customElements.define('media-airplay-button', MediaAirplayButton);
}

export default MediaAirplayButton;
