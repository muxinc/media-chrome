import PlayerChromeSlider from './player-chrome-slider.js';

class PlayerVolumeSlider extends PlayerChromeSlider {
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
        const volume = this.range.value / 1000;
        this.player.volume = volume;
      });

      player.addEventListener('volumechange', this.updated.bind(this));
      this.updated();
    }, 0);
  }

  updated() {
    const player = this.player;
    this.range.value = Math.round(player.volume * 1000);
  }
}

window.customElements.define('player-volume-slider', PlayerVolumeSlider);

export default PlayerVolumeSlider;
