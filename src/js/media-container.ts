/*
  The <media-chrome> can contain the control elements
  and the media element. Features:
  * Auto-set the `media` attribute on child media chrome elements
    * Uses the element with slot="media"
  * Take custom controls to fullscreen
  * Position controls at the bottom
  * Auto-hide controls on inactivity while playing
*/
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIAttributes, MediaStateChangeEvents } from './constants.js';
import { observeResize, unobserveResize } from './utils/resize-observer.js';
// Guarantee that `<media-gesture-receiver/>` is available for use in the template
import './media-gesture-receiver.js';
import { t } from './utils/i18n.js';
import {
  getBooleanAttr,
  getStringAttr,
  namedNodeMapToObject,
  setBooleanAttr,
  setStringAttr,
} from './utils/element-utils.js';
import MediaGestureReceiver from './media-gesture-receiver.js';

export const Attributes = {
  AUDIO: 'audio',
  AUTOHIDE: 'autohide',
  BREAKPOINTS: 'breakpoints',
  GESTURES_DISABLED: 'gesturesdisabled',
  KEYBOARD_CONTROL: 'keyboardcontrol',
  NO_AUTOHIDE: 'noautohide',
  USER_INACTIVE: 'userinactive',
  AUTOHIDE_OVER_CONTROLS: 'autohideovercontrols',
};

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
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
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
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
      }]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
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
      }]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${Attributes.USER_INACTIVE}]:not([${Attributes.NO_AUTOHIDE}]):not([${
        MediaUIAttributes.MEDIA_PAUSED
      }]):not([${MediaUIAttributes.MEDIA_IS_CASTING}]):not([${
        Attributes.AUDIO
      }])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${Attributes.USER_INACTIVE}][${
        Attributes.AUTOHIDE_OVER_CONTROLS
      }]:not([${Attributes.NO_AUTOHIDE}]):not([${
        MediaUIAttributes.MEDIA_PAUSED
      }]):not([${MediaUIAttributes.MEDIA_IS_CASTING}]):not([${Attributes.AUDIO}])) * {
        --media-cursor: none;
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

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${MediaGestureReceiver.shadowRootOptions.mode}">
          ${MediaGestureReceiver.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      ${/* default, effectively "bottom-chrome" */ ''}
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `;
}

const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);

const defaultBreakpoints = 'sm:384 md:576 lg:768 xl:960';

function resizeCallback(entry: ResizeObserverEntry) {
  setBreakpoints(entry.target as MediaContainer, entry.contentRect.width);
}

function setBreakpoints(container: MediaContainer, width: number) {
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

  if (!container.breakpointsComputed) {
    container.breakpointsComputed = true;

    container.dispatchEvent(
      new CustomEvent(MediaStateChangeEvents.BREAKPOINTS_COMPUTED, {
        bubbles: true,
        composed: true,
      })
    );
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
 * @attr {boolean} autohideovercontrols
 * @attr {string} breakpoints
 * @attr {boolean} gesturesdisabled
 * @attr {boolean} keyboardcontrol
 * @attr {boolean} noautohide
 * @attr {boolean} userinactive
 *
 * @cssprop --media-background-color - `background-color` of container.
 * @cssprop --media-slot-display - `display` of the media slot (default none for [audio] usage).
 * @cssprop --media-control-transition-out - `transition` used to define the animation effect when hiding the container.
 * @cssprop --media-control-transition-in - `transition` used to define the animation effect when showing the container.
 */
class MediaContainer extends globalThis.HTMLElement {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;

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
              MediaUIAttributes.MEDIA_ERROR,
              MediaUIAttributes.MEDIA_ERROR_MESSAGE,
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
      this.attachShadow((this.constructor as typeof MediaContainer).shadowRootOptions);

      const attrs = namedNodeMapToObject(this.attributes);
      const html = (this.constructor as typeof MediaContainer).getTemplateHTML(attrs);
      // From MDN: setHTMLUnsafe should be used instead of ShadowRoot.innerHTML 
      // when a string of HTML may contain declarative shadow roots.
      this.shadowRoot.setHTMLUnsafe ?
        this.shadowRoot.setHTMLUnsafe(html) :
        this.shadowRoot.innerHTML = html;
    }

    // Handles the case when the slotted media element is a slot element itself.
    // e.g. chaining media slots for media themes.
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
    _oldValue: string,
    newValue: string
  ) {
    if (attrName.toLowerCase() == Attributes.AUTOHIDE) {
      this.autohide = newValue;
    }
  }

  // First direct child with slot=media, or null
  get media(): HTMLVideoElement | null {
    let media = this.querySelector(':scope > [slot=media]') as HTMLVideoElement;

    // Chaining media slots for media templates
    if (media?.nodeName == 'SLOT')
      // @ts-ignore
      media = media.assignedElements({ flatten: true })[0];

    return media;
  }

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
    // Watch for child adds/removes and update the media element if necessary
    this.#mutationObserver.observe(this, { childList: true, subtree: true });
    observeResize(this, this.#handleResize);

    const isAudioChrome = this.getAttribute(Attributes.AUDIO) != null;
    const label = isAudioChrome ? t('audio player') : t('video player');
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', label);

    this.handleMediaUpdated(this.media);

    // Assume user is inactive until they're not (aka userinactive by default is true)
    // This allows things like autoplay and programmatic playing to also initiate hiding controls (CJP)
    this.setAttribute(Attributes.USER_INACTIVE, '');

    // Set breakpoints on connect since we delay resize observer callbacks.
    setBreakpoints(this, this.getBoundingClientRect().width);

    this.addEventListener('pointerdown', this);
    this.addEventListener('pointermove', this);
    this.addEventListener('pointerup', this);
    this.addEventListener('mouseleave', this);
    this.addEventListener('keyup', this);

    globalThis.window?.addEventListener('mouseup', this);
  }

  disconnectedCallback(): void {
    this.#mutationObserver.disconnect();
    unobserveResize(this, this.#handleResize);

    // When disconnected from the DOM, remove root node and media event listeners
    // to prevent memory leaks and unneeded invisble UI updates.
    if (this.media) {
      this.mediaUnsetCallback(this.media);
    }

    globalThis.window?.removeEventListener('mouseup', this);
  }

  /**
   * @abstract
   */
  mediaSetCallback(_media: HTMLMediaElement) {}

  mediaUnsetCallback(_media: HTMLMediaElement) {
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

  #mutationObserver = new MutationObserver(this.#handleMutation.bind(this));
  #handleMutation(mutationsList: MutationRecord[]) {
    const media = this.media;

    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList') continue;

      const removedNodes = mutation.removedNodes as NodeListOf<Element>;

      // Media element being removed
      for (const node of removedNodes) {
        // Is this a direct child media element of media-controller?
        // TODO: This accuracy doesn't matter after moving away from media attrs.
        // Could refactor so we can always just call 'dispose' on any removed media el.
        if (node.slot != 'media' || mutation.target != this) continue;

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
            (previousSibling = previousSibling.previousSibling as Element) !==
            null
          ) {
            if (previousSibling.slot == 'media') wasFirst = false;
          }

          if (wasFirst) this.mediaUnsetCallback(node as HTMLMediaElement);
        }
      }

      // Controls or media element being added
      // No need to inject anything if media=null
      if (media) {
        for (const node of mutation.addedNodes) {
          // Update all controls with new media if this is the new media
          if (node === media) this.handleMediaUpdated(media);
        }
      }
    }
  }

  #isResizePending = false;
  #handleResize = (entry: ResizeObserverEntry) => {
    // Already have a pending async breakpoint computation, so go ahead and bail
    if (this.#isResizePending) return;

    // Just in case it takes too long (which will cause an error to throw),
    // do the breakpoint computation asynchronously
    setTimeout(() => {
      resizeCallback(entry);

      // Once we've completed, reset the pending cb flag to false
      this.#isResizePending = false;
    }, 0);

    this.#isResizePending = true;
  };

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

    const autohideOverControls = this.hasAttribute(
      Attributes.AUTOHIDE_OVER_CONTROLS
    );
    // @ts-ignore
    if ([this, this.media].includes(event.target) || autohideOverControls) {
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
      MediaStateChangeEvents.USER_INACTIVE_CHANGE,
      { composed: true, bubbles: true, detail: true }
    );
    this.dispatchEvent(evt);
  }

  #setActive() {
    if (!this.hasAttribute(Attributes.USER_INACTIVE)) return;

    this.removeAttribute(Attributes.USER_INACTIVE);

    const evt = new globalThis.CustomEvent(
      MediaStateChangeEvents.USER_INACTIVE_CHANGE,
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

  get breakpoints(): string | undefined {
    return getStringAttr(this, Attributes.BREAKPOINTS);
  }

  set breakpoints(value: string | undefined) {
    setStringAttr(this, Attributes.BREAKPOINTS, value);
  }

  get audio(): boolean | undefined {
    return getBooleanAttr(this, Attributes.AUDIO);
  }

  set audio(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.AUDIO, value);
  }

  get gesturesDisabled(): boolean | undefined {
    return getBooleanAttr(this, Attributes.GESTURES_DISABLED);
  }

  set gesturesDisabled(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.GESTURES_DISABLED, value);
  }

  get keyboardControl(): boolean | undefined {
    return getBooleanAttr(this, Attributes.KEYBOARD_CONTROL);
  }

  set keyboardControl(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.KEYBOARD_CONTROL, value);
  }

  get noAutohide(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_AUTOHIDE);
  }

  set noAutohide(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_AUTOHIDE, value);
  }

  get autohideOverControls(): boolean | undefined {
    return getBooleanAttr(this, Attributes.AUTOHIDE_OVER_CONTROLS);
  }

  set autohideOverControls(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.AUTOHIDE_OVER_CONTROLS, value);
  }

  get userInteractive(): boolean | undefined {
    return getBooleanAttr(this, Attributes.USER_INACTIVE);
  }

  set userInteractive(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.USER_INACTIVE, value);
  }
}

if (!globalThis.customElements.get('media-container')) {
  globalThis.customElements.define('media-container', MediaContainer);
}

export { MediaContainer };
export default MediaContainer;
