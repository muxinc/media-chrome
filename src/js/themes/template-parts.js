/* Adapted from https://github.com/dy/template-parts - ISC - Dmitry Iv. */

// Template Instance API
// https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md

const ELEMENT = 1,
  STRING = 0,
  PART = 1;

export const defaultProcessor = {
  processCallback(instance, parts, state) {
    if (!state) return;
    for (const [expression, part] of parts) {
      if (expression in state) {
        const value = state[expression];
        // boolean attr
        if (
          typeof value === 'boolean' &&
          part instanceof AttrPart &&
          typeof part.element[part.attributeName] === 'boolean'
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
      }
    }
  },
};

export class TemplateInstance extends DocumentFragment {
  #parts;
  #processor;
  constructor(template, state, processor = defaultProcessor) {
    super();
    this.append(template.content.cloneNode(true));
    this.#parts = parse(this);
    this.#processor = processor;
    processor.createCallback?.(this, this.#parts, state);
    processor.processCallback(this, this.#parts, state);
  }
  update(state) {
    this.#processor.processCallback(this, this.#parts, state);
  }
}

// collect element parts
export const parse = (element, parts = []) => {
  let type, value;

  for (let attr of element.attributes || []) {
    if (attr.value.includes('{{')) {
      const list = new AttrPartList();
      for ([type, value] of tokenize(attr.value)) {
        if (!type) list.append(value);
        else {
          const part = new AttrPart(element, attr.name, attr.namespaceURI);
          list.append(part);
          parts.push([value, part]);
        }
      }
      attr.value = list.toString();
    }
  }

  for (let node of element.childNodes) {
    if (node.nodeType === ELEMENT && !(node instanceof HTMLTemplateElement)) {
      parse(node, parts);
    } else {
      if (node.nodeType === ELEMENT || node.data.includes('{{')) {
        const items = [];
        if (node.data) {
          for ([type, value] of tokenize(node.data))
            if (!type) items.push(new Text(value));
            else {
              const part = new ChildNodePart(element);
              items.push(part);
              parts.push([value, part]);
            }
        } else {
          const part = new InnerTemplatePart(element, node);
          items.push(part);
          parts.push([part.expression, part]);
        }

        node.replaceWith(
          ...items.flatMap((part) => part.replacementNodes || [part])
        );
      }
    }
  }

  return parts;
};

// parse string with template fields
const mem = {};
export const tokenize = (text) => {
  let value = '',
    open = 0,
    tokens = mem[text],
    i = 0,
    c;

  if (tokens) return tokens;
  else tokens = [];

  for (; (c = text[i]); i++) {
    if (
      c === '{' &&
      text[i + 1] === '{' &&
      text[i - 1] !== '\\' &&
      text[i + 2] &&
      ++open == 1
    ) {
      if (value) tokens.push([STRING, value]);
      value = '';
      i++;
    } else if (
      c === '}' &&
      text[i + 1] === '}' &&
      text[i - 1] !== '\\' &&
      !--open
    ) {
      tokens.push([PART, value.trim()]);
      value = '';
      i++;
    } else value += c || ''; // text[i] is undefined if i+=2 caught
  }

  if (value) tokens.push([STRING, (open > 0 ? '{{' : '') + value]);

  return (mem[text] = tokens);
};

// DOM Part API
// https://github.com/WICG/webcomponents/blob/gh-pages/proposals/DOM-Parts.md

/*
  Divergence from the proposal:
    - Renamed AttributePart to AttrPart to match the existing class `Attr`.
    - Renamed AttributePartGroup to AttrPartList as a group feels not ordered
      while this collection should maintain its order. Also closer to DOMTokenList.
    - A ChildNodePartGroup would make things unnecessarily difficult in this
      implementation. Instead an empty text node keeps track of the ChildNodePart's
      location in the child nodelist if needed.
 */

const FRAGMENT = 11;

export class Part {
  toString() {
    return this.value;
  }
}

const attrPartToList = new WeakMap();

export class AttrPartList {
  #items = [];
  [Symbol.iterator]() {
    return this.#items.values();
  }
  get length() {
    return this.#items.length;
  }
  item(index) {
    return this.#items[index];
  }
  append(...items) {
    for (const item of items) {
      if (item instanceof AttrPart) {
        attrPartToList.set(item, this);
      }
      this.#items.push(item);
    }
  }
  toString() {
    return this.#items.join('');
  }
}

export class AttrPart extends Part {
  #value = '';
  #element;
  #attributeName;
  #namespaceURI;
  constructor(element, attributeName, namespaceURI) {
    super();
    this.#element = element;
    this.#attributeName = attributeName;
    this.#namespaceURI = namespaceURI;
  }
  get #list() {
    return attrPartToList.get(this);
  }
  get attributeName() {
    return this.#attributeName;
  }
  get attributeNamespace() {
    return this.#namespaceURI;
  }
  get element() {
    return this.#element;
  }
  get value() {
    return this.#value;
  }
  set value(newValue) {
    if (this.#value === newValue) return; // save unnecessary call
    this.#value = newValue;
    if (!this.#list || this.#list.length === 1) {
      // fully templatized
      if (newValue == null) {
        this.#element.removeAttributeNS(
          this.#namespaceURI,
          this.#attributeName
        );
      } else {
        this.#element.setAttributeNS(
          this.#namespaceURI,
          this.#attributeName,
          newValue
        );
      }
    } else {
      this.#element.setAttributeNS(
        this.#namespaceURI,
        this.#attributeName,
        this.#list
      );
    }
  }
  get booleanValue() {
    return this.#element.hasAttributeNS(
      this.#namespaceURI,
      this.#attributeName
    );
  }
  set booleanValue(value) {
    if (!this.#list || this.#list.length === 1) this.value = value ? '' : null;
    else throw new DOMException('Value is not fully templatized');
  }
}

