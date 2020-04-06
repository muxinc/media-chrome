import PlayerChromeElement from './player-chrome-element.js';

const template = document.createElement('template');

// Can't comma-separate selectors like ::-webkit-slider-thumb, ::-moz-range-thumb
// Browsers ignore the whole rule if you do.
const thumbStyles = `
  box-shadow: 1px 1px 1px transparent;
  height: 10px;
  width: 10px;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
`;

const trackStyles = `
  width: 100%;
  min-width: 60px;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: #eee;
  border-radius: 0;
  border: none;
`;

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      background-color: transparent;
      height: 44px;
      width: 100px;
      min-height: 24px;
      font-size: 16px;
      line-height: 24px;
      padding: 0 10px;
    }

    :host(:focus, :focus-within) {
      outline: 2px solid rgba(0,150,255, 0.33);
      outline-offset: -2px;
    }

    :host(:hover) {
      background: rgba(255,255,255, 0.10);
    }

    input[type=range] {
      /* Reset */
      -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
      background: transparent; /* Otherwise white in Chrome */

      /* Fill host with the range */
      height: 100%;
      width: 100%; /* Specific width is required for Firefox. */

      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    /* Special styling for WebKit/Blink */
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      margin-top: -3px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
      ${thumbStyles}
    }
    input[type=range]::-moz-range-thumb { ${thumbStyles} }

    input[type=range]::-webkit-slider-runnable-track { ${trackStyles} }
    input[type=range]::-moz-range-track { ${trackStyles} }
    input[type=range]::-ms-track {
      /* Reset */
      width: 100%;
      cursor: pointer;
      /* Hides the slider so custom styles can be added */
      background: transparent;
      border-color: transparent;
      color: transparent;

      ${trackStyles}
    }

    /* Eventually want to move towards different styles for focus-visible
       https://github.com/WICG/focus-visible/blob/master/src/focus-visible.js
       Youtube appears to do this by de-focusing a button after a button click */
    input[type=range]:focus {
      outline: 0;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      outline: 0;
    }

    input[type=range]:disabled::-webkit-slider-thumb {
      background-color: #777;
    }

    input[type=range]:disabled::-webkit-slider-runnable-track {
      background-color: #777;
    }

  </style>
  <input id="range" type="range" min="0" max="1000" step="1" value="0">
`;

class PlayerChromeRange extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.range = this.shadowRoot.querySelector('#range');
  }
}

if (!window.customElements.get('player-chrome-range')) {
  window.customElements.define('player-chrome-range', PlayerChromeRange);
  window.PlayerChromeRange = PlayerChromeRange;
}

export default PlayerChromeRange;
