import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { parseTextTrackStr, splitTextTracksStr } from './utils/captions.js';
import MediaChromeList from './media-chrome-list.js';

const DEFAULT_FORMATTER = (value) => parseTextTrackStr(value)?.label ?? 'UNKNOWN';
const DEFAULT_PARSER = splitTextTracksStr;

class MediaCaptionsList extends MediaChromeList {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'no-subtitles-fallback',
      MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  constructor({ format = DEFAULT_FORMATTER, parse = DEFAULT_PARSER } = {}) {
    super({ format, parse });
  }

  connectedCallback() {
    // super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_LIST && oldValue !== newValue) {
      this.data = this.parse(newValue);
    } else if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_SHOWING) {
      this.selectedValue = newValue;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

}

defineCustomElement('media-captions-list', MediaCaptionsList);

export default MediaCaptionsList;
