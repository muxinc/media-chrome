import { assert } from '@open-wc/testing';
import { evaluateCondition, getParamValue, processor } from '../../src/js/utils/template-processor.js';
import { TemplateInstance } from '../../src/js/utils/template-parts.js';

describe('evaluateCondition', () => {
  it('can evaluate a simple boolean condition', () => {
    assert(evaluateCondition('true'));
    assert(evaluateCondition('true == myVar', { myVar: true }));
    assert(evaluateCondition('myVar != false', { myVar: true }));
  });

  it('can evaluate a simple number condition', async () => {
    assert(!evaluateCondition('0'));
    assert(evaluateCondition('1'));
    assert(evaluateCondition('5 > 3'));
    assert(evaluateCondition('5 >= 3'));
    assert(evaluateCondition('5 >= 5'));
    assert(evaluateCondition('2 < 3'));
    assert(evaluateCondition('2 <= 3'));
    assert(evaluateCondition('3 <= 3'));
    assert(evaluateCondition('myVar == 22', { myVar: 22 }));
    assert(evaluateCondition('myVar != 22', { myVar: 23 }));
  });

  it('can evaluate a simple string condition', async () => {
    assert(!evaluateCondition('""'));
    assert(evaluateCondition('"thruthy"'));
    assert(evaluateCondition('myVar == "a string"', { myVar: 'a string' }));
    assert(evaluateCondition('myVar != "a string"', { myVar: 'lalala' }));
  });
});

describe('getParamValue', () => {
  it('gets the correct value from string', () => {
    assert.equal(getParamValue('true'), true);
    assert.equal(getParamValue('false'), false);
    assert.equal(getParamValue('"hello world"'), 'hello world');
    assert.equal(getParamValue("'hello world'"), 'hello world');
    assert.equal(getParamValue('360'), 360);
    assert.equal(getParamValue('myVar', { myVar: 'val' }), 'val');
  });
});

describe('processor', () => {

  it('InnerTemplatePart: simple truthy if condition', async () => {
    const template = document.createElement('template');
    template.innerHTML = `<div>hello<template block="if x"> world</template>!</div>`;
    const instance = new TemplateInstance(template, { x: false }, processor);
    assert.equal(instance.children[0].innerHTML, 'hello!');

    instance.update({ x: true });
    assert.equal(instance.children[0].innerHTML, 'hello world!');
  });

  it('InnerTemplatePart: simple value if condition', async () => {
    const template = document.createElement('template');
    template.innerHTML = `<div>hello<template block="if x == 'hello'"> world</template>!</div>`;
    const instance = new TemplateInstance(template, { x: false }, processor);
    assert.equal(instance.childNodes[0].innerHTML, 'hello!');

    instance.update({ x: 'hell' });
    assert.equal(instance.children[0].innerHTML, 'hello!');

    instance.update({ x: 'hello' });
    assert.equal(instance.children[0].innerHTML, 'hello world!');
  });

  it('InnerTemplatePart: nested if blocks (logical AND)', async () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div>
        hello<template block="if x >= 1"> world<template block="if loud">!</template></template>
      </div>`;
    const instance = new TemplateInstance(template, { x: 0 }, processor);
    assert.equal(instance.children[0].textContent.trim(), 'hello');

    instance.update({ x: 1 });
    assert.equal(instance.children[0].textContent.trim(), 'hello world');

    instance.update({ x: 1, loud: true });
    assert.equal(instance.children[0].textContent.trim(), 'hello world!');
  });

});
