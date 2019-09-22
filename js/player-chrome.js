import './player-control-bar.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;

      position: relative;
      display: flex;
      width: 720px;
      height: 480px;
      background-color: #000;
      flex-direction: column-reverse;
    }

    ::slotted(.media-element),
    ::slotted(video),
    ::slotted(audio) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
    }
  </style>
  <slot></slot>
`;

const controlsTemplate = document.createElement('template');

controlsTemplate.innerHTML = `
  <player-control-bar controls></player-control-bar>
`;

class PlayerChrome extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Toggle play/pause with clicks on the media element itself
    this.addEventListener('click', e => {
      const player = this.player;

      if (
        e.target instanceof HTMLMediaElement ||
        e.target instanceof CustomVideoElement
      ) {
        if (player.paused) {
          player.play();
        } else {
          player.pause();
        }
      }
    });
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

    if (this.attributes['controls']) {
      this.shadowRoot.appendChild(controlsTemplate.content.cloneNode(true));
    }
  }

  get player() {
    // console.log('pc', this.querySelector('video, audio, .media-element'));
    return this.querySelector('video, audio, .media-element');
  }
}

window.customElements.define('player-chrome', PlayerChrome);

export default PlayerChrome;
