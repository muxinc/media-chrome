import {
  InnerTemplatePart,
  TemplateInstance,
  AttrPart,
} from './template-parts.js';
import { isNumericString } from './utils.js';

// e.g.  myVar | string
//       > myVar
//       nilVar ?? 'fallback'
export const reExpr = /([>&])?\s*(\w+)\s*(.*)/;

// e.g.  | string
//       ?? 'fallback'
export const reExprOperation = /^(\?\?|\|)?\s*(['"\w]*)/;

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

export const processor = {
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
                new TemplateInstance(part.template, state, processor)
              );
            } else {
              part.replace('');
            }
            break;
        }
        continue;
      }

      const [, prefix, name, rest] = expression.match(reExpr) ?? [];
      let value = state[name];

      // Adds support for:
      //   - filters (pipe char followed by function) e.g. {{ myVar | string }}
      //   - nullish coalesce operator e.g. {{ nilVar ?? 'fallback' }}
      const [, operator, modifier] = rest.match(reExprOperation) ?? [];
      const op = operators[operator];

      if (typeof op === 'function') {
        // Handle `??` operator.
        value = op(value, getParamValue(modifier, state));
      } else if (op && value != null) {
        // Handle `|` operator.
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

          value = new TemplateInstance(value.template, localState, processor);
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

const conditions = {
  '==': (a, b) => a == b,
  '!=': (a, b) => a != b,
};

// Support minimal conditional expressions e.g.
//   layout == 'on-demand'
//   layout != 'live'
//   title
export function evaluateCondition(expr, state) {
  const tokens = tokenize(expr, {
    boolean: /true|false/,
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

  if (tokens.length === 1) {
    if (!isValidParam(tokens[0])) {
      console.warn(`Warning: invalid expression \`${expr}\``);
      return false;
    }
    return getParamValue(tokens[0].token, state);
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
  return ['number', 'boolean', 'string', 'param'].includes(type);
}

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
