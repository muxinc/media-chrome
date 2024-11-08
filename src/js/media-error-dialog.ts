import { MediaUIAttributes } from './constants.js';
import { errors } from './labels/labels.js';
import { MediaChromeDialog } from './media-chrome-dialog.js';
import {
  getBooleanAttr,
  getNumericAttr,
  getStringAttr,
  setBooleanAttr,
  setNumericAttr,
  setStringAttr,
} from './utils/element-utils.js';

function getSlotTemplateHTML(attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      #content {
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8)));
        flex-direction: column;
        padding: 1.2em 1.5em;
      }

      h3,
      p,
      ::slotted(h3),
      ::slotted(p) {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${attrs.mediaerrorcode}" id="content">
      ${getErrorMessage(attrs.mediaerrorcode, attrs.mediaerrormessage)}
    </slot>
  `;
}

function shouldHideErrorDialog(errorCode?: number) {
  return !errorCode || errors[errorCode] == null;
}

function getErrorMessage(errorCode?: number | string, errorMessage?: string) {
  const message = errors[+errorCode] ?? errorMessage ?? '';
  const parts = message.split(':');

  if (parts.length === 2) {
    return /*html*/`
      <h3>${parts[0]}</h3>
      <p>${parts[1]}</p>
    `;
  }
  return /*html*/`<p>${message}</p> `;
}

const observedAttributes: string[] = [
  MediaUIAttributes.MEDIA_PAUSED,
  MediaUIAttributes.MEDIA_ERROR_CODE,
  MediaUIAttributes.MEDIA_ERROR_MESSAGE,
];

class MediaErrorDialog extends MediaChromeDialog {
  static getSlotTemplateHTML = getSlotTemplateHTML;

  static get observedAttributes() {
    return [...super.observedAttributes, ...observedAttributes];
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    // Add this conditional to prevent endless loop by setting the hidden attribute.
    if (!observedAttributes.includes(attrName)) return;

    const shouldHide = shouldHideErrorDialog(this.mediaErrorCode);
    this.hidden = !this.mediaPaused || shouldHide;

    if (!shouldHide) {
      this.shadowRoot.querySelector('slot').name = `error-${this.mediaErrorCode}`;
      this.shadowRoot.querySelector('#content').innerHTML = getErrorMessage(
        this.mediaErrorCode,
        this.mediaErrorMessage
      );
    }
  }

  get mediaPaused() {
    return getBooleanAttr(this, 'mediapaused');
  }

  set mediaPaused(value) {
    setBooleanAttr(this, 'mediapaused', value);
  }

  get mediaErrorCode() {
    return getNumericAttr(this, 'mediaerrorcode');
  }

  set mediaErrorCode(value) {
    setNumericAttr(this, 'mediaerrorcode', value);
  }

  get mediaErrorMessage() {
    return getStringAttr(this, 'mediaerrormessage');
  }

  set mediaErrorMessage(value) {
    setStringAttr(this, 'mediaerrormessage', value);
  }
}

if (!globalThis.customElements.get('media-error-dialog')) {
  globalThis.customElements.define('media-error-dialog', MediaErrorDialog);
}

export { MediaErrorDialog };
export default MediaErrorDialog;
