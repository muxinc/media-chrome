import PlayerChromeRange from './player-chrome-range.js';

class PlayerProgressRange extends PlayerChromeRange {
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

      this.updateBar();
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

    // If readyState is supported, and the range is used before
    // the player is ready, use the play promise to set the time.
    if (player.readyState !== undefined && player.readyState == 0) {
      // range.addEventListener('change', this.playIfNotReady);
    }

    player.addEventListener('progress', this.updateBar.bind(this));
  }

  playerUnsetCallback() {
    const player = this.player;
    const range = this.range;

    player.removeEventListener('timeupdate', this.updateRangeWithPlayerTime);
    range.removeEventListener('change', this.playIfNotReady);
  }

  /* Add a buffered progress bar */
  getBarColors() {
    const player = this.player;
    let colorsArray = super.getBarColors();

    if (!player || !player.buffered || !player.buffered.length || player.duration <= 0) {
      return colorsArray;
    }

    const buffered = player.buffered;
    const buffPercent = (buffered.end(buffered.length-1) / player.duration) * 100;
    colorsArray.splice(1, 0, ['var(--player-progress-buffered-color, #777)', buffPercent]);
    return colorsArray;
  }
}

if (!window.customElements.get('player-progress-range')) {
  window.customElements.define('player-progress-range', PlayerProgressRange);
  window.PlayerChrome = PlayerProgressRange;
}

export default PlayerProgressRange;
