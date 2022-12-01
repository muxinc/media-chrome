import { Window as window } from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { TemplateInstance } from './utils/template-parts.js';
import { processor } from './utils/template-processor.js';
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
  #prevTemplateHTML;

  constructor() {
    super();
    this.renderRoot = this.attachShadow({ mode: 'open' });

    const observer = new MutationObserver(() => this.render());
    observer.observe(this, { attributes: true });

    this.#initTemplate();
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
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'template' && oldValue != newValue) {
      this.#initTemplate();
    }
  }

  #initTemplate() {
    if (this.template && this.template.innerHTML !== this.#prevTemplateHTML) {
      // Transform short-hand if/partial templates to directive & expression.
      this.template.content
        .querySelectorAll('template[if],template[partial]')
        .forEach((t) => {
          let directive;

          if (t.hasAttribute('if')) directive = 'if';

          if (t.hasAttribute('partial')) directive = 'partial';

          if (directive) {
            t.setAttribute('directive', directive);
            t.setAttribute('expression', t.getAttribute(directive));
          }
        });

      this.createRenderer();
      this.#prevTemplateHTML = this.template.innerHTML;
    }
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

  createRenderer() {
    this.renderer = new TemplateInstance(
      this.template,
      this.props,
      this.constructor.processor
    );

    this.renderRoot.textContent = '';
    this.renderRoot.append(this.renderer);
  }

  render() {
    this.renderer?.update(this.props);
  }
}

defineCustomElement('media-theme', MediaThemeElement);
