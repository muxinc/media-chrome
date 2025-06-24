import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';
import { formatError } from './labels/labels.js';
import { MediaChromeDialog } from './media-chrome-dialog.js';
import {
  getNumericAttr,
  getStringAttr,
  setNumericAttr,
  setStringAttr,
} from './utils/element-utils.js';

type MediaErrorLike = {
  code: number;
  message: string;
  [key: string]: any;
};

function getSlotTemplateHTML(attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${attrs.mediaerrorcode}" id="content">
      ${formatErrorMessage({ code: +attrs.mediaerrorcode, message: attrs.mediaerrormessage })}
    </slot>
  `;
}

function shouldOpenErrorDialog(error: MediaErrorLike) {
  return error.code && formatError(error) !== null;
}

function formatErrorMessage(error: MediaErrorLike) {
  const { title, message } = formatError(error) ?? {};
  let html = '';
  if (title) html += `<slot name="error-${error.code}-title"><h3>${title}</h3></slot>`;
  if (message) html += `<slot name="error-${error.code}-message"><p>${message}</p></slot>`;
  return html;
}

const observedAttributes: string[] = [
  MediaUIAttributes.MEDIA_ERROR_CODE,
  MediaUIAttributes.MEDIA_ERROR_MESSAGE,
];

/**
 * @attr {number} mediaerrorcode - (read-only) The error code for the current media error.
 * @attr {string} mediaerrormessage - (read-only) The error message for the current media error.
 *
 * @cssproperty --media-control-background - `background` of control.
 */
class MediaErrorDialog extends MediaChromeDialog {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static formatErrorMessage = formatErrorMessage;

  static get observedAttributes() {
    return [...super.observedAttributes, ...observedAttributes];
  }

  #mediaError: MediaErrorLike | null = null;

  formatErrorMessage(error: MediaErrorLike) {
    return (this.constructor as typeof MediaErrorDialog).formatErrorMessage(error);
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    // Add this conditional to prevent endless loop by setting the open attribute.
    if (!observedAttributes.includes(attrName)) return;

    const mediaError = this.mediaError ?? {
      code: this.mediaErrorCode,
      message: this.mediaErrorMessage,
    };

    this.open = shouldOpenErrorDialog(mediaError);

    if (this.open) {
      this.shadowRoot.querySelector('slot').name = `error-${this.mediaErrorCode}`;
      this.shadowRoot.querySelector('#content').innerHTML = this.formatErrorMessage(mediaError);
    }
  }

  get mediaError(): MediaErrorLike | null {
    return this.#mediaError;
  }

  set mediaError(value: MediaErrorLike | null) {
    this.#mediaError = value;
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
