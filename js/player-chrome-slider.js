import PlayerChromeElement from './player-chrome-element.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
input {
  width: 100%;
}
</style>
<input id="range" type="range" min="0" max="1000" step="1" value="0">
`;

class PlayerChromeSlider extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.range = this.shadowRoot.querySelector('#range');
  }
}

window.customElements.define('player-chrome-slider', PlayerChromeSlider);

export default PlayerChromeSlider;
