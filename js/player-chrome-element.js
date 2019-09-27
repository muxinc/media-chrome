class PlayerChromeElement extends HTMLElement {
  constructor() {
    super();
    this._player = null;
  }

  static get observedAttributes() {
    return ['player'];
  }

  // Model the basic HTML attribute functionality of matching props
  attributeChangedCallback(attrName, oldValue, newValue) {
    // Boolean props should never start as null
    if (typeof this[attrName] == 'boolean') {
      // null is returned when attributes are removed i.e. boolean attrs
      if (newValue === null) {
        this[propName] = false;
      } else {
        // The new value might be an empty string, which is still true
        // for boolean attributes
        this[propName] = true;
      }
    } else {
      this[propName] = newValue;
    }
  }

  connectedCallback() {
    // Check for a player supplied by attr
    if (this.attributes.player) {
      let player = document.querySelector(this.attributes.player.nodeValue);

      if (!player || !player.play) {
        throw new Error('Supplied player does not appear to be a player.');
      }

      this._player = player;
    }
  }

  set player(player) {
    this._player = player;
  }

  get player() {
    if (this._player) return this._player;

    const playerChrome = this.closest('player-chrome');

    if (!playerChrome) {
      throw new Error('No player or player-chrome provided');
    }

    // Can't rely on any custom properties/functions of Player-Chrome
    // because the custom element might not have been defined yet
    // due to source loading order
    const chromeChilds = playerChrome.children;
    let mediaEl;

    // Find the first media element inside player-chrome and use as player
    for (let i = 0; i < chromeChilds.length; i++) {
      const child = chromeChilds[i];

      if (
        child instanceof HTMLMediaElement ||
        child instanceof CustomVideoElement ||
        child instanceof CustomAudioElement ||
        child.className.indexOf('custom-media-element') !== -1
      ) {
        mediaEl = child;
        break;
      }
    }

    if (!mediaEl) {
      throw new Error('No media element found in player-chrome');
    }

    return mediaEl;
  }

  get playerChrome() {
    const player = this.player;
    return player.closest('player-chrome');
  }
}

if (!window.customElements.get('player-chrome-element')) {
  window.customElements.define('player-chrome-element', PlayerChromeElement);
  window.PlayerChromeElement = PlayerChromeElement;
}

export default PlayerChromeElement;
