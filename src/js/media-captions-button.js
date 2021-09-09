/*
  <media-fullscreen-button media="#myVideo" fullscreen-element="#myContainer">

  The fullscreen-element attribute can be used to say which element
  to make fullscreen.
  If none, the button will look for the closest media-container element to the media.
  If none, the button will make the media fullscreen.
*/
import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes, TextTrackModes, TextTrackKinds } from './constants.js';
import { verbs } from './labels/labels.js';

const ccIcon = `
<svg
   aria-hidden="true"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   version="1.0"
   viewbox="0 0 153 114.71389"
   width="auto"
   height="24">
  <defs
     id="defs4">
    <marker
       markerUnits="strokeWidth"
       refX="0"
       refY="5"
       markerWidth="4"
       markerHeight="3"
       orient="auto"
       viewBox="0 0 10 10"
       id="ArrowEnd">
      <path
         d="M 0,0 L 10,5 L 0,10 L 0,0 z "
         id="path7" />
    </marker>
    <marker
       markerUnits="strokeWidth"
       refX="10"
       refY="5"
       markerWidth="4"
       markerHeight="3"
       orient="auto"
       viewBox="0 0 10 10"
       id="ArrowStart">
      <path
         d="M 10,0 L 0,5 L 10,10 L 10,0 z "
         id="path10" />
    </marker>
  </defs>
  <g
     transform="scale(6.3080558,6.3080558)"
     id="g12">
    <path
       d="M 0,0 L 24.2547,0 L 24.2547,18.1853 L 0,18.1853 L 0,0 z "
       style="fill:#000000;fill-rule:evenodd;stroke:none"
       id="path14" />
    <path
       d="M 21.9806,9.0135 C 21.9505,5.8358 21.8299,4.4502 21.077,3.4712 C 20.9415,3.2605 20.6854,3.14 20.4746,2.9895 C 19.7366,2.4472 16.2577,2.2515 12.2215,2.2515 C 8.1853,2.2515 4.54077,2.4472 3.81787,2.9895 C 3.59192,3.14 3.33581,3.2605 3.1853,3.4712 C 2.44726,4.4502 2.34192,5.8358 2.29675,9.0135 C 2.34192,12.1914 2.44726,13.5769 3.1853,14.5558 C 3.33581,14.7817 3.59192,14.8871 3.81787,15.0377 C 4.54077,15.595 8.1853,15.7757 12.2215,15.8058 C 16.2577,15.7757 19.7366,15.595 20.4746,15.0377 C 20.6854,14.8871 20.9415,14.7817 21.077,14.5558 C 21.8299,13.5769 21.9505,12.1914 21.9806,9.0135 z "
       style="fill:#ffffff;fill-rule:evenodd;stroke:none"
       id="path16" />
    <path
       d="M 21.9806,9.0135 C 21.9505,5.8358 21.8299,4.4502 21.077,3.4712 C 20.9415,3.2605 20.6854,3.14 20.4746,2.9895 C 19.7366,2.4472 16.2577,2.2515 12.2215,2.2515 C 8.1853,2.2515 4.54077,2.4472 3.81787,2.9895 C 3.59192,3.14 3.33581,3.2605 3.1853,3.4712 C 2.44726,4.4502 2.34192,5.8358 2.29675,9.0135 C 2.34192,12.1914 2.44726,13.5769 3.1853,14.5558 C 3.33581,14.7817 3.59192,14.8871 3.81787,15.0377 C 4.54077,15.595 8.1853,15.7757 12.2215,15.8058 C 16.2577,15.7757 19.7366,15.595 20.4746,15.0377 C 20.6854,14.8871 20.9415,14.7817 21.077,14.5558 C 21.8299,13.5769 21.9505,12.1914 21.9806,9.0135 z "
       style="fill:none;stroke:#000000;stroke-width:0.02387423"
       id="path18" />
    <path
       d="M 11.6896,8.1906 C 11.4853,5.704 10.1628,4.239 7.79723,4.239 C 5.63596,4.239 3.93706,6.1879 3.93706,9.31964 C 3.93706,12.4648 5.48544,14.4271 8.04452,14.4271 C 10.0875,14.4271 11.5176,12.9218 11.7434,10.4217 L 9.30256,10.4217 C 9.20579,11.3492 8.81871,12.0616 8.00151,12.0616 C 6.71121,12.0616 6.47467,10.7847 6.47467,9.42716 C 6.47467,7.5588 7.0123,6.6046 7.90474,6.6046 C 8.70045,6.6046 9.20579,7.1825 9.28106,8.1906 L 11.6896,8.1906 z "
       style="fill:#000000;fill-rule:evenodd;stroke:none"
       id="path20" />
    <path
       d="M 20.1199,8.1906 C 19.9156,5.704 18.5931,4.239 16.2275,4.239 C 14.0662,4.239 12.3674,6.1879 12.3674,9.31964 C 12.3674,12.4648 13.9157,14.4271 16.4748,14.4271 C 18.5178,14.4271 19.9479,12.9218 20.1736,10.4217 L 17.7328,10.4217 C 17.6361,11.3492 17.249,12.0616 16.4318,12.0616 C 15.1415,12.0616 14.9049,10.7847 14.9049,9.42716 C 14.9049,7.5588 15.4426,6.6046 16.335,6.6046 C 17.1307,6.6046 17.6361,7.1825 17.7113,8.1906 L 20.1199,8.1906 z "
       style="fill:#000000;fill-rule:evenodd;stroke:none"
       id="path22" />
  </g>
</svg>
`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_SELECTED_TEXT_TRACK}]:not([${MediaUIAttributes.MEDIA_SELECTED_TEXT_TRACK}=""])) slot:not([name=off]) > *, 
  :host([${MediaUIAttributes.MEDIA_SELECTED_TEXT_TRACK}]:not([${MediaUIAttributes.MEDIA_SELECTED_TEXT_TRACK}=""])) ::slotted(:not([slot=off])) {
    display: none;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([${MediaUIAttributes.MEDIA_SELECTED_TEXT_TRACK}])) slot:not([name=on]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_SELECTED_TEXT_TRACK}])) ::slotted(:not([slot=on])) {
    display: none;
  }
  </style>

  <slot name="on">${ccIcon}</slot>
  <slot name="off">${ccIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const isCaptionsOn =
    el.getAttribute(MediaUIAttributes.MEDIA_SELECTED_TEXT_TRACK) != null;
  const label = isCaptionsOn
    ? verbs.EXIT_FULLSCREEN()
    : verbs.ENTER_FULLSCREEN();
  el.setAttribute('aria-label', label);
};

class MediaCaptionsButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'use-subtitles-fallback',
      MediaUIAttributes.MEDIA_CAPTIONS_TRACKS,
      MediaUIAttributes.MEDIA_SUBTITLE_TRACKS,
    ];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CAPTIONS_TRACKS) {
      // updateAriaLabel(this);
      console.log(parseTextTracksAttr(newValue, { kind: TextTrackKinds.CAPTIONS }));
    }
    if (attrName === MediaUIAttributes.MEDIA_SUBTITLE_TRACKS) {
      // updateAriaLabel(this);
      console.log(parseTextTracksAttr(newValue, { kind: TextTrackKinds.SUBTITLES }));
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const tracks = [
      ...parseTextTracksAttr(this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_TRACKS) ?? [], { kind: TextTrackKinds.CAPTIONS }),
      ...(this.hasAttribute('use-subtitles-fallback')
        ? parseTextTracksAttr(this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLE_TRACKS) ?? [], { kind: TextTrackKinds.SUBTITLES })
        : [])
    ];
    const ccIsOn = tracks.some(({ mode }) => mode === TextTrackModes.SHOWING);
    if (ccIsOn) {
      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_HIDE_TEXT_TRACKS_REQUEST, { composed: true, bubbles: true });
      this.dispatchEvent(evt);
      return;
    }
    
    /** @TODO Disable if no tracks (CJP) */
    const [track] = tracks;

    if (!track) return;
    
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SHOW_TEXT_TRACKS_REQUEST, { composed: true, bubbles: true, detail: [track] });
    this.dispatchEvent(evt);
  }
}

const parseTextTracksAttr = (textTracksAttrStr = '', { kind } = {}) => {
  return textTracksAttrStr.split(' ').map((textTrackStr) => {
    const [language, encodedLabel] = textTrackStr.split(':');
    const label = encodedLabel
      ? decodeURIComponent(encodedLabel)
      : undefined;
    return {
      kind,
      language,
      label
    };
  });
};

defineCustomElement('media-captions-button', MediaCaptionsButton);

export default MediaCaptionsButton;
