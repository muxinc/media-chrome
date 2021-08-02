import { defineCustomElement } from './utils/defineCustomElement.js';
import { dashedToCamel } from './utils/stringUtils.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';

export const mediaUIEvents = {
  MEDIA_PLAY_REQUEST: 'mediaplayrequest',
  MEDIA_PAUSE_REQUEST: 'mediapauserequest',
  MEDIA_MUTE_REQUEST: 'mediamuterequest',
  MEDIA_UNMUTE_REQUEST: 'mediaunmuterequest',
  MEDIA_VOLUME_REQUEST: 'mediavolumerequest',
  MEDIA_SEEK_REQUEST: 'mediaseekrequest',
  MEDIA_ENTER_FULLSCREEN_REQUEST: 'mediaenterfullscreenrequest',
  MEDIA_EXIT_FULLSCREEN_REQUEST: 'mediaexitfullscreenrequest',
  MEDIA_PREVIEW_REQUEST: 'mediapreviewrequest',
  MEDIA_ENTER_PIP_REQUEST: 'mediaenterpiprequest',
  MEDIA_EXIT_PIP_REQUEST: 'mediaexitpiprequest',
  MEDIA_PLAYBACK_RATE_REQUEST:  'mediaplaybackraterequest',
};

export class MediaChromeHTMLElement extends window.HTMLElement {
  constructor() {
    super();

    // Media attribute property defaults
    this._mediaPaused = false;
    this._mediaMuted = false;
    this._mediaVolume = 1;
    this._mediaVolumeLevel = 'high';
    this._mediaCurrentTime = 0;
    this._mediaDuration = NaN;
    this._mediaIsFullscreen = false;
    this._mediaIsPip = false;
    this._mediaBuffered = null;
    this._mediaPreviewImage = null;
    this._mediaPreviewCoords = null;
    this._mediaPlaybackRate = 1;
  }

  // Observe changes to the media attribute
  static get observedAttributes() {
    return [
      'media-controller',
      'media-paused',
      'media-muted',
      'media-volume',
      'media-volume-level',
      'media-is-fullscreen',
      'media-current-time',
      'media-duration',
      'media-buffered',
      'media-preview-image',
      'media-preview-coords',
      'media-is-pip',
      'media-playback-rate',
    ].concat(super.observedAttributes || []);
  }

  dispatchMediaEvent(eventName, eventSettings) {
    eventSettings = Object.assign({
      bubbles: true,
      composed: true
    }, eventSettings);

    const event = new window.CustomEvent(eventName, eventSettings);

    // Allow for `oneventname` props on el like in native HTML
    const cancelled = (this[`on${eventName}`] && this[`on${eventName}`](event)) === false;

    if (!cancelled) {
      this.dispatchEvent(event);
    }
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
      typedValue = !(newValue === null);
    }

    if (propName != 'mediaPaused') {
      this[propName] = typedValue;
    }
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

  get mediaPaused() {
    return this._mediaPaused;
  }

  set mediaPaused(paused) {
    paused = !!paused;

    this._mediaPaused = paused;

    // Update the attribute first if needed, but don't inf loop
    const attrBoolValue = this.getAttribute('media-paused') !== null;

    if (paused !== attrBoolValue) {
      if (paused) {
        this.setAttribute('media-paused', 'media-paused');
      } else {
        this.removeAttribute('media-paused');
      }      
    }

    if (this.mediaPausedSet) this.mediaPausedSet(paused);
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

    if (this.mediaVolumeSet) this.mediaVolumeSet(volume);
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

    if (this.mediaVolumeLevelSet) this.mediaVolumeLevelSet(volumeLevel);
  }

  get mediaCurrentTime() {
    return this._mediaCurrentTime;
  }

  set mediaCurrentTime(currentTime) {
    currentTime = parseFloat(currentTime);

    // Default to zero (not null or NaN)
    if (!currentTime) currentTime = 0;

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

  get mediaPlaybackRate() {
    return this._mediaPlaybackRate;
  }

  set mediaPlaybackRate(rate) {
    rate = parseFloat(rate);

    this._mediaPlaybackRate = rate;

    const attrValue = parseFloat(this.getAttribute('media-playback-rate'));

    if (isNaN(attrValue)) {
      this.removeAttribute('media-playback-rate');
    } else if (attrValue !== rate) {
      this.setAttribute('media-playback-rate', rate);
    }

    if (this.mediaPlaybackRateSet) this.mediaPlaybackRateSet(rate);
  }

  get mediaIsFullscreen() {
    return this._mediaIsFullscreen;
  }

  set mediaIsFullscreen(fullscreen) {
    fullscreen = !!fullscreen;

    this._mediaIsFullscreen = fullscreen;

    const attrBoolValue = this.getAttribute('media-is-fullscreen') !== null;

    if (fullscreen !== attrBoolValue) {
      if (fullscreen) {
        this.setAttribute('media-is-fullscreen', 'media-is-fullscreen');
      } else {
        this.removeAttribute('media-is-fullscreen');
      }      
    }

    if (this.mediaIsFullscreenSet) this.mediaIsFullscreenSet(fullscreen);
  }

  get mediaIsPip() {
    return this._mediaIsPip;
  }

  set mediaIsPip(isPip) {
    isPip = !!isPip;

    this._mediaIsPip = isPip;

    const attrBoolValue = this.getAttribute('media-is-pip') !== null;

    if (isPip !== attrBoolValue) {
      if (isPip) {
        this.setAttribute('media-is-pip', 'media-is-pip');
      } else {
        this.removeAttribute('media-is-pip');
      }      
    }

    if (this.mediaIsPipSet) this.mediaIsPipSet(isPip);
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

defineCustomElement('media-chrome-html-element', MediaChromeHTMLElement);

export default MediaChromeHTMLElement;
