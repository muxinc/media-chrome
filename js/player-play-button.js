import PlayerChromeButton from './player-chrome-button.js';

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

class PlayerPlayButton extends PlayerChromeButton {
  constructor() {
    super();
    this.icon = playIcon;
    this._playing = false;
  }

  static get observedAttributes() {
    return ['playing'].concat(super.observedAttributes || []);
  }

  get playing() {
    return this._playing;
  }

  set playing(val) {
    this._playing = !!val;

    if (val) {
      this.icon = pauseIcon;
    } else {
      this.icon = playIcon;
    }
  }

  onClick(e) {
    const player = this.player;

    // If not using player detection, onClick should be overridden
    if (!player) {
      throw new Error(
        'No player was found and an alternative onClick handler was not set.'
      );
    }

    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }

  playerSetCallback() {
    const player = this.player;

    if (!player) return;

    this.player.addEventListener('play', () => {
      this.playing = true;
    });

    this.player.addEventListener('pause', () => {
      this.playing = false;
    });
  }
}

window.customElements.define('player-play-button', PlayerPlayButton);

export default PlayerPlayButton;
