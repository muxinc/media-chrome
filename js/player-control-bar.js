import PlayerChromeElement from './player-chrome-element.js';

import './player-play-button.js';
import './player-fullscreen-button.js';
import './player-pip-button.js';
import './player-progress-slider.js';
import './player-volume-slider.js';
import './player-mute-button.js';
import './player-forward-button.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      /* Need position to display above video for some reason */
      position: relative;
      box-sizing: border-box;
      display: flex;
      background-color: #111;

      width: 100%;
      color: var(--player-chrome-icon-color, #eee);
      background: rgba(20,20,30, 0.7);
    }

    ::slotted(*), :host > * {
      position: relative;
      padding: 10px;
      /* flex-basis: 0; */
    }

    player-progress-slider,
    ::slotted(player-progress-slider) {
      flex-grow: 1;
    }

    player-volume-slider,
    ::slotted(player-volume-slider) {
      width: 80px;
    }
  </style>
  <slot></slot>
`;

const controlsTemplate = document.createElement('template');

controlsTemplate.innerHTML = `
  <player-play-button>Play</player-play-button>
  <player-mute-button>Mute</player-mute-button>
  <player-volume-slider>Volume</player-volume-slider>
  <player-progress-slider>Progress</player-progress-slider>
  <player-fullscreen-button>Fullscreen</player-fullscreen-button>
  <player-pip-button>PIP</player-pip-button>
`;

class PlayerControlBar extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.attributes['controls']) {
      this.shadowRoot.appendChild(controlsTemplate.content.cloneNode(true));
    }
  }
}

window.customElements.define('player-control-bar', PlayerControlBar);

export default PlayerControlBar;
