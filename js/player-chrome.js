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

    #container ::slotted(:not(.media-element):not(video):not(audio)) {
      opacity: 1;
      transition: opacity 0.25s;
      visibility: visible;
    }

    /* Hide controls when inactive and not paused */
    #container.inactive:not(.paused) ::slotted(:not(.media-element):not(video):not(audio)) {
      opacity: 0;
      transition: opacity 1s;
    }
  </style>
  <div id="container">
    <slot></slot>
  </div>
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
    this.container = this.shadowRoot.getElementById('container');

    // Toggle play/pause with clicks on the media element itself
    // TODO: handle child element changes, mutationObserver
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

    this.container.classList.add('paused');
    this.player.addEventListener('play', () => {
      this.container.classList.remove('paused');
    });

    this.player.addEventListener('pause', () => {
      this.container.classList.add('paused');
    });
  }

  get player() {
    return this.querySelector('video, audio, .media-element');
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
      this.container.appendChild(controlsTemplate.content.cloneNode(true));
    }

    const scheduleInactive = () => {
      this.container.classList.remove('inactive');
      window.clearTimeout(this.inactiveTimeout);
      this.inactiveTimeout = window.setTimeout(() => {
        this.container.classList.add('inactive');
      }, 2000);
    };

    // Unhide for keyboard controlling
    this.addEventListener('keyup', e => {
      scheduleInactive();
    });

    this.addEventListener('mousemove', e => {
      if (e.target === this) return;

      // Stay visible if hovered over control bar
      this.container.classList.remove('inactive');
      window.clearTimeout(this.inactiveTimeout);

      // If hovering over the media element we're free to make inactive
      if (e.target === this.player) {
        scheduleInactive();
      }
    });

    // Immediately hide if mouse leaves the container
    this.addEventListener('mouseout', e => {
      this.container.classList.add('inactive');
    });
  }
}

window.customElements.define('player-chrome', PlayerChrome);

export default PlayerChrome;
