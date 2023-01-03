import MediaChromeListbox from './media-chrome-listbox.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';
import { parseTextTracksStr, parseTextTrackStr, formatTextTrackObj } from './utils/captions.js';


class MediaCaptionsListbox extends MediaChromeListbox {
  #subs = [];
  #caps = [];

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-multiselectable',
      MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_LIST && oldValue !== newValue) {
      this.#subs = parseTextTracksStr(this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST) ?? '');
      this.#render();

    } else if (attrName === MediaUIAttributes.MEDIA_CAPTIONS_LIST && oldValue !== newValue) {
      this.#caps = parseTextTracksStr(this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_LIST) ?? '');
      this.#render();

    } else if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_SHOWING && oldValue !== newValue) {
      const selectedTrack = parseTextTrackStr(this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING) ?? '');

      this.#subs.forEach(track => {
        track.selected = track.language === selectedTrack.language && track.label === selectedTrack.label;
      });
      this.#render();

    } else if (attrName === MediaUIAttributes.MEDIA_CAPTIONS_SHOWING && oldValue !== newValue) {
      const selectedTrack = parseTextTrackStr(this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_SHOWING) ?? '');

      this.#caps.forEach(track => {
        track.selected = track.language === selectedTrack.language && track.label === selectedTrack.label;
      });
      this.#render();

    } else if (attrName === 'aria-multiselectable') {
      // diallow aria-multiselectable
      this.removeAttribute('aria-multiselectable');
      console.warn("Captions List doesn't currently support multiple selections. You can enable multiple items via the media.textTrack API.");
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  connectedCallback() {
    this.#render();

    this.addEventListener('change', this.#onChange);

    super.connectedCallback();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#onChange);

    super.disconnectedCallback();
  }

  #perTypeRender(tracks, type) {
    tracks.forEach(track => {
      let option = track.el;
      let alreadyInDom = true;

      if (!option) {
        option = document.createElement('media-chrome-listitem');
        alreadyInDom = false;

        option.value = type + '!' + formatTextTrackObj(track);
        option.innerHTML = track.label + (track.kind === 'captions' ? ' (cc)' : '');
      }


      if (track.selected) {
        option.setAttribute('aria-selected', 'true');
      } else {
        option.setAttribute('aria-selected', 'false');
      }

      if (!alreadyInDom) {
        this.append(option);
        track.el = option;
      }
    });
  }

  #render() {
    this.#perTypeRender(this.#subs, 'subs');
    this.#perTypeRender(this.#caps, 'cc');
  }

  #onChange() {
    const [newType, selectedOption] = this.selectedOptions[0]?.value?.split('!') ?? [];
    let currentlySelectedTrack = this.#caps.find(track => track.selected);
    let oldType = 'cc';

    if (!currentlySelectedTrack) {
      currentlySelectedTrack = this.#subs.find(track => track.selected);
      oldType = 'subs';
    }

    if (currentlySelectedTrack) {
      const disableEvent = new window.CustomEvent(
        oldType === 'cc' ? MediaUIEvents.MEDIA_DISABLE_CAPTIONS_REQUEST : MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST,
        {
          composed: true,
          bubbles: true,
          detail: formatTextTrackObj(currentlySelectedTrack)
        }
      );
      this.dispatchEvent(disableEvent);
    }

    if (!selectedOption) return;

    const event = new window.CustomEvent(
      newType === 'cc' ? MediaUIEvents.MEDIA_SHOW_CAPTIONS_REQUEST : MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: selectedOption,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!window.customElements.get('media-captions-listbox')) {
  window.customElements.define('media-captions-listbox', MediaCaptionsListbox);
}

export default MediaCaptionsListbox;
