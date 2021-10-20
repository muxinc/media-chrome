import u from"./media-chrome-button.js";import{defineCustomElement as A}from"./utils/defineCustomElement.js";import{Window as h}from"./utils/server-safe-globals.js";import{MediaUIEvents as d,MediaUIAttributes as o}from"./constants.js";import{nouns as p}from"./labels/labels.js";const c=[1,1.25,1.5,1.75,2],r=1,l=document.createElement("template");l.innerHTML=`
  <style>
  :host {
    font-size: 14px;
    line-height: 24px;
    font-weight: bold;
  }

  #container {
    height: var(--media-text-content-height, 24px);
  }
  </style>

  <span id="container"></span>
`;class b extends u{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PLAYBACK_RATE,"rates"]}constructor(i={}){super({slotTemplate:l,...i});this._rates=c,this.container=this.shadowRoot.querySelector("#container"),this.container.innerHTML=`${r}x`}attributeChangedCallback(i,n,e){if(i==="rates"){const s=(e!=null?e:"").split(/,\s?/).map(t=>t?+t:Number.NaN).filter(t=>!Number.isNaN(t)).sort();this._rates=s.length?s:c;return}if(i===o.MEDIA_PLAYBACK_RATE){const s=e?+e:Number.NaN,t=Number.isNaN(s)?r:s;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",p.PLAYBACK_RATE({playbackRate:t}));return}super.attributeChangedCallback(i,n,e)}handleClick(i){var t,a;const n=+this.getAttribute(o.MEDIA_PLAYBACK_RATE)||r,e=(a=(t=this._rates.find(m=>m>n))!=null?t:this._rates[0])!=null?a:r,s=new h.CustomEvent(d.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(s)}}A("media-playback-rate-button",b);export default b;
