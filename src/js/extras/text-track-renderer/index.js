import {
  Window as window,
  Document as document,
} from '../../utils/server-safe-globals.js';
import {
  splitTextTracksStr,
  stringifyTextTrackList,
  getTextTracksList,
  updateTracksModeTo,
} from '../../utils/captions.js';
import { defineCustomElement } from '../../utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from '../../constants.js';
import { verbs } from '../../labels/labels.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  :host,
  .text-track-display {
    pointer-events: none !important;
    width: 100%;
    height: 100%;
  }

  .text-track-display > span {
    font-size: 1.5em;
    color: yellow;
    text-shadow:
       3px 3px 0 #000,
     -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
    background-color: rgba(0, 0, 0, 0.6);
    position: relative;
    top: 50%;
    left: 30px;
  }
  </style>

 <div class="text-track-display"></div>
`;

class TextTrackRenderer extends HTMLElement {
  static get observedAttributes() {
    return ['mediaController', MediaUIAttributes.MEDIA_CONTROLLER];
  }

  constructor() {
    super();

    this.mediaController = null;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.display = this.shadowRoot.querySelector('.text-track-display');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    console.log('!!!', attrName);
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      console.log('MEDIA_CONTROLLER', oldValue, newValue);
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
      }
    }

    if (attrName.toLowerCase() === 'mediaController') {
      this.mediaController = newValue;
    }
  }

  connectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }

    setTimeout(() => this.setupCustomRendering());
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  set mediaController(newMC) {
    this._mc = newMC;
  }

  get mediaController() {
    return this._mc;
  }

  setupCustomRendering() {
    const mc = this._mc;

    const [track] = getTextTracksList(mc.media, {kind: 'captions', mode: 'showing'});

    console.log('!!', track);

    track.mode = 'hidden';

    track.addEventListener('cuechange', () => {
      while (this.display.firstChild) {
        this.display.removeChild(this.display.firstChild);
      }
      Array.from(track.activeCues).forEach(cue => {
        const span = document.createElement('span')
        span.append(cue.getCueAsHTML());
        this.display.append(span);
      });
    });
  }
}

defineCustomElement('text-track-renderer', TextTrackRenderer);

export default TextTrackRenderer;
