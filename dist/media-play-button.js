import d from"./media-chrome-button.js";import{Window as p,Document as c}from"./utils/server-safe-globals.js";import{defineCustomElement as m}from"./utils/defineCustomElement.js";import{MediaUIEvents as a,MediaUIAttributes as t}from"./constants.js";import{verbs as l}from"./labels/labels.js";const E='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',A='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',n=c.createElement("template");n.innerHTML=`
  <style>
  :host([${t.MEDIA_PAUSED}]) slot[name=pause] > *, 
  :host([${t.MEDIA_PAUSED}]) ::slotted([slot=pause]) {
    display: none;
  }

  :host(:not([${t.MEDIA_PAUSED}])) slot[name=play] > *, 
  :host(:not([${t.MEDIA_PAUSED}])) ::slotted([slot=play]) {
    display: none;
  }
  </style>

  <slot name="play">${E}</slot>
  <slot name="pause">${A}</slot>
`;const i=o=>{const s=o.getAttribute(t.MEDIA_PAUSED)!=null?l.PLAY():l.PAUSE();o.setAttribute("aria-label",s)};class r extends d{static get observedAttributes(){return[...super.observedAttributes,t.MEDIA_PAUSED]}constructor(e={}){super({slotTemplate:n,...e})}connectedCallback(){i(this),super.connectedCallback()}attributeChangedCallback(e,s,u){e===t.MEDIA_PAUSED&&i(this),super.attributeChangedCallback(e,s,u)}handleClick(e){const s=this.getAttribute(t.MEDIA_PAUSED)!=null?a.MEDIA_PLAY_REQUEST:a.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new p.CustomEvent(s,{composed:!0,bubbles:!0}))}}m("media-play-button",r);export default r;
