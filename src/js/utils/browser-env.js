const windowShim = {};
const documentShim = {};
class HTMLElementShim { };

export const isServer = !!(typeof window === 'undefined')
export const Window = isServer ? windowShim : window;
export const Document = isServer ? documentShim : window.document;
export const HTMLElement = isServer ? HTMLElementShim : window.HTMLElement;
