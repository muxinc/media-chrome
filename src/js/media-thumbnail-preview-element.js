/*
  <media-thumbnail-preview media="#myVideo" time="10.00">

  Uses the "thumbnails" track of a video element to show an image relative to
  the video time given in the `time` attribute.
*/
import MediaChromeElement from './media-chrome-element.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      background-color: #000;
      width: 284px;
      height: 160px;
      overflow: hidden;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
    }
  </style>
  <img crossorigin loading="eager" decoding="async" />
`;

class MediaThumbnailPreviewElement extends MediaChromeElement {
  static get observedAttributes() {
    return ['time'].concat(super.observedAttributes || []);
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set time(time) {
    if (this.media && this.media.textTracks && this.media.textTracks.length) {
      let track = Array.prototype.find.call(this.media.textTracks, (t)=>{
        return t.label == 'thumbnails';
      });

      if (!track) return;

      let cue = Array.prototype.find.call(track.cues, c => c.startTime >= time);

      if (cue) {
        const url = new URL(cue.text);
        const [x,y,w,h] = url.hash.split('=')[1].split(',');
        const img = this.shadowRoot.querySelector('img');
        const src = url.origin + url.pathname;
        const scale = this.offsetWidth / w;

        const resize = () => {
          img.style.width = `${scale * img.naturalWidth}px`;
          img.style.height = `${scale * img.naturalHeight}px`;
        };

        if (img.src !== src) {
          img.onload = resize;
          img.src = src;
          resize();
        }

        resize();
        img.style.left = `-${scale * x}px`;
        img.style.top = `-${scale * y}px`;
        // this.style.backgroundImage = `url(${url.origin + url.pathname})`;
        // this.style.backgroundPosition = `left ${x}px top ${y}px`;
      }
    }
  }

  get time() {
    return parseFloat(this.getAttribute('time'));
  }

  mediaSetCallback(media){
    const trackList = media && media.textTracks;

    if (!trackList || !trackList.addEventListener) return;

    // Create a bound, removeable function for track changes
    this._trackChangeHandler = (evt) => {
      for (let i = 0; i < trackList.length; i++) {
        let track = trackList[i];
        if (track.label === 'thumbnails') {
          // Prime the image when a track is added
          if (!this.time) this.time = 0;
        }
      }
    };

    trackList.addEventListener('addtrack', this._trackChangeHandler, false);
    this._trackChangeHandler();
  }

  mediaUnsetCallback(media) {
    const trackList = media && media.textTracks;

    if (trackList && trackList.removeEventListener) {
      trackList.removeEventListener('addtrack', this._trackChangeHandler);
    }
  }

  // set url(url) {
  //   const setImageURL = async (url) => {
  //     const response = await fetch(url, {});
  //     const data = await response.json();
  //     const urlObj = new URL(url);
  //     const thumbnailDir = urlObj.href.substr(0, urlObj.href.lastIndexOf('/')) + '/';
  //
  //     console.log(data);
  //     this.data = data;
  //     this.style.backgroundImage = `url(${thumbnailDir}${data.url})`;
  //   };
  //
  //   if (url) {
  //     setImageURL(url);
  //   }
  // }
  //
  // get url() {
  //   return this.getAttribute('url');
  // }
}

if (!window.customElements.get('media-thumbnail-preview')) {
  window.customElements.define('media-thumbnail-preview', MediaThumbnailPreviewElement);
  window.MediaThumbnailPreviewElement = MediaThumbnailPreviewElement;
}

export default MediaThumbnailPreviewElement;
