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
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { MediaChromeHTMLElement, mediaUIEvents } from './media-chrome-html-element.js';

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
      width: 100%;
      max-width: 720px;
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

    [media-test] #container {
      display:none !important;
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

class MediaContainer extends MediaChromeHTMLElement {
  constructor() {
    super();

    // Set up the Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.getElementById('container');

    // Watch for child adds/removes and update the media element if necessary
    const mutationCallback = (mutationsList, observer) => {
      const media = this.media;

      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {

          // Media element being removed
          mutation.removedNodes.forEach(node => {
            // Is this a direct child media element of media-controller?
            // TODO: This accuracy doesn't matter after moving away from media attrs.
            // Could refactor so we can always just call 'dispose' on any removed media el.
            if (node.slot == 'media' && mutation.target == this) {
              // Check if this was the current media by if it was the first
              // el with slot=media in the child list. There could be multiple.
              let previousSibling = mutation.previousSibling && mutation.previousSibling.previousElementSibling;

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
            }
          });

          // Controls or media element being added
          // No need to inject anything if media=null
          if (media) {
            mutation.addedNodes.forEach(node => {
              if (node == media) {
                // Update all controls with new media if this is the new media
                this.mediaSetCallback(node);
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
      return false;
    }

    // Wait until custom media elements are ready
    const mediaName = media.nodeName.toLowerCase();

    if (mediaName.includes('-') && !window.customElements.get(mediaName)) {
      window.customElements.whenDefined(mediaName).then(()=>{
        this.mediaSetCallback(media);
      });
      return false;
    }

    // Auto-show/hide controls
    // Todo: Move this to using a media-paused attribute
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
    this._mediaClickPlayToggle = e => {
      if (media.paused) {
        this.dispatchMediaEvent(mediaUIEvents.MEDIA_PLAY_REQUEST);
      } else {
        this.dispatchMediaEvent(mediaUIEvents.MEDIA_PAUSE_REQUEST);
      }
    }
    media.addEventListener('click', this._mediaClickPlayToggle, false);

    return true;
  }

  mediaUnsetCallback(media) {
    media.removeEventListener('click', this._mediaClickPlayToggle);
    media.removeEventListener('play', this._mediaPlayHandler);
    media.removeEventListener('pause', this._mediaPauseHandler);

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

  dispatchMediaEvent(eventName, eventSettings) {
    eventSettings = Object.assign({
      // Control element events bubble so the controller can catch them
      // The controller shouldn't bubble events
      bubbles: false,
      composed: true
    }, eventSettings);

    const event = new window.CustomEvent(eventName, eventSettings);

    // Allow for `oneventname` props on el like in native HTML
    const cancelled = (this[`on${eventName}`] && this[`on${eventName}`](event)) === false;

    if (!cancelled) {
      this.dispatchEvent(event);
    }
  }
}

defineCustomElement('media-container', MediaContainer);

export default MediaContainer;
