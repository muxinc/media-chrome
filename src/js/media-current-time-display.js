import MediaChromeElement from './media-chrome-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;

      background-color: transparent;

      /* Default width and height can be overridden externally */
      height: 44px;

      box-sizing: border-box;
      padding: 0 5px;

      /* Min icon size is 24x24 */
      min-height: 24px;
      min-width: 24px;

      /* Vertically center any text */
      font-size: 16px;
      line-height: 24px;
      font-family: sans-serif;
      text-align: center;
      color: #ffffff;
    }

    #container {}
  </style>
  <div id="container"></div>
`;

class MediaCurrentTimeDisplay extends MediaChromeElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('#container');
    this.update(6000);
  }

  update(time) {
    this.container.innerHTML = formatTime(time);
  }

  mediaSetCallback(media) {
    media.addEventListener('timeupdate', e => {
      this.update(media.currentTime);
    });
    this.update(media.currentTime);
  }

  mediaUnsetCallback() {
    this.update(0);
  }
}

defineCustomElement('media-current-time-display', MediaCurrentTimeDisplay);

export default MediaCurrentTimeDisplay;
