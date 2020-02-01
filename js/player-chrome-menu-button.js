import PlayerChromeButton from './player-chrome-button.js';
import './player-chrome-menuitem.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
  #menuPositioner {
    position: absolute;
    display: flex;

    border: 1px solid #f00;

    /* Align menu top and centered */
    top: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  #menuContainer {
    display: none;
    position: absolute;
    bottom: 0;
    align: center;
    margin-bottom: 20px;

    border: 1px solid #999;
    background-color: #111;
  }

  slot[name=menu] {

  }
</style>

<div id="menuPositioner">
  <div id="menuContainer">
    <slot name="menu"></slot>
  </div>
</div>
`;

class PlayerChromeMenuButton extends PlayerChromeButton {
  constructor() {
    super();
    this.shadowRoot.prepend(template.content.cloneNode(true));
    this.menuContainer = this.shadowRoot.querySelector('#menuContainer');

    if (this.attributes.expanded) {
      this.menuContainer.style.display = 'flex';
    }
  }

  onClick(e) {
    if (this.attributes.expanded) {
      this.removeAttribute('expanded');
      this.menuContainer.style.display = 'none';
    } else {
      this.setAttribute('expanded', 'expanded');
      this.menuContainer.style.display = 'flex';
    }
  }

  playerSetCallback(player) {}
}

window.customElements.define(
  'player-chrome-menu-button',
  PlayerChromeMenuButton
);

export default PlayerChromeMenuButton;
