import PlayerChromeElement from "./player-chrome-element.js";

const template = document.createElement("template");

template.innerHTML = `
<style>
input {
  width: 100%;
}
</style>
<input id="range" type="range" min="0" max="1000" step="1" value="0">
`;

class PlayerProgressSlider extends PlayerChromeElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.range = this.shadowRoot.querySelector("#range");
  }

  connectedCallback() {
    // Parent element player properties are undefined when
    // connectedCallback is first called. Not exactly sure why.
    // Muation observer might be a cleaner approach.
    window.setTimeout(() => {
      const player = this.player;

      this.range.addEventListener("input", () => {
        const time = (this.range.value / 1000) * this.player.duration;
        this.player.currentTime = time;
      });

      player.addEventListener("timeupdate", () => {
        this.range.value = Math.round(
          (player.currentTime / player.duration) * 1000
        );
      });
    }, 0);
  }
}

window.customElements.define("player-progress-slider", PlayerProgressSlider);

export default PlayerProgressSlider;
