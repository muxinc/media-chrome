import PlayerChromeElement from './player-chrome-element.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      position: absolute;
      width: 300px;
      height: 200px;
      padding: 10px;
      border: 1px solid #333;
      color: #fff;
      background-color: #000;
    }
  </style>
  <slot></slot>
`;

class PlayerChromePopup extends PlayerChromeElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  playerSetCallback(player) {

  }

  playerUnsetCallback() {

  }
}

window.customElements.define('player-chrome-popup', PlayerChromePopup);

export default PlayerChromePopup;
