class PlayerChromeElement extends HTMLElement {
  constructor() {
    super();
  }

  #player = null;

  connectedCallback() {
    // Check for a player supplied by attr
    if (this.attributes.player) {
      let player = document.getElementById(this.attributes.player.nodeValue);

      if (!player || player.play) {
        throw new Error('Supplied player does not appear to be a player.');
      }

      this.#player = player;
    }
  }

  get player() {
    if (this.#player) return this.#player;

    for (
      let parent = this.parentNode;
      parent && parent !== document;
      parent = parent.parentNode || parent.host
    ) {
      let player = parent.player;

      if (player && player.play) {
        return player;
      }
    }

    throw new Error('No player found');
  }

  get playerChrome() {
    const player = this.player;

    for (
      let parent = player.parentNode;
      parent && parent !== document;
      parent = parent.parentNode || parent.host
    ) {
      if (parent.nodeName === 'PLAYER-CHROME') {
        return parent;
      }
    }

    return null;
  }
}

window.customElements.define('player-chrome-element', PlayerChromeElement);

export default PlayerChromeElement;
