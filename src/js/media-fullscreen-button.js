import MediaChromeButton from "./media-chrome-button.js";

const enterFullscreenIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
</svg>
`;

const exitFullscreenIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
</svg>
`;

class MediaFullscreenButton extends MediaChromeButton {
  constructor() {
    super();

    this.icon = enterFullscreenIcon;

    this.addEventListener("click", e => {
      const media = this.media;

      if (this.mediaChrome == document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        if (document.pictureInPictureElement) {
          // Should be async
          document.exitPictureInPicture();
        }

        this.mediaChrome.requestFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (this.mediaChrome == document.fullscreenElement) {
        this.icon = exitFullscreenIcon;
      } else {
        this.icon = enterFullscreenIcon;
      }
    });
  }
}

if (!window.customElements.get('media-fullscreen-button')) {
  window.customElements.define('media-fullscreen-button', MediaFullscreenButton);
  window.MediaChrome = MediaFullscreenButton;
}

export default MediaFullscreenButton;
