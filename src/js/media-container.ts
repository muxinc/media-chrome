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
import { MediaUIAttributes, MediaStateChangeEvents } from './constants.js';
import { nouns } from './labels/labels.js';
import { observeResize } from './utils/resize-observer.js';
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

const template: HTMLTemplateElement = document.createElement('template');

template.innerHTML = /*html*/ `
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
    :host(:not([${Attributes.AUDIO}])[${
  Attributes.GESTURES_DISABLED
}]) ::slotted([slot=gestures-chrome]),
    :host(:not([${Attributes.AUDIO}])[${
  Attributes.GESTURES_DISABLED
}]) media-gesture-receiver[slot=gestures-chrome] {
      display: none;
    }

    ${
      /*
       * any slotted element that isn't a poster or media slot should be pointer-events auto
       * we'll want to add here any slotted elements that shouldn't get pointer-events by default when slotted
       */ ''
    }
    ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([hidden])) {
      pointer-events: auto;
    }

    :host(:not([${Attributes.AUDIO}])) *[part~=layer][part~=centered-layer] {
      align-items: center;
      justify-content: center;
    }

    :host(:not([${
      Attributes.AUDIO
    }])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
    :host(:not([${
      Attributes.AUDIO
    }])) media-gesture-receiver[slot=gestures-chrome] {
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
    ::slotted(:not([slot=media]):not([slot=poster]):not([${
      Attributes.NO_AUTOHIDE
    }]):not([hidden])) {
      opacity: 1;
      transition: opacity 0.25s;
    }

    ${
      /* Hide controls when inactive, not paused, not audio and auto hide not disabled */ ''
    }
    :host([${Attributes.USER_INACTIVE}]:not([${
  MediaUIAttributes.MEDIA_PAUSED
}]):not([${MediaUIAttributes.MEDIA_IS_AIRPLAYING}]):not([${
  MediaUIAttributes.MEDIA_IS_CASTING
}]):not([${
  Attributes.AUDIO
}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${
  Attributes.NO_AUTOHIDE
}])) {
      opacity: 0;
      transition: opacity 1s;
    }

    :host([${Attributes.USER_INACTIVE}]:not([${
  MediaUIAttributes.MEDIA_PAUSED
}]):not([${MediaUIAttributes.MEDIA_IS_CASTING}]):not([${
  Attributes.AUDIO
}])) ::slotted([slot=media]) {
      cursor: none;
    }

    ::slotted(media-control-bar)  {
      align-self: stretch;
    }

    ${
      /* ::slotted([slot=poster]) doesn't work for slot fallback content so hide parent slot instead */ ''
    }
    :host(:not([${Attributes.AUDIO}])[${
  MediaUIAttributes.MEDIA_HAS_PLAYED
}]) slot[name=poster] {
      display: none;
    }

    ::slotted([role="menu"]) {
      align-self: end;
    }

    ::slotted([role="dialog"]) {
      align-self: center;
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

function resizeCallback(entry: ResizeObserverEntry) {
  setBreakpoints(entry.target as HTMLElement, entry.contentRect.width);
}

function setBreakpoints(container: HTMLElement, width: number) {
  if (!container.isConnected) return;

  const breakpoints =
    container.getAttribute(Attributes.BREAKPOINTS) ?? defaultBreakpoints;
  const ranges = createBreakpointMap(breakpoints);
  const activeBreakpoints = getBreakpoints(ranges, width);

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
      detail: activeBreakpoints,
    });

    container.dispatchEvent(evt);
  }
}

function createBreakpointMap(breakpoints: string) {
  const pairs = breakpoints.split(/\s+/);
  return Object.fromEntries(pairs.map((pair) => pair.split(':')));
}

function getBreakpoints(breakpoints: Record<string, string>, width: number) {
  return Object.keys(breakpoints).filter((name) => {
    return width >= parseInt(breakpoints[name]);
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
  static get observedAttributes(): string[] {
    return (
      [Attributes.AUTOHIDE, Attributes.GESTURES_DISABLED]
        .concat(MEDIA_UI_ATTRIBUTE_NAMES)
        // Filter out specific / complex data media UI attributes
        // that shouldn't be propagated to this state receiver element.
        .filter(
          (name) =>
            ![
              MediaUIAttributes.MEDIA_RENDITION_LIST,
              MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST,
              MediaUIAttributes.MEDIA_CHAPTERS_CUES,
              MediaUIAttributes.MEDIA_WIDTH,
              MediaUIAttributes.MEDIA_HEIGHT,
            ].includes(name as any)
        )
    );
  }

  #pointerDownTimeStamp = 0;
  #currentMedia: HTMLMediaElement | null = null;
  #inactiveTimeout: ReturnType<typeof setTimeout> | null = null;
  #autohide: number | undefined;
  breakpointsComputed = false;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Watch for child adds/removes and update the media element if necessary
    const mutationCallback = (mutationsList: MutationRecord[]) => {
      const media = this.media;

      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Media element being removed
          mutation.removedNodes.forEach((node: Element) => {
            // Is this a direct child media element of media-controller?
            // TODO: This accuracy doesn't matter after moving away from media attrs.
            // Could refactor so we can always just call 'dispose' on any removed media el.
            if (node.slot == 'media' && mutation.target == this) {
              // Check if this was the current media by if it was the first
              // el with slot=media in the child list. There could be multiple.
              let previousSibling =
                mutation.previousSibling &&
                (mutation.previousSibling as Element).previousElementSibling;

              // Must have been first if no prev sibling or new media
              if (!previousSibling || !media) {
                this.mediaUnsetCallback(node as HTMLMediaElement);
              } else {
                // Check if any prev siblings had a slot=media
                // Should remain true otherwise
                let wasFirst = previousSibling.slot !== 'media';
                while (
                  (previousSibling =
                    previousSibling.previousSibling as Element) !== null
                ) {
                  if (previousSibling.slot == 'media') wasFirst = false;
                }
                if (wasFirst) this.mediaUnsetCallback(node as HTMLMediaElement);
              }
            }
          });

          // Controls or media element being added
          // No need to inject anything if media=null
          if (media) {
            mutation.addedNodes.forEach((node) => {
              if (node === media) {
                // Update all controls with new media if this is the new media
                this.handleMediaUpdated(media);
              }
            });
          }
        }
      }
    };

    const mutationObserver = new MutationObserver(mutationCallback);
    mutationObserver.observe(this, { childList: true, subtree: true });

    let pendingResizeCb = false;
    const deferResizeCallback = (entry: ResizeObserverEntry) => {
      // Already have a pending async breakpoint computation, so go ahead and bail
      if (pendingResizeCb) return;
      // Just in case it takes too long (which will cause an error to throw),
      // do the breakpoint computation asynchronously
      setTimeout(() => {
        resizeCallback(entry);
        // Once we've completed, reset the pending cb flag to false
        pendingResizeCb = false;

        if (!this.breakpointsComputed) {
          this.breakpointsComputed = true;
          this.dispatchEvent(
            new CustomEvent(MediaStateChangeEvents.BREAKPOINTS_COMPUTED, {
              bubbles: true,
              composed: true,
            })
          );
        }
      }, 0);
      pendingResizeCb = true;
    };
    observeResize(this, deferResizeCallback);

    // Handles the case when the slotted media element is a slot element itself.
    // e.g. chaining media slots for media themes.

    /** @type {HTMLSlotElement} */
    const chainedSlot = this.querySelector(
      ':scope > slot[slot=media]'
    ) as HTMLSlotElement;
    if (chainedSlot) {
      chainedSlot.addEventListener('slotchange', () => {
        const slotEls = chainedSlot.assignedElements({ flatten: true });
        if (!slotEls.length) {
          if (this.#currentMedia) {
            this.mediaUnsetCallback(this.#currentMedia);
          }
          return;
        }
        this.handleMediaUpdated(this.media);
      });
    }
  }

  // Could share this code with media-chrome-html-element instead
  attributeChangedCallback(
    attrName: string,
    oldValue: string,
    newValue: string
  ) {
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
   * videoTracks?,
   * }}
   */
  get media(): HTMLVideoElement | null {
    /** @type {HTMLVideoElement} */
    let media = this.querySelector(':scope > [slot=media]') as HTMLVideoElement;

    // Chaining media slots for media templates
    if (media?.nodeName == 'SLOT')
      // @ts-ignore
      media = media.assignedElements({ flatten: true })[0];

    return media;
  }

  /**
   * @param {HTMLMediaElement} media
   */
  async handleMediaUpdated(media: HTMLMediaElement) {
    // Anything "falsy" couldn't act as a media element.
    if (!media) return;

    this.#currentMedia = media;

    // Custom element. Wait until it's defined before resolving
    if (media.localName.includes('-')) {
      await globalThis.customElements.whenDefined(media.localName);
    }

    // Even if we are not connected to the DOM after this await still call mediaSetCallback
    // so the media state is already computed once, then when the container is connected
    // to the DOM mediaSetCallback is called again to attach the root node event listeners.

    this.mediaSetCallback(media);
  }

  connectedCallback(): void {
    const isAudioChrome = this.getAttribute(Attributes.AUDIO) != null;
    const label = isAudioChrome ? nouns.AUDIO_PLAYER() : nouns.VIDEO_PLAYER();
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', label);

    this.handleMediaUpdated(this.media);

    // Assume user is inactive until they're not (aka userinactive by default is true)
    // This allows things like autoplay and programmatic playing to also initiate hiding controls (CJP)
    this.setAttribute(Attributes.USER_INACTIVE, '');

    this.addEventListener('pointerdown', this);
    this.addEventListener('pointermove', this);
    this.addEventListener('pointerup', this);
    this.addEventListener('mouseleave', this);
    this.addEventListener('keyup', this);

    globalThis.window?.addEventListener('mouseup', this);
  }

  disconnectedCallback(): void {
    // When disconnected from the DOM, remove root node and media event listeners
    // to prevent memory leaks and unneeded invisble UI updates.
    if (this.media) {
      this.mediaUnsetCallback(this.media);
    }

    globalThis.window?.removeEventListener('mouseup', this);
  }

  /**
   * @abstract
   * @param {HTMLMediaElement} media
   */
  mediaSetCallback(media: HTMLMediaElement) {} // eslint-disable-line

  /**
   * @param {HTMLMediaElement} media
   */
  mediaUnsetCallback(
    media: HTMLMediaElement // eslint-disable-line
  ) {
    this.#currentMedia = null;
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case 'pointerdown':
        this.#pointerDownTimeStamp = (event as PointerEvent).timeStamp;
        break;
      case 'pointermove':
        this.#handlePointerMove(event as PointerEvent);
        break;
      case 'pointerup':
        this.#handlePointerUp(event as PointerEvent);
        break;
      case 'mouseleave':
        // Immediately hide if mouse leaves the container.
        this.#setInactive();
        break;
      case 'mouseup':
        this.removeAttribute(Attributes.KEYBOARD_CONTROL);
        break;
      case 'keyup':
        // Unhide for keyboard controlling.
        this.#scheduleInactive();
        // Allow for focus styles only when using the keyboard to navigate.
        this.setAttribute(Attributes.KEYBOARD_CONTROL, '');
        break;
    }
  }

  #handlePointerMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse') {
      // On mobile we toggle the controls on a tap which is handled in pointerup,
      // but Android fires pointermove events even when the user is just tapping.
      // Prevent calling setActive() on tap because it will mess with the toggle logic.
      const MAX_TAP_DURATION = 250;
      // If the move duration exceeds 200ms then it's a drag and we should show the controls.
      if (event.timeStamp - this.#pointerDownTimeStamp < MAX_TAP_DURATION)
        return;
    }

    this.#setActive();
    // Stay visible if hovered over control bar
    clearTimeout(this.#inactiveTimeout);

    // If hovering over something other than controls, we're free to make inactive
    // @ts-ignore
    if ([this, this.media].includes(event.target)) {
      this.#scheduleInactive();
    }
  }

  #handlePointerUp(event: PointerEvent) {
    if (event.pointerType === 'touch') {
      const controlsVisible = !this.hasAttribute(Attributes.USER_INACTIVE);

      if (
        [this, this.media].includes(event.target as HTMLVideoElement) &&
        controlsVisible
      ) {
        this.#setInactive();
      } else {
        this.#scheduleInactive();
      }
    } else if (
      event
        .composedPath()
        .some((el: HTMLElement) =>
          ['media-play-button', 'media-fullscreen-button'].includes(
            el?.localName
          )
        )
    ) {
      this.#scheduleInactive();
    }
  }

  #setInactive() {
    if (this.#autohide < 0) return;
    if (this.hasAttribute(Attributes.USER_INACTIVE)) return;

    this.setAttribute(Attributes.USER_INACTIVE, '');

    const evt = new globalThis.CustomEvent(
      MediaStateChangeEvents.USER_INACTIVE,
      { composed: true, bubbles: true, detail: true }
    );
    this.dispatchEvent(evt);
  }

  #setActive() {
    if (!this.hasAttribute(Attributes.USER_INACTIVE)) return;

    this.removeAttribute(Attributes.USER_INACTIVE);

    const evt = new globalThis.CustomEvent(
      MediaStateChangeEvents.USER_INACTIVE,
      { composed: true, bubbles: true, detail: false }
    );
    this.dispatchEvent(evt);
  }

  #scheduleInactive() {
    this.#setActive();

    clearTimeout(this.#inactiveTimeout);

    const autohide = parseInt(this.autohide);

    // Setting autohide to -1 turns off autohide
    if (autohide < 0) return;

    /** @type {ReturnType<typeof setTimeout>} */
    this.#inactiveTimeout = setTimeout(() => {
      this.#setInactive();
    }, autohide * 1000);
  }

  set autohide(seconds: string) {
    const parsedSeconds = Number(seconds);
    this.#autohide = isNaN(parsedSeconds) ? 0 : parsedSeconds;
  }

  get autohide(): string {
    return (this.#autohide === undefined ? 2 : this.#autohide).toString();
  }
}

if (!globalThis.customElements.get('media-container')) {
  globalThis.customElements.define('media-container', MediaContainer);
}

export { MediaContainer };
export default MediaContainer;
