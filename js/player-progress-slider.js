import PlayerChromeSlider from './player-chrome-slider.js';

class PlayerProgressSlider extends PlayerChromeSlider {
  constructor() {
    super();
  }

  connectedCallback() {
    // Parent element player properties are undefined when
    // connectedCallback is first called. Not exactly sure why.
    // Muation observer might be a cleaner approach.
    window.setTimeout(() => {
      const player = this.player;

      this.range.addEventListener('input', () => {
        const time = (this.range.value / 1000) * this.player.duration;
        this.player.currentTime = time;
      });

      player.addEventListener('timeupdate', () => {
        this.range.value = Math.round(
          (player.currentTime / player.duration) * 1000
        );
      });
    }, 0);
  }
}

window.customElements.define('player-progress-slider', PlayerProgressSlider);

export default PlayerProgressSlider;
