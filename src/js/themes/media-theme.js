import { window, document } from '../utils/server-safe-globals.js';

class MediaTheme extends window.HTMLElement {
  static template = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.textContent = '';

    const template = document.createElement('template');
    // @ts-ignore
    template.innerHTML = this.constructor.template;

    // Clone the template in the shadow dom
    this.shadowRoot.append(template.content.cloneNode(true));
  }

  get mediaController() {
    // Expose the media controller if API access is needed
    return this.shadowRoot.querySelector('media-controller');
  }
}

if (!window.customElements.get('media-theme-base')) {
  window.customElements.define('media-theme-base', MediaTheme);
}

export default MediaTheme;
