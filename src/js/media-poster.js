// IN PROGRESS

import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  #poster {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: #000;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    transition: opacity 0.2s ease;
    opacity: 1;
  }

  #poster.hidden {
    display: none;
    opacity: 0;
  }
</style>
<div id="poster"></div>
`;

class MediaPoster extends MediaChromeHTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListener('click', e => {
      this.onClick(e);
    });
  }

  mediaSetCallback(media) {
    media.addEventListener('play', () => {
      this.hide();
    });
  }

  onClick() {
    const media = this.media;

    if (media) {
      media.play();
    }
  }

  set src(url) {
    this.shadowRoot.querySelector('#poster').style.backgroundImage = `url(${url})`;
  }

  get src() {
    const val = this.shadowRoot.querySelector('#poster').style.backgroundImage;

    if (!val || val === 'none') {
      return null;
    } else {
      // strip 'url()' from value
      return val.substr(4, val.length - 5);
    }
  }

  show() {
    this.shadowRoot.querySelector('#poster').className = '';
  }

  hide() {
    this.shadowRoot.querySelector('#poster').className = 'hidden';
  }
}

defineCustomElement('media-poster', MediaPoster);

export default MediaPoster;
