import { defineCustomElement } from '../utils/defineCustomElement.js';
import {
  InnerTemplatePart,
  TemplateInstance,
  AttrPart,
} from './template-parts.js';

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
        this.templateInstance = new TemplateInstance(
          this.template,
          this.props,
          mediaThemeProcessor
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

const operators = {
  // Filters concept like Nunjucks or Liquid.
  '|': {
    string: (value) => String(value),
  },
  // Same as nullish coalesce operator in JS.
  '??': (value, defaults) => value ?? defaults,
};

class PartialDirective {
  constructor(template) {
    this.template = template;
  }
}

const mediaThemeProcessor = {
  processCallback(instance, parts, state) {
    if (!state) return;
    for (const [expression, part] of parts) {
      if (part instanceof InnerTemplatePart) {
        switch (part.directive) {
          case 'partial': {
            state[expression] = new PartialDirective(part.template);
            break;
          }
          case 'layout': {
            if (state.layout === part.expression) {
              part.replace(
                new TemplateInstance(part.template, state, mediaThemeProcessor)
              );
            } else {
              part.replace('');
            }
            break;
          }
          case 'if':
            if (state[part.expression]) {
              part.replace(
                new TemplateInstance(part.template, state, mediaThemeProcessor)
              );
            } else {
              part.replace('');
            }
            break;
        }
        continue;
      }

      const [, partial, name, rest] = expression.match(/(>)?\s*(\w+)\s*(.*)/) ?? [];
      let value = state[name];

      // Adds support for:
      //   - filters (pipe char followed by function) e.g. {{ myVar | string }}
      //   - nullish coalesce operator e.g. {{ nilVar ?? 'fallback' }}
      const [, operator, modifier] =
        rest.match(/^(\?\?|\|)?\s*(['"\w]*)/) ?? [];
      const op = operators[operator];
      if (typeof op === 'function') {
        value = op(value, getValue(modifier, state));
      } else if (op && value != null) {
        const modify = op[modifier];
        if (modify) value = modify(value);
      }

      if (name in state) {
        if (value instanceof PartialDirective) {
          // Require the partial indicator `>` or ignore this expression.
          if (partial !== '>') continue;

          const localState = { ...state };
          // Adds support for params e.g. {{PlayButton section="center"}}
          const matches = expression.matchAll(/(\w+)\s*=\s*(['"\w]*)/g);
          for (let [, paramName, paramValue] of matches) {
            localState[paramName] = getValue(paramValue, state);
          }
          value = new TemplateInstance(
            value.template,
            localState,
            mediaThemeProcessor
          );
        }

        if (part instanceof AttrPart) {
          if (part.attributeName.startsWith('aria-')) {
            value = String(value);
          }

          if (
            typeof value === 'boolean'
            // can't use this because on custom elements the props are always undefined
            // typeof part.element[part.attributeName] === 'boolean'
          ) {
            part.booleanValue = value;
          } else if (typeof value === 'function') {
            part.element[part.attributeName] = value;
          } else {
            part.value = value;
          }
        } else {
          part.value = value;
        }
      } else {
        if (
          part instanceof AttrPart
          // typeof part.element[part.attributeName] === 'boolean'
          // media-play-button doesn't have `disabled` props so can't test
        ) {
          if (value) {
            if (
              typeof value === 'boolean' &&
              part instanceof AttrPart
              // can't use this because on custom elements the props are always undefined
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
            part.booleanValue = false;
          }
        }
      }
    }
  },
};

// Eval params of something like `{{PlayButton param='center'}}
function getValue(raw, state) {
  const firstChar = raw[0];
  const lastChar = raw.slice(-1);
  if (firstChar === lastChar && [`'`, `"`].includes(firstChar)) {
    // string
    return raw.slice(1, -1);
  }
  if (isNumeric(raw)) return raw; // number value
  else return state[raw]; // variable name
}

function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

function isNumeric(str) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

defineCustomElement('media-theme', MediaTheme);

export default MediaTheme;
