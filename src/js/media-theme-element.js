import { defineCustomElement } from './utils/defineCustomElement.js';
import { TemplateInstance } from './utils/template-parts.js';
import { processor } from './utils/template-processor.js';

// Export Template parts for players.
export * from './utils/template-parts.js';

export class MediaThemeElement extends HTMLElement {
  static observedAttributes = ['template'];
  static processor = processor;

  renderRoot;
  renderer;
  #template;

  constructor() {
    super();
    this.renderRoot = this.attachShadow({ mode: 'open' });

    const observer = new MutationObserver(() => this.render());
    observer.observe(this, { attributes: true });
  }

  get mediaController() {
    // Expose the media controller if API access is needed
    return this.renderRoot.querySelector('media-controller');
  }

  get template() {
    const templateId = this.getAttribute('template');
    if (templateId) {
      const template = this.getRootNode().getElementById(templateId);
      if (template) return template;
    }
    return this.#template;
  }

  set template(element) {
    this.#template = element;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'template' && oldValue != newValue) {
      if (this.template) {
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
      }
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

function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

defineCustomElement('media-theme', MediaThemeElement);
