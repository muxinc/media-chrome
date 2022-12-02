import { Window as window } from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { TemplateInstance } from './utils/template-parts.js';
import { processor, transformDirectiveAliases } from './utils/template-processor.js';
import { camelCase } from './utils/utils.js';

// Export Template parts for players.
export * from './utils/template-parts.js';

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

    const observer = new MutationObserver(() => this.render());
    observer.observe(this, { attributes: true });

    this.createRenderer();
  }

  get mediaController() {
    // Expose the media controller if API access is needed
    return this.renderRoot.querySelector('media-controller');
  }

  get template() {
    const templateId = this.getAttribute('template');
    if (templateId) {
      const template = this.getRootNode()?.getElementById(templateId);
      if (template) return template;
    }
    return this.#template ?? this.constructor.template;
  }

  set template(element) {
    this.#template = element;
    this.createRenderer();
  }

  get props() {
    const props = {};
    for (let attr of this.attributes) {
      if (attr.value != null) {
        props[camelCase(attr.name)] = attr.value === '' ? true : attr.value;
      } else {
        props[camelCase(attr.name)] = false;
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
    // Compare template element references here because
    // transformDirectiveAliases changes the innerHTML.
    if (this.template && this.template !== this.#prevTemplate) {
      this.#prevTemplate = this.template;

      this.renderer = new TemplateInstance(
        transformDirectiveAliases(this.template),
        this.props,
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

defineCustomElement('media-theme', MediaThemeElement);
