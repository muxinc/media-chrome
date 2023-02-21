/* 
<media-theme-etch-a-sketch>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-etch-a-sketch>
*/

import { window } from '../utils/server-safe-globals.js';
import { MediaThemeElement } from '../media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
* {
  box-sizing: border-box;
}

.examples {
  margin-top: 20px;
}

#playerContainer {
  width: 1120px;
  padding: 95px 80px 0 80px;
  background-color: #FE5F5F;
  border-radius: 24px;
  box-shadow: 10px 5px 0px #900;
}

media-controller {
  width: 960px;
  height: 540px;
  margin: 0px auto;
}

media-control-bar {
  height: 35px;
  padding: 0;
}

media-time-range, media-volume-range {
  --media-range-padding: 0;

  --media-range-bar-color: #ccc;
  --thumb-height: 0;
  --thumb-width: 0;
  --track-height: 100%;
  --track-width: 100%;
}

#knobs {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  margin: 0 -50px 0 -50px;
}

.knob {
  background-color: #DED9D9;
  height: 95px;
  width: 95px;
  color: #000;
  border-radius: 50px;
  --media-icon-color: #000;
  --media-button-icon-height: 35px;
  box-shadow: 5px 5px 0px rgba(0,0,0,0.25);
}
</style>

<div id="playerContainer">
  <media-controller id="etchController1">
    <slot name="media" slot="media"></slot>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-time-range></media-time-range>
      <media-mute-button></media-mute-button>
      <media-volume-range></media-volume-range>
    </media-control-bar>
  </media-controller>

  <div id="knobs">
    <media-play-button media-controller="etchController1" id="leftKnob" class="knob"></media-play-button>
    <div id="title"></div>
    <media-mute-button media-controller="etchController1" id="rightKnob" class="knob"></media-mute-button>
  </div>
</div>
`;

class MediaThemeEtchASketch extends MediaThemeElement {
  static template = template;
}

if (!window.customElements.get('media-theme-etch-a-sketch')) {
  window.customElements.define('media-theme-etch-a-sketch', MediaThemeEtchASketch);
}

export default MediaThemeEtchASketch;
