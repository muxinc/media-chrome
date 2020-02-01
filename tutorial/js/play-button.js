// Create teh template
const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    /* position: relative;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    background-color: transparent; */

    /* Default width and height can be overridden externally */
    /* height: 44px;
    width: 44px; */

    /* Vertically center any text */
    /* font-size: 16px;
    line-height: 24px; */

    /* Min icon size is 24x24 */
    /* min-height: 24px;
    min-width: 24px; */
  }

  /* :host(:focus, :focus-within) {
    outline: 2px solid rgba(0,150,255, 0.33);
    outline-offset: -2px;
  }

  :host(:hover) {
    background: rgba(255,255,255, 0.10);
  }

  button {
    width: 100%;
    height: 100%;
    vertical-align: middle;
    border: none;
    margin: 0;
    padding: 0;
    text-decoration: none;
    background: transparent;
    color: #ffffff;
    font-family: sans-serif;
    font-size: 16px;
    line-height: 24px;
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
  } */
</style>
<button id="icon-container">
  <slot name="play">Play</slot>
  <slot name="pause">Pause</slot>
</button>
`;

class PlayButton extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // this.iconContainer = this.shadowRoot.querySelector('#icon-container');

    this.addEventListener('click', e => {
      if (this.playing) {
        this.onPauseClick(e);
      } else {
        this.onPlayClick(e);
      }
    });

    this.playSlot = this.shadowRoot.querySelector('slot[name="play"]');
    this.pauseSlot = this.shadowRoot.querySelector('slot[name="pause"]');
    this.playing = false;
  }

  static get observedAttributes() {
    return ['playing'];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'playing') {
      if (newValue === null) {
        this.playing = false;
      } else {
        this.playing = true;
      }
    }
  }

  get playing() {
    return this._playing;
  }

  set playing(playing) {
    this._playing = !!playing;

    if (playing) {
      this.playSlot.style.display = 'none';
      this.pauseSlot.style.display = 'inline';
    } else {
      this.playSlot.style.display = 'inline';
      this.pauseSlot.style.display = 'none';
    }
  }

  onPlayClick(e) {}
  onPauseClick(e) {}
}

if (!window.customElements.get('play-button')) {
  window.customElements.define('play-button', PlayButton);
  window.PlayerChromeButton = PlayButton;
}

export default PlayButton;
