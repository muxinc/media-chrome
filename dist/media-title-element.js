import{defineCustomElement as o}from"./utils/defineCustomElement.js";import{Window as s,Document as l}from"./utils/server-safe-globals.js";const e=l.createElement("template");e.innerHTML=`
  <style>
    :host {

    }
  </style>

  <slot></slot>
`;class t extends s.HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e.content.cloneNode(!0))}}o("media-title-bar",t);export default t;
