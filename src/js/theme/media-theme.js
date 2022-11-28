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
          case 'if':
            if (evaluateCondition(part.expression, state)) {
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

      const [, prefix, name, rest] =
        expression.match(/([>&])?\s*(\w+)\s*(.*)/) ?? [];
      let value = state[name];

      // Adds support for:
      //   - filters (pipe char followed by function) e.g. {{ myVar | string }}
      //   - nullish coalesce operator e.g. {{ nilVar ?? 'fallback' }}
      const [, operator, modifier] =
        rest.match(/^(\?\?|\|)?\s*(['"\w]*)/) ?? [];
      const op = operators[operator];
      if (typeof op === 'function') {
        value = op(value, getParamValue(modifier, state));
      } else if (op && value != null) {
        const modify = op[modifier];
        if (modify) value = modify(value);
      }

      if (value) {
        if (value instanceof PartialDirective) {
          // Require the partial indicator `>` or ignore this expression.
          if (prefix !== '>') continue;

          const localState = { ...state };
          // Adds support for params e.g. {{PlayButton section="center"}}
          const matches = expression.matchAll(/(\w+)\s*=\s*(['"\w]*)/g);
          for (let [, paramName, paramValue] of matches) {
            localState[paramName] = getParamValue(paramValue, state);
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
        }

        // No need to HTML escape values, the template parts stringify the values.
        if (part instanceof AttrPart) {
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
          part.booleanValue = false;
        }
      }
    }
  },
};

function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

const conditions = {
  '==': (a, b) => a == b,
  '!=': (a, b) => a != b,
};

// Support minimal conditional expressions e.g.
//   if="layout == 'on-demand'"
//   if="layout != 'live'"
//   if="title"
function evaluateCondition(expr, state) {
  const tokens = tokenize(expr, {
    number: /-?\d+\.?\d*/,
    string: /(["'])((?:\\.|[^\\])*?)\1/,
    operator: /[!=]=/,
    ws: /\s+/,
    param: /[$a-z_][$\w]*/i,
  });
  if (tokens.length === 0 || tokens.some(({ type }) => !type)) {
    console.warn(`Warning: invalid expression \`${expr}\``);
    return false;
  }
  if (tokens.length === 1 && tokens[0].type === 'param') {
    return state[tokens[0].token];
  }
  const args = tokens.filter(({ type }) => type !== 'ws');
  if (args.length === 3) {
    let condition = conditions[args[1]?.token];
    if (!condition || !isValidParam(args[0]) || !isValidParam(args[2])) {
      console.warn(`Warning: invalid expression \`${expr}\``);
      return false;
    }
    return condition(
      getParamValue(args[0].token, state),
      getParamValue(args[2].token, state)
    );
  }
}

function isValidParam({ type }) {
  return type === 'number' || type === 'string' || type === 'param';
}

// Eval params of something like `{{PlayButton param='center'}}
function getParamValue(raw, state) {
  const firstChar = raw[0];
  const lastChar = raw.slice(-1);
  if (firstChar === lastChar && [`'`, `"`].includes(firstChar)) {
    // string
    return raw.slice(1, -1);
  }
  if (isNumeric(raw)) return raw; // number value
  else return state[raw]; // variable name
}

function isNumeric(str) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

/*
 * Tiny tokenizer
 * https://gist.github.com/borgar/451393
 *
 * - Accepts a subject string and an object of regular expressions for parsing
 * - Returns an array of token objects
 *
 * tokenize('this is text.', { word:/\w+/, whitespace:/\s+/, punctuation:/[^\w\s]/ });
 * result => [{ token="this", type="word" },{ token=" ", type="whitespace" }, Object { token="is", type="word" }, ... ]
 *
 */
function tokenize(str, parsers) {
  let len,
    match,
    token,
    tokens = [];
  while (str) {
    token = null;
    len = str.length;
    for (let key in parsers) {
      match = parsers[key].exec(str);
      // try to choose the best match if there are several
      // where "best" is the closest to the current starting point
      if (match && match.index < len) {
        token = {
          token: match[0],
          type: key,
          matches: match.slice(1),
        };
        len = match.index;
      }
    }
    if (len) {
      // there is text between last token and currently
      // matched token - push that out as type: undefined
      tokens.push({
        token: str.substr(0, len),
        type: undefined,
      });
    }
    if (token) {
      // push current token onto sequence
      tokens.push(token);
    }
    str = str.substr(len + (token ? token.token.length : 0));
  }
  return tokens;
}

defineCustomElement('media-theme', MediaTheme);

export default MediaTheme;
