import { defineCustomElement } from '../utils/defineCustomElement.js';
import { TemplateInstance } from './template-parts.js';
import { processor } from './template-processor.js';

class MediaTheme extends HTMLElement {
  static observedAttributes = ['template'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const observer = new MutationObserver(() => this.render());
    observer.observe(this, { attributes: true });
  }

  get mediaController() {
    // Expose the media controller if API access is needed
    return this.shadowRoot.querySelector('media-controller');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'template' && oldValue != newValue) {
      this.template = this.getRootNode().querySelector(
        `#${this.getAttribute('template')}`
      );

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

        this.templateInstance = new TemplateInstance(
          this.template,
          this.props,
          processor
        );

        this.shadowRoot.textContent = '';
        this.shadowRoot.append(this.templateInstance);
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

  render() {
    this.templateInstance?.update(this.props);
  }
}

function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

defineCustomElement('media-theme', MediaTheme);

export default MediaTheme;
