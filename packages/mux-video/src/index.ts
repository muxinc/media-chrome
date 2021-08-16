// Web Components: Extending Native Elements, A working example

import CustomVideoElement from "custom-video-element";
import mux from "mux-embed";

import Hls from "hls.js";

type Attributes = {
  ENV_KEY: "env-key";
};

const Attributes: Attributes = {
  ENV_KEY: "env-key",
};

class MuxVideoElement extends CustomVideoElement {
  static get observedAttributes() {
    return [
      Attributes.ENV_KEY,
      ...(CustomVideoElement.observedAttributes ?? []),
    ];
  }

  protected __hls?: Hls;
  protected __muxPlayerInitTime: number;

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

      hls.loadSource(this.src);
      hls.attachMedia(this.nativeEl);

      this.__hls = hls;

      if (env_key) {
        mux.monitor(this.nativeEl, {
          debug: false,
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
          debug: false,
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
    this.load();

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

export default MuxVideoElement;
