import videojs from 'video.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import styles from './video-js-styles.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
  ${styles}

  div.video-js {
    width: 100%;
    height: 100%;
  }
  </style>

  <video class="video-js" controls id="my-player"
    preload="auto">
   <source src="http://localhost:8000/fhqwhgads.mp4" />
  </video>
`;

class VideoJSElement extends HTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.videoEl = this.shadowRoot.querySelector('video');
  }

  connectedCallback() {
    videojs(this.videoEl);
  }
}

defineCustomElement('video-js', VideoJSElement);

export default VideoJSElement;
