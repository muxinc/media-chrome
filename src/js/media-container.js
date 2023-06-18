/*
  The <media-chrome> can contain the control elements
  and the media element. Features:
  * Auto-set the `media` attribute on child media chrome elements
    * Uses the element with slot="media"
  * Take custom controls to fullscreen
  * Position controls at the bottom
  * Auto-hide controls on inactivity while playing
*/
import { globalThis, document } from './utils/server-safe-globals.js';
import {
  MediaUIEvents,
  MediaUIAttributes,
  MediaStateChangeEvents,
} from './constants.js';
import { nouns } from './labels/labels.js';
// Guarantee that `<media-gesture-receiver/>` is available for use in the template
import './media-gesture-receiver.js';

export const Attributes = {
  AUDIO: 'audio',
  AUTOHIDE: 'autohide',
  BREAKPOINTS: 'breakpoints',
  GESTURES_DISABLED: 'gesturesdisabled',
  KEYBOARD_CONTROL: 'keyboardcontrol',
  NO_AUTOHIDE: 'noautohide',
  USER_INACTIVE: 'userinactive',
};

const template = document.createElement('template');

template.innerHTML = /*html*/`
  <style>
    ${
      /*
       * outline on media is turned off because it is allowed to get focus to faciliate hotkeys.
       * However, on keyboard interactions, the focus outline is shown,
       * which is particularly noticeable when going fullscreen via hotkeys.
       */ ''
    }
    :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
      outline: none;
    }

    :host {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      line-height: 0;
      background-color: var(--media-background-color, #000);
    }

    :host(:not([${Attributes.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
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

    slot[name=media] {
      display: var(--media-slot-display, contents);
    }

    ${
      /*
       * when in audio mode, hide the slotted media element by default
       */ ''
    }
    :host([${Attributes.AUDIO}]) slot[name=media] {
      display: var(--media-slot-display, none);
    }

    ${
      /*
       * when in audio mode, hide the gesture-layer which causes media-controller to be taller than the control bar
       */ ''
    }
    :host([${Attributes.AUDIO}]) [part~=layer][part~=gesture-layer] {
      height: 0;
      display: block;
    }

    ${
      /*
       * if gestures are disabled, don't accept pointer-events
       */ ''
    }
    :host(:not([${Attributes.AUDIO}])[${Attributes.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
    :host(:not([${Attributes.AUDIO}])[${Attributes.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
      display: none;
    }

    ${
      /*
       * any slotted element that isn't a poster or media slot should be pointer-events auto
       * we'll want to add here any slotted elements that shouldn't get pointer-events by default when slotted
       */ ''
    }
    ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator)) {
      pointer-events: auto;
    }

    :host(:not([${Attributes.AUDIO}])) *[part~=layer][part~=centered-layer] {
      align-items: center;
      justify-content: center;
    }

    :host(:not([${Attributes.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
    :host(:not([${Attributes.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
      align-self: stretch;
      flex-grow: 1;
    }

    slot[name=middle-chrome] {
      display: inline;
      flex-grow: 1;
      pointer-events: none;
      background: none;
    }

    ${/* Position the media and poster elements to fill the container */ ''}
    ::slotted([slot=media]),
    ::slotted([slot=poster]) {
      width: 100%;
      height: 100%;
    }

    ${/* Video specific styles */ ''}
    :host(:not([${Attributes.AUDIO}])) .spacer {
      flex-grow: 1;
    }

    ${/* Safari needs this to actually make the element fill the window */ ''}
    :host(:-webkit-full-screen) {
      ${/* Needs to use !important otherwise easy to break */ ''}
      width: 100% !important;
      height: 100% !important;
    }

    ${/* Only add these if auto hide is not disabled */ ''}
    ::slotted(:not([slot=media]):not([${Attributes.NO_AUTOHIDE}])) {
      opacity: 1;
      transition: opacity 0.25s;
    }

    ${
      /* Hide controls when inactive, not paused, not audio and auto hide not disabled */ ''
    }
    :host([${Attributes.USER_INACTIVE}]:not([${MediaUIAttributes.MEDIA_PAUSED}]):not([${MediaUIAttributes.MEDIA_IS_CASTING}]):not([${Attributes.AUDIO}])) ::slotted(:not([slot=media]):not([${Attributes.NO_AUTOHIDE}])) {
      opacity: 0;
      transition: opacity 1s;
    }

    ::slotted(media-control-bar)  {
      align-self: stretch;
    }

    :host([${MediaUIAttributes.MEDIA_HAS_PLAYED}]) ::slotted([slot=poster]) {
      display: none;
    }
  </style>

  <slot name="media" part="layer media-layer"></slot>
  <slot name="poster" part="layer poster-layer"></slot>
  <slot name="gestures-chrome" part="layer gesture-layer">
    <media-gesture-receiver slot="gestures-chrome"></media-gesture-receiver>
  </slot>
  <span part="layer vertical-layer">
    <slot name="top-chrome" part="top chrome"></slot>
    <slot name="middle-chrome" part="middle chrome"></slot>
    <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
    ${/* default, effectively "bottom-chrome" */ ''}
    <slot part="bottom chrome"></slot>
  </span>
`;

