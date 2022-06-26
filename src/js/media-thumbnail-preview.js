/*
  <media-thumbnail-preview media="#myVideo" time="10.00">

  Uses the "thumbnails" track of a video element to show an image relative to
  the video time given in the `time` attribute.
*/
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIAttributes } from './constants.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: inline-block;
      overflow: hidden;
    }

    img {
      display: none;
      position: relative;
    }
  </style>
  <img crossorigin loading="eager" decoding="async" />
`;

class MediaThumbnailPreview extends window.HTMLElement {
  static get observedAttributes() {
    return [
      MediaUIAttributes.MEDIA_CONTROLLER,
      'time',
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_PREVIEW_COORDS,
    ];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
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

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        'time',
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
        MediaUIAttributes.MEDIA_PREVIEW_COORDS,
      ].includes(attrName)
    ) {
      this.update();
    }
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
      }
    }
  }

  update() {
    const mediaPreviewCoordsStr = this.getAttribute(
      MediaUIAttributes.MEDIA_PREVIEW_COORDS
    );
    const mediaPreviewImage = this.getAttribute(
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE
    );
    if (!(mediaPreviewCoordsStr && mediaPreviewImage)) return;

    const [x, y, w, h] = mediaPreviewCoordsStr
      .split(/\s+/)
      .map((coord) => +coord);
    const src = mediaPreviewImage.split('#')[0];

    const computedStyle = getComputedStyle(this);
    const { maxWidth, maxHeight, minWidth, minHeight } = computedStyle;
    const maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h);
    const minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h);

    // maxRatio scales down and takes priority, minRatio scales up.
    const isScalingDown = maxRatio < 1;
    const scale = isScalingDown ? maxRatio : minRatio > 1 ? minRatio : 1;

    const { style } = findCSSRule(this.shadowRoot, ':host');
    const imgStyle = findCSSRule(this.shadowRoot, 'img').style;
    const img = this.shadowRoot.querySelector('img');

    // Revert one set of extremum to its initial value on a known scale direction.
    const extremum = isScalingDown ? 'min' : 'max';
    style.setProperty(`${extremum}-width`, 'initial', 'important');
    style.setProperty(`${extremum}-height`, 'initial', 'important');
    style.width = `${w * scale}px`;
    style.height = `${h * scale}px`;

    const resize = () => {
      imgStyle.width = `${this.imgWidth * scale}px`;
      imgStyle.height = `${this.imgHeight * scale}px`;
      imgStyle.display = 'block';
    };

    if (img.src !== src) {
      img.onload = () => {
        this.imgWidth = img.naturalWidth;
        this.imgHeight = img.naturalHeight;
        resize();
      };
      img.src = src;
      resize();
    }

    resize();
    imgStyle.transform = `translate(-${x * scale}px, -${y * scale}px)`;
  }
}

function findCSSRule(el, selectorText) {
  for (let style of el.querySelectorAll('style')) {
    for (let rule of style.sheet.cssRules)
      if (rule.selectorText === selectorText) return rule;
  }
}

defineCustomElement('media-thumbnail-preview', MediaThumbnailPreview);

export default MediaThumbnailPreview;
