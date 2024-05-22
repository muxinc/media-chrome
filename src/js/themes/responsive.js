/*
<media-theme-responsive>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-responsive>
*/

import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaThemeElement } from '../media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>

  :host(:not([audio])) {
    ${
      /*
       * Containers can't be sized by their contents, they require a width
       * https://stackoverflow.com/a/73980194/268820
       */ ''
    }
    container: media-chrome / inline-size;
    width: 100%;
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
</style>

<media-controller defaultsubtitles audio="{{audio}}">
  <slot name="media" slot="media"></slot>
  <slot name="poster" slot="poster"></slot>

  <template if="audio">
    <template if="mediatitle">
      <media-control-bar>{{mediatitle}}</media-control-bar>
    </template>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-time-display showduration></media-time-display>
      <media-time-range></media-time-range>
      <media-playback-rate-button></media-playback-rate-button>
      <media-mute-button></media-mute-button>
      <media-volume-range></media-volume-range>
    </media-control-bar>
  </template>

  <template if="audio == null">
    <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>

    <div slot="centered-chrome" class="centered-controls-overlay">
      <media-seek-backward-button seekoffset="15"></media-seek-backward-button>
      <media-play-button></media-play-button>
      <media-seek-forward-button seekoffset="15"></media-seek-forward-button>
    </div>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-seek-backward-button seekoffset="15"></media-seek-backward-button>
      <media-seek-forward-button seekoffset="15"></media-seek-forward-button>
      <media-mute-button></media-mute-button>
      <media-volume-range></media-volume-range>
      <media-time-range></media-time-range>
      <media-time-display showduration remaining></media-time-display>
      <media-captions-button></media-captions-button>
      <media-playback-rate-button></media-playback-rate-button>
      <media-pip-button></media-pip-button>
      <media-fullscreen-button></media-fullscreen-button>
      <media-airplay-button></media-airplay-button>
    </media-control-bar>
  </template>
</media-controller>
`;

class MediaThemeResponsive extends MediaThemeElement {
  static template = template;
}

if (!globalThis.customElements.get('media-theme-responsive')) {
  globalThis.customElements.define(
    'media-theme-responsive',
    MediaThemeResponsive
  );
}

export default MediaThemeResponsive;
