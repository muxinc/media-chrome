/* Adapted from https://github.com/dy/template-parts - ISC - Dmitry Iv. */

import { assert } from '@open-wc/testing';
import {
  TemplateInstance,
  AttrPart,
  AttrPartList,
} from '../../src/js/utils/template-parts.js';

const test = it;
const is = assert.deepEqual;
const any = (a, b) => assert.include(b, a);

test('create: applies data to templated text nodes', () => {
  const template = document.createElement('template');
  const originalHTML = `{{x}}`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, { x: 'Hello world' });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `Hello world`);
});

test('create: can render into partial text nodes', () => {
  const template = document.createElement('template');
  const originalHTML = `Hello {{x}}!`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, { x: 'world' });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `Hello world!`);
});

test('create: can render nested text nodes', () => {
  const template = document.createElement('template');
  const originalHTML = '<div><div>Hello {{x}}!</div></div>';
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, { x: 'world' });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div><div>Hello world!</div></div>`);
});

test('create: applies data to templated attributes', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="{{y}}"></div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, { y: 'foo' });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="foo"></div>`);
});

test('create: can render into partial attribute nodes', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="my-{{y}}-state"></div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, { y: 'foo' });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="my-foo-state"></div>`);
});

test('create: can render into many values', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="my-{{x}}-state {{y}}">{{z}}</div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, {
    x: 'foo',
    y: 'bar',
    z: 'baz',
  });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="my-foo-state bar">baz</div>`);
});

test('create: it allows spaces inside template part identifiers', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="my-{{ x }}-state {{ y }}">{{         z          }}</div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, {
    x: 'foo',
    y: 'bar',
    z: 'baz',
  });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="my-foo-state bar">baz</div>`);
});

test('create: never writes mustache syntax into an instantiated template even if no state given', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="my-{{ x }}-state {{ y }}">{{ z }}</div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template);
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="my--state "></div>`);
});

test('update: updates all nodes with new values', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="my-{{ x }}-state {{ y }}">{{ z }}</div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, {
    x: 'foo',
    y: 'bar',
    z: 'baz',
  });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="my-foo-state bar">baz</div>`);
  instance.update({ x: 'bing', y: 'bong', z: 'quux' });
  is(root.innerHTML, `<div class="my-bing-state bong">quux</div>`);
});

test('update: performs noop when update() is called with partial args', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="my-{{ x }}-state {{ y }}">{{ z }}</div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, {
    x: 'foo',
    y: 'bar',
    z: 'baz',
  });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="my-foo-state bar">baz</div>`);
  instance.update({ y: 'boo' });
  is(root.innerHTML, `<div class="my-foo-state boo">baz</div>`);
});

