import { assert } from '@open-wc/testing';
import { isElementVisible, getPointProgressOnLine } from '../../../src/js/utils/element-utils.js';

describe('getPointProgressOnLine', () => {
  it('gets progress of point on line segment', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 50 };
    assert.equal(getPointProgressOnLine(0, 0, p1, p2), 0);
    assert.equal(getPointProgressOnLine(50, 25, p1, p2), 0.5);
    assert.equal(getPointProgressOnLine(100, 50, p1, p2), 1);
  });

  it('clamps progress of point on line segment', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 0 };
    assert.equal(getPointProgressOnLine(-10, 0, p1, p2), 0);
    assert.equal(getPointProgressOnLine(50, 0, p1, p2), 0.5);
    assert.equal(getPointProgressOnLine(120, 0, p1, p2), 1);
  });
});

describe('isElementVisible', () => {
  it('checks if the element is visible w/ opacity', () => {
    const element = document.createElement('div');
    element.style.opacity = '1';
    document.body.appendChild(element);
    assert(isElementVisible(element));
    document.body.removeChild(element);
  });

  it('checks if the element is not visible w/ opacity', () => {
    const element = document.createElement('div');
    element.style.opacity = '0';
    document.body.appendChild(element);
    assert(!isElementVisible(element));
    document.body.removeChild(element);
  });

  it('checks if the element is visible w/ visibility', () => {
    const element = document.createElement('div');
    element.style.visibility = 'visible';
    document.body.appendChild(element);
    assert(isElementVisible(element));
    document.body.removeChild(element);
  });

  it('checks if the element is not visible w/ visibility', () => {
    const element = document.createElement('div');
    element.style.visibility = 'hidden';
    document.body.appendChild(element);
    assert(!isElementVisible(element));
    document.body.removeChild(element);
  });

  it('checks if the element is visible w/ display', () => {
    const element = document.createElement('div');
    element.style.display = 'block';
    document.body.appendChild(element);
    assert(isElementVisible(element));
    document.body.removeChild(element);
  });

  it('checks if the element is not visible w/ display', () => {
    const element = document.createElement('div');
    element.style.display = 'none';
    document.body.appendChild(element);
    assert(!isElementVisible(element));
    document.body.removeChild(element);
  });
});
