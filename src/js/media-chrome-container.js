/*
  The <media-chrome> can contain the control elements
  and the media element. Features:
  * Auto-set the `media` attribute on child media chrome elements
    * Uses the element with slot="media"
  * Take custom controls to fullscreen
  * Position controls at the bottom
  * Auto-hide controls on inactivity while playing
*/
import { defineCustomElement } from './utils/defineCustomElement.js';
import { propagateMedia, setAndPropagateMedia } from './media-chrome-html-element.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      position: relative;

      /* Position controls at the bottom  */
      display: flex;
      flex-direction: column-reverse;

      /* Default dimensions */
      width: 720px;
      height: 480px;
      background-color: #000;
    }

    /* Safari needs this to actually make the element fill the window */
    :host(:-webkit-full-screen) {
      /* Needs to use !important otherwise easy to break */
      width: 100% !important;
      height: 100% !important;
    }

    /* Position the media element to fill the container */
    ::slotted([slot=media]) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    /* Hide controls when inactive and not paused */
    #container ::slotted(*) {
      opacity: 1;
      transition: opacity 0.25s;
      visibility: visible;
    }

    #container.inactive:not(.paused) ::slotted(*) {
      opacity: 0;
      transition: opacity 1s;
    }
  </style>
  <slot name="media"></slot>
  <div id="container">
    <slot></slot>
  </div>
`;

class MediaChromeContainer extends HTMLElement {
  constructor() {
    super();

    // Set up the Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.getElementById('container');

    // Update the media prop of child elements when added/removed
    // and react to adds/removals of media elements.
    // This has turned into a meaty piece of logic...documenting verbosely
    const mutationCallback = (mutationsList, observer) => {
      const media = this.media;

      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {

          // Controls or media elements being removed
          mutation.removedNodes.forEach(node => {
            // Is this a direct child media element of media-chrome
            if (node.slot == 'media' && mutation.target == this) {
              // Check if this was the current media by if it was the first
              // el with slot=media in the child list. There can be multiple.
              const previousSibling = mutation.previousSibling && mutation.previousSibling.previousElementSibling;

              // Must have been first if no prev sibling or new media
              if (!previousSibling || !media) {
                this.mediaUnsetCallback(node);
              } else {
                // Check if any prev siblings had a slot=media
                // Should remain true otherwise
                let wasFirst = previousSibling.slot !== 'media';
                while ((previousSibling = previousSibling.previousSibling) !== null) {
                  if (previousSibling.slot == 'media') wasFirst = false;
                }
                if (wasFirst) this.mediaUnsetCallback(node);
              }

              // Update all controls with new media if there is one
              if (media) {
                this.mediaSetCallback(this, media);
              }
            } else {
              // This is not a media el being removed so
              // undo auto-injected medias from it and children
              setAndPropagateMedia(node, null);
            }
          });

          // Controls or media element being added
          // No need to inject anything if media=null
          if (media) {
            mutation.addedNodes.forEach(node => {
              if (node == media) {
                // Update all controls with new media if this is the new media
                this.mediaSetCallback(node);
              } else {
                setAndPropagateMedia(node, media);
              }
            });
          }
        }
      }
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(this, { childList: true, subtree: true });
  }

  // First direct child with slot=media, or null
  get media() {
    return this.querySelector(':scope > [slot=media]');
  }

  mediaSetCallback(media) {
    // Should only ever be set with a compatible media element, never null
    if (!media || !media.play) {
      console.error('<media-chrome>: Media element set with slot="media" does not appear to be compatible.', media);
      return;
    }

    // Wait until custom media elements are ready
    const mediaName = media.nodeName.toLowerCase();

    if (mediaName.includes('-')) {
      window.customElements.whenDefined(mediaName).then(()=>{
        this.mediaSetCallback(this.media);
      });
      return;
    }

    // Set the media property of all children
    propagateMedia(this, media);

    // Auto-show/hide controls
    if (media.paused) {
      this.container.classList.add('paused');
    }

    this._mediaPlayHandler = e => {
      this.container.classList.remove('paused');
    };
    media.addEventListener('play', this._mediaPlayHandler);

    this._mediaPauseHandler = e => {
      this.container.classList.add('paused');
    };
    media.addEventListener('pause', this._mediaPauseHandler);

    // Toggle play/pause with clicks on the media element itself
    this._mediaClickHandler = e => {
      if (media.paused) {
        media.play();
      } else {
        media.pause();
      }
    }
    media.addEventListener('click', this._mediaClickHandler, false);
  }

  mediaUnsetCallback(media) {
    media.removeEventListener('click', this._mediaClickHandler);
    media.removeEventListener('play', this._mediaPlayHandler);
    media.removeEventListener('pause', this._mediaPauseHandler);

    // Unset media for all child controls
    propagateMedia(this, null);

    // Unhide controls
    this.container.classList.add('paused');
  }

  connectedCallback() {
    if (this.media) {
      this.mediaSetCallback(this.media);
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

    // Allow for focus styles only when using the keyboard to navigate
    this.addEventListener('keyup', e => {
      this.container.classList.add('media-focus-visible');
    });
    this.addEventListener('mouseup', e => {
      this.container.classList.remove('media-focus-visible');
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

  autoHide(seconds) {}
}

// Define as both <media-chrome>
defineCustomElement('media-chrome', MediaChromeContainer);

export default MediaChromeContainer;