test('update: is a noop when update() is called with no args', () => {
  const template = document.createElement('template');
  const originalHTML = `<div class="my-{{ x }}-state {{ y }}">{{ z }}</div>`;
  template.innerHTML = originalHTML;
  const instance = new TemplateInstance(template, {
    x: 'foo',
    y: 'bar',
    z: 'baz',
  });
  is(template.innerHTML, originalHTML);
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div class="my-foo-state bar">baz</div>`);
  instance.update();
  is(root.innerHTML, `<div class="my-foo-state bar">baz</div>`);
});

test('update: inserting instance does not break update', () => {
  let template = document.createElement('template');
  template.innerHTML = `{{a}}`;
  const inst = new TemplateInstance(template, { a: 1 });
  let el = document.createElement('div');
  el.appendChild(inst);
  is(el.innerHTML, `1`);
  inst.update({ a: 2 });
  is(el.innerHTML, `2`);
});

test('update: inserting instance does not break update', () => {
  let template = document.createElement('template');
  template.innerHTML = `{{a}}`;
  const inst = new TemplateInstance(template, { a: 1 });
  let el = document.createElement('div');
  el.appendChild(inst);
  is(el.innerHTML, `1`);
  inst.update({ a: 2 });
  is(el.innerHTML, `2`);
});

const propertyIdentityOrBooleanAttribute = {
  createCallback() {
    return this.processCallback(...arguments);
  },

  processCallback(instance, parts, params) {
    if (typeof params !== 'object' || !params) return;
    for (const [expression, part] of parts) {
      if (expression in params) {
        const value = params[expression] ?? '';

        // boolean attr
        if (
          typeof value === 'boolean' &&
          part instanceof AttrPart &&
          typeof part.element[part.attributeName] === 'boolean'
        )
          part.booleanValue = value;
        else part.value = value;
      }
    }
  },
};

test('update: allows attributes to be toggled on and off', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div hidden="{{ hidden }}"></div>`;
  const instance = new TemplateInstance(
    template,
    { hidden: true },
    propertyIdentityOrBooleanAttribute
  );
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div hidden=""></div>`);

  instance.update({ hidden: false });
  is(root.innerHTML, `<div></div>`);

  instance.update({ hidden: 'hidden' });
  is(root.innerHTML, `<div hidden="hidden"></div>`);
});

test('update: allows attributes to be toggled on even when starting off', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div hidden="{{ hidden }}"></div>`;
  const instance = new TemplateInstance(
    template,
    { hidden: false },
    propertyIdentityOrBooleanAttribute
  );
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div></div>`);
  instance.update({ hidden: true });
  is(root.innerHTML, `<div hidden=""></div>`);
  instance.update({ hidden: false });
  is(root.innerHTML, `<div></div>`);
});

test('update: only toggles attributes with boolean class properties', () => {
  const template = document.createElement('template');
  template.innerHTML = `<input required="{{a}}" aria-disabled="{{a}}" hidden="{{a}}" value="{{a}}"/>`;
  const instance = new TemplateInstance(
    template,
    { a: false },
    propertyIdentityOrBooleanAttribute
  );
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<input aria-disabled="false" value="false">`);
  instance.update({ a: true });
  is(
    root.innerHTML,
    `<input aria-disabled="true" value="true" required="" hidden="">`
  );
  instance.update({ a: false });
  is(root.innerHTML, `<input aria-disabled="false" value="false">`);
});

test('update: clears mustache when no args given', () => {
  const template = document.createElement('template');
  template.innerHTML = `<input required="{{a}}" aria-disabled="{{a}}" hidden="{{b}}" value="{{b}}"/>`;
  const instance = new TemplateInstance(
    template,
    null,
    propertyIdentityOrBooleanAttribute
  );
  const root = document.createElement('div');
  root.appendChild(instance);
  any(root.innerHTML, [
    `<input required="" aria-disabled="" hidden="" value="">`,
    `<input required="" aria-disabled="" value="" hidden="">`,
  ]);
});

test('update: is a noop when `update()` is called with no args', () => {
  const template = document.createElement('template');
  template.innerHTML = `<input required="{{a}}" aria-disabled="{{a}}" hidden="{{b}}" value="{{b}}"/>`;
  const instance = new TemplateInstance(
    template,
    { a: false, b: true },
    propertyIdentityOrBooleanAttribute
  );
  const root = document.createElement('div');
  root.appendChild(instance);
  any(root.innerHTML, [
    `<input aria-disabled="false" hidden="" value="true">`,
    `<input aria-disabled="false" value="true" hidden="">`,
  ]);
  instance.update();
  any(root.innerHTML, [
    `<input aria-disabled="false" hidden="" value="true">`,
    `<input aria-disabled="false" value="true" hidden="">`,
  ]);
});

test('update: is a noop when `update()` is called with no args', () => {
  const template = document.createElement('template');
  template.innerHTML = `<input required="{{a}}" aria-disabled="{{a}}" hidden="{{b}}" value="{{b}}"/>`;
  const instance = new TemplateInstance(
    template,
    { a: false, b: true },
    propertyIdentityOrBooleanAttribute
  );
  const root = document.createElement('div');
  root.appendChild(instance);
  any(root.innerHTML, [
    `<input aria-disabled="false" hidden="" value="true">`,
    `<input aria-disabled="false" value="true" hidden="">`,
  ]);
  instance.update({ b: false });
  is(root.innerHTML, `<input aria-disabled="false" value="false">`);
});

