import './media-chrome-menu-button.js';
import './media-captions-listbox.js';
import { MediaUIAttributes, MediaStateReceiverAttributes } from './constants.js';
import { window, document, } from './utils/server-safe-globals.js';
import { closestComposedNode } from './utils/element-utils.js';
import { isCCOn, toggleSubsCaps } from './utils/captions.js';

const ccEnabledIcon = `
<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`;

const ccDisabledIcon = `
<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host,
  media-chrome-menu-button {
    display: contents;
    fill: var(--media-icon-color, #eee);
  }

  media-captions-listbox {
    position: absolute;
    bottom: 44px;
    max-height: 300px;
    overflow: auto;
  }
  :host([media-controller]) media-captions-listbox {
    z-index: 1;
    bottom: unset;
  }

  /* copied from media-chrome-button */
  media-chrome-menu-button slot svg {
    width: var(--media-button-icon-width);
    height: var(--media-button-icon-height, var(--media-control-height, 24px));
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
    fill: var(--media-icon-color, #eee);
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
  }
</style>

<media-chrome-menu-button aria-label="captions menu button">
  <slot slot="button-content" class="enabled" name="on">${ccEnabledIcon}</slot>
  <slot slot="button-content" class="disabled" name="off" hidden>${ccDisabledIcon}</slot>
  <media-captions-listbox slot="listbox">
    <slot slot="captions-indicator" name="captions-indicator">${ccEnabledIcon}</slot>
  </media-captions-listbox>
</media-chrome-menu-button>
`;

/**
 * @extends {HTMLElement}
 */
class MediaCaptionsMenuButton extends window.HTMLElement {
  #menuButton;
  /** @type {HTMLSlotElement} */
  #enabledSlot;
  /** @type {HTMLSlotElement} */
  #disabledSlot;
  /** @type {HTMLElement} */
  #listbox;
  #handleClick;

  static get observedAttributes() {
    return [
      'disabled',
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
      'no-subtitles-fallback',
      'default-showing',
      MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const mediaCaptionsMenuButton = template.content.cloneNode(true);
    this.nativeEl = mediaCaptionsMenuButton;

    shadow.append(mediaCaptionsMenuButton);

    this.#menuButton = this.shadowRoot.querySelector('media-chrome-menu-button');
    this.#enabledSlot = this.#menuButton.querySelector('.enabled');
    this.#disabledSlot = this.#menuButton.querySelector('.disabled');
    this.#listbox = this.#menuButton.querySelector('media-captions-listbox');

    this.#handleClick = this.#handleClick_.bind(this);

    this._captionsReady = false;
    this.#captionsDisabled();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
      }
    } else if (
      attrName === MediaUIAttributes.MEDIA_CAPTIONS_SHOWING ||
      attrName === MediaUIAttributes.MEDIA_SUBTITLES_SHOWING &&
      newValue !== oldValue
    ) {
      if (newValue) {
        this.#captionsEnabled();
      } else {
        this.#captionsDisabled();
      }
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }

    if (
      this.hasAttribute('default-showing') && // we want to show captions by default
    this.#enabledSlot.hidden // and we aren't currently showing them
    ) {
      // Make sure we're only checking against the relevant attributes based on whether or not we are using subtitles fallback
      const subtitlesIncluded = !this.hasAttribute('no-subtitles-fallback');
      const relevantAttributes = subtitlesIncluded
        ? [
            MediaUIAttributes.MEDIA_CAPTIONS_LIST,
            MediaUIAttributes.MEDIA_SUBTITLES_LIST,
          ]
        : [MediaUIAttributes.MEDIA_CAPTIONS_LIST];
      // If one of the relevant attributes changed...
      if (relevantAttributes.includes(attrName)) {
        // check if we went
        // a) from captions (/subs) not ready to captions (/subs) ready
        // b) from captions (/subs) ready to captions (/subs) not ready.
        // by using a simple truthy (empty or non-empty) string check on the relevant values
        // NOTE: We're using `getAttribute` here instead of `newValue` because we may care about
        // multiple attributes.
        const nextCaptionsReady =
          !!this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_LIST) ||
          !!(
            subtitlesIncluded &&
            this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST)
          );
        // If the value changed, (re)set the internal prop
        if (this._captionsReady !== nextCaptionsReady) {
          this._captionsReady = nextCaptionsReady;
          // If captions are currently ready, that means we went from unready to ready, so
          // use the click handler to dispatch a request to turn captions on
          if (this._captionsReady) {
            toggleSubsCaps(this);
          }
        }
      }
    }
  }

  #handleClick_() {
    this.#updateMenuPosition();
  }

  #updateMenuPosition() {
    // if the menu is hidden, skip updating the menu position
    if (this.#listbox.offsetWidth === 0) return;

    const svgs = this.shadowRoot.querySelectorAll('svg');
    const onSvgRect = (this.#enabledSlot.assignedElements()[0] ?? svgs[0]).getBoundingClientRect();
    const offSvgRect = (this.#disabledSlot.assignedElements()[0] ?? svgs[1]).getBoundingClientRect();

    if (this.hasAttribute('media-controller')) {
      const widthOn = onSvgRect.width;
      const widthOff = offSvgRect.width;
      const width = widthOn > 0 ? widthOn : widthOff > 0 ? widthOff : 0;
      const heightOn = onSvgRect.height;
      const heightOff = offSvgRect.height;
      const height = heightOn > 0 ? heightOn : heightOff > 0 ? heightOff : 0;

      this.#listbox.style.marginLeft = `calc(-${width}px - 10px * 2)`;
      this.#listbox.style.marginTop = `calc(${height}px + 10px * 2)`;

    } else {
      const xOn = onSvgRect.x;
      const xOff = offSvgRect.x;
      const leftOffset = xOn > 0 ? xOn : xOff > 0 ? xOff : 0;

      // Get the element that enforces the bounds for the time range boxes.
      const bounds =
        (this.getAttribute('bounds')
          ? closestComposedNode(this, `#${this.getAttribute('bounds')}`)
          : this.parentElement) ?? this;
      let parentOffset = bounds.getBoundingClientRect().x;

      if (this.#listbox.offsetWidth + leftOffset - parentOffset > bounds.offsetWidth) {
        this.#listbox.style.translate = (bounds.offsetWidth - this.#listbox.offsetWidth) + 'px';
      } else {
        this.#listbox.style.translate = `calc(${leftOffset}px - ${parentOffset}px - 10px)`;
      }
    }
  }

  #captionsEnabled() {
    this.#enabledSlot.hidden = false;
    this.#disabledSlot.hidden = true;
  }
  #captionsDisabled() {
    this.#enabledSlot.hidden = true;
    this.#disabledSlot.hidden = false;
  }

  enable() {
    this.addEventListener('click', this.#handleClick);
    this.#menuButton.removeAttribute('disabled');
  }
  disable() {
    this.removeEventListener('click', this.#handleClick);
    this.#menuButton.setAttribute('disabled', '');
  }

  connectedCallback() {
    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    if (isCCOn(this)) {
      this.#captionsEnabled();
    }

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    this.disable();

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  get keysUsed() {
    return ['Enter', ' ', 'ArrowUp', 'ArrowDown'];
  }
}

if (!window.customElements.get('media-captions-menu-button')) {
  window.customElements.define('media-captions-menu-button', MediaCaptionsMenuButton);
}

export default MediaCaptionsMenuButton;
