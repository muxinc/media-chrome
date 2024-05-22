import { globalThis } from './server-safe-globals.js';

// Use 1 resize observer instance for many elements for best performance.
// https://groups.google.com/a/chromium.org/g/blink-dev/c/z6ienONUb5A/m/F5-VcUZtBAAJ

const callbacksMap = new WeakMap();

const getCallbacks = (element) => {
  let callbacks = callbacksMap.get(element);
  if (!callbacks) callbacksMap.set(element, (callbacks = new Set()));
  return callbacks;
};

const observer = new globalThis.ResizeObserver((entries) => {
  for (let entry of entries) {
    for (let callback of getCallbacks(entry.target)) {
      callback(entry);
    }
  }
});

export function observeResize(element, callback) {
  getCallbacks(element).add(callback);
  observer.observe(element);
}

export function unobserveResize(element, callback) {
  const callbacks = getCallbacks(element);
  callbacks.delete(callback);

  if (!callbacks.size) {
    observer.unobserve(element);
  }
}
