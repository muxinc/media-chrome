import fs from 'fs';
import { parseHTML } from 'linkedom';
import './dom-shim.js';
import '../../dist/index.js';

const voidElements = new Set(['area', 'base', 'br', 'col', 'command',
'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source',
'track', 'wbr']);

const nonClosingElements = new Set([
  ...voidElements,
  'html'
]);

const app = fs.readFileSync('./app.html');
const { document: { head, body } } = parseHTML(app);
document.head.innerHTML = head.innerHTML;
document.body.innerHTML = body.innerHTML;

document.body.querySelectorAll('media-controller').forEach((ctrl) => {
  // Linkedom doesn't support querySelector(':scope >') and has no video element defaults.
  Object.defineProperty(ctrl, 'media', { get: () => ({
    paused: !ctrl.querySelector('[slot="media"]').hasAttribute('autoplay'),
    volume: 1,
    muted: ctrl.querySelector('[slot="media"]').hasAttribute('muted'),
    currentTime: 0,
  }) });

  // Needed after ctrl.media is defined above so state is propagated.
  ctrl.unregisterMediaStateReceiver(ctrl);
  ctrl.registerMediaStateReceiver(ctrl);

  // Needed to get the MutationObserver to pick up the media state receivers.
  ctrl.append(...ctrl.childNodes)
})

// Setting attributes could be async see media-controller.js setAttr().
setTimeout(() => {
  fs.writeFileSync('./index.html', stringify(document))
}, 100);

function stringify(node) {
  let str = '';

  if (node.nodeName === '#document') {
    node = node.documentElement;
    str += '<!doctype html>';
  }

  if (node.nodeName === '#text') {
    return node.textContent;
  }

  if (node.nodeName === '#comment') {
    return `<!--${node.textContent}-->`;
  }

  str += `<${node.localName}${(node.attributes || [])
    .map(a => ` ${a.name}${a.value === '' ? '' : `="${a.value}"`}`)
    .join('')}>`;

  if (node.shadowRoot) {
    str += `<template shadowroot="open">${node.shadowRoot.childNodes
      .map(stringify)
      .join('')}</template>`;
  }

  if (node.childNodes) {
    str += node.childNodes.map(stringify).join('');
  }

  if(!nonClosingElements.has(node.localName)) {
    str += `</${node.localName}>`;
  }

  return str;
}
