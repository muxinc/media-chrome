import{MediaUIAttributes as r}from"./constants.js";import{defineCustomElement as b}from"./utils/defineCustomElement.js";import{Window as g,Document as a}from"./utils/server-safe-globals.js";const d=a.createElement("template");d.innerHTML=`
<style>
  :host {
    display: inline-block;
    width: auto;
    height: auto;
    vertical-align: middle;
    box-sizing: border-box;
    background-color: var(--media-control-background, rgba(20,20,30, 0.7));

    /* Default width and height can be overridden externally */
    padding: 10px;
    

    /* Vertically center any text */
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    text-align: center;

    transition: background-color 0.15s linear;

    pointer-events: auto;
    cursor: pointer;
    font-family: Arial, sans-serif;
    vertical-align: middle;
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
    background-color: var(--media-control-hover-background, rgba(50,50,70, 0.7));
  }

  svg, img, ::slotted(svg), ::slotted(img) {
    width: var(--media-button-icon-width, 24px);
    height: var(--media-button-icon-height);
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
    fill: var(--media-icon-color, #eee);
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
    min-height: 100%;
  }

  ::slotted(div), ::slotted(span) {
    height: 24px;
  }
</style>
`;const l=["Enter"," "];class h extends g.HTMLElement{static get observedAttributes(){return[r.MEDIA_CONTROLLER]}constructor(i={}){super();const n=this.attachShadow({mode:"open"}),e=d.content.cloneNode(!0);this.nativeEl=e;let o=i.slotTemplate;o||(o=a.createElement("template"),o.innerHTML=`<slot>${i.defaultContent||""}</slot>`),this.nativeEl.appendChild(o.content.cloneNode(!0)),n.appendChild(e),this.addEventListener("click",t=>{this.handleClick(t)});const s=t=>{const{key:c}=t;if(!l.includes(c)){this.removeEventListener("keyup",s);return}this.handleClick(t)};this.addEventListener("keydown",t=>{const{metaKey:c,altKey:u,key:m}=t;if(c||u||!l.includes(m)){this.removeEventListener("keyup",s);return}this.addEventListener("keyup",s)})}attributeChangedCallback(i,n,e){var o,s;if(i===r.MEDIA_CONTROLLER){if(n){const t=a.getElementById(n);(o=t==null?void 0:t.unassociateElement)==null||o.call(t,this)}if(e){const t=a.getElementById(e);(s=t==null?void 0:t.associateElement)==null||s.call(t,this)}}}connectedCallback(){var n;this.setAttribute("role","button"),this.setAttribute("tabindex",0);const i=this.getAttribute(r.MEDIA_CONTROLLER);if(i){const e=a.getElementById(i);(n=e==null?void 0:e.associateElement)==null||n.call(e,this)}}disconnectedCallback(){var n;if(this.getAttribute(r.MEDIA_CONTROLLER)){const e=a.getElementById(mediaControllerId);(n=e==null?void 0:e.unassociateElement)==null||n.call(e,this)}}handleClick(){}}b("media-chrome-button",h);export default h;
