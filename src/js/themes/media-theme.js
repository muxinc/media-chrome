import { defineCustomElement } from '../utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from '../utils/server-safe-globals.js';

class MediaTheme extends window.HTMLElement {
  static template = '';
  static style = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.textContent = '';

    const style = this.constructor.style;
    let template = this.constructor.template;

    if (style !== '' && !constructableSheetSupported) {
      template = `
        <style>${style}</style>
        ${template}
        `;
    }

    const templateEl = document.createElement('template');
    templateEl.innerHTML = template;

    // Clone the template in the shadow dom
    this.shadowRoot.append(templateEl.content.cloneNode(true));

    if (style !== '' && constructableSheetSupported) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(style);

      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
  }

  get mediaController() {
    // Expose the media controller if API access is needed
    return this.shadowRoot.querySelector('media-controller');
  }
}

const supportsConstructableStylesheetTest = () => {
  try {
    new CSSStyleSheet();
    return true;
  } catch (e) {
    return false;
  }
};

const constructableSheetSupported = supportsConstructableStylesheetTest();


defineCustomElement('media-theme', MediaTheme);

export default MediaTheme;
