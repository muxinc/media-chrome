import './polyfills/window';

import CustomVideoElement from "custom-video-element";
import mux, { Options } from "mux-embed";

import Hls from "hls.js";

type Metadata = Partial<Options["data"]>;

/** @TODO make the relationship between name+value smarter and more deriveable (CJP) */
type AttributeNames = {
  ENV_KEY: "env-key";
  DEBUG: "debug";
  PLAYBACK_ID: "playback-id";
  METADATA_URL: "metadata-url";
};

const Attributes: AttributeNames = {
  ENV_KEY: "env-key",
  DEBUG: "debug",
  PLAYBACK_ID: "playback-id",
  METADATA_URL: "metadata-url",
};

const AttributeNameValues = Object.values(Attributes);

const toMuxVideoURL = (playbackId: string | null) =>
  playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null;

type HTMLVideoElementWithMux = HTMLVideoElement & { mux: typeof mux };

class MuxVideoElement extends CustomVideoElement<HTMLVideoElementWithMux> {
  static get observedAttributes() {
    return [
      ...AttributeNameValues,
      ...(CustomVideoElement.observedAttributes ?? []),
    ];
  }

  protected __hls?: Hls;
  protected __muxPlayerInitTime: number;
  protected __metadata: Readonly<Metadata> = {};

  constructor() {
    super();
    this.__muxPlayerInitTime = Date.now();
  }

  get hls() {
    return this.__hls;
  }

  get mux(): Readonly<typeof mux> {
    return this.nativeEl.mux;
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

  /** @TODO write a generic module for well defined primitive types -> attribute getter/setters/removers (CJP) */
  get debug(): boolean {
    return this.getAttribute("debug") != null;
  }

  set debug(val: boolean) {
    // dont' cause an infinite loop
    if (val === this.debug) return;

    if (val) {
      this.setAttribute(Attributes.DEBUG, "");
    } else {
      this.removeAttribute(Attributes.DEBUG);
    }
  }

  get metadata() {
    return this.__metadata;
  }

  set metadata(val: Readonly<Metadata> | undefined) {
    this.__metadata = val ?? {};
    if (!!this.mux) {
      /** @TODO Link to docs for a more detailed discussion (CJP) */
      console.info(
        "Some metadata values may not be overridable at this time. Make sure you set all metadata to override before setting the src."
      );
      this.mux.emit("hb", this.__metadata);
    }
  }

  load() {
    /** @TODO Add custom errors + error codes */
    if (!this.src) {
      console.error("DONT DO THIS");
      return;
    }

    const env_key = this.getAttribute(Attributes.ENV_KEY);
    const debug = this.debug;

    if (Hls.isSupported()) {
      const hls = new Hls({
        // Kind of like preload metadata, but causes spinner.
        // autoStartLoad: false,
        debug,
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
          debug,
          hlsjs: hls,
          Hls: Hls,
          data: {
            env_key, // required
            // Metadata fields
            player_name: "mux-video", // any arbitrary string you want to use to identify this player
            // Should this be the initialization of *THIS* player (instance) or the page?
            player_init_time: this.__muxPlayerInitTime, // ex: 1451606400000,
            ...this.__metadata,
          },
        });
      }
    } else if (this.nativeEl.canPlayType("application/vnd.apple.mpegurl")) {
      this.nativeEl.src = this.src;
      if (env_key) {
        mux.monitor(this.nativeEl, {
          debug,
          data: {
            env_key, // required
            // Metadata fields
            player_name: "mux-video", // any arbitrary string you want to use to identify this player
            // Should this be the initialization of *THIS* player (instance) or the page?
            player_init_time: this.__muxPlayerInitTime, // ex: 1451606400000
            ...this.__metadata,
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

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    switch (attrName) {
      case "src":
        // Handle 3 cases:
        // 1. no src -> src
        // 2. src -> (different) src
        // 3. src -> no src
        break;
      case Attributes.PLAYBACK_ID:
        this.src = toMuxVideoURL(newValue);
        break;
      case Attributes.DEBUG:
        const debug = this.debug;
        if (!!this.mux) {
          /** @TODO Link to docs for a more detailed discussion (CJP) */
          console.info(
            "Cannot toggle debug mode of mux data after initialization. Make sure you set all metadata to override before setting the src."
          );
        }
        if (!!this.hls) {
          this.hls.config.debug = debug;
        }
        break;
      case Attributes.METADATA_URL:
        if (newValue) {
          fetch(newValue).then(resp => resp.json()).then(json => this.metadata = json);
        }
        break;
      default:
        break;
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

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
