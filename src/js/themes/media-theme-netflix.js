/* 
<media-theme-netflix>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-netflix>
*/

import MediaTheme from './media-theme.js';

const template = `
<style>
  body {
    font-family: "Helvetica Neue", sans-serif;
  }

  media-controller {
    width: 100%;
    /* Keep the buttons from overflowing */
    min-width: 420px;
    height: 720px;

    --media-range-thumb-background: rgba(255,0,0, 1);
    --media-range-track-height: 4px;
    --media-range-track-transition: height .2s ease;
    --media-range-track-background: #555;
    --media-range-bar-color: rgb(229, 9, 20);

    --media-button-icon-width: 50px;
    --media-button-icon-height: 50px;
  }

  media-time-range {
    width: 100%;
    height: 25px;
    margin-bottom: 10px;
    --media-range-thumb-height: 20px;
    --media-range-thumb-width: 20px;
    --media-range-thumb-border-radius: 20px;
    --media-time-buffered-color: #777;
  }

  media-time-range:hover {
    --media-range-track-height: 9px;
  }

  media-control-bar {
    background: none;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-align-items: center;
    align-items: center;
    display: flex;
    -webkit-box-pack: justify;
    flex-wrap: nowrap;
  }

  media-control-bar > * {
    background: none;
    display: flex;
    flex: 0 1 auto;
    width: 60px;
    min-width: 60px;
    height: 80px;
    padding-bottom: 20px;
    margin: 0 3px;

    --media-button-icon-transform: scale(1.2);
    --media-button-icon-transition: transform .2s ease;
  }

  /* For some reason media-control-bar > *:hover doesn't work...
  while media-control-bar > *:focus-within does. 
  And also media-control-bar > *:not(:hover)
  Really annoying. Need to submit a bug.  */
  media-control-bar > *:not(:hover) {
    --media-button-icon-transform: scale(1);
    --media-button-icon-transition: transform .2s ease;
  }

  media-play-button,
  media-seek-backward-button,
  media-seek-forward-button,
  media-mute-button,
  media-fullscreen-button {
    height: 80px;
  }

  media-fullscreen-button {
    margin-right: 10px;
  }
  
  media-control-bar > *:focus,
  media-control-bar > *:focus-within {
    outline: 0;
  }

  media-volume-range {
    width: 100px;
  }

  .videoTitle {
    flex-grow: 1;
    height: 80px;
    line-height: 64px;
    vertical-align: middle;
    overflow: hidden;
    padding: 0 10px;
    min-width: 0;
  }

  .videoTitleText {
    width: 100%;
    vertical-align: middle;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .videoTitleText h4 {
    margin: 0;
    display: inline-block;
    white-space: nowrap;
  }

  .videoTitle span {
    display: inline;
    font-weight: 200;
    margin-left: 5px;
  }

</style>

<media-controller>

  <slot name="media" slot="media"></slot>

  <media-time-range></media-time-range>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-seek-backward-button></media-seek-backward-button>
    <media-seek-forward-button></media-seek-forward-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <div class="videoTitle">
      <div class="videoTitleText">
        <h4>My Title</h4><span>P2:E4 Episode 4</span>
      </div>
    </div>
    <media-fullscreen-button>
      <svg slot="enter" viewBox="0 0 28 28"><g transform="translate(2, 6)"><polygon points="8 0 6 0 5.04614258 0 0 0 0 5 2 5 2 2 8 2"></polygon><polygon transform="translate(4, 13.5) scale(1, -1) translate(-4, -13.5) " points="8 11 6 11 5.04614258 11 0 11 0 16 2 16 2 13 8 13"></polygon><polygon transform="translate(20, 2.5) scale(-1, 1) translate(-20, -2.5) " points="24 0 22 0 21.0461426 0 16 0 16 5 18 5 18 2 24 2"></polygon><polygon transform="translate(20, 13.5) scale(-1, -1) translate(-20, -13.5) " points="24 11 22 11 21.0461426 11 16 11 16 16 18 16 18 13 24 13"></polygon></g></svg>
      <svg slot="exit" viewBox="0 0 28 28"><g transform="translate(3, 6)"><polygon transform="translate(19.000000, 3.000000) scale(-1, 1) translate(-19.000000, -3.000000) " points="22 0 20 0 20 4 16 4 16 6 22 6"></polygon><polygon transform="translate(19.000000, 13.000000) scale(-1, -1) translate(-19.000000, -13.000000) " points="22 10 20 10 20 14 16 14 16 16 22 16"></polygon><polygon points="6 0 4 0 4 4 0 4 0 6 6 6"></polygon><polygon transform="translate(3.000000, 13.000000) scale(1, -1) translate(-3.000000, -13.000000) " points="6 10 4 10 4 14 0 14 0 16 6 16"></polygon></g></svg>
    </media-fullscreen-button>
  </media-control-bar>
</media-controller>
`;

class MediaThemeNetflix extends MediaTheme {
  constructor(options = {}) {
    super(template, { /* allow ...defaultOptions, */ ...options });
  }
}

if (!customElements.get('media-theme-netflix')) {
  customElements.define('media-theme-netflix', MediaThemeNetflix);
}

export default MediaThemeNetflix;
