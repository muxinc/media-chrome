import { defineCustomElement } from './utils/defineCustomElement.js';
import { dashedToCamel } from './utils/dashedToCamel.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';

class MediaChromeHTMLElement extends window.HTMLElement {
  constructor() {
    super();
    this._media = null;
    this._mediaMuted = false;
    this._mediaVolume = 1;
    this._mediaVolumeLevel = 'high';
    this._mediaCurrentTime = 0;
    this._mediaDuration = NaN;
    this._mediaFullscreen = false;
    this._mediaBuffered = null;
    this._mediaPreviewImage = null;
    this._mediaPreviewCoords = null;
  }

  // Observe changes to the media attribute
  static get observedAttributes() {
    return [
      'media', 
      'media-controller',
      'media-muted',
      'media-volume',
      'media-volume-level',
      'media-is-fullscreen',
      'media-current-time',
      'media-duration',
      'media-buffered',
      'media-preview-image',
      'media-preview-coords',
    ].concat(super.observedAttributes || []);
  }

  // Model the basic HTML attribute functionality of matching props
  attributeChangedCallback(attrName, oldValue, newValue) {
    // Assume attrs with dashes match camelCase props
    const propName = dashedToCamel(attrName);

    // Deprecate
    if (propName == 'media') {
      if (newValue === null) {
        this.media = null;
        return;
      }

      let media = document.querySelector(newValue);

      if (!media || !media.play) {
        throw new Error(
          'Supplied media attribute does not appear to match a media element.'
        );
      }

      this.media = media;
      return;
    }

    if (propName == 'mediaController') {
      this[propName] = document.getElementById(newValue);
      return;
    }

    let typedValue = newValue;

    // Boolean props should never start as null
    if (typeof this[propName] == 'boolean') {
      // null is returned when attributes are removed i.e. boolean attrs
      // The new value might be an empty string, which is still true
      // for boolean attributes
      const typedValue = !(newValue === null);
    }

    this[propName] = typedValue;
  }

  get mediaController() {
    return this._mediaController || null;
  }

  set mediaController(controller) {
    if (controller === this._mediaController) return;

    if (this._mediaController) this._mediaController.unassociateElement(this);

    if (controller) { 
      this._mediaController = controller;
      // Potential memory leak issue here
      // TODO: Unassociate in disconnectedCallback
      controller.associateElement(this);
    }
  }

  get mediaMuted() {
    return this._mediaMuted;
  }

  set mediaMuted(muted) {
    muted = !!muted;

    this._mediaMuted = muted;

    // Update the attribute first if needed, but don't inf loop
    const attrBoolValue = this.getAttribute('media-muted') !== null;

    if (muted !== attrBoolValue) {
      if (muted) {
        this.setAttribute('media-muted', 'media-muted');
      } else {
        this.removeAttribute('media-muted');
      }      
    }

    if (this.mediaMutedSet) this.mediaMutedSet(muted);
  }

  get mediaVolume() {
    return this._mediaVolume;
  }

  set mediaVolume(volume) {
    volume = parseFloat(volume);

    this._mediaVolume = volume;

    const attrValue = parseFloat(this.getAttribute('media-volume'));

    if (attrValue !== volume) {
      this.setAttribute('media-volume', volume);
    }
  }

  get mediaVolumeLevel() {
    return this._mediaVolumeLevel;
  }

  set mediaVolumeLevel(volumeLevel) {
    volumeLevel = volumeLevel.toLowerCase();

    if (['off', 'low','medium','high'].indexOf(volumeLevel) === -1) {
      volumeLevel = 'high';
    }

    this._mediaVolumeLevel = volumeLevel;

    const attrValue = this.getAttribute('media-volume-level');

    if (volumeLevel !== attrValue) {
      this.setAttribute('media-volume-level', volumeLevel);
    }
  }

  get mediaCurrentTime() {
    return this._mediaCurrentTime;
  }

  set mediaCurrentTime(currentTime) {
    currentTime = parseFloat(currentTime);

    this._mediaCurrentTime = currentTime;

    const attrValue = parseFloat(this.getAttribute('media-current-time'));

    if (attrValue !== currentTime) {
      this.setAttribute('media-current-time', currentTime);
    }

    if (this.mediaCurrentTimeSet) this.mediaCurrentTimeSet(currentTime);
  }

  get mediaDuration() {
    return this._mediaDuration;
  }

  set mediaDuration(duration) {
    duration = parseFloat(duration);

    this._mediaDuration = duration;

    const attrValue = parseFloat(this.getAttribute('media-duration'));

    if (isNaN(attrValue)) {
      this.removeAttribute('media-duration');
    } else if (attrValue !== duration) {
      this.setAttribute('media-duration', duration);
    }

    if (this.mediaDurationSet) this.mediaDurationSet(duration);
  }

  get mediaIsFullscreen() {
    return this._mediaFullscreen;
  }

  set mediaIsFullscreen(fullscreen) {
    fullscreen = !!fullscreen;

    this._mediaFullscreen = fullscreen;

    const attrBoolValue = this.getAttribute('media-is-fullscreen') !== null;

    if (fullscreen !== attrBoolValue) {
      if (fullscreen) {
        this.setAttribute('media-is-fullscreen', 'media-is-fullscreen');
      } else {
        this.removeAttribute('media-is-fullscreen');
      }      
    }

    if (this.mediaFullscreenSet) this.mediaFullscreenSet(fullscreen);
  }

  get mediaPreviewImage() {
    return this._mediaPreviewImage;
  }

  set mediaPreviewImage(image) {
    this._mediaPreviewImage = image;

    const attrValue = this.getAttribute('media-preview-image');
    
    if (attrValue !== image) {
      this.setAttribute('media-preview-image', image);
    }

    if (this.mediaPreviewImageSet) this.mediaPreviewImageSet(image);
  }

  get mediaPreviewCoords() {
    return this._mediaPreviewCoords;
  }

  set mediaPreviewCoords(coords) {
    if (typeof coords == 'string') {
      coords = coords.split(',');
    }

    this._mediaPreviewCoords = coords;

    const attrValue = this.getAttribute('media-preview-coords');
    
    if (attrValue !== coords.join(',')) {
      this.setAttribute('media-preview-coords', coords.join(','));
    }

    if (this.mediaPreviewCoordsSet) this.mediaPreviewCoordsSet(coords);
  }
}

/*
  Recursively set the media prop of all child MediaChromeHTMLElements
*/
export function setAndPropagateMedia(el, media) {
  const elName = el.nodeName.toLowerCase();

  // Can't set <media-chrome> media
  // and shouldn't propagate into a child media-chrome
  if (elName == 'media-chrome') return;

  // Only custom elements might have the correct media attribute
  if (elName.includes('-')) {
    window.customElements.whenDefined(elName).then(()=>{
      if (el instanceof MediaChromeHTMLElement) {
        // Media-chrome html els propogate to their children automatically
        // including to shadow dom children
        el.media = media;
      } else {
        // Otherwise continue to this el's children
        propagateMedia(el, media);
      }
    });
  } else if (el.slot !== 'media') {
    // If not a custom element or media element, continue to children
    propagateMedia(el, media);
  }
};

export function propagateMedia(parent, media) {
  Array.prototype.forEach.call(parent.children, (child)=>{
    setAndPropagateMedia(child, media);
  });
}

defineCustomElement('media-chrome-html-element', MediaChromeHTMLElement);

export default MediaChromeHTMLElement;
