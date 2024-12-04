import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';
import { errors } from './labels/labels.js';
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
      p,
      ::slotted(h3),
      ::slotted(p) {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${attrs.mediaerrorcode}" id="content">
      ${formatErrorMessage({ code: +attrs.mediaerrorcode, message: attrs.mediaerrormessage })}
    </slot>
  `;
}

function shouldOpenErrorDialog(errorCode?: number) {
  return errorCode && errors[errorCode] !== null;
}

function formatErrorMessage(error: MediaErrorLike) {
  const title: string = errors[error.code]?.title ?? '';
  const message: string = errors[error.code]?.message ?? error.message ?? '';
  let html = '';
  if (title) html += `<h3>${title}</h3>`;
  if (message) html += `<p>${message}</p>`;
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

    this.open = shouldOpenErrorDialog(this.mediaErrorCode);

    if (this.open) {
      this.shadowRoot.querySelector('slot').name = `error-${this.mediaErrorCode}`;
      this.shadowRoot.querySelector('#content').innerHTML = this.formatErrorMessage(
        this.mediaError ?? {
          code: this.mediaErrorCode,
          message: this.mediaErrorMessage,
        }
      );
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
