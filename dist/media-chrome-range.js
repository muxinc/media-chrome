import{MediaUIAttributes as o}from"./constants.js";import{defineCustomElement as g}from"./utils/defineCustomElement.js";import{Window as b,Document as i}from"./utils/server-safe-globals.js";const c=i.createElement("template"),h=`
  height: var(--thumb-height);
  width: var(--media-range-thumb-width, 10px);
  border: var(--media-range-thumb-border, none);
  border-radius: var(--media-range-thumb-border-radius, 10px);
  background: var(--media-range-thumb-background, #fff);
  box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
  cursor: pointer;
  transition: var(--media-range-thumb-transition, none);
  transform: var(--media-range-thumb-transform, none);
  opacity: var(--media-range-thumb-opacity, 1);
`,s=`
  width: var(--media-range-track-width, 100%);
  min-width: 40px;
  height: var(--track-height);
  border: var(--media-range-track-border, none);
  border-radius: var(--media-range-track-border-radius, 0);
  background: var(--media-range-track-background-internal, --media-range-track-background, #eee);

  box-shadow: var(--media-range-track-box-shadow, none);
  transition: var(--media-range-track-transition, none);
  cursor: pointer;
`;c.innerHTML=`
  <style>
    :host {
      --thumb-height: var(--media-range-thumb-height, 10px);
      --track-height: var(--media-range-track-height, 4px);

      position: relative;
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      background-color: var(--media-control-background, rgba(20,20,30, 0.7));
      transition: background-color 0.15s linear;
      height: 44px;
      width: 100px;
      padding: 0 10px;

      pointer-events: auto;
    }

    /*
      Only show outline when keyboard focusing.
      https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
    */
    :host-context([media-keyboard-control]):host(:focus),
    :host-context([media-keyboard-control]):host(:focus-within) {
      box-shadow: inset 0 0 0 2px rgba(27, 127, 204, 0.9);
    }

    :host(:hover) {
      background-color: var(--media-control-hover-background, rgba(50,50,60, 0.7));
    }

    input[type=range] {
      /* Reset */
      -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
      background: transparent; /* Otherwise white in Chrome */

      /* Fill host with the range */
      min-height: 100%;
      width: var(--media-range-track-width, 100%); /* Specific width is required for Firefox. */

      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    /* Special styling for WebKit/Blink */
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      ${h}
      /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
      margin-top: calc(calc(0px - var(--thumb-height) + var(--track-height)) / 2);
    }
    input[type=range]::-moz-range-thumb { ${h} }

    input[type=range]::-webkit-slider-runnable-track { ${s} }
    input[type=range]::-moz-range-track { ${s} }
    input[type=range]::-ms-track {
      /* Reset */
      width: 100%;
      cursor: pointer;
      /* Hides the slider so custom styles can be added */
      background: transparent;
      border-color: transparent;
      color: transparent;

      ${s}
    }

    /* Eventually want to move towards different styles for focus-visible
       https://github.com/WICG/focus-visible/blob/master/src/focus-visible.js
       Youtube appears to do this by de-focusing a button after a button click */
    input[type=range]:focus {
      outline: 0;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      outline: 0;
    }

    input[type=range]:disabled::-webkit-slider-thumb {
      background-color: #777;
    }

    input[type=range]:disabled::-webkit-slider-runnable-track {
      background-color: #777;
    }

  </style>
  <input id="range" type="range" min="0" max="1000" step="1" value="0">
`;class u extends b.HTMLElement{static get observedAttributes(){return[o.MEDIA_CONTROLLER]}constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(c.content.cloneNode(!0)),this.range=this.shadowRoot.querySelector("#range"),this.range.setAttribute("aria-live","polite"),this.range.addEventListener("input",this.updateBar.bind(this))}attributeChangedCallback(a,t,e){var n,d;if(a===o.MEDIA_CONTROLLER){if(t){const r=i.getElementById(t);(n=r==null?void 0:r.unassociateElement)==null||n.call(r,this)}if(e){const r=i.getElementById(e);(d=r==null?void 0:r.associateElement)==null||d.call(r,this)}}}connectedCallback(){var t;const a=this.getAttribute(o.MEDIA_CONTROLLER);if(a){const e=i.getElementById(a);(t=e==null?void 0:e.associateElement)==null||t.call(e,this)}this.updateBar()}disconnectedCallback(){var t;if(this.getAttribute(o.MEDIA_CONTROLLER)){const e=i.getElementById(mediaControllerId);(t=e==null?void 0:e.unassociateElement)==null||t.call(e,this)}}updateBar(){const a=this.getBarColors();let t="linear-gradient(to right, ",e=0;a.forEach(n=>{n[1]<e||(t=t+`${n[0]} ${e}%, ${n[0]} ${n[1]}%,`,e=n[1])}),t=t.slice(0,t.length-1)+")",this.style.setProperty("--media-range-track-background-internal",t)}getBarColors(){const a=this.range,t=a.value/a.max*100;return[["var(--media-range-bar-color, #fff)",t],["var(--media-range-track-background, #333)",100]]}}g("media-chrome-range",u);export default u;
