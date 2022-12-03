import {
  InnerTemplatePart,
  TemplateInstance,
  AttrPart,
} from './template-parts.js';
import { isNumericString } from './utils.js';
import { subscript } from './subscript.js';

// e.g.  myVar | string
//       > myVar
//       nilVar ?? 'fallback'
export const reExpr = /([>&])?\s*((\w+)\s*(.*))/;

class PartialTemplate {
  constructor(template) {
    this.template = template;
  }
}

const Directives = {
  partial: (part, state) => {
    state[part.expression] = new PartialTemplate(part.template);
  },
  if: (part, state) => {
    if (subscript(part.expression)(state)) {
      part.value = new TemplateInstance(part.template, state, processor);
    } else {
      part.value = '';
    }
  },
};

const DirectiveNames = Object.keys(Directives);

export const processor = {
  processCallback(instance, parts, state) {
    if (!state) return;

    for (const [expression, part] of parts) {
      if (part instanceof InnerTemplatePart) {
        if (!part.directive) {
          // Transform short-hand if/partial attributes to directive & expression.
          const directive = DirectiveNames.find((n) => part.template.hasAttribute(n));
          if (directive) {
            part.directive = directive;
            part.expression = part.template.getAttribute(directive);
          }
        }
        Directives[part.directive]?.(part, state);
        continue;
      }

      const [, prefix, expr, name] = expression.match(reExpr) ?? [];
      let value = state[name];

      // Adds support for:
      //   - filters (pipe char followed by function) e.g. {{ myVar | string }}
      //   - nullish coalesce operator e.g. {{ nilVar ?? 'fallback' }}
      if (!prefix) {
        value = subscript(expr)(state);
      }

      if (value) {
        if (value instanceof PartialTemplate) {
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
            processor
          );
        }

        if (part instanceof AttrPart) {
          if (part.attributeName.startsWith('aria-')) {
            value = String(value);
          }
        }

        // No need to HTML escape values, the template parts stringify the values.
        if (part instanceof AttrPart) {
          if (typeof value === 'boolean') {
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
        if (part instanceof AttrPart) {
          part.booleanValue = false;
        }
      }
    }
  },
};

// Eval params of something like `{{PlayButton param='center'}}
export function getParamValue(raw, state) {
  const firstChar = raw[0];
  const lastChar = raw.slice(-1);

  if (raw === 'true' || raw === 'false') {
    // boolean
    return raw === 'true';
  }

  if (firstChar === lastChar && [`'`, `"`].includes(firstChar)) {
    // string
    return raw.slice(1, -1);
  }

  if (isNumericString(raw)) {
    // number
    return parseFloat(raw);
  }

  // state property
  return state[raw];
}
