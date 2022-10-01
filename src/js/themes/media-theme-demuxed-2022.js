/* 
<media-theme-demuxed-2022>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-demuxed-2022>
*/

import { defineCustomElement } from '../utils/defineCustomElement.js';
import MediaTheme from './media-theme.js';

const template = `
<style>
  :host {
    --primary-color: black;
    --secondary-color: transparent;
    --tertiary-color: #7596CC;
  }

  media-airplay-button[media-airplay-unavailable] {
    display: none;
  }

  media-cast-button[media-cast-unavailable] {
    display: none;
  }

  media-pip-button[media-pip-unavailable] {
    display: none;
  }

  media-controller {
    width: 100%;
    aspect-ratio: 16 / 9;

    --media-control-background: var(--secondary-color);
    --media-control-hover-background: transparent;
    
    --media-icon-color: var(--primary-color);

    --media-range-track-height: 6px;
    --media-range-track-background: var(--tertiary-color);
    --media-range-track-border-radius: 9999px;

    --media-range-thumb-background: var(--tertiary-color);
    --media-range-thumb-width: 14px;
    --media-range-thumb-height: 14px;
  }

  media-control-bar {
    position: relative;
    margin: 30px;
    padding: 10px 14px;
    border-radius: 9999px;
    background: rgba(0,0,0,0.2);
  }

  media-control-bar :first-child {
    margin: 0 5px 0 0;
  }
  
  media-control-bar :last-child {
    margin: 0 0 0 5px;
  }

  .small-button {
    position: relative;
    flex: none;
    margin: 0 5px;
    display: flex;
    align-items: center;
    justify-items: center;
    height: 32px;
    width: 32px;
    background: white;
    border-radius: 9999px;
  }

  .small-button svg {
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 20px;
    margin: 0 !important;
    padding: 0 !important;
  }

  .small-button:hover {
    box-shadow: 0 0 0 calc(2px) var(--tertiary-color);
  }

  div[slot="centered-chrome"] media-play-button {
    position: relative;
    flex: none;
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    justify-items: center;
    height: 96px;
    width: 96px;
    background: rgba(0,0,0,0.8);
    border-radius: 9999px;
  }

  div[slot="centered-chrome"] media-play-button:hover {
    box-shadow: 0 0 0 calc(2px) var(--tertiary-color);
  }

  div[slot="centered-chrome"] media-play-button svg {
    filter: invert(100%);
    height: 64px;
  }

  media-cinema-button {
    cursor: pointer;
  }

  media-time-range {
    height: 32px;
    margin: 0 8px 0 0;
  }

  media-volume-range {
    height: 100%;
  }

  media-time-display {
    padding: 0 12px 0 16px;
  }

  media-time-display, media-preview-time-display {
    font-size: 14px;
    font-family: sofia-pro, sans-serif;
  }

  .demuxed-gradient-bottom {
    padding-top: 37px;
    position: absolute;
    width: 100%;
    height: 200px;
    bottom: 0;
    pointer-events: none;
    background-position: bottom;
    background-repeat: repeat-x;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACqCAYAAABsziWkAAAAAXNSR0IArs4c6QAAAQVJREFUOE9lyNdHBQAAhfHb3nvvuu2997jNe29TJJEkkkgSSSSJJJJEEkkiifRH5jsP56Xz8PM5gcC/xfDEmjhKxEOCSaREEiSbFEqkQppJpzJMJiWyINvkUCIX8kw+JQqg0BRRxaaEEqVQZsopUQGVpooS1VBjglStqaNEPTSYRko0QbNpoUQrtJl2qsN0UqILuk0PJXqhz/RTYgAGzRA1bEYoMQpjZpwSExAyk5SYgmkzQ82aOUqEIWKilJiHBbNIiSVYhhVYhTVYhw3YhC3Yhh3YhT3YhwM4hCM4hhM4hTM4hwu4hCu4hhu4hTu4hwd4hCd4hhd4hTd4hw/4hC/4hh/4/QM2/id28uIEJAAAAABJRU5ErkJggg==");
  }

  div[slot="top-chrome"] {
    width: calc(100% - 32px);
    display: flex;
    flex-direction: row-reverse;
    padding-right: 32px;
  }

  div[slot="top-chrome"] .small-button {
    margin: 32px 8px;
  }

  @media (max-width: 720px) {
    media-control-bar {
      background: transparent;
      margin: 0;
      padding: 12px 8px;
      flex-direction: column;
      align-items: flex-start;
    }

    .small-button {
      display: none;
    }

    media-fullscreen-button.small-button {
      display: flex;
      position: absolute;
      top: 8px;
      right: 20px;
    }

    media-time-range {
      width: 100%;
    }

    media-time-display {
      padding: 0 10px;
    }

    div[slot="centered-chrome"] media-play-button {
      z-index: 1;
      height: 72px;
      width: 72px;
    }

    div[slot="centered-chrome"] media-play-button svg {
      height: 44px;
    }
  }
</style>

<media-controller>
  <slot name="media" slot="media"></slot>
  <slot name="poster" slot="poster"></slot>
  <div class="demuxed-gradient-bottom"></div>
  <div slot="top-chrome">
    <media-cast-button class="small-button">
      <svg slot="enter" viewBox="0 0 26 26">
        <g transform="translate(1.5, 0.5)">
          <path d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g>
        </g>
      </svg>
    </media-cast-button>
    <media-airplay-button class="small-button">
      <svg slot="airplay" viewBox="0 0 24 24">
        <g transform="translate(-0.7, 0.5)">
          <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
        </g>
      </svg>
    </media-airplay-button>
  </div>
  <div slot="centered-chrome">
    <media-play-button>
      <svg slot="play" viewBox="0 0 16 16">
        <g transform="translate(-6, -6)">
          <path d="M19.6,13.2L11.1,9c-0.6-0.3-1.2,0.1-1.2,0.7v8.5c0,0.6,0.7,1,1.2,0.7l8.5-4.2C20.2,14.4,20.2,13.6,19.6,13.2z"/>
        </g>
      </svg>
      <svg slot="pause" viewBox="0 0 16 16">
        <g transform="translate(-6, -6)">
          <g>
            <path d="M17.8,20c-0.5,0-0.9-0.4-0.9-0.9V8.9c0-0.5,0.4-0.9,0.9-0.9s0.9,0.4,0.9,0.9v10.2C18.7,19.6,18.3,20,17.8,20z"/>
          </g>
          <g>
            <path d="M10.1,20c-0.5,0-0.9-0.4-0.9-0.9V8.9C9.2,8.4,9.6,8,10.1,8S11,8.4,11,8.9v10.2C10.9,19.6,10.5,20,10.1,20z"/>
          </g>
        </g>
      </svg>
    </media-play-button>
  </div>
  <media-control-bar>
    <media-play-button class="small-button">
      <svg slot="play" viewBox="0 0 16 16">
        <g transform="translate(-6, -6)">
          <path d="M19.6,13.2L11.1,9c-0.6-0.3-1.2,0.1-1.2,0.7v8.5c0,0.6,0.7,1,1.2,0.7l8.5-4.2C20.2,14.4,20.2,13.6,19.6,13.2z"/>
        </g>
      </svg>
      <svg slot="pause" viewBox="0 0 16 16">
        <g transform="translate(-6, -6)">
          <g>
            <path d="M17.8,20c-0.5,0-0.9-0.4-0.9-0.9V8.9c0-0.5,0.4-0.9,0.9-0.9s0.9,0.4,0.9,0.9v10.2C18.7,19.6,18.3,20,17.8,20z"/>
          </g>
          <g>
            <path d="M10.1,20c-0.5,0-0.9-0.4-0.9-0.9V8.9C9.2,8.4,9.6,8,10.1,8S11,8.4,11,8.9v10.2C10.9,19.6,10.5,20,10.1,20z"/>
          </g>
        </g>
      </svg>
    </media-play-button>
    <media-mute-button class="small-button">
      <svg slot="off" viewBox="0 0 16 16">
        <g transform="translate(-6, -6)">
          <path d="M13,8.2l-2.8,2.9v0.1H7.4c-0.5,0-0.9,0.4-0.9,0.9V16c0,0.5,0.4,0.9,0.9,0.9h2.8l2.8,2.9c0.3,0.3,0.8,0.1,0.8-0.3v-11
        C13.8,8.1,13.3,7.9,13,8.2z"/>
          <path d="M19.4,14l2-2c0.3-0.3,0.3-0.6,0-0.9c-0.3-0.3-0.6-0.3-0.9,0l-2,2l-2-2c-0.3-0.3-0.6-0.3-0.9,0c-0.3,0.3-0.3,0.6,0,0.9l2,2
        l-2,2c-0.3,0.3-0.3,0.6,0,0.9c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.3-0.1,0.4-0.2l2-2l2,2c0.1,0.1,0.3,0.2,0.4,0.2
        c0.2,0,0.3-0.1,0.4-0.2c0.3-0.3,0.3-0.6,0-0.9L19.4,14z"/>
        </g>
      </svg>
      <svg slot="high" viewBox="0 0 16 16">
        <g transform="translate(-6, -6)">
          <g id="_x2D_e-speaker_00000056397674509617663590000017246565507478500284_">
            <path d="M13.1,8.2l-2.8,3l0,0H7.5c-0.5,0-0.9,0.4-0.9,0.9V16c0,0.5,0.4,0.9,0.9,0.9h2.8l2.8,2.9c0.3,0.3,0.8,0.1,0.8-0.3v-11
              C13.9,8.1,13.4,7.9,13.1,8.2z"/>
          </g>
          <g>
            <g>
              <path d="M18.6,19.8c-0.2,0-0.3-0.1-0.4-0.2c-0.3-0.3-0.3-0.6,0-0.9c1.3-1.2,2-2.8,2-4.5s-0.7-3.3-2-4.5c-0.3-0.3-0.3-0.6,0-0.9
                c0.3-0.3,0.6-0.3,0.9,0c1.5,1.5,2.3,3.4,2.3,5.4c0,2.1-0.8,4-2.3,5.4C18.9,19.7,18.7,19.8,18.6,19.8z"/>
            </g>
            <g>
              <path d="M16.3,17.4c-0.2,0-0.3-0.1-0.4-0.2c-0.3-0.3-0.3-0.6,0-0.9c0.6-0.6,1-1.4,1-2.3s-0.4-1.6-1-2.3c-0.3-0.3-0.3-0.6,0-0.9
                c0.3-0.3,0.6-0.3,0.9,0c0.9,0.8,1.4,2,1.4,3.2s-0.5,2.3-1.4,3.2C16.6,17.4,16.4,17.4,16.3,17.4z"/>
            </g>
          </g>
        </g>
      </svg>
    </media-mute-button>
    <media-seek-forward-button class="small-button">
      <svg slot="forward" viewBox="0 0 16 16">
        <g transform="translate(-6, -6)">
          <g>
            <g>
              <path d="M9.1,19.1c-0.1,0-0.2,0-0.3-0.1c-0.2-0.1-0.3-0.4-0.3-0.6V9.5c0-0.3,0.1-0.5,0.3-0.6C8.9,8.8,9.2,8.9,9.4,9l6.5,4.4c0.2,0.1,0.3,0.3,0.3,0.5s-0.1,0.4-0.3,0.5l-6.5,4.4C9.3,19.1,9.2,19.1,9.1,19.1z"/>
            </g>
          </g>
          <path d="M18.8,19.1L18.8,19.1c-0.5,0-0.8-0.4-0.8-0.8V9.7c0-0.5,0.4-0.8,0.8-0.8l0,0c0.5,0,0.8,0.4,0.8,0.8v8.6C19.7,18.7,19.3,19.1,18.8,19.1z"/>
        </g>
      </svg>
    </media-seek-forward-button class="small-button">
    <media-time-display show-duration></media-time-display>
    <media-time-range>
      <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
      <media-preview-time-display slot="preview"></media-preview-time-display>
    </media-time-range>
    <media-captions-button class="small-button">
      <svg slot="off" viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#FFFFFF;}
        </style>
        <g transform="translate(-6, -6)">
          <g>
            <path d="M18.6,19.7H9.4c-1.4,0-2.6-1.1-2.6-2.6v-6.2c0-1.4,1.1-2.6,2.6-2.6h9.3c1.4,0,2.6,1.1,2.6,2.6v6.2C21.2,18.6,20,19.7,18.6,19.7z"/>
          </g>
          <g>
            <g>
              <path class="st0" d="M10.7,14H9.2c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h1.5c0.2,0,0.4,0.2,0.4,0.4C11.1,13.8,10.9,14,10.7,14z"/>
            </g>
            <g>
              <path class="st0" d="M18.5,14h-5.8c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h5.7c0.2,0,0.4,0.2,0.4,0.4C18.8,13.8,18.7,14,18.5,14z"/>
            </g>
            <g>
              <path class="st0" d="M13.7,16.2H9.2c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h4.6c0.2,0,0.4,0.2,0.4,0.4C14.1,16,13.9,16.2,13.7,16.2z"/>
            </g>
            <g>
              <path class="st0" d="M18.5,16.2h-2.7c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h2.7c0.2,0,0.4,0.2,0.4,0.4C18.9,16,18.7,16.2,18.5,16.2z"/>
            </g>
          </g>
        </g>
      </svg>
      <svg slot="on" viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#000000;}
        </style>
        <g transform="translate(-6, -6)">
          <g>
            <path d="M18.6,19.7H9.4c-1.4,0-2.6-1.1-2.6-2.6v-6.2c0-1.4,1.1-2.6,2.6-2.6h9.3c1.4,0,2.6,1.1,2.6,2.6v6.2C21.2,18.6,20,19.7,18.6,19.7z"/>
          </g>
          <g>
            <g>
              <path class="st0" d="M10.7,14H9.2c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h1.5c0.2,0,0.4,0.2,0.4,0.4C11.1,13.8,10.9,14,10.7,14z"/>
            </g>
            <g>
              <path class="st0" d="M18.5,14h-5.8c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h5.7c0.2,0,0.4,0.2,0.4,0.4C18.8,13.8,18.7,14,18.5,14z"/>
            </g>
            <g>
              <path class="st0" d="M13.7,16.2H9.2c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h4.6c0.2,0,0.4,0.2,0.4,0.4C14.1,16,13.9,16.2,13.7,16.2z"/>
            </g>
            <g>
              <path class="st0" d="M18.5,16.2h-2.7c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h2.7c0.2,0,0.4,0.2,0.4,0.4C18.9,16,18.7,16.2,18.5,16.2z"/>
            </g>
          </g>
        </g>
      </svg>
    </media-captions-button class="small-button">
    <!--
    <media-settings-button class="small-button">
      <svg viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#FFFFFF;}
        </style>
        <g transform="translate(-6, -6)">
          <path d="M20.9,13.2h-1.3c-0.2-1-0.5-1.9-1.1-2.6l0.9-0.9c0.3-0.3,0.3-0.8,0-1.1c-0.3-0.3-0.8-0.3-1.1,0l-0.9,0.9c-0.8-0.5-1.7-1-2.6-1.1V7.1c0-0.5-0.3-0.8-0.8-0.8s-0.8,0.3-0.8,0.8v1.3c-1,0.2-1.9,0.5-2.6,1.1L9.7,8.5c-0.3-0.3-0.8-0.3-1.1,0c-0.3,0.3-0.3,0.8,0,1.1l0.9,0.9c-0.5,0.8-1,1.7-1.1,2.6H7.1c-0.5,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8h1.3c0.2,1,0.5,1.9,1.1,2.6l-0.9,0.9c-0.3,0.3-0.3,0.8,0,1.1c0.2,0.2,0.4,0.2,0.5,0.2s0.4-0.1,0.5-0.2l0.9-0.9c0.8,0.5,1.7,1,2.6,1.1v1.5c0,0.5,0.3,0.8,0.8,0.8s0.8-0.3,0.8-0.8v-1.3c1-0.2,1.9-0.5,2.6-1.1l0.9,0.9c0.2,0.2,0.4,0.2,0.5,0.2s0.4-0.1,0.5-0.2c0.3-0.3,0.3-0.8,0-1.1l-0.9-0.9c0.5-0.8,1-1.7,1.1-2.6h1.3c0.5,0,0.8-0.3,0.8-0.8S21.3,13.2,20.9,13.2z M13.9,18.2c-2.3,0-4.2-1.8-4.2-4.2l0,0l0,0c0-2.3,1.8-4.2,4.2-4.2s4.2,1.8,4.2,4.2S16.2,18.2,13.9,18.2z"/>
        </g>
      </svg>
    </media-settings-button>
    -->
    <media-pip-button class="small-button">
      <svg slot="enter" viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#FFFFFF;}
        </style>
        <g transform="translate(-6, -6)">
          <g>
            <path d="M20.2,19.1H7.8c-0.4,0-0.7-0.3-0.7-0.7V9.5c0-0.4,0.3-0.7,0.7-0.7h12.3c0.4,0,0.7,0.3,0.7,0.7v8.9C20.9,18.9,20.6,19.1,20.2,19.1z M8.5,17.8h11v-7.5h-11V17.8z"/>
          </g>
          <rect x="13.2" y="13.3" width="5.1" height="3.1"/>
        </g>
      </svg>
      <svg slot="exit" viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#FFFFFF;}
        </style>
        <g transform="translate(-6, -6)">
          <g>
            <path d="M20.2,19.1H7.8c-0.4,0-0.7-0.3-0.7-0.7V9.5c0-0.4,0.3-0.7,0.7-0.7h12.3c0.4,0,0.7,0.3,0.7,0.7v8.9C20.9,18.9,20.6,19.1,20.2,19.1z M8.5,17.8h11v-7.5h-11V17.8z"/>
          </g>
          <rect x="13.2" y="13.3" width="5.1" height="3.1"/>
        </g>
      </svg>
    </media-pip-button>
    <media-cinema-button class="small-button">
      <svg viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#FFFFFF;}
        </style>
        <g transform="translate(-6, -6)">
		      <path d="M19.2,17.6H8.8c-0.4,0-0.7-0.3-0.7-0.7v-5.8c0-0.4,0.3-0.7,0.7-0.7h10.4c0.4,0,0.7,0.3,0.7,0.7v5.8C19.9,17.3,19.6,17.6,19.2,17.6z M9.5,16.2h9v-4.4h-9V16.2z"/>
        </g>
      </svg>
    </media-cinema-button>
    <media-fullscreen-button class="small-button">
      <svg slot="enter" viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#FFFFFF;}
        </style>
        <g transform="translate(-6, -6)">
          <g>
            <path d="M8.9,12.6c-0.4,0-0.7-0.3-0.7-0.7v-3c0-0.4,0.3-0.7,0.7-0.7h3c0.4,0,0.7,0.3,0.7,0.7S12.4,9.6,12,9.6H9.6V12C9.6,12.3,9.3,12.6,8.9,12.6z"/>
          </g>
          <g>
            <path d="M19.1,12.6c-0.4,0-0.7-0.3-0.7-0.7V9.6H16c-0.4,0-0.7-0.3-0.7-0.7s0.3-0.7,0.7-0.7h3c0.4,0,0.7,0.3,0.7,0.7v3C19.8,12.3,19.5,12.6,19.1,12.6z"/>
          </g>
          <g>
            <path d="M12,19.8h-3c-0.4,0-0.7-0.3-0.7-0.7v-3c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7v2.4H12c0.4,0,0.7,0.3,0.7,0.7C12.6,19.5,12.3,19.8,12,19.8z"/>
          </g>
          <g>
            <path d="M19.1,19.8h-3c-0.4,0-0.7-0.3-0.7-0.7c0-0.4,0.3-0.7,0.7-0.7h2.4V16c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7v3C19.8,19.5,19.5,19.8,19.1,19.8z"/>
          </g>
        </g>
      </svg>
      <svg slot="exit" viewBox="0 0 16 16">
        <style type="text/css">
          .st0{fill:#FFFFFF;}
        </style>
        <g transform="translate(-6, -6)">
          <g>
            <path d="M8.9,12.6c-0.4,0-0.7-0.3-0.7-0.7v-3c0-0.4,0.3-0.7,0.7-0.7h3c0.4,0,0.7,0.3,0.7,0.7S12.4,9.6,12,9.6H9.6V12C9.6,12.3,9.3,12.6,8.9,12.6z"/>
          </g>
          <g>
            <path d="M19.1,12.6c-0.4,0-0.7-0.3-0.7-0.7V9.6H16c-0.4,0-0.7-0.3-0.7-0.7s0.3-0.7,0.7-0.7h3c0.4,0,0.7,0.3,0.7,0.7v3C19.8,12.3,19.5,12.6,19.1,12.6z"/>
          </g>
          <g>
            <path d="M12,19.8h-3c-0.4,0-0.7-0.3-0.7-0.7v-3c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7v2.4H12c0.4,0,0.7,0.3,0.7,0.7C12.6,19.5,12.3,19.8,12,19.8z"/>
          </g>
          <g>
            <path d="M19.1,19.8h-3c-0.4,0-0.7-0.3-0.7-0.7c0-0.4,0.3-0.7,0.7-0.7h2.4V16c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7v3C19.8,19.5,19.5,19.8,19.1,19.8z"/>
          </g>
        </g>
      </svg>
    </media-fullscreen-button>
  </media-control-bar>
</media-controller>
`;

class MediaThemeDemuxed extends MediaTheme {
  static template = template;
}

defineCustomElement('media-theme-demuxed-2022', MediaThemeDemuxed);

export default MediaThemeDemuxed;
