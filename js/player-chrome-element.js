class PlayerChromeElement extends HTMLElement {
  constructor() {
    super();
    this._player = null;
  }

  static get observedAttributes() {
    return ['player'].concat(super.observedAttributes || []);
  }

  // Model the basic HTML attribute functionality of matching props
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName == 'player') {
      if (newValue === null) {
        this.player = null;
        return;
      }

      let player = document.querySelector(newValue);

      if (!player || !player.play) {
        throw new Error(
          'Supplied player attribute does not appear to match a player.'
        );
      }

      this.player = player;
      return;
    }

    // Boolean props should never start as null
    if (typeof this[attrName] == 'boolean') {
      // null is returned when attributes are removed i.e. boolean attrs
      if (newValue === null) {
        this[attrName] = false;
      } else {
        // The new value might be an empty string, which is still true
        // for boolean attributes
        this[attrName] = true;
      }
    } else {
      this[attrName] = newValue;
    }
  }

  set player(player) {
    if (player !== this._player) {
      if (this._player) {
        this.playerUnsetCallback(this._player);
      }

      this._player = player;
      this.playerSetCallback(this._player);

      /* Might need to instead have playerChrome fire a playerconnected event
         so child elements that don't have a player set can listen for that change
         rather than find the player each time. Then it can fire that event
         whenever the player needs to be updated. Just need to figure out a clean
         way to handle the no player case. Maybe if you're not in PlayerChrome
         and no player has been set. */
    }
  }

  get player() {
    return this._player;

    // if (this._player) return this._player;

    // const parentNode = this.parentNode;
    //
    // const playerChrome = this.closest('player-chrome');
    //
    // // Can't rely on any custom properties/functions of Player-Chrome
    // // because the custom element might not have been defined yet
    // // due to source loading order
    // const chromeChilds = playerChrome.children;
    // let mediaEl;
    //
    // // Find the first media element inside player-chrome and use as player
    // for (let i = 0; i < chromeChilds.length; i++) {
    //   const child = chromeChilds[i];
    //
    //   if (
    //     child instanceof HTMLMediaElement ||
    //     child instanceof CustomVideoElement ||
    //     child instanceof CustomAudioElement ||
    //     child.className.indexOf('custom-media-element') !== -1
    //   ) {
    //     mediaEl = child;
    //     break;
    //   }
    // }
    //
    // if (!mediaEl) {
    //   throw new Error('No media element found in player-chrome');
    // }
    //
    // return mediaEl;
  }

  connectedCallback() {}
  playerSetCallback() {}
  playerUnsetCallback() {}

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
