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
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes, MediaStateChangeEvents } from './constants.js';
import { nouns } from './labels/labels.js';
import { containsComposedNode } from './utils/element-utils.js';
// Guarantee that `<media-gesture-receiver/>` is available for use in the template
import './media-gesture-receiver.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      line-height: 0;
      background-color: #000;
    }

    :host(:not([audio])) *[part~=layer]:not([part~=media-layer]) {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: start;
      pointer-events: none;
      background: none;
    }

    :host(:not([audio])) :is([part~=gestures-layer],[part~=media-layer])  {
      pointer-events: auto;
    }

    :host(:not([audio])[gestures-disabled]) ::slotted([slot=gestures-chrome]),
    :host(:not([audio])[gestures-disabled]) media-gesture-receiver[slot=gestures-chrome] {
      pointer-events: none;
    }
    
    :host(:not([audio])) *[part~=layer][part~=centered-layer] {
      align-items: center;
      justify-content: center;
    }

    :host(:not([audio])) ::slotted(media-gesture-receiver[slot=gestures-chrome]), 
    :host(:not([audio])) media-gesture-receiver[slot=gestures-chrome] {
      align-self: stretch;
      flex-grow: 1;
    }

    .spacer {
      pointer-events: none;
      background: none;
    }

    /* Position the media and poster elements to fill the container */
    ::slotted([slot=media]),
    ::slotted([slot=poster]) {
      width: 100%;
      height: 100%;
    }

    /* Video specific styles */
    :host(:not([audio])) .spacer {
      flex-grow: 1;
    }

    /* Safari needs this to actually make the element fill the window */
    :host(:-webkit-full-screen) {
      /* Needs to use !important otherwise easy to break */
      width: 100% !important;
      height: 100% !important;
    }

    /* Need to revisit this. May be too presumptuous for user-inactive behavior */
    ::slotted(:not([slot=media]):not([slot=poster])) {
      pointer-events: auto;
    }

    /* Only add these if auto hide is not disabled */
    ::slotted(:not([slot=media]):not([no-auto-hide])) {
      opacity: 1;
      transition: opacity 0.25s;
    }

    /* Hide controls when inactive, not paused, not audio and auto hide not disabled */
    :host([user-inactive]:not([${MediaUIAttributes.MEDIA_PAUSED}]):not([${MediaUIAttributes.MEDIA_IS_CASTING}]):not([audio])) ::slotted(:not([slot=media]):not([no-auto-hide])) {
      opacity: 0;
      transition: opacity 1s;
    }

    ::slotted(media-control-bar)  {
      align-self: stretch;
    }
  </style>

  <span part="layer media-layer">
    <slot name="media"></slot>
  </span>
  <span part="layer poster-layer">
    <slot name="poster"></slot>
  </span>
  <span part="layer gesture-layer">
    <slot name="gestures-chrome">
      <media-gesture-receiver slot="gestures-chrome"></media-gesture-receiver>
    </slot>
  </span>
  <span part="layer vertical-layer">
    <slot name="top-chrome"></slot>
    <span class="spacer"><slot name="middle-chrome"></slot></span>
    <!-- default, effectively "bottom-chrome" -->
    <slot></slot>
  </span>
  <span part="layer centered-layer">
    <slot name="centered-chrome"></slot>
  </span>
