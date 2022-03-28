// https://github.com/matthewp/ocean
/**
  BSD 2-Clause License

  Copyright (c) 2021, Matthew Phillips
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright notice,
     this list of conditions and the following disclaimer in the documentation
     and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
const prefix = 'Ã¶cean';
const commentPlaceholder = `<!--${prefix}-->`;
const urlContextPrefix = `${prefix}-url-context`;
const urlContextCommentPlaceholder = (p) => `<!--${urlContextPrefix}=${p}-->`;
class HydrateLoad1 {
  constructor() {
    this.condition = 'load';
  }
  inject(head, _tagName, src) {
    let script = head.ownerDocument.createElement('script');
    script.setAttribute('src', urlContextCommentPlaceholder(src));
    script.setAttribute('type', 'module');
    head.append(script);
  }
}
class HydrateIdle1 {
  constructor(tagName = 'ocean-hydrate-idle') {
    this.tagName = tagName;
    this.condition = 'idle';
    this.renderMultiple = false;
  }
  script() {
    return `customElements.define("${this.tagName}",class extends HTMLElement{connectedCallback(){let e=this.getAttribute("src");this.parentNode.removeChild(this),requestIdleCallback((()=>import(e)))}});`;
  }
}
class HydrateMedia1 {
  constructor(tagName1 = 'ocean-hydrate-media', mediaAttr = 'ocean-query') {
    this.tagName = tagName1;
    this.mediaAttr = mediaAttr;
    this.condition = 'media';
    this.renderMultiple = true;
  }
  keys(node) {
    return [node.getAttribute(this.mediaAttr)];
  }
  mutate(hydrationEl, node) {
    let query = node.getAttribute(this.mediaAttr);
    hydrationEl.setAttribute('query', query);
  }
  script() {
    return `customElements.define("${this.tagName}",class extends HTMLElement{connectedCallback(){let e=this.getAttribute("src");this.parentNode.removeChild(this);let t=matchMedia(this.getAttribute("query")),a=()=>import(e);t.matches?a():t.addEventListener("change",a,{once:!0})}});`;
  }
}
class HydrateVisible1 {
  constructor(tagName2 = 'ocean-hydrate-visible') {
    this.tagName = tagName2;
    this.condition = 'visible';
    this.renderMultiple = true;
  }
  script() {
    return `customElements.define("${this.tagName}",class extends HTMLElement{connectedCallback(){let e=this.getAttribute("src"),t=this.previousElementSibling;this.parentNode.removeChild(this);let s=new IntersectionObserver((([t])=>{t.isIntersecting&&(s.disconnect(),import(e))}));s.observe(t)}});`;
  }
}
function validate(hydrators) {
  for (let hydrator of hydrators) {
    if (hydrator.tagName) {
      if (!('condition' in hydrator)) {
        throw new Error("This hydrator needs a 'condition' property.");
      }
      if (!('renderMultiple' in hydrator)) {
        throw new Error(
          "This hydrator is missing the required 'renderMultiple' property."
        );
      }
    } else if (hydrator.inject) {
    } else {
      throw new Error('Unrecognized hydrator format');
    }
  }
  return hydrators;
}
const defaultHydrators = Object.freeze([
  HydrateIdle1,
  HydrateLoad1,
  HydrateMedia1,
  HydrateVisible1,
]);
function getHydrators(hydrationMethod, providedHydrators = []) {
  switch (hydrationMethod) {
    case 'none': {
      return [];
    }
    case 'partial': {
      let hydrators = providedHydrators.length
        ? providedHydrators
        : defaultHydrators.map((Hydrator) => new Hydrator());
      return validate(hydrators);
    }
    case 'full': {
      return [HydrateLoad1];
    }
    default: {
      throw new Error(`Invalid hydration method [${method}]`);
    }
  }
}
function makeKey(...strings) {
  return strings.map((s) => '[' + s + ']').join('-');
}
class TemplateHydration {
  constructor(hydration) {
    this.hydration = hydration;
    this.scripts = new Set();
    this.elementCache = new Set();
  }
  async addScript(hydrator, head, node) {
    let doc = node.ownerDocument;
    let script = doc.createElement('script');
    let code = hydrator.script();
    if (code.includes('\n')) {
      throw new Error('Hydrators must produce minified scripts.');
    }
    script.textContent = code;
    head.append(script);
  }
  addElement(hydrator, node, src) {
    let doc = node.ownerDocument;
    let hydrationEl = doc.createElement(hydrator.tagName);
    hydrationEl.setAttribute('src', urlContextCommentPlaceholder(src));
    if (hydrator.mutate) {
      hydrator.mutate(hydrationEl, node);
    }
    node.after(hydrationEl);
  }
  computeElementCacheKey(hydrator, node) {
    let keyParts = [hydrator.tagName, node.localName];
    if ('keys' in hydrator) {
      keyParts.push(...hydrator.keys(node));
    }
    let cacheKey = makeKey(...keyParts);
    return cacheKey;
  }
  run(hydrator, head, node, src) {
    if (hydrator.tagName) {
      let condition = hydrator.condition;
      let cacheKey = this.computeElementCacheKey(hydrator, node);
      if (hydrator.renderMultiple || !this.elementCache.has(cacheKey)) {
        this.addElement(hydrator, node, src);
        this.elementCache.add(cacheKey);
      }
      if (!this.scripts.has(condition)) {
        this.addScript(hydrator, head, node);
        this.scripts.add(condition);
      }
    } else if (hydrator.inject) {
      hydrator.inject(head, node.localName, src);
    }
  }
  handle(head, node, src) {
    let { hydrationAttr, hydratorMap, hydrators, method } = this.hydration;
    switch (method) {
      case 'full': {
        this.run(hydrators[0], head, node, src);
        break;
      }
      case 'partial': {
        let condition = node.getAttribute(hydrationAttr);
        let hydrator = hydratorMap.get(condition);
        if (!hydrator) {
          throw new Error(`No hydrator provided for [${condition}]`);
        }
        node.removeAttribute(hydrationAttr);
        this.run(hydrator, head, node, src);
        break;
      }
    }
  }
}
class Hydration {
  #method;
  constructor(hydrationMethod, hydrationAttr, providedHydrators) {
    this.hydrationAttr = hydrationAttr || 'ocean-hydrate';
    this.method = hydrationMethod || 'partial';
    this.hydrators = getHydrators(this.method, providedHydrators);
    this.hydratorMap = new Map(
      this.hydrators.filter((h) => h.condition).map((h) => [h.condition, h])
    );
  }
  set method(val) {
    this.#method = val;
  }
  get method() {
    return this.#method;
  }
  createInstance() {
    return new TemplateHydration(this);
  }
}
function noop(...args) {}
function createWeakMap() {
  if (typeof WeakMap !== 'undefined') {
    return new WeakMap();
  } else {
    return fakeSetOrMap();
  }
}
function fakeSetOrMap() {
  return {
    add: noop,
    delete: noop,
    get: noop,
    set: noop,
    has(k) {
      return false;
    },
  };
}
const hop = Object.prototype.hasOwnProperty;
const has = function (obj, prop) {
  return hop.call(obj, prop);
};
function extend(target, source) {
  for (const prop in source) {
    if (has(source, prop)) {
      target[prop] = source[prop];
    }
  }
  return target;
}
const reLeadingNewline = /^[ \t]*(?:\r\n|\r|\n)/;
const reTrailingNewline = /(?:\r\n|\r|\n)[ \t]*$/;
const reStartsWithNewlineOrIsEmpty = /^(?:[\r\n]|$)/;
const reDetectIndentation = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/;
const reOnlyWhitespaceWithAtLeastOneNewline = /^[ \t]*[\r\n][ \t\r\n]*$/;
function _outdentArray(
  strings,
  firstInterpolatedValueSetsIndentationLevel,
  options
) {
  let indentationLevel = 0;
  const match = strings[0].match(reDetectIndentation);
  if (match) {
    indentationLevel = match[1].length;
  }
  const reSource = `(\\r\\n|\\r|\\n).{0,${indentationLevel}}`;
  const reMatchIndent = new RegExp(reSource, 'g');
  if (firstInterpolatedValueSetsIndentationLevel) {
    strings = strings.slice(1);
  }
  const { newline, trimLeadingNewline, trimTrailingNewline } = options;
  const normalizeNewlines = typeof newline === 'string';
  const l = strings.length;
  const outdentedStrings = strings.map((v, i) => {
    v = v.replace(reMatchIndent, '$1');
    if (i === 0 && trimLeadingNewline) {
      v = v.replace(reLeadingNewline, '');
    }
    if (i === l - 1 && trimTrailingNewline) {
      v = v.replace(reTrailingNewline, '');
    }
    if (normalizeNewlines) {
      v = v.replace(/\r\n|\n|\r/g, (_) => newline);
    }
    return v;
  });
  return outdentedStrings;
}
function concatStringsAndValues(strings, values) {
  let ret = '';
  for (let i = 0, l = strings.length; i < l; i++) {
    ret += strings[i];
    if (i < l - 1) {
      ret += values[i];
    }
  }
  return ret;
}
function isTemplateStringsArray(v) {
  return has(v, 'raw') && has(v, 'length');
}
function createInstance(options) {
  const arrayAutoIndentCache = createWeakMap();
  const arrayFirstInterpSetsIndentCache = createWeakMap();
  function outdent(stringsOrOptions, ...values) {
    if (isTemplateStringsArray(stringsOrOptions)) {
      const strings = stringsOrOptions;
      const firstInterpolatedValueSetsIndentationLevel =
        (values[0] === outdent || values[0] === defaultOutdent) &&
        reOnlyWhitespaceWithAtLeastOneNewline.test(strings[0]) &&
        reStartsWithNewlineOrIsEmpty.test(strings[1]);
      const cache = firstInterpolatedValueSetsIndentationLevel
        ? arrayFirstInterpSetsIndentCache
        : arrayAutoIndentCache;
      let renderedArray = cache.get(strings);
      if (!renderedArray) {
        renderedArray = _outdentArray(
          strings,
          firstInterpolatedValueSetsIndentationLevel,
          options
        );
        cache.set(strings, renderedArray);
      }
      if (values.length === 0) {
        return renderedArray[0];
      }
      const rendered = concatStringsAndValues(
        renderedArray,
        firstInterpolatedValueSetsIndentationLevel ? values.slice(1) : values
      );
      return rendered;
    } else {
      return createInstance(
        extend(extend({}, options), stringsOrOptions || {})
      );
    }
  }
  const fullOutdent = extend(outdent, {
    string(str) {
      return _outdentArray([str], false, options)[0];
    },
  });
  return fullOutdent;
}
const defaultOutdent = createInstance({
  trimLeadingNewline: true,
  trimTrailingNewline: true,
});
if (typeof module !== 'undefined') {
  try {
    module.exports = defaultOutdent;
    Object.defineProperty(defaultOutdent, '__esModule', {
      value: true,
    });
    defaultOutdent.default = defaultOutdent;
    defaultOutdent.outdent = defaultOutdent;
  } catch (e) {}
}
function isURLLike(obj) {
  return !!(typeof obj === 'object' && obj.protocol);
}
function relative(fromURL, toURL) {
  if (!isURLLike(fromURL) || !isURLLike(toURL))
    throw new Error(`from and to must both be URLs`);
  if (fromURL.toString() == toURL.toString()) return '';
  if (fromURL.protocol !== toURL.protocol) return toURL.toString();
  if (fromURL.host !== toURL.host) return toURL.toString();
  let from = fromURL.pathname;
  let to = toURL.pathname;
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== 47) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== 47) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47) {
          if (from.charCodeAt(fromStart + i) === 47) {
            return to.slice(toStart + i + 1);
          } else {
            return to.slice(toStart + lastCommonSep + 1);
          }
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (fromCode === 47) lastCommonSep = i;
  }
  let out = '';
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd - 1; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === 47) {
      if (out.length === 0) out += '..';
      else out += '/..';
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === 47) ++toStart;
    return to.slice(toStart);
  }
}
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
const nonClosingElements = new Set([...voidElements, 'html']);
const validHeadElements = new Set([
  '!doctype',
  'title',
  'meta',
  'link',
  'style',
  'script',
  'noscript',
  'base',
]);
const elementsBeforeBody = new Set([...validHeadElements, 'html', 'head']);
const { replace } = '';
const ca = /[<>&\xA0]/g;
const esca = {
  '\xA0': '&nbsp;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};
const pe = (m) => esca[m];
const escapeHTML = (es) => replace.call(es, ca, pe);
const escapeAttributeValue = (value) => value.replace(/"/g, '&quot;');
const oceanSerializeSymbol = Symbol.for('ocean.serialize');
function* serializeFragment(frag) {
  for (let node of frag.childNodes) {
    yield* serialize(node);
  }
}
function isInsideScript(node) {
  return node.parentNode && node.parentNode.localName === 'script';
}
function isInsideStyle(node) {
  return node.parentNode && node.parentNode.localName === 'style';
}
function* serializeElement(el) {
  if (oceanSerializeSymbol in el) {
    yield* el[oceanSerializeSymbol]();
    return;
  }
  yield `<${el.localName}`;
  for (let { name, value } of el.attributes) {
    if (value === '') {
      yield ` ${name}`;
    } else {
      yield ` ${name}="${escapeAttributeValue(value)}"`;
    }
  }
  yield `>`;
  if (voidElements.has(el.localName)) {
    return;
  }
  if (el.shadowRoot) {
    yield `<template shadowroot="open">`;
    yield* serializeFragment(el.shadowRoot);
    yield `</template>`;
  }
  for (let child of el.childNodes) {
    yield* serialize(child);
  }
  yield `</${el.localName}>`;
}
function* serialize(node) {
  switch (node.nodeType) {
    case 1: {
      yield* serializeElement(node);
      break;
    }
    case 3: {
      if (isInsideScript(node) || isInsideStyle(node)) yield node.data;
      else yield escapeHTML(node.data);
      break;
    }
    case 8: {
      yield `<!--${node.data}-->`;
      break;
    }
    case 10: {
      yield `<!doctype html>`;
      yield* serializeAll(node.childNodes);
      break;
    }
    case 11: {
      yield* serializeFragment(node);
      break;
    }
    default: {
      throw new Error('Unable to serialize nodeType ' + node.nodeType);
    }
  }
}
function* serializeAll(nodes) {
  for (let node of nodes) {
    yield* serialize(node);
  }
}
class TextBinding {
  set(node, val) {
    node.data = val;
  }
}
class AttributeBinding {
  constructor(name) {
    this.name = name;
  }
  set(node, val) {
    node.setAttribute(this.name, val);
  }
}
class PropertyBinding {
  constructor(name1) {
    this.name = name1;
  }
  set(node, val) {
    Reflect.set(node, this.name, val);
  }
}
const asyncRenderSymbol = Symbol.for('ocean.asyncRender');
function isPrimitive(val) {
  if (typeof val === 'object') {
    return val === null;
  }
  return typeof val !== 'function';
}
function isThenable(val) {
  return typeof val.then === 'function';
}
async function* iterable(value) {
  if (isPrimitive(value) || isThenable(value)) {
    yield value || '';
  } else if (Array.isArray(value)) {
    for (let inner of value) {
      yield* iterable(inner);
    }
  } else {
    yield* value;
  }
}
class Part {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}
class TextPart extends Part {
  constructor(text, start1, end1) {
    super(start1, end1);
    this.text = text;
  }
  addDoctype(doctype) {
    this.text = doctype.replace(this.text);
  }
  async *render(values) {
    yield this.text;
    for (let value of values) {
      yield* iterable(value);
    }
  }
}
class ComponentPart {
  constructor(node, state) {
    let start2 = state.i;
    this.node = node;
    this.document = node.ownerDocument;
    this.start = start2;
    this.bindings = new Map();
    this.hasBindings = false;
    this.process(node, state);
    this.end = state.i;
  }
  process(node, state) {
    let document = this.document;
    let bindings = this.bindings;
    let walker = document.createTreeWalker(node, 133, null, false);
    let currentNode = node;
    let index = 0;
    while (currentNode) {
      switch (currentNode.nodeType) {
        case 1: {
          let nodeBindings = [];
          for (let attr of currentNode.attributes) {
            if (attr.value === commentPlaceholder) {
              if (attr.name.startsWith('.')) {
                nodeBindings.push(new PropertyBinding(attr.name.substr(1)));
                currentNode.removeAttribute(attr.name);
              } else {
                nodeBindings.push(new AttributeBinding(attr.name));
              }
              state.i++;
              this.end++;
            }
          }
          if (nodeBindings.length) {
            bindings.set(index, nodeBindings);
          }
          break;
        }
        case 8: {
          if (currentNode.data === prefix) {
            currentNode.replaceWith(document.createTextNode(''));
            bindings.set(index, [new TextBinding()]);
            state.i++;
            this.end++;
          }
          break;
        }
      }
      index++;
      currentNode = walker.nextNode();
    }
    this.hasBindings = this.bindings.size > 0;
  }
  async hydrate(values) {
    let resolved = await Promise.all(values);
    let document = this.document;
    let el = this.node.cloneNode(true);
    if (this.hasBindings) {
      let bindings = this.bindings;
      let walker = document.createTreeWalker(el, -1);
      let currentNode = el;
      let index = 0;
      let valueIndex = 0;
      while (currentNode) {
        if (bindings.has(index)) {
          for (let binding of bindings.get(index)) {
            let value = resolved[valueIndex];
            binding.set(currentNode, value);
            valueIndex++;
          }
        }
        index++;
        currentNode = walker.nextNode();
      }
    }
    return el;
  }
  async *render(values) {
    let el = await this.hydrate(values);
    let document = this.document;
    document.body.appendChild(el);
    if (asyncRenderSymbol in el) {
      await el[asyncRenderSymbol]();
    }
    yield* serialize(el);
    document.body.removeChild(el);
  }
}
class ContextPart extends Part {
  constructor(prop) {
    super(0, 0);
    this.prop = prop;
  }
}
class URLContextPart extends ContextPart {
  constructor(pathOrURL) {
    super('url');
    this.pathOrURL = pathOrURL;
  }
  async *render(_values, context) {
    if (!context || !('url' in context)) {
      yield this.pathOrURL;
      return;
    }
    let url = context.url;
    let resolvedURL = new URL(this.pathOrURL, url);
    let relPath = relative(url, resolvedURL);
    yield relPath;
  }
}
const interpolationExp = new RegExp(
  commentPlaceholder + '|' + `<!--${urlContextPrefix}=(.+)-->`,
  'g'
);
function htmlValue(htmlStr) {
  return {
    type: 'html',
    value: htmlStr,
  };
}
function* holeValue(state) {
  yield {
    type: 'hole',
  };
  state.i++;
}
function* urlContextValue(path) {
  yield {
    type: 'url-context',
    value: path,
  };
}
function* multiInterpolation(str, state) {
  interpolationExp.lastIndex = 0;
  let match = interpolationExp.exec(str);
  let strIndex = 0;
  while (match) {
    let html = str.substr(strIndex, match.index - strIndex);
    yield htmlValue(html);
    let matchedPoint = match[0];
    if (matchedPoint === commentPlaceholder) {
      yield* holeValue(state);
    } else if (matchedPoint.includes(urlContextPrefix)) {
      yield* urlContextValue(match[1]);
    }
    strIndex = match.index + matchedPoint.length;
    match = interpolationExp.exec(str);
  }
  let html = str.substr(strIndex);
  yield htmlValue(html);
}
function* walkFragment(frag, state) {
  for (let node of frag.childNodes) {
    yield* walk(node, state);
  }
}
function* walkElement(node, state) {
  let customElements = node.ownerDocument.defaultView.customElements;
  if (customElements.get(node.localName)) {
    yield {
      type: 'component',
      value: node,
    };
    return;
  }
  yield htmlValue(`<${node.localName}`);
  for (let { name, value } of node.attributes) {
    if (value === '') {
      yield htmlValue(` ${name}`);
    } else {
      yield htmlValue(` ${name}="`);
      let escaped = escapeAttributeValue(value);
      yield* multiInterpolation(escaped, state);
      yield htmlValue('"');
    }
  }
  yield htmlValue(`>`);
  for (let child of node.childNodes) {
    yield* walk(child, state);
  }
  if (!nonClosingElements.has(node.localName)) {
    yield htmlValue(`</${node.localName}>`);
  }
}
function* walk(entryNode, state) {
  let node = entryNode;
  switch (node.nodeType) {
    case 1: {
      yield* walkElement(node, state);
      break;
    }
    case 3: {
      yield* multiInterpolation(node.data, state);
      break;
    }
    case 8: {
      if (node.data === prefix) {
        yield* holeValue(state);
      } else if (node.data === urlContextPrefix) {
        yield* urlContextValue();
      } else {
        yield htmlValue(`<!--${node.data}-->`);
      }
      break;
    }
    case 11: {
      yield* walkFragment(node, state);
      break;
    }
  }
}
class Codegen {
  createTemplates(frag, doctype) {
    let templates = [];
    let buffer = '';
    function closeBuffer(state) {
      if (buffer) {
        templates.push(new TextPart(buffer, state.li, state.i));
        buffer = '';
      }
    }
    let state = {
      i: 0,
      li: 0,
    };
    for (let { type, value } of walk(frag, state)) {
      switch (type) {
        case 'html': {
          buffer += value;
          break;
        }
        case 'hole': {
          templates.push(new TextPart(buffer, state.i, state.i + 1));
          buffer = '';
          break;
        }
        case 'component': {
          closeBuffer(state);
          templates.push(new ComponentPart(value, state));
          break;
        }
        case 'url-context': {
          closeBuffer(state);
          templates.push(new URLContextPart(value));
          break;
        }
      }
      state.li = state.i;
    }
    if (buffer) {
      templates.push(new TextPart(buffer, state.i + 1));
    }
    if (doctype.match && templates[0] instanceof TextPart) {
      templates[0].addDoctype(doctype);
    }
    return templates;
  }
}
class EndOfHead {
  constructor(document) {
    this.ownerDocument = document;
    this.head = null;
    this.firstNonHead = null;
    this.foundElementsBeforeBody = false;
  }
  get found() {
    return !!(this.head || this.firstNonHead);
  }
  find(root) {
    let doc = root.ownerDocument;
    let walker = doc.createTreeWalker(frag, 133, null, false);
    let currentNode = root;
    while (currentNode) {
      if (this.visit(node)) {
        break;
      }
      currentNode = walker.nextNode();
    }
  }
  visit(node) {
    if (this.found || node.nodeType !== 1) {
      return;
    }
    let name = node.localName;
    if (node.localName === 'head') {
      this.head = node;
      return true;
    }
    if (!elementsBeforeBody.has(name)) {
      this.firstNonHead = node;
      return true;
    } else {
      this.foundElementsBeforeBody = true;
    }
    return false;
  }
  append(node) {
    if (this.head) {
      this.head.insertBefore(node, this.head.lastChild);
    } else if (this.firstNonHead) {
      this.firstNonHead.parentNode.insertBefore(node, this.firstNonHead);
    }
  }
}
class Optimizer {
  #polyfillURL;
  constructor(opts) {
    this.document = opts.document;
    this.customElements = this.document.defaultView.customElements;
    this.elements = opts.elements;
    this.hydrator = opts.hydrator;
    this.settings = opts.settings;
    this.plugins = opts.plugins;
  }
  optimize(frag) {
    let document = this.document;
    let customElements = this.customElements;
    let elements = this.elements;
    let polyfillURL = this.settings.polyfillURL;
    let plugins = this.plugins.map((p) => p());
    let hydrator = this.hydrator.createInstance();
    let foundShadow = false;
    let eoh = new EndOfHead(document);
    let walker = document.createTreeWalker(frag, 133, null, false);
    let currentNode = frag;
    while (currentNode) {
      switch (currentNode.nodeType) {
        case 1: {
          let name = currentNode.localName;
          eoh.visit(currentNode);
          for (let plugin of plugins) {
            plugin.handle(currentNode, eoh);
          }
          if (customElements.get(name)) {
            if (currentNode.shadowRoot) {
              foundShadow = true;
            }
            if (elements.has(name)) {
              hydrator.handle(eoh, currentNode, elements.get(name));
            }
          }
          break;
        }
      }
      currentNode = walker.nextNode();
    }
    if (foundShadow && eoh.foundElementsBeforeBody && polyfillURL) {
      let script = document.createElement('script');
      script.setAttribute('type', 'module');
      script.textContent = this.inlinePolyfill();
      eoh.append(script);
    }
  }
  inlinePolyfill() {
    return `const o=(new DOMParser).parseFromString('<p><template shadowroot="open"></template></p>',"text/html",{includeShadowRoots:!0}).querySelector("p");o&&o.shadowRoot||async function(){const{hydrateShadowRoots:o}=await import("${urlContextCommentPlaceholder(
      this.settings.polyfillURL
    )}");o(document.body)}()`;
  }
}
class Template {
  constructor(parts) {
    this.parts = parts;
  }
  async *render(values, context) {
    let parts = this.parts;
    for (let part of parts) {
      let partValues = values.slice(part.start, part.end);
      yield* part.render(partValues, context);
    }
  }
}
class Doctype {
  constructor(raw) {
    this.raw = raw;
    this.match = /(<!doctype html>)/i.exec(raw);
    this.source = this.match ? this.match[0] : null;
    this.start = this.match ? this.match.index : null;
    this.end = this.match ? this.match.index + this.source.length : null;
  }
  remove() {
    if (!this.match) {
      return this.raw;
    }
    return this.raw.slice(0, this.start) + this.raw.slice(this.end);
  }
  replace(part) {
    if (!this.match) {
      return part;
    }
    return part.slice(0, this.start) + this.source + part.slice(this.start);
  }
}
class Compiler {
  constructor(opts1) {
    this.document = opts1.document;
    this.polyfillURL = opts1.polyfillURL;
    this.optimizer = new Optimizer({
      document: this.document,
      elements: opts1.elements,
      hydrator: opts1.hydrator,
      plugins: opts1.plugins,
      settings: opts1.settings,
    });
    this.codegen = new Codegen();
  }
  compile(parts, values) {
    let document = this.document;
    let replacedValues = Array.from(
      {
        length: values.length,
      },
      (_) => commentPlaceholder
    );
    let raw = defaultOutdent(parts, ...replacedValues);
    let doctype = new Doctype(raw);
    raw = doctype.remove();
    let div = document.createElement('div');
    div.innerHTML = raw;
    let frag = document.createDocumentFragment();
    frag.append(...div.childNodes);
    this.optimizer.optimize(frag);
    let templates = this.codegen.createTemplates(frag, doctype);
    return new Template(templates);
  }
}
function must(opts, key) {
  if (!(key in opts)) {
    throw new Error(`The option [${key}] is missing.`);
  }
  return Reflect.get(opts, key);
}
class Ocean1 {
  constructor(opts2 = {}) {
    this.document = must(opts2, 'document');
    this.plugins = opts2.plugins || [];
    this.hydrator = new Hydration(
      opts2.hydration,
      opts2.hydrationAttr,
      opts2.hydrators
    );
    this.templateCache = new WeakMap();
    this.elements = new Map();
    this.settings = {
      polyfillURL: opts2.polyfillURL || null,
    };
    this.compiler = new Compiler({
      document: this.document,
      elements: this.elements,
      hydrator: this.hydrator,
      plugins: this.plugins,
      settings: this.settings,
    });
    this.html = this.html.bind(this);
    this.relativeTo = this.relativeTo.bind(this);
  }
  set polyfillURL(val) {
    this.settings.polyfillURL = val;
  }
  get polyfillURL() {
    return this.settings.polyfilURL;
  }
  #getTemplate(strings, values) {
    let template;
    if (this.templateCache.has(strings)) {
      template = this.templateCache.get(strings);
    } else {
      template = this.compiler.compile(strings, values);
      this.templateCache.set(strings, template);
    }
    return template;
  }
  async *html(strings, ...values) {
    yield* this.#getTemplate(strings, values).render(values);
  }
  async *#htmlRelative(url, strings, ...values) {
    let template = this.#getTemplate(strings, values);
    yield* template.render(values, {
      url,
    });
  }
  relativeTo(_url) {
    let url = _url instanceof URL ? _url : new URL(_url.toString());
    return this.#htmlRelative.bind(this, url);
  }
}
export {
  HydrateIdle1 as HydrateIdle,
  HydrateLoad1 as HydrateLoad,
  HydrateMedia1 as HydrateMedia,
  HydrateVisible1 as HydrateVisible,
};
export { Ocean1 as Ocean };