test('update: replaces an empty replace() call with an empty text node', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div>{{a}}</div>`;
  const instance = new TemplateInstance(
    template,
    { a: true },
    {
      createCallback() {
        return this.processCallback(...arguments);
      },
      processCallback(instance, parts, params) {
        if (typeof params !== 'object' || !params) return;
        for (const [expression, part] of parts) {
          if (expression in params) {
            const value = params[expression] ?? '';
            part.replace();
            part.replace();
            part.replace();
          }
        }
      },
    }
  );
  const root = document.createElement('div');
  root.appendChild(instance);
  is(root.innerHTML, `<div></div>`);
});

test('createCallback: is called once on construction, if present', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div>{{a}}</div>`;
  let createCallCount = 0;
  new TemplateInstance(
    template,
    { a: true },
    {
      createCallback() {
        createCallCount += 1;
      },
      processCallback() {
        return;
      },
    }
  );
  is(createCallCount, 1);
});

test('createCallback: is not called on update', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div>{{a}}</div>`;
  let createCallCount = 0;
  const instance = new TemplateInstance(
    template,
    { a: true },
    {
      createCallback() {
        createCallCount += 1;
      },
      processCallback() {
        return;
      },
    }
  );
  is(createCallCount, 1);
  instance.update({ a: false });
  is(createCallCount, 1);
});

test('processCallback: is called on construction', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div>{{a}}</div>`;
  let processCallCount = 0;
  new TemplateInstance(
    template,
    { a: true },
    {
      processCallback() {
        processCallCount += 1;
      },
    }
  );
  is(processCallCount, 1);
});

