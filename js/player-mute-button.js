import PlayerChromeButton from './player-chrome-button.js';

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

class PlayerMuteButton extends PlayerChromeButton {
  constructor() {
    super();
    this.icon = playIcon;
  }

  onClick(e) {
    const player = this.player;
    player.muted = !player.muted;
  }

  connectedCallback() {
    window.setTimeout(() => {
      const player = this.player;

      if (!player.muted) {
        this.icon = pauseIcon;
      }

      player.addEventListener('volumechange', () => {
        if (player.muted || player.volume === 0) {
          this.icon = playIcon;
        } else {
          this.icon = pauseIcon;
        }
      });
    }, 0);
  }
}

window.customElements.define('player-mute-button', PlayerMuteButton);

export default PlayerMuteButton;
