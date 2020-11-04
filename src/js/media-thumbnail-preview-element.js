import MediaChromeElement from './media-chrome-element.js';

// <media-thumbnail-preview player="" url="" time="0.00">
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      background-color: #000;
      width: 284px;
      height: 160px;
    }
  </style>
`;

class MediaThumbnailPreviewElement extends MediaChromeElement {
  static get observedAttributes() {
    return ['url', 'time'].concat(super.observedAttributes || []);
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set url(url) {
    const setImageURL = async (url) => {
      const response = await fetch(url, {});
      const data = await response.json();
      const urlObj = new URL(url);
      const thumbnailDir = urlObj.href.substr(0, urlObj.href.lastIndexOf('/')) + '/';

      console.log(data);
      this.data = data;
      this.style.backgroundImage = `url(${thumbnailDir}${data.url})`;
    };

    if (url) {
      setImageURL(url);
    }
  }

  get url() {
    return this.getAttribute('url');
  }

  set time(time) {
    // Hack to get this working, but need full URLs in the storyboard vtt
    let baseURL = 'http://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/';

    console.log('here', this.media)
    if (this.media && this.media.textTracks && this.media.textTracks.length > 0) {
      let track = Array.prototype.find.call(this.media.textTracks, (t)=>{
        return t.label == 'thumbnails';
      });

      console.log(track);

      if (!track) return;
      console.log(track.cues);

      let cue = Array.prototype.find.call(track.cues, c => time >= c.startTime);

      if (cue) {
        const url = new URL(cue.text, baseURL);
        console.log(url);

        // this.style.backgroundImage = `url(${baseURL}${cue.text})`;
        // this.style.backgroundPosition = `left ${tile.x}px top ${tile.y}px`;
      }
    }
  }

  get time() {
    return parseFloat(this.getAttribute('time'));
  }

  mediaSetCallback(media){
    console.log('mediaSet');
  }
}

if (!window.customElements.get('media-thumbnail-preview')) {
  window.customElements.define('media-thumbnail-preview', MediaThumbnailPreviewElement);
  window.MediaThumbnailPreviewElement = MediaThumbnailPreviewElement;
}

export default MediaThumbnailPreviewElement;
