import { MediaStateReceiverAttributes } from './constants.js';
import MediaTooltip, { TooltipPosition } from './media-tooltip.js';
import {
  getOrInsertCSSRule,
  getStringAttr,
  setStringAttr,
} from './utils/element-utils.js';
import { globalThis, document } from './utils/server-safe-globals.js';

const Attributes = {
  TOOLTIP_POSITION: 'tooltipposition',
};

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
  :host {
    position: relative;
    font: var(--media-font,
      var(--media-font-weight, bold)
      var(--media-font-size, 14px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
    padding: var(--media-button-padding, var(--media-control-padding, 10px));
    justify-content: var(--media-button-justify-content, center);
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    box-sizing: border-box;
    transition: background .15s linear;
    pointer-events: auto;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  ${
    /*
    Only show outline when keyboard focusing.
    https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
  */ ''
  }
  :host(:focus-visible) {
    box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
    outline: 0;
  }
  ${
    /*
     * hide default focus ring, particularly when using mouse
     */ ''
  }
  :host(:where(:focus)) {
    box-shadow: none;
    outline: 0;
  }

  :host(:hover) {
    background: var(--media-control-hover-background, rgba(50 50 70 / .7));
  }

  svg, img, ::slotted(svg), ::slotted(img) {
    width: var(--media-button-icon-width);
    height: var(--media-button-icon-height, var(--media-control-height, 24px));
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
    fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
  }

  media-tooltip {
    opacity: 0;
    transition: opacity .3s;
  }

  :host(:hover) media-tooltip {
    opacity: 1;
  }
</style>
`;

/**
 * @extends {HTMLElement}
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 * @attr {('top'|'right'|'bottom'|'left'|'none')} tooltipposition - The position of the tooltip, defaults to "top"
 *
 * @cssproperty --media-primary-color - Default color of text and icon.
 * @cssproperty --media-secondary-color - Default color of button background.
 * @cssproperty --media-text-color - `color` of button text.
 * @cssproperty --media-icon-color - `fill` color of button icon.
 *
 * @cssproperty --media-control-display - `display` property of control.
 * @cssproperty --media-control-background - `background` of control.
 * @cssproperty --media-control-hover-background - `background` of control hover state.
 * @cssproperty --media-control-padding - `padding` of control.
 * @cssproperty --media-control-height - `line-height` of control.
 *
 * @cssproperty --media-font - `font` shorthand property.
 * @cssproperty --media-font-weight - `font-weight` property.
 * @cssproperty --media-font-family - `font-family` property.
 * @cssproperty --media-font-size - `font-size` property.
 * @cssproperty --media-text-content-height - `line-height` of button text.
 *
 * @cssproperty --media-button-icon-width - `width` of button icon.
 * @cssproperty --media-button-icon-height - `height` of button icon.
 * @cssproperty --media-button-icon-transform - `transform` of button icon.
 * @cssproperty --media-button-icon-transition - `transition` of button icon.
 */
class MediaChromeButton extends globalThis.HTMLElement {
  #mediaController;
  preventClick = false;
  nativeEl: DocumentFragment;
  tooltip: MediaTooltip = null;

  static get observedAttributes() {
    return [
      'disabled',
      Attributes.TOOLTIP_POSITION,
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
    ];
  }

  constructor(
    options: Partial<{
      slotTemplate: HTMLTemplateElement;
      defaultContent: string;
    }> = {}
  ) {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });

      const buttonHTML = template.content.cloneNode(true) as DocumentFragment;
      this.nativeEl = buttonHTML;

      // Slots
      let slotTemplate = options.slotTemplate;

      if (!slotTemplate) {
        slotTemplate = document.createElement('template');
        slotTemplate.innerHTML = `<slot>${options.defaultContent || ''}</slot>`;
      }

      this.nativeEl.appendChild(slotTemplate.content.cloneNode(true));

      this.shadowRoot.appendChild(buttonHTML);

      this.tooltip = this.shadowRoot.querySelector('media-tooltip');
    }
  }

  #clickListener = (e) => {
    if (!this.preventClick) {
      this.handleClick(e);
    }
  };

  // NOTE: There are definitely some "false positive" cases with multi-key pressing,
  // but this should be good enough for most use cases.
  #keyupListener = (e) => {
    const { key } = e;
    if (!this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }

    if (!this.preventClick) {
      this.handleClick(e);
    }
  };

  #keydownListener = (e) => {
    const { metaKey, altKey, key } = e;
    if (metaKey || altKey || !this.keysUsed.includes(key)) {
      this.removeEventListener('keyup', this.#keyupListener);
      return;
    }
    this.addEventListener('keyup', this.#keyupListener, { once: true });
  };

  enable() {
    this.addEventListener('click', this.#clickListener);
    this.addEventListener('keydown', this.#keydownListener);
    this.tabIndex = 0;
  }

  disable() {
    this.removeEventListener('click', this.#clickListener);
    this.removeEventListener('keydown', this.#keydownListener);
    this.removeEventListener('keyup', this.#keyupListener);
    this.tabIndex = -1;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue && this.isConnected) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
      }
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    } else if (
      attrName === Attributes.TOOLTIP_POSITION &&
      newValue !== oldValue
    ) {
      // If the tooltip isn't defined, then we could accidentally overwrite
      // the '.position' property
      if (this.tooltip && globalThis.customElements.get('media-tooltip')) {
        this.tooltip.position = newValue;
      }
    }
  }

  connectedCallback() {
    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty(
      'display',
      `var(--media-control-display, var(--${this.localName}-display, inline-flex))`
    );

    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    this.setAttribute('role', 'button');

    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      this.#mediaController =
        // @ts-ignore
        this.getRootNode()?.getElementById(mediaControllerId);
      this.#mediaController?.associateElement?.(this);
    }

    if (window.customElements.get('media-tooltip')) {
      this.setupTooltip();
    } else {
      globalThis.customElements
        .whenDefined('media-tooltip')
        .then(this.setupTooltip.bind(this));
    }
  }

  disconnectedCallback() {
    this.disable();
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;

    this.removeEventListener('mouseenter', this.tooltip?.updateXOffset);
    this.removeEventListener('focus', this.tooltip?.updateXOffset);
    // TODO: how to remove this correctly?
    // this.removeEventListener('click', this.tooltip?.updatePosition);
    this.tooltip = null;
  }

  get keysUsed() {
    return ['Enter', ' '];
  }

  /**
   * Get or set tooltip position
   */
  get tooltipPosition(): TooltipPosition | undefined {
    return getStringAttr(this, Attributes.TOOLTIP_POSITION);
  }

  set tooltipPosition(value: TooltipPosition | undefined) {
    setStringAttr(this, Attributes.TOOLTIP_POSITION, value);
  }

  /**
   * @abstract
   * @argument {Event} e
   */
  handleClick(e) {} // eslint-disable-line

  // Called when we know the tooltip is ready / defined
  setupTooltip() {
    this.addEventListener('mouseenter', this.tooltip.updateXOffset);
    this.addEventListener('focus', this.tooltip.updateXOffset);
    this.addEventListener('click', () => {
      // Timeout needed to wait for a new "tick" of event loop otherwise
      // measured position does not take into account the new tooltip content
      setTimeout(this.tooltip.updateXOffset, 0);
    });
    const initialPosition = this.tooltipPosition;
    if (initialPosition) this.tooltip.position = initialPosition;
  }
}

if (!globalThis.customElements.get('media-chrome-button')) {
  globalThis.customElements.define('media-chrome-button', MediaChromeButton);
}

export { MediaChromeButton };
export default MediaChromeButton;
