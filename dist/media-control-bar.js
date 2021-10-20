import{MediaUIAttributes as n}from"./constants.js";import{defineCustomElement as m}from"./utils/defineCustomElement.js";import{Window as l,Document as i}from"./utils/server-safe-globals.js";const d=i.createElement("template");d.innerHTML=`
  <style>
    :host {
      /* Need position to display above video for some reason */
      box-sizing: border-box;
      display: inline-flex;

      color: var(--media-icon-color, #eee);
    }

    ::slotted(*), :host > * {
      flex-shrink: 1;
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-progress-range),
    ::slotted(media-clip-selector) {
      flex-grow: 1;
    }
  </style>

  <slot></slot>
`;class r extends l.HTMLElement{static get observedAttributes(){return[n.MEDIA_CONTROLLER]}constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(d.content.cloneNode(!0))}attributeChangedCallback(o,s,t){var a,c;if(o===n.MEDIA_CONTROLLER){if(s){const e=i.getElementById(s);(a=e==null?void 0:e.unassociateElement)==null||a.call(e,this)}if(t){const e=i.getElementById(t);(c=e==null?void 0:e.associateElement)==null||c.call(e,this)}}}connectedCallback(){var s;const o=this.getAttribute(n.MEDIA_CONTROLLER);if(o){const t=i.getElementById(o);(s=t==null?void 0:t.associateElement)==null||s.call(t,this)}}disconnectedCallback(){var s;if(this.getAttribute(n.MEDIA_CONTROLLER)){const t=i.getElementById(mediaControllerId);(s=t==null?void 0:t.unassociateElement)==null||s.call(t,this)}}}m("media-control-bar",r);export default r;
