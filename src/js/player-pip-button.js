import PlayerChromeButton from './player-chrome-button.js';

const pipIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

class PlayerPIPButton extends PlayerChromeButton {
  constructor() {
    super();

    this.icon = pipIcon;

    this.addEventListener('click', e => {
      const player = this.player;

      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        if (this.playerChrome == document.fullscreenElement) {
          document.exitFullscreen();
        }

        player.requestPictureInPicture();
      }
    });
  }
}

if (!window.customElements.get('player-pip-button')) {
  window.customElements.define('player-pip-button', PlayerPIPButton);
  window.PlayerChrome = PlayerPIPButton;
}

export default PlayerPIPButton;
