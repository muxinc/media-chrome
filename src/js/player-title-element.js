import PlayerChromeElement from './player-chrome-element.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {

    }
  </style>

  <slot></slot>
`;


class PlayerTitleBar extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!window.customElements.get('player-title-bar')) {
  window.customElements.define('player-title-bar', PlayerTitleBar);
  window.PlayerChrome = PlayerTitleBar;
}

export default PlayerTitleBar;
