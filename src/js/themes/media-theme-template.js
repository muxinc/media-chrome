import { defineCustomElement } from '../utils/defineCustomElement.js';
import MediaTheme from './media-theme.js';
import { InnerTemplatePart, TemplateInstance, AttrPart } from './template-parts.js';

class MediaThemeTemplate extends MediaTheme {
  constructor() {
    super();
  }

  connectedCallback() {
    this.template = this.getRootNode().querySelector(`#${this.getAttribute('template')}`);

    this.templateInstance = new TemplateInstance(
      this.template,
      this.props,
      mediaThemeProcessor
    );

    this.shadowRoot.append(this.templateInstance);

    const observer = new MutationObserver(() => this.render());
    observer.observe(this, { attributes: true });
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
    this.templateInstance.update(this.props);
  }
}

const camelCase = (name) => {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
};

const mediaThemeProcessor = {
  processCallback(instance, parts, state) {
    if (!state) return;
    for (const [expression, part] of parts) {
      if (part instanceof InnerTemplatePart) {
        console.log(part);
        switch (part.directive) {
          case 'set': {
            // cache these so they return the same element across layouts
            state[expression] = new TemplateInstance(part.template, state, mediaThemeProcessor);
            break;
          }
          case 'layout': {
            if (state.layout === part.expression) {
              // todo: cache the `TemplateInstance` per layout
              part.replace(new TemplateInstance(part.template, state, mediaThemeProcessor));
            } else {
              part.replace('');
            }
            break;
          }
          case 'if':
            if (state[part.expression]) {
              // cache here too
              part.replace(new TemplateInstance(part.template, state, mediaThemeProcessor));
            } else {
              part.replace('');
            }
            break;
        }
        continue;
      }

      const [, name, modifier] = expression.match(/(\w+)\s*\|?\s*(\w*)/) ?? [];
      if (name in state) {
        let value = state[name];
        if (modifier === 'string') {
          if (value === true) value = '';
          value += '';
        }

        // boolean attr
        if (
          typeof value === 'boolean' &&
          part instanceof AttrPart
          // typeof part.element[part.attributeName] === 'boolean'
        ) {
          part.booleanValue = value;
        } else if (
          typeof value === 'function' &&
          part instanceof AttrPart
        ) {
          part.element[part.attributeName] = value;
        } else {
          part.value = value;
        }
      } else {
        if (
          part instanceof AttrPart
          // typeof part.element[part.attributeName] === 'boolean'
          // media-play-button doesn't have `disabled` props so can't test
        ) {
          part.booleanValue = false;
        }
      }
    }
  },
};

export default MediaThemeTemplate;

defineCustomElement('media-theme-template', MediaThemeTemplate);
