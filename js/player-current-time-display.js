import PlayerChromeElement from './player-chrome-element.js';
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

class PlayerCurrentTimeDisplay extends PlayerChromeElement {
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

  playerSetCallback(player) {
    player.addEventListener('timeupdate', e => {
      this.update(player.currentTime);
    });
    this.update(player.currentTime);
  }

  playerUnsetCallback() {
    this.update(0);
  }
}

window.customElements.define(
  'player-current-time-display',
  PlayerCurrentTimeDisplay
);

export default PlayerCurrentTimeDisplay;
