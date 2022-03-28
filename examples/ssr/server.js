import fs from 'fs';
import './ocean/dom-shim.js';
import { Ocean } from './ocean/ocean.js';
import '../../dist/index.js';

const { document } = globalThis;

const { html } = new Ocean({
  document,
});

const app = fs.readFileSync('./app.html');
const createTemplateIterator = (src) => {
  return new Function('html', 'return html`' + src + '`')(html);
};

let iterator = createTemplateIterator(app);

let code = '';
for await (let chunk of iterator) {
  code += chunk;
}

fs.writeFileSync('./index.html', code);
