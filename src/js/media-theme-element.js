import { window } from './utils/server-safe-globals.js';
import { TemplateInstance } from './utils/template-parts.js';
import { processor } from './utils/template-processor.js';
import { camelCase } from './utils/utils.js';

// Export Template parts for players.
export * from './utils/template-parts.js';

const observedMediaAttributes = {
  'media-stream-type': 'streamType',
};

/**
 * @extends {HTMLElement}
 */
export class MediaThemeElement extends window.HTMLElement {
  static template;
  static observedAttributes = ['template'];
  static processor = processor;

  renderRoot;
  renderer;
  #template;
  #prevTemplate;

  constructor() {
    super();
    this.renderRoot = this.attachShadow({ mode: 'open' });

    const observer = new MutationObserver((mutationList) => {
      if (mutationList.some((mutation) => {
        if (mutation.type !== 'attributes') return false;

        // Render on each attribute change of the `<media-theme>` element.
        if (this.hasAttribute(mutation.attributeName)) return true;

        // Render if this attribute is directly observed.
        if (observedMediaAttributes[mutation.attributeName]) return true;

        // Render if `breakpoint-x` attributes change.
        if (mutation.attributeName.startsWith('breakpoint-')) return true;

      })) {
        this.render();
      }
    });

    // Observe the `<media-theme>` element for attribute changes.
    observer.observe(this, { attributes: true });

    // Observe the subtree of the render root, by default the elements in the shadow dom.
    observer.observe(this.renderRoot, {
      attributes: true,
      subtree: true,
    })

    this.createRenderer();
  }

  get mediaController() {
    // Expose the media controller if API access is needed
    return this.renderRoot.querySelector('media-controller');
  }

  get template() {
    const templateId = this.getAttribute('template');
    if (templateId) {
      // @ts-ignore
      const template = this.getRootNode()?.getElementById(templateId);
      if (template) return template;
    }
    // @ts-ignore
    return this.#template ?? this.constructor.template;
  }

  set template(element) {
    this.#template = element;
    this.createRenderer();
  }

  get props() {
    const observedAttributes = [
      ...Array.from(this.attributes),
      ...Array.from(this.mediaController?.attributes ?? [])
        .filter(({ name }) => {
          return observedMediaAttributes[name] || name.startsWith('breakpoint-')
        })
    ];

    const props = {};
    for (let attr of observedAttributes) {
      const name = observedMediaAttributes[attr.name] ?? camelCase(attr.name);
      if (attr.value != null) {
        props[name] = attr.value === '' ? true : attr.value;
      } else {
        props[name] = false;
      }
    }

    return props;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'template' && oldValue != newValue) {
      this.createRenderer();
    }
  }

  createRenderer() {
    if (this.template && this.template !== this.#prevTemplate) {
      this.#prevTemplate = this.template;

      this.renderer = new TemplateInstance(
        this.template,
        this.props,
        // @ts-ignore
        this.constructor.processor
      );

      this.renderRoot.textContent = '';
      this.renderRoot.append(this.renderer);
    }
  }

  render() {
    this.renderer?.update(this.props);
  }
}

if (!window.customElements.get('media-theme')) {
  window.customElements.define('media-theme', MediaThemeElement);
}
