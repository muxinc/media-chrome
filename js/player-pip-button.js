import PlayerChromeElement from "./player-chrome-element.js";

class PlayerPIPButton extends PlayerChromeElement {
  constructor() {
    super();

    this.addEventListener("click", e => {
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

window.customElements.define("player-pip-button", PlayerPIPButton);

export default PlayerPIPButton;
