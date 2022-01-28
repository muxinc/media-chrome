class MediaTheme extends HTMLElement {
  constructor(template = ``, options = {}) {
    super();

    options = Object.assign(
      {
        // Default options
      },
      options
    );

    // Expose the template publicaly for other uses
    this.template = template;

    // Not sure if this is best practice or if we should just
    // innerHTML the template string in the shadow dom
    const templateEl = document.createElement('template');
    templateEl.innerHTML = template;

    // Clone the template in the shadow dom
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateEl.content.cloneNode(true));

    // Expose the media controller if API access is needed
    this.mediaController = shadow.querySelector('media-controller');
  }
}

if (!customElements.get('media-theme')) {
  customElements.define('media-theme', MediaTheme);
}

export default MediaTheme;
