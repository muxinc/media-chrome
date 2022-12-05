/* 
<media-theme-responsive>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-responsive>
*/

import { defineCustomElement } from '../utils/defineCustomElement.js';
import { MediaThemeElement } from '../media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: inline-block;
  }
  media-controller:not([audio]) {
    display: block;
    aspect-ratio: 16 / 9;   /* set container aspect ratio if preload=none */
  }
  video {
    width: 100%;      /* prevents video to expand beyond its container */
  }

  media-controller {
    container: media-chrome / inline-size;
  }

  .centered-controls-overlay {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;
  }

  @container (max-width: 590px) {
    .centered-controls-overlay {
      display: flex;
    }
    media-control-bar {
      display: flex;
    }
    media-control-bar media-play-button,
    media-control-bar media-seek-backward-button,
    media-control-bar media-seek-forward-button {
      display: none;
    }
  }
  @container (max-width: 420px) {
    .centered-controls-overlay {
      display: flex;
    }
    media-control-bar {
      display: none;
    }
  }
  @container (min-width: 590px) {
    .centered-controls-overlay {
      display: none;
    }
    media-control-bar {
      display: flex;
    }
  }

  media-controller .centered-controls-overlay {
    align-self: stretch;
  }
  [slot='centered-chrome'] {
    margin: 0 15%;
    --media-control-hover-background: none;
    --media-control-background: none;
  }
  [slot='centered-chrome']:is(media-play-button, media-seek-backward-button, media-seek-forward-button) {
    padding: 0px;
  }
  [slot='centered-chrome']media-play-button {
    width: 20%;
  }
  [slot='centered-chrome']:is(media-seek-backward-button, media-seek-forward-button) {
    width: 15%;
  }

  media-loading-indicator {
    position: absolute;
    inset: 0;
  }

  media-airplay-button[media-airplay-unavailable],
  media-fullscreen-button[media-fullscreen-unavailable],
  media-volume-range[media-volume-unavailable],
  media-pip-button[media-pip-unavailable] {
    display: none;
  }
</style>

<media-controller>
  <slot name="media" slot="media"></slot>
  <slot name="poster" slot="poster"></slot>
  <media-loading-indicator media-loading slot="centered-chrome" no-auto-hide></media-loading-indicator>
  <div slot="centered-chrome" class="centered-controls-overlay">
    <media-seek-backward-button></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button></media-seek-forward-button>
  </div>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <media-time-display show-duration remaining></media-time-display>
    <media-captions-button default-showing></media-captions-button>
    <media-playback-rate-button></media-playback-rate-button>
    <media-pip-button></media-pip-button>
    <media-fullscreen-button></media-fullscreen-button>
    <media-airplay-button></media-airplay-button>
  </media-control-bar>
</media-controller>
`;

class MediaThemeResponsive extends MediaThemeElement {
  static template = template;
}

defineCustomElement('media-theme-responsive', MediaThemeResponsive);

export default MediaThemeResponsive;
