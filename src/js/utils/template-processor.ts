import {
  AttrPart,
  InnerTemplatePart,
  Processor,
  TemplateInstance,
  type Part,
  type State,
} from './template-parts.js';
import { isNumericString } from './utils.js';

// Filters concept like Nunjucks or Liquid.
const pipeModifiers = {
  string: (value) => String(value),
};

class PartialTemplate {
  template: any;
  state: Record<string, any>;

  constructor(template) {
    this.template = template;
    this.state = undefined;
  }
}

const templates = new WeakMap();
const templateInstances = new WeakMap();

const Directives = {
  partial: (part: any, state: any) => {
    state[part.expression] = new PartialTemplate(part.template);
  },
  if: (part, state) => {
    if (evaluateExpression(part.expression, state)) {
      // If the template did not change for this part we can skip creating
      // a new template instance / parsing and update the inner parts directly.
      if (templates.get(part) !== part.template) {
        templates.set(part, part.template);

        const tpl = new TemplateInstance(part.template, state, processor);
        part.replace(tpl);
        templateInstances.set(part, tpl);
      } else {
        templateInstances.get(part)?.update(state);
      }
    } else {
      part.replace('');
      // Clean up template caches if this part's contents is cleared.
      templates.delete(part);
      templateInstances.delete(part);
    }
  },
};

const DirectiveNames = Object.keys(Directives);

export const processor: Processor = {
  processCallback(
    instance: TemplateInstance,
    parts: [string, Part][],
    state: State
  ) {
    if (!state) return;

    for (const [expression, part] of parts) {
      if (part instanceof InnerTemplatePart) {
        if (!part.directive) {
          // Transform short-hand if/partial attributes to directive & expression.
          const directive = DirectiveNames.find((n) =>
            part.template.hasAttribute(n)
          );
          if (directive) {
            part.directive = directive;
            part.expression = part.template.getAttribute(directive);
          }
        }

        Directives[part.directive]?.(part, state);
        continue;
      }

      let value = evaluateExpression(expression, state);

      if (value instanceof PartialTemplate) {
        if (templates.get(part) !== value.template) {
          templates.set(part, value.template);

          value = new TemplateInstance(value.template, value.state, processor);
          part.value = value;
          templateInstances.set(part, value);
        } else {
          templateInstances.get(part)?.update(value.state);
        }

        continue;
      }

      if (value) {
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

          // Clean up template caches if this part's contents is not a partial.
          templates.delete(part);
          templateInstances.delete(part);
        }
      } else {
        if (part instanceof AttrPart) {
          part.value = undefined;
        } else {
          part.value = undefined;

          // Clean up template caches if this part's contents is cleared.
          templates.delete(part);
          templateInstances.delete(part);
        }
      }
    }
  },
};

const operators = {
  '!': (a) => !a,
  '!!': (a) => !!a,
  '==': (a, b) => a == b,
  '!=': (a, b) => a != b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '??': (a, b) => a ?? b,
  '|': (a, b) => pipeModifiers[b]?.(a),
};

export function tokenizeExpression(expr: string): Token[] {
  return tokenize(expr, {
    boolean: /true|false/,
    number: /-?\d+\.?\d*/,
    string: /(["'])((?:\\.|[^\\])*?)\1/,
    operator: /[!=><][=!]?|\?\?|\|/,
    ws: /\s+/,
    param: /[$a-z_][$\w]*/i,
  }).filter(({ type }) => type !== 'ws');
}

// Support minimal expressions e.g.
//   >PlayButton section="center"
//   section ?? 'bottom'
//   value | string
//   streamtype == 'on-demand'
//   streamtype != 'live'
//   breakpointmd
//   !targetlivewindow
export function evaluateExpression(
  expr: string,
  state: Record<string, any> = {}
): any {
  const tokens = tokenizeExpression(expr);

  if (tokens.length === 0 || tokens.some(({ type }) => !type)) {
    return invalidExpression(expr);
  }

  // e.g. {{>PlayButton section="center"}}
  if (tokens[0]?.token === '>') {
    const partial = state[tokens[1]?.token];
    if (!partial) {
      return invalidExpression(expr);
    }

    const partialState = { ...state };
    partial.state = partialState;

    // Adds support for arguments e.g. {{>PlayButton section="center"}}
    const args = tokens.slice(2);
    for (let i = 0; i < args.length; i += 3) {
      const name = args[i]?.token;
      const operator = args[i + 1]?.token;
      const value = args[i + 2]?.token;

      if (name && operator === '=') {
        partialState[name] = getParamValue(value, state);
      }
    }
    return partial;
  }

  // e.g. {{'hello world'}} or {{breakpointmd}}
  if (tokens.length === 1) {
    if (!isValidParam(tokens[0])) {
      return invalidExpression(expr);
    }
    return getParamValue(tokens[0].token, state);
  }

  // e.g. {{!targetlivewindow}} or {{!!lengthInBoolean}}
  if (tokens.length === 2) {
    const operator = tokens[0]?.token;
    const run = operators[operator];

    if (!run || !isValidParam(tokens[1])) {
      return invalidExpression(expr);
    }

    const a = getParamValue(tokens[1].token, state);
    return run(a);
  }

  // e.g. {{streamtype == 'on-demand'}}, {{val | string}}, {{section ?? 'bottom'}}
  if (tokens.length === 3) {
    const operator = tokens[1]?.token;
    const run = operators[operator];

    if (!run || !isValidParam(tokens[0]) || !isValidParam(tokens[2])) {
      return invalidExpression(expr);
    }

    const a = getParamValue(tokens[0].token, state);

    if (operator === '|') {
      return run(a, tokens[2].token);
    }

    const b = getParamValue(tokens[2].token, state);
    return run(a, b);
  }
}

function invalidExpression(expr: string): boolean {
  console.warn(`Warning: invalid expression \`${expr}\``);
  return false;
}

function isValidParam({ type }: Token): boolean {
  return ['number', 'boolean', 'string', 'param'].includes(type);
}

// Eval params of something like `{{PlayButton param='center'}}
export function getParamValue(raw: string, state?: Record<string, any>) {
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

type Token = {
  token: string;
  type: string;
  matches?: string[];
};

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
function tokenize(str: string, parsers): Token[] {
  let len, match, token;
  const tokens: Token[] = [];

  while (str) {
    token = null;
    len = str.length;

    for (const key in parsers) {
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
