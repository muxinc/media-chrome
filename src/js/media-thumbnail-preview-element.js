import MediaChromeElement from './media-chrome-element.js';

// <media-thumbnail-preview player="" url="" time="0.00">
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      background-color: #000;
      width: 160px;
      height: 90px;
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
    const data = this.data;
    const tiles = data && data.tiles;

    if (!data || !tiles || !tiles.length) return;

    const lastTile = tiles[tiles.length-1];
    let tile;
    if (lastTile.start < time) {
      tile = lastTile;
    } else {
      tile = tiles.find(t => t.start > time);
    }

    this.style.backgroundPosition = `left ${tile.x}px top ${tile.y}px`;
  }

  get time() {
    return parseFloat(this.getAttribute('time'));
  }
}

if (!window.customElements.get('media-thumbnail-preview')) {
  window.customElements.define('media-thumbnail-preview', MediaThumbnailPreviewElement);
  window.MediaThumbnailPreviewElement = MediaThumbnailPreviewElement;
}

export default MediaThumbnailPreviewElement;
