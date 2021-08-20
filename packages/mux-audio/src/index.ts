import "./polyfills/window";
import CustomAudioElement from "./CustomAudioElement";
import mux, { Options, HighPriorityMetadata } from "mux-embed";

type Metadata = Partial<Options["data"]>;

/** @TODO make the relationship between name+value smarter and more deriveable (CJP) */
type AttributeNames = {
  ENV_KEY: "env-key";
  DEBUG: "debug";
  METADATA_URL: "metadata-url";
  PREFER_NATIVE: "prefer-native";
  METADATA_VIDEO_ID: "metadata-video-id";
  METADATA_VIDEO_TITLE: "metadata-video-title";
  METADATA_VIEWER_USER_ID: "metadata-viewer-user-id";
};

const Attributes: AttributeNames = {
  ENV_KEY: "env-key",
  DEBUG: "debug",
  METADATA_URL: "metadata-url",
  PREFER_NATIVE: "prefer-native",
  METADATA_VIDEO_ID: "metadata-video-id",
  METADATA_VIDEO_TITLE: "metadata-video-title",
  METADATA_VIEWER_USER_ID: "metadata-viewer-user-id",
};

const AttributeNameValues = Object.values(Attributes);

type HTMLAudioElementWithMux = HTMLAudioElement & { mux?: typeof mux };

const getHighPriorityMetadata = (
  mediaEl: MuxAudioElement
): Partial<HighPriorityMetadata> => {
  const video_title = mediaEl.getAttribute(Attributes.METADATA_VIDEO_TITLE);
  const viewer_id = mediaEl.getAttribute(Attributes.METADATA_VIEWER_USER_ID);
  const video_id = mediaEl.getAttribute(Attributes.METADATA_VIDEO_ID);
  const videoTitleObj = video_title ? { video_title } : {};
  const viewerIdObj = viewer_id ? { viewer_id } : {};
  const videoIdObj = video_id ? { video_id } : {};
  return {
    ...videoTitleObj,
    ...viewerIdObj,
    ...videoIdObj,
  };
};

class MuxAudioElement extends CustomAudioElement<HTMLAudioElementWithMux> {
  static get observedAttributes() {
    return [
      ...AttributeNameValues,
      ...(CustomAudioElement.observedAttributes ?? []),
    ];
  }

  protected __muxPlayerInitTime: number;
  protected __metadata: Readonly<Metadata> = {};

  constructor() {
    super();
    this.__muxPlayerInitTime = Date.now();
  }

  get mux(): Readonly<typeof mux> | undefined {
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
    return this.getAttribute(Attributes.DEBUG) != null;
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

  /** @TODO Followup: naming convention: all lower (common per HTMLElement props) vs. camel (common per JS convention) (CJP) */
  get preferNative(): boolean {
    return this.getAttribute(Attributes.PREFER_NATIVE) != null;
  }

  set preferNative(val: boolean) {
    // dont' cause an infinite loop
    if (val === this.debug) return;

    if (val) {
      this.setAttribute(Attributes.PREFER_NATIVE, "");
    } else {
      this.removeAttribute(Attributes.PREFER_NATIVE);
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

  /** @TODO Refactor as an independent function (CJP) */
  load() {
    /** @TODO Add custom errors + error codes */
    if (!this.src) {
      console.error("DONT DO THIS");
      return;
    }

    const env_key = this.getAttribute(Attributes.ENV_KEY);
    const debug = this.debug;

    // 2. Start monitoring for mux data before we do anything else
    if (env_key) {
      const player_init_time = this.__muxPlayerInitTime;
      const metadataObj = this.__metadata;
      const highPriorityMetadata = getHighPriorityMetadata(this);
      /**
       * @TODO Use documented version if/when resolved (commented out below) (CJP)
       * @see https://github.com/snowpackjs/snowpack/issues/3621
       * @see https://www.snowpack.dev/reference/environment-variables#option-2-config-file
       */
      // @ts-ignore
      const player_version = import.meta.env
        .SNOWPACK_PUBLIC_PLAYER_VERSION as string;
      // const player_version = __SNOWPACK_ENV__.PLAYER_VERSION;

      mux.monitor(this.nativeEl, {
        debug,
        data: {
          env_key, // required
          // Metadata fields
          player_name: "mux-audio", // default player name for "mux-audio"
          player_version,
          player_init_time,
          // Use any metadata passed in programmatically (which may override the defaults above)
          ...metadataObj,
          // Use any high priority metadata passed in via attributes (which may override any of the above)
          ...highPriorityMetadata,
        },
      });
    }

    /** @TODO Make this a little beefier for formats that aren't supported (CJP) */
    this.nativeEl.src = this.src;
  }

  unload() {
    if (this.nativeEl.mux) {
      this.nativeEl.mux.destroy();
      delete this.nativeEl.mux;
    }
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    switch (attrName) {
      case "src":
        const hadSrc = !!oldValue;
        const hasSrc = !!newValue;
        if (!hadSrc && hasSrc) {
          this.load();
        } else if (hadSrc && !hasSrc) {
          this.unload();
          /** @TODO Test this thoroughly (async?) and confirm unload() necessary (CJP) */
        } else if (hadSrc && hasSrc) {
          this.unload();
          this.load();
        }
        break;
      case Attributes.DEBUG:
        const debug = this.debug;
        if (!!this.mux) {
          /** @TODO Link to docs for a more detailed discussion (CJP) */
          console.info(
            "Cannot toggle debug mode of mux data after initialization. Make sure you set all metadata to override before setting the src."
          );
        }
        break;
      case Attributes.METADATA_URL:
        if (newValue) {
          fetch(newValue)
            .then((resp) => resp.json())
            .then((json) => (this.metadata = json));
        }
        break;
      default:
        break;
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  disconnectedCallback() {
    this.unload();
  }

  /** @TODO Followup - investigate why this is necessary (attributeChanged not invoked on initial load when setting playback-id) (CJP) */
  connectedCallback() {
    // Only auto-load if we have a src
    if (this.src) {
      this.load();
    }
  }
}

declare global {
  interface Window {
    MuxAudioElement: typeof MuxAudioElement;
  }
}

/** @TODO Refactor once using `globalThis` polyfills */
if (!window.customElements.get("mux-audio")) {
  window.customElements.define("mux-audio", MuxAudioElement);
  /** @TODO consider externalizing this (breaks standard modularity) */
  window.MuxAudioElement = MuxAudioElement;
}

export default MuxAudioElement;