`;

const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);

class MediaContainer extends window.HTMLElement {
  constructor() {
    super();

    // Set up the Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Watch for child adds/removes and update the media element if necessary
    const mutationCallback = (mutationsList, observer) => {
      const media = this.media;

      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Media element being removed
          mutation.removedNodes.forEach((node) => {
            // Is this a direct child media element of media-controller?
            // TODO: This accuracy doesn't matter after moving away from media attrs.
            // Could refactor so we can always just call 'dispose' on any removed media el.
            if (node.slot == 'media' && mutation.target == this) {
              // Check if this was the current media by if it was the first
              // el with slot=media in the child list. There could be multiple.
              let previousSibling =
                mutation.previousSibling &&
                mutation.previousSibling.previousElementSibling;

              // Must have been first if no prev sibling or new media
              if (!previousSibling || !media) {
                this.mediaUnsetCallback(node);
              } else {
                // Check if any prev siblings had a slot=media
                // Should remain true otherwise
                let wasFirst = previousSibling.slot !== 'media';
                while (
                  (previousSibling = previousSibling.previousSibling) !== null
                ) {
                  if (previousSibling.slot == 'media') wasFirst = false;
                }
                if (wasFirst) this.mediaUnsetCallback(node);
              }
            }
          });

          // Controls or media element being added
          // No need to inject anything if media=null
          if (media) {
            mutation.addedNodes.forEach((node) => {
              if (node == media) {
                // Update all controls with new media if this is the new media
                this.handleMediaUpdated(media).then((media) =>
                  this.mediaSetCallback(media)
                );
              }
            });
          }
        }
      }
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(this, { childList: true, subtree: true });

    // Handles the case when the slotted media element is a slot element itself.
    // e.g. chaining media slots for media themes.
    let currentMedia = this.media;
    let chainedSlot = this.querySelector(':scope > slot[slot=media]');
    if (chainedSlot) {
      chainedSlot.addEventListener('slotchange', () => {
        const slotEls = chainedSlot.assignedElements({ flatten: true });
        if (!slotEls.length) {
          this.mediaUnsetCallback(currentMedia);
          return;
        }
        if (this.media) {
          currentMedia = this.media
          this.handleMediaUpdated(this.media).then((media) =>
            this.mediaSetCallback(media)
          );
        }
      });
    }
  }

  static get observedAttributes() {
    return ['autohide', 'gestures-disabled'].concat(MEDIA_UI_ATTRIBUTE_NAMES);
  }

  // Could share this code with media-chrome-html-element instead
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName.toLowerCase() == 'autohide') {
      this.autohide = newValue;
    }
  }

  // First direct child with slot=media, or null
  get media() {
    let media = this.querySelector(':scope > [slot=media]');

    // Chaining media slots for media templates
    if (media?.nodeName == 'SLOT')
      media = media.assignedElements({ flatten: true })[0];

    return media;
  }

  mediaSetCallback(media) {
    // Toggle play/pause with clicks on the media element itself
    this._mediaClickPlayToggle = (_e) => {
      const eventName = media.paused
        ? MediaUIEvents.MEDIA_PLAY_REQUEST
        : MediaUIEvents.MEDIA_PAUSE_REQUEST;
      this.dispatchEvent(
        new window.CustomEvent(eventName, { composed: true, bubbles: true })
      );
    };
  }

  handleMediaUpdated(media) {
    const resolveMediaPromise = (media) => {
      // media.addEventListener('click', this._mediaClickPlayToggle, false);

      return Promise.resolve(media);
    };

    const rejectMediaPromise = (media) => {
      console.error(
        '<media-chrome>: Media element set with slot="media" does not appear to be compatible.',
        media
      );
      return Promise.reject(media);
    };

    // Anything "falsy" couldn't act as a media element. Reject.
    if (!media) {
      return rejectMediaPromise(media);
    }

    const mediaName = media.nodeName.toLowerCase();
    // Custom element. Wait until it's defined before resolving
    if (mediaName.includes('-')) {
      return window.customElements.whenDefined(mediaName).then(() => {
        return resolveMediaPromise(media);
      });
    }

    // Exists and isn't a custom element. Resolve.
    return resolveMediaPromise(media);
  }

  mediaUnsetCallback(media) {
    // media.removeEventListener('click', this._mediaClickPlayToggle);
  }

  connectedCallback() {
    const isAudioChrome = this.getAttribute('audio') != null;
    const label = isAudioChrome ? nouns.AUDIO_PLAYER() : nouns.VIDEO_PLAYER();
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', label);

    if (this.media) {
      this.handleMediaUpdated(this.media).then((media) =>
        this.mediaSetCallback(media)
      );
    }

    // Assume user is inactive until they're not (aka user-inactive by default is true)
    // This allows things like autoplay and programmatic playing to also initiate hiding controls (CJP)
    this.setAttribute('user-inactive', 'user-inactive');

    const scheduleInactive = () => {
      this.removeAttribute('user-inactive');
      const evt = new window.CustomEvent(
        MediaStateChangeEvents.USER_INACTIVE, 
        { composed: true, bubbles: true, detail: false }
      );
      this.dispatchEvent(evt);
      window.clearTimeout(this._inactiveTimeout);

      // Setting autohide to -1 turns off autohide
      if (this.autohide < 0) return;

      this._inactiveTimeout = window.setTimeout(() => {
        this.setAttribute('user-inactive', 'user-inactive');
        const evt = new window.CustomEvent(
          MediaStateChangeEvents.USER_INACTIVE, 
          { composed: true, bubbles: true, detail: true }
        );
        this.dispatchEvent(evt);
      }, this.autohide * 1000);
    };

    // Unhide for keyboard controlling
    this.addEventListener('keyup', (e) => {
      scheduleInactive();
    });

    // Allow for focus styles only when using the keyboard to navigate
    this.addEventListener('keyup', (e) => {
      this.setAttribute('media-keyboard-control', 'media-keyboard-control');
    });
    this.addEventListener('mouseup', (e) => {
      this.removeAttribute('media-keyboard-control');
    });

    this.addEventListener('mousemove', (e) => {
      if (!containsComposedNode(this, e.target)) return;

      // Stay visible if hovered over control bar
      this.removeAttribute('user-inactive');
      const evt = new window.CustomEvent(
        MediaStateChangeEvents.USER_INACTIVE, 
        { composed: true, bubbles: true, detail: false }
      );
      this.dispatchEvent(evt);
      window.clearTimeout(this._inactiveTimeout);

      // If hovering over something other than controls, we're free to make inactive
      if ([this, this.media].includes(e.target)) {
        scheduleInactive();
      }
    });

    // Immediately hide if mouse leaves the container
    this.addEventListener('mouseleave', (e) => {
      if (this.autohide < 0) return;
      this.setAttribute('user-inactive', 'user-inactive');
      const evt = new window.CustomEvent(
        MediaStateChangeEvents.USER_INACTIVE, 
        { composed: true, bubbles: true, detail: true }
      );
      this.dispatchEvent(evt);
    });
  }

  set autohide(seconds) {
    seconds = Number(seconds);
    this._autohide = isNaN(seconds) ? 0 : seconds;
  }

  get autohide() {
    return this._autohide === undefined ? 2 : this._autohide;
  }
}

// Aliasing media-controller to media-container in main index until we know
// we're not breaking people with the change.
defineCustomElement('media-container-temp', MediaContainer);

export default MediaContainer;
