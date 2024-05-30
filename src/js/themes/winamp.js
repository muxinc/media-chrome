import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaThemeElement } from '../media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
  :host {
    --media-range-background: transparent;

    --media-range-track-height: 1px;
    --media-range-track-background: transparent;

    --media-preview-time-background: transparent;
    --media-preview-time-margin: 0;
    --media-preview-time-padding: 0;

    image-rendering: pixelated;
  }

  media-time-range, media-time-range:active, media-time-range:hover {
    --media-range-thumb-width: 28px;
    --media-range-thumb-height: 10px;
    --media-range-thumb-border-radius: 0;
    --media-range-thumb-background: 58px 0 url(./winamp-theme/POSBAR.BMP);
  }

  media-volume-range, media-volume-range:active, media-volume-range:hover {
    --media-range-thumb-width: 14px;
    --media-range-thumb-height: 10px;
    --media-range-thumb-border-radius: 0;
    --media-range-thumb-background: 53px 443px url(./winamp-theme/BALANCE.BMP);
  }

  @font-face {
    font-family: winamp-numbers;
    src: url("./winamp-theme/winamp-numbers.ttf") format("truetype");
  }

  @font-face {
    font-family: winamp;
    src: url("./winamp-theme/winamp.ttf") format("truetype");
  }

  .wrapper {
    position: relative; width: 275px; height: 116px; background: url(./winamp-theme/MAIN.BMP);
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .controls {
    position: absolute; top: 88px; left: 16px; display: flex;
  }

  media-seek-backward-button {
    display: block; overflow: hidden; padding: 0; width: 23px; height: 18px;
  }

  media-seek-backward-button div[slot="icon"] {
    width: 23px; height: 18px; background: 136px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-seek-backward-button:active div[slot="icon"] {
    width: 23px; height: 18px; background: 136px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button {
    display: block; overflow: hidden; padding: 0; width: 23px; height: 18px;
  }

  media-play-button.play div[slot="play"] {
    width: 23px; height: 18px; background: 114px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.play div[slot="pause"] {
    width: 23px; height: 18px; background: 114px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.play:active div[slot="play"] {
    width: 23px; height: 18px; background: 114px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.play:active div[slot="pause"] {
    width: 23px; height: 18px; background: 114px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.pause div[slot="pause"] {
    width: 23px; height: 18px; background: 91px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.pause div[slot="play"] {
    width: 23px; height: 18px; background: 91px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.pause:active div[slot="play"] {
    width: 23px; height: 18px; background: 91px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.pause:active div[slot="pause"] {
    width: 23px; height: 18px; background: 91px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.stop div[slot="pause"] {
    width: 23px; height: 18px; background: 68px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.stop div[slot="play"] {
    width: 23px; height: 18px; background: 68px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.stop:active div[slot="play"] {
    width: 23px; height: 18px; background: 68px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-play-button.stop:active div[slot="pause"] {
    width: 23px; height: 18px; background: 68px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-seek-forward-button {
    display: block; overflow: hidden; padding: 0; width: 23px; height: 18px;
  }

  media-seek-forward-button div[slot="icon"] {
    width: 23px; height: 18px; background: 45px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-seek-forward-button:active div[slot="icon"] {
    width: 23px; height: 18px; background: 45px 18px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-fullscreen-button {
    display: block; overflow: hidden; padding: 0; margin-top: 1px; margin-left: 6px; width: 22px; height: 16px;
  }

  media-fullscreen-button div[slot="enter"] {
    width: 23px; height: 16px; background: 22px 0 url(./winamp-theme/CBUTTONS.BMP);
  }

  media-fullscreen-button:active div[slot="enter"] {
    width: 23px; height: 16px; background: 22px 20px url(./winamp-theme/CBUTTONS.BMP);
  }

  media-time-display {
    position: absolute; background: black; line-height: 20px; top: 23px; left: 61px; padding: 0; color: #00E201; letter-spacing: -0.04rem; font-family: 'winamp-numbers'; font-size: 83%; font-smooth: never; -webkit-font-smoothing: none;
  }

  media-time-range {
    position: absolute; top: 71px; left: 17px; background: transparent; height: 12px; width: 248px; padding: 0;
  }

  media-volume-range {
    position: absolute; top: 58px; left: 108px; background: 0 -2px url(./winamp-theme/VOLUME.png); height: 10px; width: 68px; padding: 0;
  }

  .balance {
    position: absolute; top: 58px; left: 177px; background: -9px -2px url(./winamp-theme/BALANCE.BMP); height: 10px; width: 37px; padding: 0;
  }

  .monoster {
    position: absolute; left: 215px; top: 40px; width: 50px; height: 15px; display: flex;
  }

  .monoster :first-child {
    width: 24px; height: 13px; background: 24px 13px url(./winamp-theme/MONOSTER.BMP);
  }

  .monoster :last-child {
    width: 26px; height: 13px; background: 0px 25px url(./winamp-theme/MONOSTER.BMP);
  }

  marquee {
    position: absolute; left: 111px; top: 27px; width: 153px; letter-spacing: 0.02rem; font-family: winamp; font-size: 6px; color: #00E201; font-smooth: never; -webkit-font-smoothing: none; text-transform: uppercase;
  }

  .kbps {
    position: absolute; left: 111px; top: 43px; width: 153px; letter-spacing: 0.02rem; font-family: winamp; font-size: 6px; color: #00E201; font-smooth: never; -webkit-font-smoothing: none;
  }

  .khz {
    position: absolute; left: 156px; top: 43px; width: 153px; letter-spacing: 0.02rem; font-family: winamp; font-size: 6px; color: #00E201; font-smooth: never; -webkit-font-smoothing: none;
  }

  media-play-button.play-pause-indicator {
    display: block; overflow: hidden; background: none; position: absolute; top: 28px; left: 24px; padding: 0; width: 9px; height: 9px;
  }

  media-play-button.play-pause-indicator div[slot="play"] {
    width: 9px; height: 9px; background: 0 0 url(./winamp-theme/STOP.png);
  }

  media-play-button.play-pause-indicator div[slot="pause"] {
    width: 9px; height: 9px; background: 0 0 url(./winamp-theme/PLAY.png);
  }

  media-play-button.vu-meter {
    display: block; overflow: hidden; background: none; position: absolute; top: 40px; left: 20px; padding: 0; width: 88px; height: 22px;
  }

  media-play-button.vu-meter div[slot="play"] {
    width: 88px; height: 22px; background: none;
  }

  media-play-button.vu-meter div[slot="pause"] {
    width: 88px; height: 22px; background: 0 0 url(./winamp-theme/VU.gif);
  }

  .display {
    position: absolute; left: 10px; top: 22px;
  }

  .eq {
    position: absolute; left: 220px; top: 57px; width: 22px; height: 12px; background: 0 0 url(./winamp-theme/EQ.png);
  }

  .pl {
    position: absolute; left: 243px; top: 57px; width: 22px; height: 12px; background: 0 0 url(./winamp-theme/PL.png);
  }

  .loop {
    position: absolute; left: 211px; top: 89px; width: 28px; height: 14px; background: 0 0 url(./winamp-theme/LOOP.png);
  }

  media-captions-button {
    position: absolute; left: 165px; top: 89px; width: 46px; height: 14px; padding: 0; overflow: hidden;
  }

  media-captions-button div[slot="on"] {
    width: 46px; height: 14px; background: 0 0 url(./winamp-theme/SHUFFLE.png) no-repeat;
  }

  media-captions-button div[slot="off"] {
    width: 46px; height: 14px; background: 0 0 url(./winamp-theme/SHUFFLE.png) no-repeat;
  }

  .window {
    width: 275px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .window .top, .window .bottom {
    width: 100%;
    height: 20px;
    flex: none;
    display: flex;
    flex: none;
  }

  .window .top :nth-child(1) {
    width: 25px;
    height: 20px;
    flex: none;
    background-image: url(./winamp-theme/WINDOWTL.png);
  }

  .window .top :nth-child(2) {
    height: 20px;
    width: 100%;
    flex-grow: 1;
    background-image: url(./winamp-theme/WINDOWT.png);
    background-repeat: no-repeat;
  }

  .window .top :nth-child(3) {
    width: 25px;
    height: 20px;
    flex: none;
    background-image: url(./winamp-theme/WINDOWTR.png);
  }

  .window .bottom :nth-child(1) {
    width: 125px;
    height: 14px;
    flex: none;
    background-image: url(./winamp-theme/WINDOWBL.png);
  }

  .window .bottom :nth-child(2) {
    height: 14px;
    width: 100%;
    flex-grow: 1;
    background-image: url(./winamp-theme/WINDOWB.png);
    background-repeat: no-repeat;
  }

  .window .bottom :nth-child(3) {
    width: 125px;
    height: 14px;
    flex: none;
    background-image: url(./winamp-theme/WINDOWBR.png);
  }

  .window .center {
    width: 100%;
    height: 108px;
    display: flex;
  }

  .window .center .center-left {
    width: 11px;
    height: 100%;
    flex: none;
    background-image: url(./winamp-theme/WINDOWL.png);
    background-repeat: no-repeat;
    background-position: 0 0;
  }

  .window .center .center-middle {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    overflow: hidden;
  }

  .window .center .center-middle media-controller {
    display: block;
    width: 100%;
    height: 100%;
    background: black;
    transform: scale(1.35);
  }

  .window .center .center-right {
    width: 8px;
    height: 100%;
    flex: none;
    background-image: url(./winamp-theme/WINDOWR.png);
  }
</style>

<div class="wrapper">
  <div class="controls">
    <media-seek-backward-button mediacontroller="controller">
      <div slot="icon"></div>
    </media-seek-backward-button>
    <media-play-button class="play" mediacontroller="controller">
      <div slot="play"></div>
      <div slot="pause"></div>
    </media-play-button>
    <media-play-button class="pause" mediacontroller="controller">
      <div slot="play"></div>
      <div slot="pause"></div>
    </media-play-button>
    <media-play-button class="stop" mediacontroller="controller">
      <div slot="play"></div>
      <div slot="pause"></div>
    </media-play-button>
    <media-seek-forward-button mediacontroller="controller">
      <div slot="icon"></div>
    </media-seek-forward-button>
    <media-fullscreen-button mediacontroller="controller">
      <div slot="enter"></div>
    </media-fullscreen-button>
  </div>
  <media-time-display mediacontroller="controller"></media-time-display>
  <media-time-range mediacontroller="controller"></media-time-range>
  <media-volume-range mediacontroller="controller"></media-volume-range>
  <img class="header" src="./winamp-theme/HEADER.png">
  <img class="display" src="./winamp-theme/DISPLAY.png">
  <div class="eq"></div>
  <div class="pl"></div>
  <div class="loop"></div>
  <media-captions-button mediacontroller="controller">
    <div slot="on"></div>
    <div slot="off"></div>
  </media-captions-button>
  <div class="balance"></div>
  <div class="monoster">
    <div></div>
    <div></div>
  </div>
  <marquee scrolldelay="200">Media Chrome, it really whips the llama's ass!</marquee>
  <div class="kbps">192</div>
  <div class="khz">44</div>
  <media-play-button mediacontroller="controller" class="play-pause-indicator">
    <div slot="play"></div>
    <div slot="pause"></div>
  </media-play-button>
  <media-play-button mediacontroller="controller" class="vu-meter">
    <div slot="play"></div>
    <div slot="pause"></div>
  </media-play-button>
</div>

<div class="window">
  <div class="top">
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="center">
    <div class="center-left"></div>
    <div class="center-middle">
      <div style="width: 100%; height: 100%; background: green;">
        <media-controller id="controller">
          <slot name="media" slot="media"></slot>
          <slot name="poster" slot="poster"></slot>
        </media-controller>
      </div>
    </div>
    <div class="center-right"></div>
  </div>
  <div class="bottom">
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
`;

class MediaThemeWinamp extends MediaThemeElement {
  static template = template;
}

if (!globalThis.customElements.get('media-theme-winamp')) {
  globalThis.customElements.define('media-theme-winamp', MediaThemeWinamp);
}

export default MediaThemeWinamp;
