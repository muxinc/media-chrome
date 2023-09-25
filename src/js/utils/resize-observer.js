import { globalThis } from './server-safe-globals.js';

// Use 1 resize observer instance for many elements for best performance.
// https://groups.google.com/a/chromium.org/g/blink-dev/c/z6ienONUb5A/m/F5-VcUZtBAAJ

const callbacks = new WeakMap();

const observer = new globalThis.ResizeObserver((entries) => {
  for (let entry of entries) {
    callbacks.get(entry.target)?.(entry);
  }
});

export function observeResize(element, callback) {
  callbacks.set(element, callback);
  observer.observe(element);
}

export function unobserveResize(element) {
  callbacks.delete(element);
  observer.unobserve(element);
}