const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);

const defaultBreakpoints = 'sm:384 md:576 lg:768 xl:960';

const resizeCallback = (entries) => {
  for (const entry of entries) {
    const container = entry.target;

    if (!container.isConnected) continue;

    const breakpoints =
      container.getAttribute(Attributes.BREAKPOINTS) ?? defaultBreakpoints;
    const ranges = createBreakpointMap(breakpoints);
    const activeBreakpoints = getBreakpoints(ranges, entry.contentRect);

    let changed = false;

    Object.keys(ranges).forEach((name) => {
      if (activeBreakpoints.includes(name)) {
        if (!container.hasAttribute(`breakpoint${name}`)) {
          container.setAttribute(`breakpoint${name}`, '');
          changed = true;
        }
        return;
      }

      if (container.hasAttribute(`breakpoint${name}`)) {
        container.removeAttribute(`breakpoint${name}`);
        changed = true;
      }
    });

    if (changed) {
      const evt = new CustomEvent(MediaStateChangeEvents.BREAKPOINTS_CHANGE, {
        detail: activeBreakpoints
      });

      container.dispatchEvent(evt)
    }
  }
};

function createBreakpointMap(breakpoints) {
  const pairs = breakpoints.split(/\s+/);
  return Object.fromEntries(pairs.map((pair) => pair.split(':')));
}

function getBreakpoints(breakpoints, rect) {
  return Object.keys(breakpoints).filter((name) => {
    return rect.width >= breakpoints[name];
  });
}

/**
 * @extends {HTMLElement}
 *
 * @attr {boolean} audio
 * @attr {string} autohide
 * @attr {string} breakpoints
 * @attr {boolean} gesturesdisabled
 * @attr {boolean} keyboardcontrol
 * @attr {boolean} noautohide
 * @attr {boolean} userinactive
 *
 * @cssprop --media-background-color - `background-color` of container.
 * @cssprop --media-slot-display - `display` of the media slot (default none for [audio] usage).
 */
class MediaContainer extends globalThis.HTMLElement {
  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Watch for child adds/removes and update the media element if necessary
    const mutationCallback = (mutationsList) => {
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

    const mutationObserver = new MutationObserver(mutationCallback);
    mutationObserver.observe(this, { childList: true, subtree: true });

    let pendingResizeCb = false;
    const deferResizeCallback = (entries) => {
      // Already have a pending async breakpoint computation, so go ahead and bail
      if (pendingResizeCb) return;
      // Just in case it takes too long (which will cause an error to throw),
      // do the breakpoint computation asynchronously
      window.setTimeout(() => {
        resizeCallback(entries);
        // Once we've completed, reset the pending cb flag to false
        pendingResizeCb = false;
      }, 16); // Use 16ms to ensure at most ~1 invocation per animation frame (~60fps)
      pendingResizeCb = true;
    };
    const resizeObserver = new ResizeObserver(deferResizeCallback);
    this.resizeObserver = resizeObserver;
    resizeObserver.observe(this);

    // Handles the case when the slotted media element is a slot element itself.
    // e.g. chaining media slots for media themes.
    let currentMedia = this.media;
    /** @type {HTMLSlotElement} */
    let chainedSlot = this.querySelector(':scope > slot[slot=media]');
    if (chainedSlot) {
      chainedSlot.addEventListener('slotchange', () => {
        const slotEls = chainedSlot.assignedElements({ flatten: true });
        if (!slotEls.length) {
          this.mediaUnsetCallback(currentMedia);
          return;
        }
        if (this.media) {
          currentMedia = this.media;
          this.handleMediaUpdated(this.media).then((media) =>
            this.mediaSetCallback(media)
          );
        }
      });
    }
  }

  static get observedAttributes() {
    return [Attributes.AUTOHIDE, Attributes.GESTURES_DISABLED].concat(
      MEDIA_UI_ATTRIBUTE_NAMES
    );
  }

