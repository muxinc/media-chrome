import { isServer } from './browser-env.js';

export function createTemplate(name, element) {
  if (isServer()) {
    return {};
  }
  return document.createElement('template');
}
