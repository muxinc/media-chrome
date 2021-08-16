import CustomVideoElement from "custom-video-element";
import mux from "mux-embed";

import Hls from "hls.js";

/** @TODO make the relationship between name+value smarter and more deriveable (CJP) */
type AttributeNames = {
  ENV_KEY: "env-key";
  DEBUG: "debug";
};

const Attributes: AttributeNames = {
  ENV_KEY: "env-key",
  DEBUG: "debug",
};

class MuxVideoElement extends CustomVideoElement {
  static get observedAttributes() {
    return [
      Attributes.ENV_KEY,
      Attributes.DEBUG,
      ...(CustomVideoElement.observedAttributes ?? []),
    ];
  }

  protected __hls?: Hls;
  protected __muxPlayerInitTime: number;
  // protected __metadata:

  constructor() {
    super();
    this.__muxPlayerInitTime = Date.now();
  }

  get hls() {
    return this.__hls;
  }

  get src() {
    // Use the attribute value as the source of truth.
    // No need to store it in two places.
    // This avoids needing a to read the attribute initially and update the src.
    return this.getAttribute("src");
  }

  set src(val) {
    // If being set by attributeChangedCallback,
    // dont' cause an infinite loop
    if (val === this.src) return;

    if (val == null) {
      this.removeAttribute("src");
    } else {
      this.setAttribute("src", val);
    }
  }

  load() {
    /** @TODO Add custom errors + error codes */
    if (!this.src) {
      console.error("DONT DO THIS");
      return;
    }

    const env_key = this.getAttribute(Attributes.ENV_KEY);

    if (Hls.isSupported()) {
      const hls = new Hls({
        // Kind of like preload metadata, but causes spinner.
        // autoStartLoad: false,
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.error("fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            default:
              // cannot recover
              console.error(
                "unrecoverable fatal error encountered, cannot recover (check logs for more info)"
              );
              hls.destroy();
              break;
          }
        }
      });

      hls.loadSource(this.src);
      hls.attachMedia(this.nativeEl);

      this.__hls = hls;

      if (env_key) {
        mux.monitor(this.nativeEl, {
          debug: true,
          hlsjs: hls,
          Hls: Hls,
          data: {
            env_key, // required
            // Metadata fields
            player_name: "mux-video", // any arbitrary string you want to use to identify this player
            // Should this be the initialization of *THIS* player (instance) or the page?
            player_init_time: this.__muxPlayerInitTime, // ex: 1451606400000
            // ...
          },
        });
      }
    } else if (this.nativeEl.canPlayType("application/vnd.apple.mpegurl")) {
      this.nativeEl.src = this.src;
      if (env_key) {
        mux.monitor(this.nativeEl, {
          debug: true,
          data: {
            env_key, // required
            // Metadata fields
            player_name: "mux-video", // any arbitrary string you want to use to identify this player
            // Should this be the initialization of *THIS* player (instance) or the page?
            player_init_time: this.__muxPlayerInitTime, // ex: 1451606400000
            // ...
          },
        });
      }
    }
  }

  // play() {
  //   if (this.readyState === 0 && this.networkState < 2) {
  //     this.load();
  //     this.hls.on(Hls.Events.MANIFEST_PARSED,function() {
  //     video.play();
  //
  //     return this.nativeEl.play();
  //   }
  // }

  connectedCallback() {
    // Only auto-load if we have a src
    if (this.src) {
      this.load();
    }

    // Not preloading might require faking the play() promise
    // so that you can call play(), call load() within that
    // But wait until MANIFEST_PARSED to actually call play()
    // on the nativeEl.
    // if (this.preload === 'auto') {
    //   this.load();
    // }
  }
}

declare global {
  interface Window {
    MuxVideoElement: typeof MuxVideoElement;
  }
}

/** @TODO Refactor once using `globalThis` polyfills */
if (!window.customElements.get("mux-video")) {
  window.customElements.define("mux-video", MuxVideoElement);
  /** @TODO consider externalizing this (breaks standard modularity) */
  window.MuxVideoElement = MuxVideoElement;
}

export { Hls };

export default MuxVideoElement;
