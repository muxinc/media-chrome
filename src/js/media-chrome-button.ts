import {
  MediaStateReceiverAttributes,
  MediaUIAttributes,
} from './constants.js';
import MediaTooltip, { TooltipPlacement } from './media-tooltip.js';
import {
  getBooleanAttr,
  getOrInsertCSSRule,
  getStringAttr,
  namedNodeMapToObject,
  setBooleanAttr,
  setStringAttr,
} from './utils/element-utils.js';
import { globalThis } from './utils/server-safe-globals.js';

const Attributes = {
  TOOLTIP_PLACEMENT: 'tooltipplacement',
  DISABLED: 'disabled',
  NO_TOOLTIP: 'notooltip',
};

function getTemplateHTML(_attrs: Record<string, string>, _props: Record<string, any> = {}) {
  return /*html*/ `
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
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      ${
        /*
        Only show outline when keyboard focusing.
        https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
      */ ''
      }
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
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
        ${
          /** Make sure unpositioned tooltip doesn't cause page overflow (scroll). */ ''
        }
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(_attrs, _props)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${MediaTooltip.shadowRootOptions.mode}">
          ${MediaTooltip.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(_attrs)}
        </slot>
      </media-tooltip>
    </slot>
  `;
}

function getSlotTemplateHTML(_attrs: Record<string, string>, _props: Record<string, any>) {
  return /*html*/ `
    <slot></slot>
  `;
}

function getTooltipContentHTML() {
  return '';
}

/**
 * @extends {HTMLElement}
 *
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 * @attr {('top'|'right'|'bottom'|'left'|'none')} tooltipplacement - The placement of the tooltip, defaults to "top"
 * @attr {boolean} notooltip - Hides the tooltip if this attribute is present
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
 * @cssproperty --media-button-justify-content - `justify-content` property of button.
 * @cssproperty --media-button-padding - `padding` of button.
 * @cssproperty --media-cursor - `cursor` property.
 * @cssproperty --media-focus-box-shadow - `box-shadow` of focused control.
 */
class MediaChromeButton extends globalThis.HTMLElement {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  #mediaController;
  preventClick = false;
  tooltipEl: MediaTooltip = null;

  static get observedAttributes() {
    return [
      'disabled',
      Attributes.TOOLTIP_PLACEMENT,
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
      MediaUIAttributes.MEDIA_LANG
    ];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow((this.constructor as typeof MediaChromeButton).shadowRootOptions);

      const attrs = namedNodeMapToObject(this.attributes);
      const html = (this.constructor as typeof MediaChromeButton).getTemplateHTML(attrs);
      // From MDN: setHTMLUnsafe should be used instead of ShadowRoot.innerHTML 
      // when a string of HTML may contain declarative shadow roots.
      this.shadowRoot.setHTMLUnsafe ?
        this.shadowRoot.setHTMLUnsafe(html) :
        this.shadowRoot.innerHTML = html;
    }

    this.tooltipEl = this.shadowRoot.querySelector('media-tooltip');
  }

  #clickListener = (e) => {
    if (!this.preventClick) {
      this.handleClick(e);
    }

    // Timeout needed to wait for a new "tick" of event loop otherwise
    // measured position does not take into account the new tooltip content
    setTimeout(this.#positionTooltip, 0);
  };

  #positionTooltip = () => {
    // Conditional chaining accounts for scenarios
    // where the tooltip element isn't yet defined.
    this.tooltipEl?.updateXOffset?.();
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
      attrName === Attributes.TOOLTIP_PLACEMENT &&
      this.tooltipEl &&
      newValue !== oldValue
    ) {
      this.tooltipEl.placement = newValue;
    }
    else if (attrName === MediaUIAttributes.MEDIA_LANG) {
      this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML = (this.constructor as typeof MediaChromeButton).getTooltipContentHTML();
    }

    // The tooltips label, and subsequently it's size and position, are a function
    // of the buttons state, so we greedily assume we need account for any form
    // of state change by reacting to all attribute changes, even if sometimes the
    // update might be redundant
    this.#positionTooltip();
  }

  connectedCallback() {
    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty(
      'display',
      `var(--media-control-display, var(--${this.localName}-display, inline-flex))`
    );

    if (!this.hasAttribute('disabled')) {
      this.enable();
    } else {
      this.disable();
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

    globalThis.customElements
      .whenDefined('media-tooltip')
      .then(() => this.#setupTooltip());
  }

  // Called when we know the tooltip is ready / defined
  #setupTooltip() {
    this.addEventListener('mouseenter', this.#positionTooltip);
    this.addEventListener('focus', this.#positionTooltip);
    this.addEventListener('click', this.#clickListener);

    const initialPlacement = this.tooltipPlacement;
    if (initialPlacement && this.tooltipEl) {
      this.tooltipEl.placement = initialPlacement;
    }
  }

  disconnectedCallback() {
    this.disable();
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;

    this.removeEventListener('mouseenter', this.#positionTooltip);
    this.removeEventListener('focus', this.#positionTooltip);
    this.removeEventListener('click', this.#clickListener);
  }

  get keysUsed() {
    return ['Enter', ' '];
  }

  /**
   * Get or set tooltip placement
   */
  get tooltipPlacement(): TooltipPlacement | undefined {
    return getStringAttr(this, Attributes.TOOLTIP_PLACEMENT);
  }

  set tooltipPlacement(value: TooltipPlacement | undefined) {
    setStringAttr(this, Attributes.TOOLTIP_PLACEMENT, value);
  }

  get mediaController(): string | undefined {
    return getStringAttr(this, MediaStateReceiverAttributes.MEDIA_CONTROLLER);
  }

  set mediaController(value: string | undefined) {
    setStringAttr(this, MediaStateReceiverAttributes.MEDIA_CONTROLLER, value);
  }

  get disabled(): boolean | undefined {
    return getBooleanAttr(this, Attributes.DISABLED);
  }

  set disabled(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.DISABLED, value);
  }

  get noTooltip(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_TOOLTIP);
  }

  set noTooltip(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_TOOLTIP, value);
  }

  /**
   * @abstract
   * @argument {Event} e
   */
  handleClick(e) {} // eslint-disable-line
}

if (!globalThis.customElements.get('media-chrome-button')) {
  globalThis.customElements.define('media-chrome-button', MediaChromeButton);
}

export { MediaChromeButton };
export default MediaChromeButton;
