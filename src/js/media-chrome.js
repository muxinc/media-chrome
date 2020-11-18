import MediaChromeElement from './media-chrome-element.js';
import './media-control-bar.js';
import './media-playback-rate-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

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
  <media-control-bar>
    <media-play-button>Play</media-play-button>
    <media-mute-button>Mute</media-mute-button>
    <media-volume-range>Volume</media-volume-range>
    <media-progress-range>Progress</media-progress-range>
    <media-pip-button>PIP</media-pip-button>
    <media-fullscreen-button>Fullscreen</media-fullscreen-button>
  </media-control-bar>
`;

class MediaChrome extends HTMLElement {
  constructor() {
    super();

    // Set up the Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.getElementById('container');

    this._media = null;

    const mutationCallback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach(node => {
            if (node.media === this.media) {
              // Undo auto-injected medias
              node.media = null;
            }
          });
          mutation.addedNodes.forEach(node => {
            if (node instanceof MediaChromeElement && !node.media) {
              // Inject the media in new children
              // Todo: Make recursive
              node.media = this.media;
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

  get media() {
    return this._media;
  }

  set media(media) {
    this._media = media;

    if (media) {
      // Toggle play/pause with clicks on the media element itself
      // TODO: handle child element changes, mutationObserver
      this.addEventListener('click', e => {
        const media = this.media;

        // instanceof HTMLMediaElement ||
        // CustomVideoElement && e.target instanceof CustomVideoElement
        if (e.target.slot == 'media') {
          if (media.paused) {
            media.play();
          } else {
            media.pause();
          }
        }
      });

      this.container.classList.add('paused');

      // Uncomment to auto-hide controls
      media.addEventListener('play', () => {
        this.container.classList.remove('paused');
      });

      media.addEventListener('pause', () => {
        this.container.classList.add('paused');
      });

      const mediaName = media.nodeName.toLowerCase();

      if (mediaName == 'audio' || mediaName == 'video') {
        propagteNewMedia.call(this, media);
      } else {
        // Wait for custom video element to be ready before setting it
        window.customElements.whenDefined(mediaName).then(() => {
          propagteNewMedia.call(this, media);
        });
      }
    }

    function propagteNewMedia(media) {
      this.querySelectorAll('*').forEach(el => {

        if (el instanceof MediaChromeElement) {
          // Media should be settable at this point.
          el.media = this.media;
        }
      });

      this.shadowRoot.querySelectorAll('*').forEach(el => {
        if (el instanceof MediaChromeElement) {
          el.media = this.media;
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

    let media = this.querySelector('[slot=media]');

    if (media) {
      this.media = media;
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
      if (e.target === this.media) {
        scheduleInactive();
      }
    });

    // Immediately hide if mouse leaves the container
    this.addEventListener('mouseout', e => {
      this.container.classList.add('inactive');
    });
  }
}

defineCustomElement('media-chrome', MediaChrome);

export default MediaChrome;
