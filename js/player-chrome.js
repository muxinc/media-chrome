import './player-control-bar.js';

class PlayerChrome extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Don't know child components until the el finishes displaying
    const observer = new MutationObserver((mutationsList, observer) => {
      // Set this up to track what media elements are available.
      // This could be much faster than doing a querySelector
      // for the mediaElement each time, but that might also be
      // premature optimization.
    });
    observer.observe(this, {
      childList: true,
    });
  }

  get player() {
    // console.log('pc', this.querySelector('video, audio, .media-element'));
    return this.querySelector('video, audio, .media-element');
  }
}

window.customElements.define('player-chrome', PlayerChrome);

export default PlayerChrome;
