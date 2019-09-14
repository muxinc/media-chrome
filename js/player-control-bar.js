import PlayerChromeElement from './player-chrome-element.js';

import './player-play-button.js';
import './player-fullscreen-button.js';
import './player-pip-button.js';
import './player-progress-slider.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
div {
  /* Need position to display above video for some reason */
  position: relative;
  box-sizing: border-box;
  display: flex;
  background-color: #330;
  width: 100%;
}

::slotted(*), div > * {
  position: relative;
  padding: 10px;
  border: 1px solid #eee;
  background-color: #900;
  color: #777;
}
</style>
<div>
  <!-- <player-play-button>Play 2</player-play-button> -->
  <slot></slot>
</div>
`;

class PlayerControlBar extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('player-control-bar', PlayerControlBar);

export default PlayerControlBar;