test('processCallback: is called on update', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div>{{a}}</div>`;
  let processCallCount = 0;
  const instance = new TemplateInstance(
    template,
    { a: true },
    {
      processCallback() {
        processCallCount += 1;
      },
    }
  );
  is(processCallCount, 1);
  instance.update({ a: false });
  is(processCallCount, 2);
});

test('innerTemplatePart: full form', () => {
  const template = document.createElement('template');
  template.innerHTML = `<div><template directive="x" expression="x">{{ x }}</template></div>`;
  let arr = [];
  const instance = new TemplateInstance(
    template,
    { x: ['x', 'y'] },
    {
      processCallback(el, [[, part]], state) {
        arr.push(part.directive);
        arr.push(part.expression);
        const nodes = state[part.expression].map(
          (item) => new TemplateInstance(part.template, { x: item })
        );
        part.replace(nodes);
      },
    }
  );
  is(arr, ['x', 'x']);
  is(instance.childNodes[0].innerHTML, 'xy');

  instance.update({ x: ['y', 'z', 'w'] });
  is(instance.childNodes[0].innerHTML, 'yzw');
});

test('attr: updates the given attribute from partList when updateParent is called', () => {
  const el = document.createElement('div');
  const attr = document.createAttribute('class');
  const part = new AttrPart(el, attr.name, attr.namespaceURI);
  part.value = 'foo';
  is(el.getAttribute('class'), 'foo');
});

test('attr: updates the AttributeValue which updates the Attr whenever it receives a new value', () => {
  const el = document.createElement('div');
  const attr = document.createAttribute('class');
  const list = new AttrPartList();
  list.append(
    new AttrPart(el, attr.name, attr.namespaceURI),
    new AttrPart(el, attr.name, attr.namespaceURI)
  );
  list.item(0).value = 'hello';
  list.item(1).value = ' world'; // NOTE: space here
  is(el.getAttribute('class'), 'hello world');

  list.item(0).value = 'goodbye';
  is(el.getAttribute('class'), 'goodbye world');
});

test('attr: updates boolean attr', () => {
  const el = document.createElement('div');
  const attr = document.createAttribute('hidden');
  const list = new AttrPartList();
  list.append(new AttrPart(el, attr.name, attr.namespaceURI));
  list.item(0).booleanValue = false;
  is(el.hasAttribute('hidden'), false);
  is(list.item(0).booleanValue, false);

  list.item(0).booleanValue = true;
  is(el.hasAttribute('hidden'), true);
  is(list.item(0).booleanValue, true);
});

test('nodes: should preserve spaces', () => {
  let tpl = document.createElement('template');
  tpl.innerHTML = `<span>{{ count }}</span> {{ text }} left`;
  let inst = new TemplateInstance(tpl, { count: 10, text: 'items' });
  let el = document.createElement('div');
  el.appendChild(inst);
  is(el.innerHTML, `<span>10</span> items left`);
});

const originalHTML = `Hello {{x}}!`;
const processor = {
  createCalls: 0,
  processCalls: 0,
  createCallback() {
    this.createCalls++;
  },

  processCallback(instance, parts, params) {
    if (typeof params !== 'object' || !params) return;
    for (const [expression, part] of parts) {
      if (expression in params) {
        const value = params[expression] ?? '';
        part.value = value;
        this.processCalls++;
      }
    }
  },
};

test('processor: creates a processor calling the given function when the param exists', () => {
  let template = document.createElement('template');
  template.innerHTML = originalHTML;

  processor.createCalls = 0;
  const instance = new TemplateInstance(template, { x: 'world' }, processor);
  is(processor.createCalls, 1);
  is(processor.processCalls, 1);
  instance.update({ x: 'foo' });
  is(processor.processCalls, 2);
  instance.update({});
  is(processor.processCalls, 2);
});

test('processor: does not process parts with no param for the expression', () => {
  let template = document.createElement('template');
  template.innerHTML = originalHTML;

  processor.createCalls = 0;
  processor.processCalls = 0;
  const instance = new TemplateInstance(template, {}, processor);
  is(processor.createCalls, 1);
  is(processor.processCalls, 0);
  instance.update({ y: 'world' });
  is(processor.createCalls, 1);
  is(processor.processCalls, 0);
});

test('default processor: default processor is identity/boolean', () => {
  const tplEl = document.createElement('template');
  tplEl.innerHTML = `<div x={{x}} hidden={{hidden}} onclick={{onclick}}></div>`;
  const onclick = () => {};
  const tpl = new TemplateInstance(tplEl, {
    x: 'Hello',
    hidden: false,
    onclick,
  });
  let el = tpl.childNodes[0];
  is(el.getAttribute('x'), 'Hello');
  is(el.hasAttribute('hidden'), false);
  is(el.onclick, onclick); // function
});

test('table: default HTML behavior', () => {
  let tpl = document.createElement('template');
  tpl.innerHTML = `<table>123</table>`;
  let instance = new TemplateInstance(tpl);

  const el = document.createElement('div');
  el.appendChild(instance);
  is(el.innerHTML, `123<table></table>`);
});

test('table: <table><!--{{ a }}--><tr><!-- {{ b }} --></tr></table>', () => {
  let tpl = document.createElement('template');
  tpl.innerHTML = `<table><!--{{ a }}--><tr><!--  {{ b }}  --></tr></table>`;

  let table = document.createElement('table');
  table.innerHTML = `<tr><td>a</td></tr>`;
  let inst = new TemplateInstance(tpl, {
    a: table.childNodes[0].childNodes,
    b: 'b',
  });

  let el = document.createElement('div');
  el.appendChild(inst);

  any(el.innerHTML, [
    `<table><tr><td>a</td></tr><tr> b </tr></table>`,
    `<table><tr><td>a</td></tr><tbody><tr>  b  </tr></tbody></table>`,
  ]);
});
