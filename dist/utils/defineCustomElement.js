import{Window as s}from"./server-safe-globals.js";export function defineCustomElement(e,o){s.customElements.get(e)||(s.customElements.define(e,o),s[o.name]=o)}
