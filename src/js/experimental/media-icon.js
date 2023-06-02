import { window, document } from '../utils/server-safe-globals.js';
import { getIcons } from '../icons/registry.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }
  </style>
`;

class MediaIcon extends window.HTMLElement {
  static observedAttributes = ['icons', 'name'];

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.append(template.content.cloneNode(true));
    }
  }

  get icons() {
    return this.getAttribute('icons') ?? 'default';
  }

  set icons(val) {
    this.setAttribute('icons', val);
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(val) {
    this.setAttribute('name', val);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue != newValue) {
      this.renderIcon();
    }
  }

  async renderIcon() {
    const iconSet = getIcons(this.icons);
    if (iconSet) {

      const html = await iconSet.resolver(this.name);
      const template = document.createElement('template');
      template.innerHTML = html;

      const icon = template.content.firstElementChild;
      if (iconSet.mutator) {
        await iconSet.mutator(icon);
      }

      this.shadowRoot.querySelector(':host > :not(style)')?.remove();
      this.shadowRoot.append(icon);
    }
  }
}

if (!window.customElements.get('media-icon')) {
  window.customElements.define('media-icon', MediaIcon);
}

export default MediaIcon;
