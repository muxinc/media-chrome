import PlayerChromeElement from './player-chrome-element.js';
import PlayerChromeMenu from './player-chrome-menu.js';
import PlayerChromeMenuitem from './player-chrome-menuitem.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      position: absolute;
      width: 300px;
      height: auto;
      right: 5px;
      bottom: 45px;
      padding: 10px;
      border: 1px solid #333;
      color: #ccc;
      background-color: #000;
    }
  </style>
  <slot></slot>

  <!-- This is too much for a menu... -->

  <player-chrome-panel>
  <player-chrome-menu>
    <player-chrome-submenu-menuitem label="Playback speed" value="1.2">
    </player-chrome-submenu-menuitem>
    <player-chrome-menuitem>Hello1</player-chrome-menuitem>
    <player-chrome-menuitem>Hello1</player-chrome-menuitem>
    <player-chrome-menuitem>Hello1</player-chrome-menuitem>
    <player-chrome-menuitem>Hello1</player-chrome-menuitem>
  </player-chrome-menu>
  <player-chrome-menu slot="menu">
    <player-chrome-menuitem>Normal</player-chrome-menuitem>
    <player-chrome-menuitem>1.5</player-chrome-menuitem>
  </player-chrome-menu>
`;

class PlayerSettingsPopup extends PlayerChromeElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  playerSetCallback(player) {

  }

  playerUnsetCallback() {

  }
}

window.customElements.define('player-settings-popup', PlayerSettingsPopup);

export default PlayerSettingsPopup;
