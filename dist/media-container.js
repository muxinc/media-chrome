import{defineCustomElement as b}from"./utils/defineCustomElement.js";import{Window as o,Document as f}from"./utils/server-safe-globals.js";import{MediaUIEvents as u,MediaUIAttributes as c}from"./constants.js";import{nouns as m}from"./labels/labels.js";const h=f.createElement("template");h.innerHTML=`
  <style>
    :host {
      box-sizing: border-box;
      position: relative;
      display: inline-block;

      /* Max out at 100% width for smaller screens (< 720px) */
      // max-width: 100%;
      background-color: #000;
    }

    *[part~=layer] {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: stretch;
      pointer-events: none;
      background: none;
    }

    *[part~=gestures-layer] {
      pointer-events: auto;
    }

    ::slotted([slot=controls-overlay]) {
      flex-grow: 1;
      display: flex; 
      flex-flow: row nowrap; 
      align-items: center; 
      justify-content: space-evenly;
    }

    .spacer {
      flex-grow: 1;
      pointer-events: none;
      background: none;
    }

    /* Position the media element to fill the container */
    ::slotted([slot=media]) {
      margin: auto 0 auto 0;
      width: 100%;
    }

    /* Video specific styles */
    :host(:not([audio])) {
      aspect-ratio: var(--media-aspect-ratio, auto 3 / 2);
      width: 720px;
    }

    @supports not (aspect-ratio: 1 / 1) {
      :host(:not([audio])) {
        height: 480px;
      }
    }

    /* Safari needs this to actually make the element fill the window */
    :host(:-webkit-full-screen) {
      /* Needs to use !important otherwise easy to break */
      width: 100% !important;
      height: 100% !important;
    }

    /* Hide controls when inactive and not paused and not audio */
    slot:not([media]) ::slotted() {
      opacity: 1;
      transition: opacity 0.25s;
      visibility: visible;
      pointer-events: auto;
    }

    :host([user-inactive]:not([${c.MEDIA_PAUSED}]):not([audio])) slot:not([media]) ::slotted(*) {
      opacity: 0;
      transition: opacity 1s;
    }
  </style>

  <span part="layer media-layer">
    <slot name="media"></slot>
  </span>
  <span part="layer gesture-layer">
    <slot name="gestures-overlay"></slot>
  </span>
  <!--
  <span part="layer text-tracks-layer">
    <slot name="text-tracks-renderer"></slot>
  </span>
  -->
  <span part="layer controls-overlay-layer">
    <slot name="controls-overlay"></slot>
  </span>
  <span part="layer controls-layer">
    <slot name="top-controls"></slot>
    <span class="spacer centered"><slot name="middle-controls"></slot></span>
    <!-- default, effectively "bottom-controls" -->
    <slot></slot>
  </span>
  <slot name="custom-chrome"></slot>
`;const v=Object.values(c);class p extends o.HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"});this.shadowRoot.appendChild(h.content.cloneNode(!0));const i=(t,g)=>{const l=this.media;for(let a of t)a.type==="childList"&&(a.removedNodes.forEach(n=>{if(n.slot=="media"&&a.target==this){let r=a.previousSibling&&a.previousSibling.previousElementSibling;if(!r||!l)this.mediaUnsetCallback(n);else{let d=r.slot!=="media";for(;(r=r.previousSibling)!==null;)r.slot=="media"&&(d=!1);d&&this.mediaUnsetCallback(n)}}}),l&&a.addedNodes.forEach(n=>{n==l&&this.mediaSetCallback(n)}))};new MutationObserver(i).observe(this,{childList:!0,subtree:!0})}static get observedAttributes(){return["autohide"].concat(v)}attributeChangedCallback(e,i,s){e.toLowerCase()=="autohide"&&(this.autohide=s)}get media(){let e=this.querySelector(":scope > [slot=media]");return e.nodeName=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}mediaSetCallback(e){if(!e||!e.play)return console.error('<media-chrome>: Media element set with slot="media" does not appear to be compatible.',e),!1;const i=e.nodeName.toLowerCase();return i.includes("-")&&!o.customElements.get(i)?(o.customElements.whenDefined(i).then(()=>{this.mediaSetCallback(e)}),!1):(this._mediaClickPlayToggle=s=>{const t=e.paused?u.MEDIA_PLAY_REQUEST:u.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new o.CustomEvent(t,{composed:!0,bubbles:!0}))},!0)}mediaUnsetCallback(e){}connectedCallback(){const i=this.getAttribute("audio")!=null?m.AUDIO_PLAYER():m.VIDEO_PLAYER();this.setAttribute("role","region"),this.setAttribute("aria-label",i),this.media&&this.mediaSetCallback(this.media);const s=()=>{this.removeAttribute("user-inactive"),o.clearTimeout(this.inactiveTimeout),!(this.autohide<0)&&(this.inactiveTimeout=o.setTimeout(()=>{this.setAttribute("user-inactive","user-inactive")},this.autohide*1e3))};this.addEventListener("keyup",t=>{s()}),this.addEventListener("keyup",t=>{this.setAttribute("media-keyboard-control","media-keyboard-control")}),this.addEventListener("mouseup",t=>{this.removeAttribute("media-keyboard-control")}),this.addEventListener("mousemove",t=>{t.target!==this&&(this.removeAttribute("user-inactive"),o.clearTimeout(this.inactiveTimeout),t.target===this.media&&s())}),this.addEventListener("mouseout",t=>{this.autohide>-1&&this.setAttribute("user-inactive","user-inactive")})}set autohide(e){e=Number(e),this._autohide=isNaN(e)?0:e}get autohide(){return this._autohide===void 0?2:this._autohide}}b("media-container-temp",p);export default p;
