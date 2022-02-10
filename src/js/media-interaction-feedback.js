import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';

const template = document.createElement('template');
const playIcon =
  '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

template.innerHTML = `
<style>
:host {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

/*
  Toggle between showing the play and pause icons
  on the correct interactions
*/
:host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=play] > *, 
:host([${MediaUIAttributes.MEDIA_PAUSED}]) ::slotted([slot=play]) {
  display: none;
}

:host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=pause] > *, 
:host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=pause]) {
  display: none;
}

/*
  Visually hide the interaction when current time begins with 0.
  This prevents the interaction from showing on initial load and
  on initial play.
*/
:host([${MediaUIAttributes.MEDIA_CURRENT_TIME}^="0"]) slot[name=play] > *,
:host([${MediaUIAttributes.MEDIA_CURRENT_TIME}^="0"]) ::slotted([slot=play]),
:host([${MediaUIAttributes.MEDIA_CURRENT_TIME}^="0"]) slot[name=pause] > *,
:host([${MediaUIAttributes.MEDIA_CURRENT_TIME}^="0"]) ::slotted([slot=pause]) {
  visibility: hidden;
}

/*
  Define the animation to follow when the slot is visible.
*/
:host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause] > *, 
:host([${MediaUIAttributes.MEDIA_PAUSED}]) ::slotted([slot=pause]),
:host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] > *, 
:host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=play]) {
  animation: fadeAndScale ease 0.682418s;
  animation-fill-mode: forwards;
}

svg, img, ::slotted(svg), ::slotted(img) {
  width: var(--media-interaction-feedback-icon-width, 75px);
  height: var(--media-interaction-feedback-icon-height);
  transform: var(--media-interaction-feedback-icon-transform);
  transition: var(--media-interaction-feedback-icon-transition);
  fill: var(--media-icon-color, #eee);
  vertical-align: middle;
}

@keyframes fadeAndScale {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}
</style>

<slot name="play">${playIcon}</slot>
<slot name="pause">${pauseIcon}</slot>
`;

class MediaInteractionFeedback extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER, MediaUIAttributes.MEDIA_PAUSED, MediaUIAttributes.MEDIA_CURRENT_TIME];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

defineCustomElement('media-interaction-feedback', MediaInteractionFeedback);

export default MediaInteractionFeedback;
