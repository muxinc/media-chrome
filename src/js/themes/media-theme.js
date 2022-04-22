class MediaTheme extends HTMLElement {
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
    template.innerHTML = this.constructor.template;

    // Clone the template in the shadow dom
    this.shadowRoot.append(template.content.cloneNode(true));

    // Expose the media controller if API access is needed
    this.mediaController = this.shadowRoot.querySelector('media-controller');
  }
}

if (!customElements.get('media-theme')) {
  customElements.define('media-theme', MediaTheme);
}

export default MediaTheme;
