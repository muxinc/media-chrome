import{defineCustomElement as w}from"../../utils/defineCustomElement.js";import{Window as s,Document as C}from"../../utils/server-safe-globals.js";import{MediaUIEvents as u,MediaUIAttributes as c}from"../../constants.js";const f=C.createElement("template"),v=8,m={"100":100,"200":200,"300":300};function o(p){return Math.max(0,Math.min(1,p))}f.innerHTML=`
  <style>
    #selectorContainer {
      background-color: transparent;
      height: 44px;
      width: 100%;
      display: flex;
      position: relative;
    }

    #timeline {
      width: 100%;
      height: 10px;
      background: #ccc;
      position: absolute;
      top: 16px;
      z-index: ${m["100"]};
    }

    #startHandle, #endHandle {
      cursor: pointer;
      height: 80%;
      width: ${v}px;
      border-radius: 4px;
      background-color: royalblue;
    }

    #playhead {
      height: 100%;
      width: 3px;
      background-color: #aaa;
      position: absolute;
      display: none;
      z-index: ${m["300"]};
    }

    #selection {
      display: flex;
      z-index: ${m["200"]};
      width: 25%;
      height: 100%;
      align-items: center;
    }

    #leftTrim {
      width: 25%;
    }

    #spacer {
      flex: 1;
      background-color: cornflowerblue;
      height: 40%;
    }

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

    :host(:hover) #thumbnailContainer.enabled {
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
  <div id="selectorContainer">
    <div id="timeline"></div>
    <div id="playhead"></div>
    <div id="leftTrim"></div>
    <div id="selection">
      <div id="startHandle"></div>
      <div id="spacer"></div>
      <div id="endHandle"></div>
    </div>
  </div>
`;class E extends s.HTMLElement{static get observedAttributes(){return["thumbnails",c.MEDIA_DURATION,c.MEDIA_CURRENT_TIME]}constructor(){super();const t=this.attachShadow({mode:"open"});this.shadowRoot.appendChild(f.content.cloneNode(!0)),this.draggingEl=null,this.wrapper=this.shadowRoot.querySelector("#selectorContainer"),this.selection=this.shadowRoot.querySelector("#selection"),this.playhead=this.shadowRoot.querySelector("#playhead"),this.leftTrim=this.shadowRoot.querySelector("#leftTrim"),this.spacerFirst=this.shadowRoot.querySelector("#spacerFirst"),this.startHandle=this.shadowRoot.querySelector("#startHandle"),this.spacerMiddle=this.shadowRoot.querySelector("#spacerMiddle"),this.endHandle=this.shadowRoot.querySelector("#endHandle"),this.spacerLast=this.shadowRoot.querySelector("#spacerLast"),this._clickHandler=this.handleClick.bind(this),this._dragStart=this.dragStart.bind(this),this._dragEnd=this.dragEnd.bind(this),this._drag=this.drag.bind(this),this.wrapper.addEventListener("click",this._clickHandler,!1),this.wrapper.addEventListener("touchstart",this._dragStart,!1),s.addEventListener("touchend",this._dragEnd,!1),this.wrapper.addEventListener("touchmove",this._drag,!1),this.wrapper.addEventListener("mousedown",this._dragStart,!1),s.addEventListener("mouseup",this._dragEnd,!1),s.addEventListener("mousemove",this._drag,!1),this.enableThumbnails()}get mediaDuration(){return+this.getAttribute(c.MEDIA_DURATION)}get mediaCurrentTime(){return+this.getAttribute(c.MEDIA_CURRENT_TIME)}getPlayheadBasedOnMouseEvent(t){const e=this.mediaDuration;return e?o(this.getMousePercent(t))*e:void 0}getXPositionFromMouse(t){let e;return["touchstart","touchmove"].includes(t.type)&&(e=t.touches[0].clientX),e||t.clientX}getMousePercent(t){const e=this.wrapper.getBoundingClientRect(),i=(this.getXPositionFromMouse(t)-e.left)/e.width;return o(i)}dragStart(t){t.target===this.startHandle&&(this.draggingEl=this.startHandle),t.target===this.endHandle&&(this.draggingEl=this.endHandle),this.initialX=this.getXPositionFromMouse(t)}dragEnd(t){this.initialX=null,this.draggingEl=null}setSelectionWidth(t,e){let i=t;const a=v*3,n=o(a/e);i<n&&(i=n),this.selection.style.width=`${i*100}%`}drag(t){if(!this.draggingEl)return;t.preventDefault();const i=this.wrapper.getBoundingClientRect().width,n=this.getXPositionFromMouse(t)-this.initialX,d=this.getMousePercent(t),l=this.selection.getBoundingClientRect().width;if(this.draggingEl===this.startHandle){this.initialX=this.getXPositionFromMouse(t),this.leftTrim.style.width=`${d*100}%`;const r=o((l-n)/i);this.setSelectionWidth(r,i)}if(this.draggingEl===this.endHandle){this.initialX=this.getXPositionFromMouse(t);const r=o((l+n)/i);this.setSelectionWidth(r,i)}this.dispatchUpdate()}dispatchUpdate(){const t=new CustomEvent("update",{detail:this.getCurrentClipBounds()});this.dispatchEvent(t)}getCurrentClipBounds(){const t=this.wrapper.getBoundingClientRect(),e=this.leftTrim.getBoundingClientRect(),i=this.selection.getBoundingClientRect(),a=o(e.width/t.width),n=o((e.width+i.width)/t.width);return{startTime:Math.round(a*this.mediaDuration),endTime:Math.round(n*this.mediaDuration)}}isTimestampInBounds(t){const{startTime:e,endTime:i}=this.getCurrentClipBounds();return e<=t&&i>=t}handleClick(t){const i=this.getMousePercent(t)*this.mediaDuration;this.isTimestampInBounds(i)&&this.dispatchEvent(new s.CustomEvent(u.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:i}))}mediaCurrentTimeSet(t){const e=o(this.mediaCurrentTime/this.mediaDuration),i=this.wrapper.getBoundingClientRect().width,a=e*i;if(this.playhead.style.left=`${e*100}%`,this.playhead.style.display="block",!this.mediaPaused){const{startTime:n,endTime:d}=this.getCurrentClipBounds();(this.mediaCurrentTime<n||this.mediaCurrentTime>d)&&this.dispatchEvent(new s.CustomEvent(u.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:n}))}}mediaUnsetCallback(t){super.mediaUnsetCallback(t),this.wrapper.removeEventListener("touchstart",this._dragStart),this.wrapper.removeEventListener("touchend",this._dragEnd),this.wrapper.removeEventListener("touchmove",this._drag),this.wrapper.removeEventListener("mousedown",this._dragStart),s.removeEventListener("mouseup",this._dragEnd),s.removeEventListener("mousemove",this._drag)}enableThumbnails(){this.thumbnailPreview=this.shadowRoot.querySelector("media-thumbnail-preview"),this.shadowRoot.querySelector("#thumbnailContainer").classList.add("enabled");let e;const i=()=>{e=l=>{const r=this.mediaDuration;if(!r)return;const h=this.wrapper.getBoundingClientRect(),g=this.getMousePercent(l),b=h.left-this.getBoundingClientRect().left+g*h.width;this.thumbnailPreview.style.left=`${b}px`,this.dispatchEvent(new s.CustomEvent(u.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:g*r}))},s.addEventListener("mousemove",e,!1)},a=()=>{s.removeEventListener("mousemove",e)};let n=!1,d=l=>{if(!n&&this.mediaDuration){n=!0,this.thumbnailPreview.style.display="block",i();let r=h=>{h.target!=this&&!this.contains(h.target)&&(this.thumbnailPreview.style.display="none",s.removeEventListener("mousemove",r),n=!1,a())};s.addEventListener("mousemove",r,!1)}this.mediaDuration||(this.thumbnailPreview.style.display="none")};this.addEventListener("mousemove",d,!1)}disableThumbnails(){thumbnailContainer.classList.remove("enabled")}}w("media-clip-selector",E);export default E;
