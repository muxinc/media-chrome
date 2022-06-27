/* 
<media-theme-youtube>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-youtube>
*/

import { defineCustomElement } from '../utils/defineCustomElement.js';
import MediaTheme from './media-theme.js';

const template = `
<style>
  :host {
    display: inline-block;
    --primary-color: #eee;
    --secondary-color: transparent;
  }

  media-controller {
    width: 100%;
    height: 100%;

    font-size: 13px;
    font-family: Roboto, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    color: var(--primary-color);

    --media-control-background: var(--secondary-color);
    --media-control-hover-background: var(--secondary-color);
    --media-range-track-height: 3px;
    --media-range-thumb-height: 13px;
    --media-range-thumb-width: 13px;
    --media-range-thumb-border-radius: 13px;

    --media-icon-color: var(--primary-color);
  }

  *:hover {
    color: #fff;
    --media-icon-color: #fff;
  }

  media-control-bar {
    position: relative;
  }

  media-control-bar:last-child {
    padding: 0 10px 0 5px;
  }

  media-play-button {
    --media-button-icon-width: 30px;
    padding: 6px 10px;
  }

  media-time-range {
    width: 100%;
    height: 5px;

    --media-range-track-transition: height 0.1s linear;
    --media-range-track-background: rgba(255,255,255,.2);
    --media-time-buffered-color: rgba(255,255,255,.4);

    --media-range-bar-color: rgb(229, 9, 20);
    --media-progress-buffered-color: #999;

    --media-range-thumb-border-radius: 13px;
    --media-range-thumb-background: #f00;

    --media-range-thumb-transition: transform 0.1s linear;
    --media-range-thumb-transform: scale(0) translate(0%, 0%);
  }

  media-time-range:hover {
    --media-range-track-height: 5px;
    --media-range-thumb-transform: scale(1) translate(0%, 0%);
  }

  media-volume-range {
    padding-left: 0px;

    --media-range-track-background: rgba(255,255,255,.2);
    --media-range-bar-color: #fff;
    --media-range-thumb-background: #fff;
  }

  .control-spacer {
    flex-grow: 1;
  }

  media-mute-button + media-volume-range {
    width: 0px;
    overflow: hidden;
    padding-right: 0px;

    /* Set the internal width so it reveals, not grows */
    --media-range-track-width: 60px;
    transition: width 0.2s ease-in;
  }

  /* Expand volume control in all relevant states */
  media-mute-button:hover + media-volume-range,
  media-mute-button:focus + media-volume-range,
  media-mute-button:focus-within + media-volume-range,
  media-volume-range:hover,
  media-volume-range:focus,
  media-volume-range:focus-within {
    width: 70px;
  }

  media-fullscreen-button {
    --media-button-icon-transform: scale(1.3);
  }

  .ytp-gradient-bottom {
    padding-top: 37px;
    position: absolute;
    width: 100%;
    height: 170px;
    bottom: 0;
    pointer-events: none;
    background-position: bottom;
    background-repeat: repeat-x;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACqCAYAAABsziWkAAAAAXNSR0IArs4c6QAAAQVJREFUOE9lyNdHBQAAhfHb3nvvuu2997jNe29TJJEkkkgSSSSJJJJEEkkiifRH5jsP56Xz8PM5gcC/xfDEmjhKxEOCSaREEiSbFEqkQppJpzJMJiWyINvkUCIX8kw+JQqg0BRRxaaEEqVQZsopUQGVpooS1VBjglStqaNEPTSYRko0QbNpoUQrtJl2qsN0UqILuk0PJXqhz/RTYgAGzRA1bEYoMQpjZpwSExAyk5SYgmkzQ82aOUqEIWKilJiHBbNIiSVYhhVYhTVYhw3YhC3Yhh3YhT3YhwM4hCM4hhM4hTM4hwu4hCu4hhu4hTu4hwd4hCd4hhd4hTd4hw/4hC/4hh/4/QM2/id28uIEJAAAAABJRU5ErkJggg==");
  }
</style>

<media-controller>
  <slot name="media" slot="media"></slot>
  <slot name="poster" slot="poster"></slot>

  <div class="ytp-gradient-bottom"></div>
  <media-time-range>
    <media-thumbnail-preview slot="preview"></media-thumbnail-preview>
  </media-time-range>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-display show-duration></media-time-display>
    <span class="control-spacer"></span>
    <media-playback-rate-button></media-playback-rate-button>
    <media-pip-button></media-pip-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
`;

class MediaThemeYoutube extends MediaTheme {
  static template = template;
}

defineCustomElement('media-theme-youtube', MediaThemeYoutube);

export default MediaThemeYoutube;