  // Could share this code with media-chrome-html-element instead
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName.toLowerCase() == Attributes.AUTOHIDE) {
      this.autohide = newValue;
    }
  }

  // First direct child with slot=media, or null
  /**
   * @returns {HTMLVideoElement &
   * {buffered,
   * webkitEnterFullscreen?,
   * webkitExitFullscreen?,
   * requestCast?,
   * webkitShowPlaybackTargetPicker?,
   * }}
   */
  get media() {
    /** @type {HTMLVideoElement} */
    let media = this.querySelector(':scope > [slot=media]');

    // Chaining media slots for media templates
    if (media?.nodeName == 'SLOT')
      // @ts-ignore
      media = media.assignedElements({ flatten: true })[0];

    return media;
  }

  mediaSetCallback(media) {
    // Toggle play/pause with clicks on the media element itself
    this._mediaClickPlayToggle = () => {
      const eventName = media.paused
        ? MediaUIEvents.MEDIA_PLAY_REQUEST
        : MediaUIEvents.MEDIA_PAUSE_REQUEST;
      this.dispatchEvent(
        new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
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
      return globalThis.customElements.whenDefined(mediaName).then(() => {
        return resolveMediaPromise(media);
      });
    }

    // Exists and isn't a custom element. Resolve.
    return resolveMediaPromise(media);
  }

  /**
   * @abstract
   */
  // eslint-disable-next-line
  mediaUnsetCallback(node) {
    // media.removeEventListener('click', this._mediaClickPlayToggle);
  }

  connectedCallback() {
    const isAudioChrome = this.getAttribute(Attributes.AUDIO) != null;
    const label = isAudioChrome ? nouns.AUDIO_PLAYER() : nouns.VIDEO_PLAYER();
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', label);

    if (this.media) {
      this.handleMediaUpdated(this.media).then((media) =>
        this.mediaSetCallback(media)
      );
    }

    // Assume user is inactive until they're not (aka userinactive by default is true)
    // This allows things like autoplay and programmatic playing to also initiate hiding controls (CJP)
    this.setAttribute(Attributes.USER_INACTIVE, '');

    const setInactive = () => {
      if (this.autohide < 0) return;
      if (this.hasAttribute(Attributes.USER_INACTIVE)) return;

      this.setAttribute(Attributes.USER_INACTIVE, '');

      const evt = new globalThis.CustomEvent(
        MediaStateChangeEvents.USER_INACTIVE,
        { composed: true, bubbles: true, detail: true }
      );
      this.dispatchEvent(evt);
    };

    const setActive = () => {
      if (!this.hasAttribute(Attributes.USER_INACTIVE)) return;

      this.removeAttribute(Attributes.USER_INACTIVE);

      const evt = new globalThis.CustomEvent(
        MediaStateChangeEvents.USER_INACTIVE,
        { composed: true, bubbles: true, detail: false }
      );
      this.dispatchEvent(evt);
    }

    const scheduleInactive = () => {
      setActive();

      globalThis.clearTimeout(this._inactiveTimeout);

      // Setting autohide to -1 turns off autohide
      if (this.autohide < 0) return;

      this._inactiveTimeout = globalThis.setTimeout(() => {
        setInactive();
      }, this.autohide * 1000);
    };

    // Unhide for keyboard controlling
    this.addEventListener('keyup', () => {
      scheduleInactive();
    });

    // when we get a tap, we want to unhide
    this.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') {
        if (
          // @ts-ignore
          [this, this.media].includes(e.target) &&
          !this.hasAttribute(Attributes.USER_INACTIVE)
        ) {
          setInactive();
        } else {
          scheduleInactive();
        }
      } else if (
        e.composedPath().some((el) =>
          ['media-play-button', 'media-fullscreen-button'].includes(
            // @ts-ignore
            el?.nodeName?.toLowerCase()
          )
        )
      ) {
        scheduleInactive();
      }
    });

    this.addEventListener('pointermove', (e) => {
      // pointermove doesn't happen with touch on taps on iOS, but does on android,
      // so, only run pointermove for mouse
      if (e.pointerType !== 'mouse') return;

      setActive();
      // Stay visible if hovered over control bar
      globalThis.clearTimeout(this._inactiveTimeout);

      // If hovering over something other than controls, we're free to make inactive
      // @ts-ignore
      if ([this, this.media].includes(e.target)) {
        scheduleInactive();
      }
    });

    // Immediately hide if mouse leaves the container
    this.addEventListener('mouseleave', () => {
      setInactive();
    });

    // Allow for focus styles only when using the keyboard to navigate
    this.addEventListener('keyup', () => {
      this.setAttribute(Attributes.KEYBOARD_CONTROL, '');
    });
    globalThis.window?.addEventListener('mouseup', () => {
      this.removeAttribute(Attributes.KEYBOARD_CONTROL);
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

// NOTE: Since MediaContainer is not currently designed to be used directly as
// a custom element, unlike other components, we do not `define()` it.

export { MediaContainer };
export default MediaContainer;
