import { MediaChromeMenuButton } from './media-chrome-menu-button.js';
import { globalThis } from '../utils/server-safe-globals.js';
import { getMediaController } from '../utils/element-utils.js';
import { t } from '../utils/i18n.js';
import { MediaUIAttributes } from '../constants.js';

function getSlotTemplateHTML() {
  return /*html*/ `
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg>
    </slot>
  `;
}

function getTooltipContentHTML() {
  return t('Settings');
}

const updateAriaLabelTooltip = (el: MediaSettingsMenuButton) => {
  const label = t('settings');
  el.setAttribute('aria-label', label);

  const tooltipContent = el.shadowRoot?.querySelector('slot[name="tooltip-content"]');
  if (tooltipContent) tooltipContent.textContent = t('Settings');
};

/**
 * @attr {string} target - CSS id selector for the element to be targeted by the button.
 */
class MediaSettingsMenuButton extends MediaChromeMenuButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'target'];
  }

  connectedCallback(): void {
    super.connectedCallback();
    updateAriaLabelTooltip(this)
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_LANG) {
      updateAriaLabelTooltip(this);
    }
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   * @return {HTMLElement | null}
   */
  get invokeTargetElement(): HTMLElement | null {
    if (this.invokeTarget != undefined) return super.invokeTargetElement;
    return getMediaController(this).querySelector('media-settings-menu');
  }
}

if (!globalThis.customElements.get('media-settings-menu-button')) {
  globalThis.customElements.define(
    'media-settings-menu-button',
    MediaSettingsMenuButton
  );
}

export { MediaSettingsMenuButton };
export default MediaSettingsMenuButton;
