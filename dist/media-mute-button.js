import c from"./media-chrome-button.js";import{defineCustomElement as d}from"./utils/defineCustomElement.js";import{Window as L,Document as M}from"./utils/server-safe-globals.js";import{MediaUIEvents as n,MediaUIAttributes as t}from"./constants.js";import{verbs as l}from"./labels/labels.js";const r='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="icon" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',E='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="icon" d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',u='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="icon" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',i=M.createElement("template");i.innerHTML=`
  <style>
  /* Default to High slot/icon. */
  :host(:not([${t.MEDIA_VOLUME_LEVEL}])) slot:not([name=high]) > *, 
  :host(:not([${t.MEDIA_VOLUME_LEVEL}])) ::slotted(:not([slot=high])),
  :host([${t.MEDIA_VOLUME_LEVEL}=high]) slot:not([name=high]) > *, 
  :host([${t.MEDIA_VOLUME_LEVEL}=high]) ::slotted(:not([slot=high])) {
    display: none;
  }

  :host([${t.MEDIA_VOLUME_LEVEL}=off]) slot:not([name=off]) > *, 
  :host([${t.MEDIA_VOLUME_LEVEL}=off]) ::slotted(:not([slot=off])) {
    display: none;
  }

  :host([${t.MEDIA_VOLUME_LEVEL}=low]) slot:not([name=low]) > *, 
  :host([${t.MEDIA_VOLUME_LEVEL}=low]) ::slotted(:not([slot=low])) {
    display: none;
  }

  :host([${t.MEDIA_VOLUME_LEVEL}=medium]) slot:not([name=medium]) > *, 
  :host([${t.MEDIA_VOLUME_LEVEL}=medium]) ::slotted(:not([slot=medium])) {
    display: none;
  }
  </style>

  <slot name="off">${r}</slot>
  <slot name="low">${E}</slot>
  <slot name="medium">${E}</slot>
  <slot name="high">${u}</slot>
`;const a=s=>{const e=s.getAttribute(t.MEDIA_VOLUME_LEVEL)==="off"?l.UNMUTE():l.MUTE();s.setAttribute("aria-label",e)};class h extends c{static get observedAttributes(){return[...super.observedAttributes,t.MEDIA_VOLUME_LEVEL]}constructor(o={}){super({slotTemplate:i,...o})}connectedCallback(){a(this),super.connectedCallback()}attributeChangedCallback(o,e,m){o===t.MEDIA_VOLUME_LEVEL&&a(this),super.attributeChangedCallback(o,e,m)}handleClick(o){const e=this.getAttribute(t.MEDIA_VOLUME_LEVEL)==="off"?n.MEDIA_UNMUTE_REQUEST:n.MEDIA_MUTE_REQUEST;this.dispatchEvent(new L.CustomEvent(e,{composed:!0,bubbles:!0}))}}d("media-mute-button",h);export default h;
