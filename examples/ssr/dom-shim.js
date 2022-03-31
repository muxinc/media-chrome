import { parseHTML } from 'linkedom';

let parsed = parseHTML(`
  <html lang="en">
  <head><title>Site</title></head>
  <body></body>
  </html>
`);

globalThis.window = parsed.window;

for (let name of [
  'customElements',
  'document',
  'window',
  'Document',
  'Element',
  'HTMLElement',
  'HTMLTemplateElement',
  'Node',
  'requestAnimationFrame',
  'Text',
  'MutationObserver',
  'Event',
  'CustomEvent',
]) {
  window[name] = parsed[name];
}
