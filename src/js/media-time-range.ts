import { globalThis } from './utils/server-safe-globals.js';
import { MediaChromeRange } from './media-chrome-range.js';
import './media-preview-thumbnail.js';
import './media-preview-time-display.js';
import './media-preview-chapter-display.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { isValidNumber } from './utils/utils.js';
import { formatAsTimePhrase } from './utils/time.js';
import { isElementVisible } from './utils/element-utils.js';
import { RangeAnimation } from './utils/range-animation.js';
import {
  getOrInsertCSSRule,
  containsComposedNode,
  closestComposedNode,
  getBooleanAttr,
  setBooleanAttr,
  getNumericAttr,
  setNumericAttr,
  getStringAttr,
  setStringAttr,
} from './utils/element-utils.js';
import { t } from './utils/i18n.js';
import MediaPreviewThumbnail from './media-preview-thumbnail.js';

type Rects = {
  box: { width: number; min: number; max: number };
  range?: DOMRect;
  bounds?: DOMRect;
};

const DEFAULT_MISSING_TIME_PHRASE = 'video not loaded, unknown time.';

const updateAriaValueText = (el: any): void => {
  const range = el.range;
  const currentTimePhrase = formatAsTimePhrase(+calcTimeFromRangeValue(el));
  const totalTimePhrase = formatAsTimePhrase(+el.mediaSeekableEnd);
  const fullPhrase = !(currentTimePhrase && totalTimePhrase)
    ? DEFAULT_MISSING_TIME_PHRASE
    : `${currentTimePhrase} of ${totalTimePhrase}`;
  range.setAttribute('aria-valuetext', fullPhrase);
};

function getTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    ${MediaChromeRange.getTemplateHTML(_attrs)}
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        ${
          /* 1% rail width trick was off in Safari, contain: layout seems to
          prevent the horizontal overflow as well. */ ''
        }
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        ${
          /* absolute position is needed here so the box doesn't overflow the bounds */ ''
        }
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}], [${
        MediaUIAttributes.MEDIA_PREVIEW_TIME
      }])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}], [${
          MediaUIAttributes.MEDIA_PREVIEW_TIME
        }]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        ${
          /* delay changing these CSS props until the preview box transition is ended */ ''
        }
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE
      }][dragging]) media-preview-thumbnail,
      :host([${
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE
      }][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${
          MediaUIAttributes.MEDIA_PREVIEW_IMAGE
        }]:hover) media-preview-thumbnail,
        :host([${
          MediaUIAttributes.MEDIA_PREVIEW_IMAGE
        }]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${MediaUIAttributes.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        ${
          /* delay changing these CSS props until the preview box transition is ended */ ''
        }
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE
      }]) media-preview-chapter-display,
      :host([${
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE
      }]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${MediaUIAttributes.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${
        MediaUIAttributes.MEDIA_PREVIEW_CHAPTER
      }]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        ${
          /* delay changing these CSS props until the preview box transition is ended */ ''
        }
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE
      }]) media-preview-time-display,
      :host([${
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE
      }]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${MediaUIAttributes.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        ${/* border-color has to come before border-top-color! */ ''}
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${MediaPreviewThumbnail.shadowRootOptions.mode}">
            ${MediaPreviewThumbnail.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        ${
          /* Example: add the current time w/ arrow to the playhead
          <media-time-display slot="current"></media-time-display>
          <div part="arrow" slot="current"></div> */ ''
        }
      </slot>
    </div>
  `;
}

const calcRangeValueFromTime = (
  el: any,
  time: number = el.mediaCurrentTime
): number => {
  const startTime = Number.isFinite(el.mediaSeekableStart)
    ? el.mediaSeekableStart
    : 0;
  // Prefer `mediaDuration` when available and finite.
  const endTime = Number.isFinite(el.mediaDuration)
    ? el.mediaDuration
    : el.mediaSeekableEnd;
  if (Number.isNaN(endTime)) return 0;
  const value = (time - startTime) / (endTime - startTime);
  return Math.max(0, Math.min(value, 1));
};

const calcTimeFromRangeValue = (
  el: any,
  value: number = el.range.valueAsNumber
): number => {
  const startTime = Number.isFinite(el.mediaSeekableStart)
    ? el.mediaSeekableStart
    : 0;
  // Prefer `mediaDuration` when available and finite.
  const endTime = Number.isFinite(el.mediaDuration)
    ? el.mediaDuration
    : el.mediaSeekableEnd;
  if (Number.isNaN(endTime)) return 0;
  return value * (endTime - startTime) + startTime;
};

/**
 * @slot preview - An element that slides along the timeline to the position of the pointer hovering.
 * @slot preview-arrow - An arrow element that slides along the timeline to the position of the pointer hovering.
 * @slot current - An element that slides along the timeline to the position of the current time.
 *
 * @attr {string} mediabuffered - (read-only) Set to the buffered time ranges.
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 * @attr {string} mediaduration - (read-only) Set to the media duration.
 * @attr {string} mediaseekable - (read-only) Set to the seekable time ranges.
 * @attr {boolean} mediapaused - (read-only) Present if the media is paused.
 * @attr {boolean} medialoading - (read-only) Present if the media is loading.
 * @attr {string} mediacurrenttime - (read-only) Set to the current media time.
 * @attr {string} mediapreviewimage - (read-only) Set to the timeline preview image URL.
 * @attr {string} mediapreviewtime - (read-only) Set to the timeline preview time.
 *
 * @csspart buffered - A CSS part that selects the buffered bar element.
 * @csspart box - A CSS part that selects both the preview and current box elements.
 * @csspart preview-box - A CSS part that selects the preview box element.
 * @csspart current-box - A CSS part that selects the current box element.
 * @csspart arrow - A CSS part that selects the arrow element.
 *
 * @cssproperty [--media-time-range-display = inline-block] - `display` property of range.
 * @cssproperty --media-time-range-buffered-color - `background` color of buffered range.
 *
 * @cssproperty --media-preview-transition-property - `transition-property` of range hover preview.
 * @cssproperty --media-preview-transition-duration-out - `transition-duration` out of range hover preview.
 * @cssproperty --media-preview-transition-delay-out - `transition-delay` out of range hover preview.
 * @cssproperty --media-preview-transition-duration-in - `transition-duration` in of range hover preview.
 * @cssproperty --media-preview-transition-delay-in - `transition-delay` in of range hover preview.
 *
 * @cssproperty --media-preview-thumbnail-background - `background` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-box-shadow - `box-shadow` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-max-width - `max-width` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-max-height - `max-height` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-min-width - `min-width` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-min-height - `min-height` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-border-radius - `border-radius` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-border - `border` of range preview thumbnail.
 *
 * @cssproperty --media-preview-chapter-background - `background` of range preview chapter display.
 * @cssproperty --media-preview-chapter-border-radius - `border-radius` of range preview chapter display.
 * @cssproperty --media-preview-chapter-padding - `padding` of range preview chapter display.
 * @cssproperty --media-preview-chapter-margin - `margin` of range preview chapter display.
 * @cssproperty --media-preview-chapter-text-shadow - `text-shadow` of range preview chapter display.
 *
 * @cssproperty --media-preview-background - `background` of range preview elements.
 * @cssproperty --media-preview-border-radius - `border-radius` of range preview elements.
 *
 * @cssproperty --media-preview-time-background - `background` of range preview time display.
 * @cssproperty --media-preview-time-border-radius - `border-radius` of range preview time display.
 * @cssproperty --media-preview-time-padding - `padding` of range preview time display.
 * @cssproperty --media-preview-time-margin - `margin` of range preview time display.
 * @cssproperty --media-preview-time-text-shadow - `text-shadow` of range preview time display.
 *
 * @cssproperty --media-box-display - `display` of range box.
 * @cssproperty --media-box-margin - `margin` of range box.
 * @cssproperty --media-box-padding-left - `padding-left` of range box.
 * @cssproperty --media-box-padding-right - `padding-right` of range box.
 * @cssproperty --media-box-border-radius - `border-radius` of range box.
 *
 * @cssproperty --media-preview-box-display - `display` of range preview box.
 * @cssproperty --media-preview-box-margin - `margin` of range preview box.
 *
 * @cssproperty --media-current-box-display - `display` of range current box.
 * @cssproperty --media-current-box-margin - `margin` of range current box.
 *
 * @cssproperty --media-box-arrow-display - `display` of range box arrow.
 * @cssproperty --media-box-arrow-background - `border-top-color` of range box arrow.
 * @cssproperty --media-box-arrow-border-width - `border-width` of range box arrow.
 * @cssproperty --media-box-arrow-height - `height` of range box arrow.
 * @cssproperty --media-box-arrow-width - `width` of range box arrow.
 * @cssproperty --media-box-arrow-offset - `translateX` offset of range box arrow.
 * 
 * @cssproperty --media-cursor - `cursor` property.
 * @cssproperty --media-focus-box-shadow - `box-shadow` of focused control.
 */
class MediaTimeRange extends MediaChromeRange {
  static shadowRootOptions = { mode: 'open' as ShadowRootMode };
  static getTemplateHTML = getTemplateHTML;

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PAUSED,
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_PREVIEW_TIME,
      MediaUIAttributes.MEDIA_PREVIEW_CHAPTER,
      MediaUIAttributes.MEDIA_BUFFERED,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      MediaUIAttributes.MEDIA_LOADING,
      MediaUIAttributes.MEDIA_ENDED,
    ];
  }

  #rootNode;
  #animation;
  #boxes;
  #previewTime: number;
  #previewBox: HTMLElement;
  #currentBox: HTMLElement;
  #boxPaddingLeft: number;
  #boxPaddingRight: number;
  #mediaChaptersCues;
  #isPointerDown: boolean;

  constructor() {
    super();

    const track = this.shadowRoot.querySelector('#track');
    track.insertAdjacentHTML(
      'afterbegin',
      '<div id="buffered" part="buffered"></div>'
    );

    this.#boxes = this.shadowRoot.querySelectorAll('[part~="box"]');
    this.#previewBox = this.shadowRoot.querySelector('[part~="preview-box"]');
    this.#currentBox = this.shadowRoot.querySelector('[part~="current-box"]');

    const computedStyle = getComputedStyle(this);
    this.#boxPaddingLeft = parseInt(
      computedStyle.getPropertyValue('--media-box-padding-left')
    );
    this.#boxPaddingRight = parseInt(
      computedStyle.getPropertyValue('--media-box-padding-right')
    );

    this.#animation = new RangeAnimation(this.range, this.#updateRange, 60);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.range.setAttribute('aria-label', t('seek'));
    this.#toggleRangeAnimation();

    // NOTE: Adding an event listener to an ancestor here.
    this.#rootNode = this.getRootNode();
    this.#rootNode?.addEventListener('transitionstart', this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#toggleRangeAnimation();

    this.#rootNode?.removeEventListener('transitionstart', this);
    this.#rootNode = null;
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (oldValue == newValue) return;

    if (
      attrName === MediaUIAttributes.MEDIA_CURRENT_TIME ||
      attrName === MediaUIAttributes.MEDIA_PAUSED ||
      attrName === MediaUIAttributes.MEDIA_ENDED ||
      attrName === MediaUIAttributes.MEDIA_LOADING ||
      attrName === MediaUIAttributes.MEDIA_DURATION ||
      attrName === MediaUIAttributes.MEDIA_SEEKABLE
    ) {
      this.#animation.update({
        start: calcRangeValueFromTime(this),
        duration: this.mediaSeekableEnd - this.mediaSeekableStart,
        playbackRate: this.mediaPlaybackRate,
      });
      this.#toggleRangeAnimation();
      updateAriaValueText(this);
    } else if (attrName === MediaUIAttributes.MEDIA_BUFFERED) {
      this.updateBufferedBar();
    }

    if (
      attrName === MediaUIAttributes.MEDIA_DURATION ||
      attrName === MediaUIAttributes.MEDIA_SEEKABLE
    ) {
      this.mediaChaptersCues = this.#mediaChaptersCues;
      this.updateBar();
    }
  }

  #toggleRangeAnimation(): void {
    if (this.#shouldRangeAnimate()) {
      this.#animation.start();
    } else {
      this.#animation.stop();
    }
  }

  #shouldRangeAnimate(): boolean {
    return (
      this.isConnected &&
      !this.mediaPaused &&
      !this.mediaLoading &&
      !this.mediaEnded &&
      this.mediaSeekableEnd > 0 &&
      isElementVisible(this)
    );
  }

  #updateRange = (value: number): void => {
    if (this.dragging) return;

    if (isValidNumber(value)) {
      this.range.valueAsNumber = value;
    }

    if (!this.#isPointerDown) {
      this.updateBar();
    }
  };

  get mediaChaptersCues(): any[] {
    return this.#mediaChaptersCues;
  }

  set mediaChaptersCues(value: any[]) {
    this.#mediaChaptersCues = value;

    this.updateSegments(
      this.#mediaChaptersCues?.map((c) => ({
        start: calcRangeValueFromTime(this, c.startTime),
        end: calcRangeValueFromTime(this, c.endTime),
      }))
    );
  }

  /**
   * Is the media paused
   */
  get mediaPaused(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
  }

  set mediaPaused(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
  }

  /**
   * Is the media loading
   */
  get mediaLoading(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING);
  }

  set mediaLoading(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING, value);
  }

  /**
   *
   */
  get mediaDuration(): number | undefined {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
  }

  set mediaDuration(value: number | undefined) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, value);
  }

  /**
   *
   */
  get mediaCurrentTime(): number | undefined {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME);
  }

  set mediaCurrentTime(value: number | undefined) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, value);
  }

  /**
   *
   */
  get mediaPlaybackRate(): number {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, 1);
  }

  set mediaPlaybackRate(value: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
  }

  /**
   * An array of ranges, each range being an array of two numbers.
   * e.g. [[1, 2], [3, 4]]
   */
  get mediaBuffered(): number[][] {
    const buffered = this.getAttribute(MediaUIAttributes.MEDIA_BUFFERED);
    if (!buffered) return [];
    return buffered
      .split(' ')
      .map((timePair) => timePair.split(':').map((timeStr) => +timeStr));
  }

  set mediaBuffered(list: number[][]) {
    if (!list) {
      this.removeAttribute(MediaUIAttributes.MEDIA_BUFFERED);
      return;
    }
    const strVal = list.map((tuple) => tuple.join(':')).join(' ');
    this.setAttribute(MediaUIAttributes.MEDIA_BUFFERED, strVal);
  }

  /**
   * Range of values that can be seeked to
   * An array of two numbers [start, end]
   */
  get mediaSeekable(): number[] | undefined {
    const seekable = this.getAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
    if (!seekable) return undefined;
    // Only currently supports a single, contiguous seekable range (CJP)
    return seekable.split(':').map((time) => +time);
  }

  set mediaSeekable(range: number[] | undefined) {
    if (range == null) {
      this.removeAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
      return;
    }
    this.setAttribute(MediaUIAttributes.MEDIA_SEEKABLE, range.join(':'));
  }

  /**
   *
   */
  get mediaSeekableEnd(): number | undefined {
    const [, end = this.mediaDuration] = this.mediaSeekable ?? [];
    return end;
  }

  get mediaSeekableStart(): number {
    const [start = 0] = this.mediaSeekable ?? [];
    return start;
  }

  /**
   * The url of the preview image
   */
  get mediaPreviewImage(): string | undefined {
    return getStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE);
  }

  set mediaPreviewImage(value: string | undefined) {
    setStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE, value);
  }

  /**
   *
   */
  get mediaPreviewTime(): number | undefined {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME);
  }

  set mediaPreviewTime(value: number | undefined) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME, value);
  }

  /**
   *
   */
  get mediaEnded(): boolean | undefined {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_ENDED);
  }

  set mediaEnded(value: boolean | undefined) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_ENDED, value);
  }

  /* Add a buffered progress bar */
  updateBar(): void {
    super.updateBar();
    this.updateBufferedBar();
    this.updateCurrentBox();
  }

  updateBufferedBar(): void {
    const buffered = this.mediaBuffered;
    if (!buffered.length) {
      return;
    }

    // Find the buffered range that "contains" the current time and get its end.
    // If none, just assume the start of the media timeline for
    // visualization purposes.
    let relativeBufferedEnd;

    if (!this.mediaEnded) {
      const currentTime = this.mediaCurrentTime;
      const [, bufferedEnd = this.mediaSeekableStart] =
        buffered.find(
          ([start, end]) => start <= currentTime && currentTime <= end
        ) ?? [];
      relativeBufferedEnd = calcRangeValueFromTime(this, bufferedEnd);
    } else {
      // If we've ended, there may be some discrepancies between seekable end, duration, and current time.
      // In this case, just presume `relativeBufferedEnd` is the maximum possible value for visualization
      // purposes (CJP.)
      relativeBufferedEnd = 1;
    }

    const { style } = getOrInsertCSSRule(this.shadowRoot, '#buffered');
    style.setProperty('width', `${relativeBufferedEnd * 100}%`);
  }

  updateCurrentBox(): void {
    // If there are no elements in the current box no need for expensive style updates.
    const currentSlot: HTMLSlotElement = this.shadowRoot.querySelector(
      'slot[name="current"]'
    );
    if (!currentSlot.assignedElements().length) return;

    const currentRailRule = getOrInsertCSSRule(
      this.shadowRoot,
      '#current-rail'
    );
    const currentBoxRule = getOrInsertCSSRule(
      this.shadowRoot,
      '[part~="current-box"]'
    );

    const rects = this.#getElementRects(this.#currentBox);
    const boxPos = this.#getBoxPosition(rects, this.range.valueAsNumber);
    const boxShift = this.#getBoxShiftPosition(rects, this.range.valueAsNumber);

    currentRailRule.style.transform = `translateX(${boxPos})`;
    currentRailRule.style.setProperty('--_range-width', `${rects.range.width}`);
    currentBoxRule.style.setProperty('--_box-shift', `${boxShift}`);
    currentBoxRule.style.setProperty('--_box-width', `${rects.box.width}px`);
    currentBoxRule.style.setProperty('visibility', 'initial');
  }

  #getElementRects(box: HTMLElement) {
    // Get the element that enforces the bounds for the time range boxes.
    const bounds =
      (this.getAttribute('bounds')
        ? closestComposedNode(this, `#${this.getAttribute('bounds')}`)
        : this.parentElement) ?? this;

    const boundsRect = bounds.getBoundingClientRect();
    const rangeRect = this.range.getBoundingClientRect();

    // Use offset dimensions to include borders.
    const width = box.offsetWidth;
    const min = -(rangeRect.left - boundsRect.left - width / 2);
    const max = boundsRect.right - rangeRect.left - width / 2;

    return {
      box: { width, min, max },
      bounds: boundsRect,
      range: rangeRect,
    };
  }

  /**
   * Get the position, max and min for the box in percentage.
   * It's important this is in percentage so when the player is resized
   * the box will move accordingly.
   */
  #getBoxPosition(rects: Rects, ratio: number): string {
    let position = `${ratio * 100}%`;
    const { width, min, max } = rects.box;

    if (!width) return position;

    if (!Number.isNaN(min)) {
      const pad = `var(--media-box-padding-left)`;
      const minPos = `calc(1 / var(--_range-width) * 100 * ${min}% + ${pad})`;
      position = `max(${minPos}, ${position})`;
    }

    if (!Number.isNaN(max)) {
      const pad = `var(--media-box-padding-right)`;
      const maxPos = `calc(1 / var(--_range-width) * 100 * ${max}% - ${pad})`;
      position = `min(${position}, ${maxPos})`;
    }

    return position;
  }

  #getBoxShiftPosition(rects: Rects, ratio: number) {
    const { width, min, max } = rects.box;
    const pointerX = ratio * rects.range.width;

    if (pointerX < min + this.#boxPaddingLeft) {
      const offset =
        rects.range.left - rects.bounds.left - this.#boxPaddingLeft;
      return `${pointerX - width / 2 + offset}px`;
    }

    if (pointerX > max - this.#boxPaddingRight) {
      const offset =
        rects.bounds.right - rects.range.right - this.#boxPaddingRight;
      return `${pointerX + width / 2 - offset - rects.range.width}px`;
    }

    return 0;
  }

  handleEvent(evt: Event | MouseEvent): void {
    super.handleEvent(evt);

    switch (evt.type) {
      case 'input':
        this.#seekRequest();
        break;
      case 'pointermove':
        this.#handlePointerMove(evt as MouseEvent);
        break;
      case 'pointerup':
        if (this.#isPointerDown) this.#isPointerDown = false;
        break;
      case 'pointerdown':
        this.#isPointerDown = true;
        break;
      case 'pointerleave':
        this.#previewRequest(null);
        break;
      case 'transitionstart':
        if (containsComposedNode(evt.target as any, this)) {
          // Wait a tick to be sure the transition has started. Required for Safari.
          setTimeout(() => this.#toggleRangeAnimation(), 0);
        }
        break;
    }
  }

  #handlePointerMove(evt: MouseEvent): void {
    // @ts-ignore
    const isOverBoxes = [...this.#boxes].some((b) =>
      evt.composedPath().includes(b)
    );

    if (!this.dragging && (isOverBoxes || !evt.composedPath().includes(this))) {
      this.#previewRequest(null);
      return;
    }

    const duration = this.mediaSeekableEnd;
    // If no duration we can't calculate which time to show
    if (!duration) return;

    const previewRailRule = getOrInsertCSSRule(
      this.shadowRoot,
      '#preview-rail'
    );
    const previewBoxRule = getOrInsertCSSRule(
      this.shadowRoot,
      '[part~="preview-box"]'
    );

    const rects = this.#getElementRects(this.#previewBox);

    let pointerRatio = (evt.clientX - rects.range.left) / rects.range.width;
    pointerRatio = Math.max(0, Math.min(1, pointerRatio));

    const boxPos = this.#getBoxPosition(rects, pointerRatio);
    const boxShift = this.#getBoxShiftPosition(rects, pointerRatio);

    previewRailRule.style.transform = `translateX(${boxPos})`;
    previewRailRule.style.setProperty('--_range-width', `${rects.range.width}`);
    previewBoxRule.style.setProperty('--_box-shift', `${boxShift}`);
    previewBoxRule.style.setProperty('--_box-width', `${rects.box.width}px`);

    // At least require a 1s difference before requesting a new preview thumbnail,
    // unless it's at the beginning or end of the timeline.
    const diff =
      Math.round(this.#previewTime) - Math.round(pointerRatio * duration);
    if (Math.abs(diff) < 1 && pointerRatio > 0.01 && pointerRatio < 0.99)
      return;

    this.#previewTime = pointerRatio * duration;
    this.#previewRequest(this.#previewTime);
  }

  #previewRequest(detail): void {
    this.dispatchEvent(
      new globalThis.CustomEvent(MediaUIEvents.MEDIA_PREVIEW_REQUEST, {
        composed: true,
        bubbles: true,
        detail,
      })
    );
  }

  #seekRequest(): void {
    // Cancel progress bar refreshing when seeking.
    this.#animation.stop();

    const detail = calcTimeFromRangeValue(this);
    this.dispatchEvent(
      new globalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
        composed: true,
        bubbles: true,
        detail,
      })
    );
  }
}

if (!globalThis.customElements.get('media-time-range')) {
  globalThis.customElements.define('media-time-range', MediaTimeRange);
}

export default MediaTimeRange;
