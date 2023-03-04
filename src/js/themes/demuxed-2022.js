/* 
<media-theme-demuxed-2022>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-demuxed-2022>
*/

import { window, document } from '../utils/server-safe-globals.js';
import { MediaThemeElement } from '../media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    --primary-color: black;
    --secondary-color: transparent;
    --tertiary-color: #7596CC;
  }

  :host([stream-type="live"]) media-time-range, :host([stream-type="live"]) media-time-display {
    opacity: 0;
  }

  media-controller {
    width: 100%;
    aspect-ratio: 16 / 9;

    --media-control-background: var(--secondary-color);
    --media-control-hover-background: transparent;
    
    --media-icon-color: var(--primary-color);

    --media-range-track-height: 6px;
    --media-range-track-background: rgba(0,0,0,0.4);
    --media-range-track-border-radius: 9999px;

    --media-range-thumb-background: var(--tertiary-color);
    --media-range-thumb-width: 14px;
    --media-range-thumb-height: 14px;
  }

  media-controller[media-is-fullscreen] {
    aspect-ratio: auto;
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

  media-cinema-button.small-button {
    display: none;
    cursor: pointer;
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

  media-time-range {
    height: 32px;
    margin: 0 8px 0 0;
  }

  media-volume-range {
    height: 100%;
  }

  media-time-display {
    min-width: 92px;
    padding: 0 6px 3px 8px;
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
    width: calc(100% - 36px);
    display: flex;
    flex-direction: row-reverse;
    padding-right: 36px;
  }

  div[slot="top-chrome"] .small-button {
    margin: 32px 8px;
  }

  .media-volume-wrapper {
    position: relative;
    padding-left: 6px;
  }

  .media-volume-range-wrapper {
    width: 122px;
    height: 34px;
    overflow: hidden;
    opacity: 0;
    transform: rotate(-90deg);
    position: absolute;
    top: -75px;
    left: -52px;
    border-left: 16px solid transparent;
  }

  media-volume-range {
    border-radius: 0 9999px 9999px 0;
    background: rgba(0,0,0,0.2);
    --media-range-track-width: 80px;
  }

  media-mute-button:hover + .media-volume-range-wrapper,
  media-mute-button:focus + .media-volume-range-wrapper,
  media-mute-button:focus-within + .media-volume-range-wrapper,
  .media-volume-range-wrapper:hover,
  .media-volume-range-wrapper:focus,
  .media-volume-range-wrapper:focus-within {
    opacity: 1;
  }

  media-airplay-button[media-airplay-unavailable].small-button {
    display: none;
  }

  media-cast-button[media-cast-unavailable].small-button {
    display: none;
  }

  media-pip-button[media-pip-unavailable].small-button {
    display: none;
  }

  media-captions-button.small-button {
    display: none;
  }

  media-captions-button[media-captions-list].small-button {
    display: flex;
  }

  media-captions-button[media-subtitles-list].small-button {
    display: flex;
  }

  media-controller[user-inactive]:not(.sm) * {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  media-controller:not(.sm) media-control-bar {
    position: static;
    background: transparent;
    margin: 0;
    padding: 22px 15px;
  }

  media-controller:not(.sm) .media-volume-range-wrapper {
    display: none;
  }

  media-controller:not(.sm) .small-button {
    display: none;
    width: 48px;
    height: 48px;
  }

  media-controller:not(.sm) .small-button svg {
    transform: scale(1.4);
  }

  media-controller:not(.sm) div[slot="top-chrome"] {
    width: calc(100% - 13px);
    padding-right: 13px;
  }

  media-controller:not(.sm) div[slot="top-chrome"] .small-button {
    display: flex;
    margin: 22px 7px;
  }

  media-controller:not(.sm) media-airplay-button[media-airplay-unavailable].small-button {
    display: none;
  }

  media-controller:not(.sm) media-cast-button[media-cast-unavailable].small-button {
    display: none;
  }

  media-controller:not(.sm) media-fullscreen-button.small-button {
    display: flex;
    position: absolute;
    right: 20px;
  }

  media-controller:not(.sm) media-mute-button.small-button {
    display: flex;
  }

  media-controller:not(.sm) media-captions-button.small-button {
    position: absolute;
    top: 22px;
    left: 16px;
  }

  media-controller:not(.sm) media-time-range {
    display: none;
  }

  media-controller:not(.sm) media-time-display {
    display: none;
  }

  media-controller:not(.sm) div[slot="centered-chrome"] media-play-button {
    z-index: 1;
    height: 72px;
    width: 72px;
  }

  media-controller:not(.sm) div[slot="centered-chrome"] media-play-button svg {
    margin-left: -2px;
    height: 48px;
  }
</style>

<media-controller>
  <slot name="media" slot="media"></slot>
  <slot name="poster" slot="poster"></slot>
  <div class="demuxed-gradient-bottom"></div>
  <div slot="top-chrome">
    <media-cast-button class="small-button">
      <svg slot="enter" viewBox="0 0 26 26"><path d="M2.5 18.5v3h3c0-1.7-1.34-3-3-3ZM2.5 14.5v2c2.76 0 5 2.2 5 5h2c0-3.87-3.13-7-7-7Z"/><path d="M2.5 10.5v2c4.97 0 9 4 9 9h2c0-6.08-4.93-11-11-11Z"/><path d="M22.5 3.5h-18c-1.1 0-2 .9-2 2v3h2v-3h18v14h-7v2h7c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2Z"/></svg>
      <svg slot="exit" viewBox="0 0 26 26"><path d="M2.5 18.5v3h3c0-1.7-1.34-3-3-3ZM2.5 14.5v2c2.76 0 5 2.2 5 5h2c0-3.87-3.13-7-7-7Z"/><path d="M2.5 10.5v2c4.97 0 9 4 9 9h2c0-6.08-4.93-11-11-11Z"/><path d="M22.5 3.5h-18c-1.1 0-2 .9-2 2v3h2v-3h18v14h-7v2h7c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2Z"/></svg>
    </media-cast-button>
    <media-airplay-button class="small-button">
      <svg slot="airplay" viewBox="0 0 23 23"><path d="M20.88 3.5H2.62a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4l1.73-2h-4v-11h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V4.37a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/></svg>
    </media-airplay-button>
  </div>
  <div slot="centered-chrome">
    <media-play-button>
      <svg slot="play" viewBox="0 0 16 16"><path d="M13.6 7.2 5.1 3c-.6-.3-1.2.1-1.2.7v8.5c0 .6.7 1 1.2.7l8.5-4.2c.6-.3.6-1.1 0-1.5z"/></svg>
      <svg slot="pause" viewBox="0 0 16 16"><path d="M11.8 14c-.5 0-.9-.4-.9-.9V2.9c0-.5.4-.9.9-.9s.9.4.9.9v10.2c0 .5-.4.9-.9.9zM4.1 14c-.5 0-.9-.4-.9-.9V2.9c0-.5.4-.9.9-.9s.9.4.9.9v10.2c-.1.5-.5.9-.9.9z"/></svg>
    </media-play-button>
  </div>
  <media-control-bar>
    <media-play-button class="small-button">
      <svg slot="play" viewBox="0 0 16 16"><path d="M13.6 7.2 5.1 3c-.6-.3-1.2.1-1.2.7v8.5c0 .6.7 1 1.2.7l8.5-4.2c.6-.3.6-1.1 0-1.5z"/></svg>
      <svg slot="pause" viewBox="0 0 16 16"><path d="M11.8 14c-.5 0-.9-.4-.9-.9V2.9c0-.5.4-.9.9-.9s.9.4.9.9v10.2c0 .5-.4.9-.9.9zM4.1 14c-.5 0-.9-.4-.9-.9V2.9c0-.5.4-.9.9-.9s.9.4.9.9v10.2c-.1.5-.5.9-.9.9z"/></svg>
    </media-play-button>
    <div class="media-volume-wrapper">
      <media-mute-button class="small-button">
        <svg slot="off" viewBox="0 0 16 16"><path d="M7 2.2 4.2 5.1v.1H1.4c-.5 0-.9.4-.9.9V10c0 .5.4.9.9.9h2.8L7 13.8c.3.3.8.1.8-.3v-11c0-.4-.5-.6-.8-.3ZM13.4 8l2-2" fill-rule="nonzero"/><path d="M15.622 5.479a.606.606 0 0 1 0 .857l-4.286 4.286a.606.606 0 1 1-.857-.857l4.286-4.286a.606.606 0 0 1 .857 0Z"/><path d="M10.479 5.479a.606.606 0 0 0 0 .857l4.286 4.286a.606.606 0 1 0 .857-.857l-4.286-4.286a.606.606 0 0 0-.857 0Z"/></svg>
        <svg slot="low" viewBox="0 0 16 16"><path d="m7.1 2.2-2.8 3H1.5c-.5 0-.9.4-.9.9V10c0 .5.4.9.9.9h2.8l2.8 2.9c.3.3.8.1.8-.3v-11c0-.4-.5-.6-.8-.3zM10.3 11.4c-.2 0-.3-.1-.4-.2-.3-.3-.3-.6 0-.9.6-.6 1-1.4 1-2.3s-.4-1.6-1-2.3c-.3-.3-.3-.6 0-.9.3-.3.6-.3.9 0 .9.8 1.4 2 1.4 3.2s-.5 2.3-1.4 3.2c-.2.2-.4.2-.5.2z"/></svg>
        <svg slot="medium" viewBox="0 0 16 16"><path d="m7.1 2.2-2.8 3H1.5c-.5 0-.9.4-.9.9V10c0 .5.4.9.9.9h2.8l2.8 2.9c.3.3.8.1.8-.3v-11c0-.4-.5-.6-.8-.3zM12.6 13.8c-.2 0-.3-.1-.4-.2-.3-.3-.3-.6 0-.9 1.3-1.2 2-2.8 2-4.5s-.7-3.3-2-4.5c-.3-.3-.3-.6 0-.9.3-.3.6-.3.9 0 1.5 1.5 2.3 3.4 2.3 5.4 0 2.1-.8 4-2.3 5.4-.2.1-.4.2-.5.2z"/><path d="M10.3 11.4c-.2 0-.3-.1-.4-.2-.3-.3-.3-.6 0-.9.6-.6 1-1.4 1-2.3s-.4-1.6-1-2.3c-.3-.3-.3-.6 0-.9.3-.3.6-.3.9 0 .9.8 1.4 2 1.4 3.2s-.5 2.3-1.4 3.2c-.2.2-.4.2-.5.2z"/></svg>
        <svg slot="high" viewBox="0 0 16 16"><path d="m7.1 2.2-2.8 3H1.5c-.5 0-.9.4-.9.9V10c0 .5.4.9.9.9h2.8l2.8 2.9c.3.3.8.1.8-.3v-11c0-.4-.5-.6-.8-.3zM12.6 13.8c-.2 0-.3-.1-.4-.2-.3-.3-.3-.6 0-.9 1.3-1.2 2-2.8 2-4.5s-.7-3.3-2-4.5c-.3-.3-.3-.6 0-.9.3-.3.6-.3.9 0 1.5 1.5 2.3 3.4 2.3 5.4 0 2.1-.8 4-2.3 5.4-.2.1-.4.2-.5.2z"/><path d="M10.3 11.4c-.2 0-.3-.1-.4-.2-.3-.3-.3-.6 0-.9.6-.6 1-1.4 1-2.3s-.4-1.6-1-2.3c-.3-.3-.3-.6 0-.9.3-.3.6-.3.9 0 .9.8 1.4 2 1.4 3.2s-.5 2.3-1.4 3.2c-.2.2-.4.2-.5.2z"/></svg>
      </media-mute-button>
      <div class="media-volume-range-wrapper">
        <media-volume-range></media-volume-range>
      </div>
    </div>
    <media-seek-forward-button style="display: none;" class="small-button">
      <svg slot="forward" viewBox="0 0 16 16"><path d="M3.1 13.1c-.1 0-.2 0-.3-.1-.2-.1-.3-.4-.3-.6V3.5c0-.3.1-.5.3-.6.1-.1.4 0 .6.1l6.5 4.4c.2.1.3.3.3.5s-.1.4-.3.5l-6.5 4.4c-.1.3-.2.3-.3.3zM12.8 13.1c-.5 0-.8-.4-.8-.8V3.7c0-.5.4-.8.8-.8.5 0 .8.4.8.8v8.6c.1.4-.3.8-.8.8z"/></svg> 
    </media-seek-forward-button>
    <media-time-display show-duration></media-time-display>
    <media-time-range>
      <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
      <media-preview-time-display slot="preview"></media-preview-time-display>
    </media-time-range>
    <media-captions-button class="small-button">
      <svg slot="off" viewBox="0 0 16 16"><path d="M12.6 13.7H3.4C2 13.7.8 12.6.8 11.1V4.9c0-1.4 1.1-2.6 2.6-2.6h9.3c1.4 0 2.6 1.1 2.6 2.6v6.2c-.1 1.5-1.3 2.6-2.7 2.6z"/><path fill="#fff" d="M4.7 8H3.2c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h1.5c.2 0 .4.2.4.4s-.2.4-.4.4zM12.5 8H6.7c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h5.7c.2 0 .4.2.4.4s-.1.4-.3.4zM7.7 10.2H3.2c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h4.6c.2 0 .4.2.4.4-.1.2-.3.4-.5.4zM12.5 10.2H9.8c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h2.7c.2 0 .4.2.4.4s-.2.4-.4.4z"/></svg>
      <svg slot="on" viewBox="0 0 16 16"><path d="M4.7 8H3.2c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h1.5c.2 0 .4.2.4.4s-.2.4-.4.4zM12.5 8H6.7c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h5.7c.2 0 .4.2.4.4s-.1.4-.3.4zM7.7 10.2H3.2c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h4.6c.2 0 .4.2.4.4-.1.2-.3.4-.5.4zM12.5 10.2H9.8c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h2.7c.2 0 .4.2.4.4s-.2.4-.4.4z"/></svg>
    </media-captions-button>
    <media-pip-button class="small-button">
      <svg slot="enter" viewBox="0 0 16 16"><path d="M14.2 13.1H1.8c-.4 0-.7-.3-.7-.7V3.5c0-.4.3-.7.7-.7h12.3c.4 0 .7.3.7.7v8.9c.1.5-.2.7-.6.7zM2.5 11.8h11V4.3h-11v7.5z"/><path d="M7.2 7.3h5.1v3.1H7.2z"/></svg>
      <svg slot="exit" viewBox="0 0 16 16"><path d="M14.2 13.1H1.8c-.4 0-.7-.3-.7-.7V3.5c0-.4.3-.7.7-.7h12.3c.4 0 .7.3.7.7v8.9c.1.5-.2.7-.6.7zM2.5 11.8h11V4.3h-11v7.5z"/><path d="M7.2 7.3h5.1v3.1H7.2z"/></svg>
    </media-pip-button>
    <media-cinema-button class="small-button">
      <svg viewBox="0 0 16 16"><path d="M13.2 11.6H2.8c-.4 0-.7-.3-.7-.7V5.1c0-.4.3-.7.7-.7h10.4c.4 0 .7.3.7.7v5.8c0 .4-.3.7-.7.7zm-9.7-1.4h9V5.8h-9v4.4z"/></svg>
    </media-cinema-button>
    <media-fullscreen-button class="small-button">
      <svg slot="enter" viewBox="0 0 16 16"><path d="M2.9 6.6c-.4 0-.7-.3-.7-.7v-3c0-.4.3-.7.7-.7h3c.4 0 .7.3.7.7s-.2.7-.6.7H3.6V6c0 .3-.3.6-.7.6zM13.1 6.6c-.4 0-.7-.3-.7-.7V3.6H10c-.4 0-.7-.3-.7-.7s.3-.7.7-.7h3c.4 0 .7.3.7.7v3c.1.4-.2.7-.6.7zM6 13.8H3c-.4 0-.7-.3-.7-.7v-3c0-.4.3-.7.7-.7.4 0 .7.3.7.7v2.4H6c.4 0 .7.3.7.7-.1.3-.4.6-.7.6zM13.1 13.8h-3c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7h2.4V10c0-.4.3-.7.7-.7.4 0 .7.3.7.7v3c-.1.5-.4.8-.8.8z"/></svg>
      <svg slot="exit" viewBox="0 0 16 16"><path d="M2.9 6.6c-.4 0-.7-.3-.7-.7v-3c0-.4.3-.7.7-.7h3c.4 0 .7.3.7.7s-.2.7-.6.7H3.6V6c0 .3-.3.6-.7.6zM13.1 6.6c-.4 0-.7-.3-.7-.7V3.6H10c-.4 0-.7-.3-.7-.7s.3-.7.7-.7h3c.4 0 .7.3.7.7v3c.1.4-.2.7-.6.7zM6 13.8H3c-.4 0-.7-.3-.7-.7v-3c0-.4.3-.7.7-.7.4 0 .7.3.7.7v2.4H6c.4 0 .7.3.7.7-.1.3-.4.6-.7.6zM13.1 13.8h-3c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7h2.4V10c0-.4.3-.7.7-.7.4 0 .7.3.7.7v3c-.1.5-.4.8-.8.8z"/></svg>
    </media-fullscreen-button>
  </media-control-bar>
</media-controller>
`;

class MediaThemeDemuxed extends MediaThemeElement {
  static template = template;
  static get observedAttributes() {
    return ["stream-type"];
  }
  #breakpoints = { xs: 360, sm: 600, md: 760, lg: 960, xl: 1100 };

  #getBreakpoints(rect) {
    return Object.keys(this.#breakpoints).filter((key) => {
      return rect.width >= this.#breakpoints[key];
    });
  }

  connectedCallback() {
    this.render();
    
    const resizeObserver = new window.ResizeObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.className = this.#getBreakpoints(entry.contentRect).join(' ');
      });
    });

    resizeObserver.observe(this.shadowRoot.querySelector('media-controller'));
  }

  async attributeChangedCallback(name, _oldValue, newValue) {
    if(name === "stream-type" && newValue === "live") {
      /** @type {HTMLMediaElement} */
      const media = this.querySelector('[slot="media"]');
      media.muted = true;
      media.play();
    }
  }
}

if (!window.customElements.get('media-theme-demuxed-2022')) {
  window.customElements.define('media-theme-demuxed-2022', MediaThemeDemuxed);
}

export default MediaThemeDemuxed;
