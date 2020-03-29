import PlayerChromeElement from './player-chrome-element.js';

import './player-play-button.js';
import './player-fullscreen-button.js';
import './player-pip-button.js';
import './player-progress-range.js';
import './player-volume-range.js';
import './player-mute-button.js';
import './player-forward-button.js';
import './player-replay-button.js';
import './player-current-time-display.js';
import './player-duration-display.js';
import './player-chrome-menu-button.js';
import './player-chrome-menu.js';
import './player-settings-popup.js';
import './player-chrome-popup.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      /* Need position to display above video for some reason */
      position: relative;
      box-sizing: border-box;
      display: flex;

      /* All putting the progress range at full width on other lines */
      flex-wrap: wrap;

      width: 100%;
      color: var(--player-chrome-icon-color, #eee);

      background-color: var(--player-chrome-control-bar-background, rgba(20,20,30, 0.7));
    }

    ::slotted(*), :host > * {
      /* position: relative; */
    }

    player-progress-range,
    ::slotted(player-progress-range) {
      flex-grow: 1;
    }

    player-volume-range,
    ::slotted(player-volume-range) {
      width: 80px;
    }
  </style>

  <slot></slot>
`;

const controlsTemplate = document.createElement('template');

/*
Before this can work, the player needs to propogate from the control bar
to shadow dom children. Player-chrome can't do that automatically, it
has to be the control bar (or player-chrome-element).
Probably could just kill this feature and wait until we know there's value.
Let all custom controls happen at the player-chrome level.
*/
controlsTemplate.innerHTML = `
  <player-play-button>Play</player-play-button>
  <player-mute-button>Mute</player-mute-button>
  <player-volume-range>Volume</player-volume-range>
  <player-progress-range>Progress</player-progress-range>
  <player-pip-button>PIP</player-pip-button>
  <player-fullscreen-button>Fullscreen</player-fullscreen-button>
`;

class PlayerControlBar extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.attributes['defaultControls']) {
      this.shadowRoot.appendChild(controlsTemplate.content.cloneNode(true));
    }
  }
}

window.customElements.define('player-control-bar', PlayerControlBar);

export default PlayerControlBar;
