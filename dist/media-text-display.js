import{MediaUIAttributes as o}from"./constants.js";import{defineCustomElement as h}from"./utils/defineCustomElement.js";import{Window as f,Document as i}from"./utils/server-safe-globals.js";const r=i.createElement("template");r.innerHTML=`
  <style>
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      background-color: var(--media-control-background, rgba(20,20,30, 0.7));
  
      /* Default width and height can be overridden externally */
      padding: 10px;

      font-size: 14px;
      line-height: 24px;
      font-family: Arial, sans-serif;
      text-align: center;
      color: #ffffff;
      pointer-events: auto;
    }

    #container {
      /* NOTE: We don't currently have more generic sizing vars */
      height: var(--media-text-content-height, auto);
    }
  </style>
  <span id="container">
  <slot></slot>
  </span>
`;class d extends f.HTMLElement{static get observedAttributes(){return[o.MEDIA_CONTROLLER]}constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(r.content.cloneNode(!0)),this.container=this.shadowRoot.querySelector("#container")}attributeChangedCallback(s,n,t){var a,c;if(s===o.MEDIA_CONTROLLER){if(n){const e=i.getElementById(n);(a=e==null?void 0:e.unassociateElement)==null||a.call(e,this)}if(t){const e=i.getElementById(t);(c=e==null?void 0:e.associateElement)==null||c.call(e,this)}}}connectedCallback(){var n;const s=this.getAttribute(o.MEDIA_CONTROLLER);if(s){const t=i.getElementById(s);(n=t==null?void 0:t.associateElement)==null||n.call(t,this)}}disconnectedCallback(){var n;if(this.getAttribute(o.MEDIA_CONTROLLER)){const t=i.getElementById(mediaControllerId);(n=t==null?void 0:t.unassociateElement)==null||n.call(t,this)}}}h("media-text-display",d);export default d;
