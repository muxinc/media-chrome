import { globalThis } from '../utils/server-safe-globals.js';

/* Adapted from https://github.com/dy/template-parts - ISC - Dmitry Iv. */

// Template Instance API
// https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md

const ELEMENT = 1;
const STRING = 0;
const PART = 1;

export type State = Record<string, any>;
export type Parts = [string, Part][];

export type Processor = {
  createCallback?: (
    instance: TemplateInstance,
    parts: Parts,
    state: State
  ) => void;
  processCallback: (
    instance: TemplateInstance,
    parts: Parts,
    state: State
  ) => void;
};

export const defaultProcessor: Processor = {
  processCallback(
    instance: TemplateInstance,
    parts: Parts,
    state: State
  ): void {
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
        } else if (typeof value === 'function' && part instanceof AttrPart) {
          part.element[part.attributeName] = value;
        } else {
          part.value = value;
        }
      }
    }
  },
};

/**
 *
 */
export class TemplateInstance extends globalThis.DocumentFragment {
  #parts;
  #processor: Processor;

  constructor(
    template: HTMLTemplateElement,
    state?: State | null,
    processor: Processor = defaultProcessor
  ) {
    super();

    this.append(template.content.cloneNode(true));
    this.#parts = parse(this as any);

    this.#processor = processor;
    processor.createCallback?.(this, this.#parts, state);
    processor.processCallback(this, this.#parts, state);
  }

  update(state?: State) {
    this.#processor.processCallback(this, this.#parts, state);
  }
}

// collect element parts
export const parse = (element: Element, parts: Parts = []) => {
  let type, value;

  for (const attr of element.attributes || []) {
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

  for (const node of element.childNodes) {
    if (node.nodeType === ELEMENT && !(node instanceof HTMLTemplateElement)) {
      parse(node as Element, parts);
    } else {
      const data = (node as any).data;
      if (node.nodeType === ELEMENT || data.includes('{{')) {
        const items = [];
        if (data) {
          for ([type, value] of tokenize(data))
            if (!type) items.push(new Text(value));
            else {
              const part = new ChildNodePart(element);
              items.push(part);
              parts.push([value, part]);
            }
        } else if (node instanceof HTMLTemplateElement) {
          const part = new InnerTemplatePart(element, node);
          items.push(part);
          parts.push([part.expression, part]);
        }

        node.replaceWith(
          // @ts-ignore
          ...items.flatMap((part) => part.replacementNodes || [part])
        );
      }
    }
  }

  return parts;
};

// parse string with template fields
const mem: Record<string, [number, string][]> = {};

export const tokenize = (text: string): [number, string][] => {
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
  get value(): string {
    return '';
  }

  set value(val: string) {}

  toString(): string {
    return this.value;
  }
}

const attrPartToList: WeakMap<AttrPart, AttrPartList> = new WeakMap();

type AttrPiece = AttrPart | string;

export class AttrPartList {
  #items: AttrPiece[] = [];

  [Symbol.iterator](): IterableIterator<AttrPiece> {
    return this.#items.values();
  }

  get length(): number {
    return this.#items.length;
  }

  item(index: number): AttrPiece {
    return this.#items[index];
  }

  append(...items: AttrPiece[]): void {
    for (const item of items) {
      if (item instanceof AttrPart) {
        attrPartToList.set(item, this);
      }
      this.#items.push(item);
    }
  }

  toString(): string {
    return this.#items.join('');
  }
}

export class AttrPart extends Part {
  #value: string = '';
  #element: Element;
  #attributeName: string;
  #namespaceURI: string;

  constructor(
    element: Element,
    attributeName: string,
    namespaceURI: string | null
  ) {
    super();
    this.#element = element;
    this.#attributeName = attributeName;
    this.#namespaceURI = namespaceURI;
  }

  get #list(): AttrPartList {
    return attrPartToList.get(this);
  }

  get attributeName(): string {
    return this.#attributeName;
  }

  get attributeNamespace(): string {
    return this.#namespaceURI;
  }

  get element(): Element {
    return this.#element;
  }

  get value(): string {
    return this.#value;
  }

  set value(newValue: string) {
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
        this.#list.toString()
      );
    }
  }

  get booleanValue(): boolean {
    return this.#element.hasAttributeNS(
      this.#namespaceURI,
      this.#attributeName
    );
  }

  set booleanValue(value: boolean) {
    if (!this.#list || this.#list.length === 1) this.value = value ? '' : null;
    else throw new DOMException('Value is not fully templatized');
  }
}

export class ChildNodePart extends Part {
  #parentNode;
  #nodes;

  constructor(parentNode: Element, nodes?: ChildNode[]) {
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

    if (!normalisedNodes.length) normalisedNodes.push(new Text());

    this.#nodes = swapdom(
      this.#nodes[0].parentNode,
      this.#nodes,
      normalisedNodes,
      this.nextSibling
    );
  }
}

export class InnerTemplatePart extends ChildNodePart {
  directive: string;
  expression: string;
  template: HTMLTemplateElement;

  constructor(parentNode: Element, template: HTMLTemplateElement) {
    const directive =
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

function swapdom(parent, a, b, end = null) {
  let i = 0,
    cur,
    next,
    bi,
    n = b.length,
    m = a.length;

  // skip head/tail
  while (i < n && i < m && a[i] == b[i]) i++;
  while (i < n && i < m && b[n - 1] == a[m - 1]) end = b[(--m, --n)];

  // append/prepend/trim shortcuts
  if (i == m) while (i < n) parent.insertBefore(b[i++], end);
  if (i == n) while (i < m) parent.removeChild(a[i++]);
  else {
    cur = a[i];

    while (i < n) {
      (bi = b[i++]), (next = cur ? cur.nextSibling : end);

      // skip
      if (cur == bi) cur = next;
      // swap / replace
      else if (i < n && b[i] == next)
        parent.replaceChild(bi, cur), (cur = next);
      // insert
      else parent.insertBefore(bi, cur);
    }

    // remove tail
    while (cur != end)
      (next = cur.nextSibling), parent.removeChild(cur), (cur = next);
  }

  return b;
}
