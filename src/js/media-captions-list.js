import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import {
  MediaUIEvents,
  MediaUIAttributes,
  TextTrackKinds,
} from './constants.js';
import { parseTextTrackStr, splitTextTracksStr } from './utils/captions.js';
import MediaChromeListbox from './media-chrome-listbox.js';

const CC_PREFIX = '!cc';
const isCC = (extendedTextTrackStr = '') =>
  extendedTextTrackStr?.startsWith?.(CC_PREFIX);
const withoutCC = (extendedTextTrackStr = '') => {
  if (!isCC(extendedTextTrackStr)) return extendedTextTrackStr;
  return extendedTextTrackStr.slice(CC_PREFIX.length + 1);
};

const withCC = (textTrackStr = '') => `${CC_PREFIX}:${textTrackStr}`;

const DEFAULT_UNKNOWN_LABEL = 'UNKNOWN';
const DEFAULT_CC_LABEL_PART = '(cc)';
const DEFAULT_FORMATTER = (value) => {
  const textTrackStr = withoutCC(value);
  const baseLabel =
    parseTextTrackStr(textTrackStr)?.label ?? DEFAULT_UNKNOWN_LABEL;
  const suffix = isCC(value) ? ` ${DEFAULT_CC_LABEL_PART}` : '';
  return `${baseLabel}${suffix}`;
};
const parseAsSubCCStr = (str, kind = TextTrackKinds.SUBTITLES) => {
  if (!str) return [];
  if (kind === TextTrackKinds.SUBTITLES) return splitTextTracksStr(str);
  return splitTextTracksStr(str).map(withCC);
};

class MediaCaptionsList extends MediaChromeListbox {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  constructor({ format = DEFAULT_FORMATTER } = {}) {
    super({ format });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        MediaUIAttributes.MEDIA_SUBTITLES_LIST,
        MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      ].includes(attrName) &&
      oldValue !== newValue
    ) {
      this.data = [
        ...parseAsSubCCStr(
          this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST)
        ),
        ...parseAsSubCCStr(
          this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_LIST),
          TextTrackKinds.CAPTIONS
        ),
      ];
    } else if (
      [
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
        MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      ].includes(attrName) &&
      oldValue !== newValue
      && !this.stateUpdaterId
    ) {
      // Discuss this simple scheduling as a means of avoiding edge case updates as a result of 
      // unsetting + resetting via distinct events + separation of captions vs. subtitles (CJP)
      this.stateUpdaterId = setTimeout(() => {
        this.selectedValue = this.hasAttribute(MediaUIAttributes.MEDIA_CAPTIONS_SHOWING)
          ? withCC(this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_SHOWING))
          : this.hasAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING)
          ? this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING)
          : undefined;
       this.stateUpdaterId = undefined;
      });
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  get selectedElement() {
    return super.selectedElement;
  }

  // Discuss well-defined method instead of getter/setter
  set selectedElement(element) {
    if (element === this.selectedElement) return;
    if (!!this.selectedElement) {
      const type = isCC(this.selectedValue)
        ? MediaUIEvents.MEDIA_DISABLE_CAPTIONS_REQUEST
        : MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST;
      const evt = new window.CustomEvent(type, {
        composed: true,
        bubbles: true,
        detail: withoutCC(this.selectedElement.id),
      });
      this.dispatchEvent(evt);
    }
    // Discuss this "being presumptuous" (could require it to always be set "from the outside", but would need some refactoring)
    // Discuss "internally managed state" vs. "externally provided state"
    super.selectedElement = element;
    if (element) {
      const type = isCC(this.selectedValue)
        ? MediaUIEvents.MEDIA_SHOW_CAPTIONS_REQUEST
        : MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST;
      const evt = new window.CustomEvent(type, {
        composed: true,
        bubbles: true,
        detail: withoutCC(element.id),
      });
      this.dispatchEvent(evt);
    }
  }
}

defineCustomElement('media-captions-list', MediaCaptionsList);

export default MediaCaptionsList;
