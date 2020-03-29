import PlayerChromeElement from './player-chrome-element.js';
import './player-chrome-menuitem.js';
import './player-chrome-submenu-menuitem.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      width: 100%;
      border: 1px solid #f00;
      background-color: #000;
    }
  </style>
  <slot></slot>
`;

class PlayerChromeMenu extends PlayerChromeElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  playerSetCallback(player) {}
}

if (!window.customElements.get('player-chrome-menu')) {
  window.customElements.define('player-chrome-menu', PlayerChromeMenu);
  window.PlayerChromeButton = PlayerChromeMenu;
}

export default PlayerChromeMenu;
