import MediaChromeHTMLElement from './media-chrome-html-element.js';
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

class MediaDurationDisplay extends MediaChromeHTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('#container');
    this.update(0);
  }

  update(duration) {
    this.container.innerHTML = formatTime(duration);
  }

  mediaSetCallback(media) {
    media.addEventListener('durationchange', e => {
      this.update(media.duration);
    });
    this.update(media.duration);
  }

  mediaUnsetCallback() {
    this.update(0);
  }
}

defineCustomElement('media-duration-display', MediaDurationDisplay);

export default MediaDurationDisplay;
