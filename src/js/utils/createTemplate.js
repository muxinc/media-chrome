import { isServer, Document } from './browser-env.js';

export function createTemplate(name, element) {
  if (isServer()) {
    return {};
  }
  return Document.createElement('template');
}
