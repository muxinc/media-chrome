import PlayerChromeElement from './player-chrome-element.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    display: inline-block;
    box-sizing: border-box;
    background-color: var(--player-chrome-control-background-color, transparent);
  }

  :host(:focus, :focus-within) {
    outline: 2px solid rgba(0,150,255, 0.33);
    outline-offset: -2px;
  }

  :host(:hover) {
    background: rgba(255,255,255, 0.10);
  }

  button {
    width: 100%;
    height: 100%;
    border: none;
    padding: 10px;
    margin: 0;
    text-decoration: none;
    background: transparent;
    color: #ffffff;
    font-family: sans-serif;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  button:hover {}
  button:focus {
    outline: 0;
  }
  button:active {}

  svg .icon {
    fill: var(--player-chrome-icon-color, #eee);
  }
</style>
<button id="icon-container">
  <slot></slot>
</button>
`;

class PlayerChromeButton extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.iconContainer = this.shadowRoot.querySelector('#icon-container');

    this.addEventListener('click', e => {
      this.onClick(e);
    });
  }

  onClick() {}

  set icon(svg) {
    this.iconContainer.innerHTML = svg;
  }
}

if (!window.customElements.get('player-chrome-button')) {
  window.customElements.define('player-chrome-button', PlayerChromeButton);
  window.PlayerChromeButton = PlayerChromeButton;
}

export default PlayerChromeButton;
