import PlayerChromeElement from './player-chrome-element.js';
import './player-control-bar.js';
import './hls-video-element.js';

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

    ::slotted([slot=media]) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
    }

    #container ::slotted(*) {
      opacity: 1;
      transition: opacity 0.25s;
      visibility: visible;
    }

    /* Hide controls when inactive and not paused */
    #container.inactive:not(.paused) ::slotted(*) {
      opacity: 0;
      transition: opacity 1s;
    }
  </style>
  <slot name="media"></slot>
  <div id="container">
    <slot></slot>
    <slot name="controls"></slot>
  </div>
`;

const controlsTemplate = document.createElement('template');

controlsTemplate.innerHTML = `
  <player-control-bar>
    <player-play-button>Play</player-play-button>
    <player-mute-button>Mute</player-mute-button>
    <player-volume-range>Volume</player-volume-range>
    <player-progress-range>Progress</player-progress-range>
    <player-pip-button>PIP</player-pip-button>
    <player-fullscreen-button>Fullscreen</player-fullscreen-button>
  </player-control-bar>
`;

class PlayerChrome extends HTMLElement {
  constructor() {
    super();

    // Set up the Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.getElementById('container');

    this._player = null;

    const mutationCallback = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach(node => {
            if (node.player === this.player) {
              // Undo auto-injected players
              node.player = null;
            }
          });
          mutation.addedNodes.forEach(node => {
            if (node instanceof PlayerChromeElement && !node.player) {
              // Inject the player in new children
              // Todo: Make recursive
              node.player = this.player;
            }
          });
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(mutationCallback);

    // Start observing the target node for configured mutations
    observer.observe(this, { childList: true, subtree: true });

    // -=----------------------------


  }

  get player() {
    return this._player;
  }

  set player(player) {
    this._player = player;

    if (player) {
      // Toggle play/pause with clicks on the media element itself
      // TODO: handle child element changes, mutationObserver
      this.addEventListener('click', e => {
        const player = this.player;

        // instanceof HTMLMediaElement ||
        // CustomVideoElement && e.target instanceof CustomVideoElement
        if (e.target.slot == 'media') {
          if (player.paused) {
            player.play();
          } else {
            player.pause();
          }
        }
      });

      this.container.classList.add('paused');

      // Uncomment to auto-hide controls
      player.addEventListener('play', () => {
        this.container.classList.remove('paused');
      });

      player.addEventListener('pause', () => {
        this.container.classList.add('paused');
      });

      const playerName = player.nodeName.toLowerCase();

      if (playerName == 'audio' || playerName == 'video') {
        propagteNewPlayer.call(this, player);
      } else {
        // Wait for custom video element to be ready before setting it
        window.customElements.whenDefined(playerName).then(() => {
          propagteNewPlayer.call(this, player);
        });
      }
    }

    function propagteNewPlayer(player) {
      this.querySelectorAll('*').forEach(el => {

        if (el instanceof PlayerChromeElement) {
          // Player should be settable at this point.
          el.player = this.player;
        }
      });

      this.shadowRoot.querySelectorAll('*').forEach(el => {
        if (el instanceof PlayerChromeElement) {
          el.player = this.player;
        }
      });
    }
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

    if (this.attributes['defaultControls']) {
      this.container.appendChild(controlsTemplate.content.cloneNode(true));
    }

    let player = this.querySelector('[slot=media]');

    if (player) {
      this.player = player;
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
