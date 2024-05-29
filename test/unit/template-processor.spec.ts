import { assert } from '@open-wc/testing';
import { TemplateInstance } from '../../src/js/utils/template-parts.js';
import { evaluateExpression, getParamValue, processor } from '../../src/js/utils/template-processor.js';

describe('evaluateExpression', () => {
  it('can evaluate a simple boolean condition', () => {
    assert(evaluateExpression('true'));
    assert(evaluateExpression('!false'));
    assert(evaluateExpression('!!true'));
    assert(evaluateExpression('true == myVar', { myVar: true }));
    assert(evaluateExpression('myVar != false', { myVar: true }));
  });

  it('can evaluate a simple number condition', async () => {
    assert(!evaluateExpression('0'));
    assert(evaluateExpression('1'));
    assert(evaluateExpression('!0'));
    assert(!evaluateExpression('!1'));
    assert(evaluateExpression('5 > 3'));
    assert(evaluateExpression('5 >= 3'));
    assert(evaluateExpression('5 >= 5'));
    assert(evaluateExpression('2 < 3'));
    assert(evaluateExpression('2 <= 3'));
    assert(evaluateExpression('3 <= 3'));
    assert(evaluateExpression('myVar == 22', { myVar: 22 }));
    assert(evaluateExpression('myVar != 22', { myVar: 23 }));
  });

  it('can evaluate a simple string condition', async () => {
    assert(!evaluateExpression('""'));
    assert(evaluateExpression('!""'));
    assert(evaluateExpression('"thruthy"'));
    assert(evaluateExpression('myVar == "a string"', { myVar: 'a string' }));
    assert(evaluateExpression('myVar != "a string"', { myVar: 'lalala' }));
  });

  it('can evaluate the string filter', () => {
    assert.equal(evaluateExpression('2.34 | string'), '2.34');
  });

  it('can evaluate nullish coalesce operator', () => {
    assert.equal(evaluateExpression('myVar ?? "on-demand"'), 'on-demand');
    assert.equal(evaluateExpression('myVar ?? "hello world"'), 'hello world');
    assert.equal(evaluateExpression('myVar ?? 99'), 99);
    assert.equal(evaluateExpression('myVar ?? true'), true);
    assert.equal(evaluateExpression('null ?? true'), true);
    assert.equal(evaluateExpression('undefined ?? true'), true);
  });

  it('can evaluate partial', () => {
    const MyButton = {};
    let result = evaluateExpression('>MyButton arg1="hello"', { MyButton });
    assert.equal(result, MyButton);
    assert.deepEqual(result.state, { MyButton, arg1: 'hello' });

    result = evaluateExpression(' > MyButton ', { MyButton });
    assert.equal(result, MyButton);
    assert.deepEqual(result.state, { MyButton });
  });
});

describe('getParamValue', () => {
  it('gets the correct value from string', () => {
    assert.equal(getParamValue('true'), true);
    assert.equal(getParamValue('false'), false);
    assert.equal(getParamValue('"hello world"'), 'hello world');
    assert.equal(getParamValue('"hello-world"'), 'hello-world');
    assert.equal(getParamValue('"hello_world"'), 'hello_world');
    assert.equal(getParamValue("'hello world'"), 'hello world');
    assert.equal(getParamValue('360'), 360);
    assert.equal(getParamValue('myVar', { myVar: 'val' }), 'val');
    assert.equal(getParamValue('my_var', { my_var: 'val' }), 'val');
  });
});

describe('processor', () => {

  it('InnerTemplatePart: simple truthy if condition', async () => {
    const template = document.createElement('template');
    template.innerHTML = `<div>hello<template if="x"> world</template>!</div>`;
    const instance = new TemplateInstance(template, { x: false }, processor);
    assert.equal(instance.children[0].innerHTML, 'hello!');

    instance.update({ x: true });
    assert.equal(instance.children[0].innerHTML, 'hello world!');
  });

  it('InnerTemplatePart: simple value if condition', async () => {
    const template = document.createElement('template');
    template.innerHTML = `<div>hello<template if="x == 'hello'"> world</template>!</div>`;
    const instance = new TemplateInstance(template, { x: false }, processor);
    assert.equal(instance.children[0].innerHTML, 'hello!');

    instance.update({ x: 'hell' });
    assert.equal(instance.children[0].innerHTML, 'hello!');

    instance.update({ x: 'hello' });
    assert.equal(instance.children[0].innerHTML, 'hello world!');
  });

  it('InnerTemplatePart: nested if blocks (logical AND)', async () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div>
        hello<template if="x >= 1"> world<template if="loud">!</template></template>
      </div>`;
    const instance = new TemplateInstance(template, { x: 0 }, processor);
    assert.equal(instance.children[0].textContent!.trim(), 'hello');

    instance.update({ x: 1 });
    assert.equal(instance.children[0].textContent!.trim(), 'hello world');

    instance.update({ x: 1, loud: true });
    assert.equal(instance.children[0].textContent!.trim(), 'hello world!');
  });

});
