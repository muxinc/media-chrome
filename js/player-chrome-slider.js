import PlayerChromeElement from './player-chrome-element.js';

const template = document.createElement('template');

const rangeStylesReset = `
/* Reset range styles */
input[type="range"] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent;
  border-color: transparent;
  color: transparent;
}
`;

// Can't comma-separate selectors like ::-webkit-slider-thumb, ::-moz-range-thumb
// Browsers ignore the whole rule if you do.
const thumbStyles = `
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  /* border: 1px solid #000000; */
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
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #eee;
  border-radius: 0;
  border: none;
`;

template.innerHTML = `
  <style>
    ${rangeStylesReset}

    input[type=range] {
      /* margin-top: 10px; */
      height: 20px;
    }

    /* Special styling for WebKit/Blink */
    input[type=range]::-webkit-slider-thumb {
      margin-top: -3px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
      ${thumbStyles}
    }
    input[type=range]::-moz-range-thumb { ${thumbStyles} }

    input[type=range]::-webkit-slider-runnable-track { ${trackStyles} }
    input[type=range]::-moz-range-track { ${trackStyles} }
    input[type=range]::-ms-track { ${trackStyles} }

    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #367ebd;
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
