class HTMLElementShim { };

export function isServer () {
  return (typeof window === 'undefined');
}

let element

if (isServer()) {
  element = HTMLElementShim;
} else {
  element = window.HTMLElement;
}

export const HTMLElement = element;