export class ChildNodePart extends Part {
  #parentNode;
  #nodes;
  constructor(parentNode, nodes) {
    super();
    this.#parentNode = parentNode;
    this.#nodes = nodes ? [...nodes] : [new Text()];
  }
  get replacementNodes() {
    return this.#nodes;
  }
  get parentNode() {
    return this.#parentNode;
  }
  get nextSibling() {
    return this.#nodes[this.#nodes.length - 1].nextSibling;
  }
  get previousSibling() {
    return this.#nodes[0].previousSibling;
  }
  // FIXME: not sure why do we need string serialization here? Just because parent class has type DOMString?
  get value() {
    return this.#nodes.map((node) => node.textContent).join('');
  }
  set value(newValue) {
    this.replace(newValue);
  }
  replace(...nodes) {
    // replace current nodes with new nodes.
    const normalisedNodes = nodes
      .flat()
      .flatMap((node) =>
        node == null
          ? [new Text()]
          : node.forEach
          ? [...node]
          : node.nodeType === FRAGMENT
          ? [...node.childNodes]
          : node.nodeType
          ? [node]
          : [new Text(node)]
      );
    if (!normalisedNodes.length) normalisedNodes.push(new Text(''));
    this.#nodes[0].before(...normalisedNodes);
    for (const oldNode of this.#nodes) {
      if (!normalisedNodes.includes(oldNode)) oldNode.remove();
    }
    this.#nodes = normalisedNodes;
  }
  replaceHTML(html) {
    const fragment = this.parentNode.cloneNode();
    fragment.innerHTML = html;
    this.replace(fragment.childNodes);
  }
}

export class InnerTemplatePart extends ChildNodePart {
  directive;
  constructor(parentNode, template) {
    let directive =
      template.getAttribute('directive') || template.getAttribute('type');
    let expression =
      template.getAttribute('expression') ||
      template.getAttribute(directive) ||
      '';
    if (expression.startsWith('{{'))
      expression = expression.trim().slice(2, -2).trim();

    super(parentNode);

    this.expression = expression;
    this.template = template;
    this.directive = directive;
  }
}
