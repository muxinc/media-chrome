import { globalThis } from './server-safe-globals.js';

// Use 1 resize observer instance for many elements for best performance.
// https://groups.google.com/a/chromium.org/g/blink-dev/c/z6ienONUb5A/m/F5-VcUZtBAAJ

const callbacksMap = new WeakMap<Element, Set<ResizeCallback>>();

type ResizeCallback = (entry: ResizeObserverEntry) => void;

const getCallbacks = (element: Element): Set<ResizeCallback> => {
  let callbacks = callbacksMap.get(element);
  if (!callbacks)
    callbacksMap.set(element, (callbacks = new Set<ResizeCallback>()));
  return callbacks;
};

const observer = new globalThis.ResizeObserver(
  (entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      for (const callback of getCallbacks(entry.target)) {
        callback(entry);
      }
    }
  }
);

export function observeResize(
  element: Element,
  callback: ResizeCallback
): void {
  getCallbacks(element).add(callback);
  observer.observe(element);
}

export function unobserveResize(
  element: Element,
  callback: ResizeCallback
): void {
  const callbacks = getCallbacks(element);
  callbacks.delete(callback);

  if (!callbacks.size) {
    observer.unobserve(element);
  }
}
