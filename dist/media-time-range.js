import I from"./media-chrome-range.js";import{defineCustomElement as M}from"./utils/defineCustomElement.js";import{Window as s,Document as C}from"./utils/server-safe-globals.js";import{MediaUIEvents as h,MediaUIAttributes as n}from"./constants.js";import{nouns as w}from"./labels/labels.js";import{formatAsTimePhrase as c}from"./utils/time.js";const T="video not loaded, unknown time.",f=d=>{const e=d.range,t=c(+e.value),i=c(+e.max),l=t&&i?`${t} of ${i}`:T;e.setAttribute("aria-valuetext",l)},b=C.createElement("template");b.innerHTML=`
  <style>
    #thumbnailContainer {
      display: none;
      position: absolute;
      top: 0;
    }

    media-thumbnail-preview {
      position: absolute;
      bottom: 10px;
      border: 2px solid #fff;
      border-radius: 2px;
      background-color: #000;
      width: 160px;
      height: 90px;

      /* Negative offset of half to center on the handle */
      margin-left: -80px;
    }

    /* Can't get this working. Trying a downward triangle. */
    /* media-thumbnail-preview::after {
      content: "";
      display: block;
      width: 300px;
      height: 300px;
      margin: 100px;
      background-color: #ff0;
    } */

    :host([${n.MEDIA_PREVIEW_IMAGE}]:hover) #thumbnailContainer {
      display: block;
      animation: fadeIn ease 0.5s;
    }

    @keyframes fadeIn {
      0% {
        /* transform-origin: bottom center; */
        /* transform: scale(0.7); */
        margin-top: 10px;
        opacity: 0;
      }
      100% {
        /* transform-origin: bottom center; */
        /* transform: scale(1); */
        margin-top: 0;
        opacity: 1;
      }
    }
  </style>
  <div id="thumbnailContainer">
    <media-thumbnail-preview></media-thumbnail-preview>
  </div>
`;class p extends I{static get observedAttributes(){return[...super.observedAttributes,"thumbnails",n.MEDIA_DURATION,n.MEDIA_CURRENT_TIME,n.MEDIA_PREVIEW_IMAGE]}constructor(){super();this.shadowRoot.appendChild(b.content.cloneNode(!0)),this.range.addEventListener("input",()=>{const t=this.range.value,i=new s.CustomEvent(h.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t});this.dispatchEvent(i)}),this.enableThumbnails()}connectedCallback(){this.range.setAttribute("aria-label",w.SEEK()),super.connectedCallback()}attributeChangedCallback(e,t,i){e===n.MEDIA_CURRENT_TIME&&(this.range.value=+i,f(this),this.updateBar()),e===n.MEDIA_DURATION&&(this.range.max=+i,f(this),this.updateBar()),super.attributeChangedCallback(e,t,i)}getBarColors(){let e=super.getBarColors();if(!this.mediaBuffered||!this.mediaBuffered.length||this.mediaDuration<=0)return e;const t=this.mediaBuffered,i=t[t.length-1][1]/this.mediaDuration*100;return e.splice(1,0,["var(--media-time-buffered-color, #777)",i]),e}enableThumbnails(){this.thumbnailPreview=this.shadowRoot.querySelector("media-thumbnail-preview"),this.shadowRoot.querySelector("#thumbnailContainer").classList.add("enabled");let t;const i=()=>{t=u=>{const r=+this.getAttribute(n.MEDIA_DURATION);if(!r)return;const a=this.range.getBoundingClientRect();let o=(u.clientX-a.left)/a.width;o=Math.max(0,Math.min(1,o));const E=a.left-this.getBoundingClientRect().left+o*a.width;this.thumbnailPreview.style.left=`${E}px`;const v=o*r,A=new s.CustomEvent(h.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:v});this.dispatchEvent(A)},s.addEventListener("mousemove",t,!1)},l=()=>{s.removeEventListener("mousemove",t)};let m=!1,g=u=>{const r=this.getAttribute(n.MEDIA_DURATION);if(!m&&r){m=!0,i();let a=o=>{o.target!=this&&!this.contains(o.target)&&(s.removeEventListener("mousemove",a),m=!1,l())};s.addEventListener("mousemove",a,!1)}};this.addEventListener("mousemove",g,!1)}}M("media-time-range",p);export default p;
