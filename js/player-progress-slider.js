import PlayerChromeSlider from './player-chrome-slider.js';

class PlayerProgressSlider extends PlayerChromeSlider {
  constructor() {
    super();

    this.setPlayerTimeWithRange = () => {
      const player = this.player;
      const range = this.range;

      // Can't set the time before the player is ready
      // Ignore if readyState isn't supported
      if (player.readyState > 0 || player.readyState === undefined) {
        player.currentTime = Math.round((range.value / 1000) * player.duration);
      }
    };
    this.range.addEventListener('input', this.setPlayerTimeWithRange);

    // The following listeners need to be removeable
    this.updateRangeWithPlayerTime = () => {
      const player = this.player;
      this.range.value = Math.round(
        (player.currentTime / player.duration) * 1000
      );
    };

    this.playIfNotReady = e => {
      this.range.removeEventListener('change', this.playIfNotReady);
      const player = this.player;
      player.play().then(this.setPlayerTimeWithRange);
    };
  }

  playerSetCallback() {
    const player = this.player;
    const range = this.range;

    player.addEventListener('timeupdate', this.updateRangeWithPlayerTime);

    // If readyState is supported, and the slider is used before
    // the player is ready, use the play promise to set the time.
    if (player.readyState !== undefined && player.readyState == 0) {
      // range.addEventListener('change', this.playIfNotReady);
    }
  }

  playerUnsetCallback() {
    const player = this.player;
    const range = this.range;

    player.removeEventListener('timeupdate', this.updateRangeWithPlayerTime);
    range.removeEventListener('change', this.playIfNotReady);
  }
}

window.customElements.define('player-progress-slider', PlayerProgressSlider);

export default PlayerProgressSlider;
