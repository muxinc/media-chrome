/**
 * This is not meant to be included in Media Chrome! WIP
 * It should be able to work on its own.
 *
 * Mutate document or using CastableVideo globally?
 * document.castElement vs CastableVideo.castElement
 * document.castEnabled vs CastableVideo.castEnabled
 * document.exitCast() vs CastableVideo.exitCast()
 */
class CastableVideo extends HTMLVideoElement {
  static observedAttributes = ['cast-src'];
  static instances = new Set();

  static #castElement;
  static get castElement() {
    return this.#castElement;
  }

  static #castEnabled = false;
  static get castEnabled() {
    return this.#castEnabled;
  }

  static initCast = () => {
    if (!this.#isChromeCastAvailable) {
      window.__onGCastApiAvailable = () => {
        // The window.__onGCastApiAvailable callback alone is not reliable for
        // the added cast.framework. It's loaded in a separate JS file.
        // http://www.gstatic.com/eureka/clank/101/cast_sender.js
        // http://www.gstatic.com/cast/sdk/libs/sender/1.0/cast_framework.js
        customElements
          .whenDefined('google-cast-button')
          .then(() => this.#onSdkLoaded(chrome.cast.isAvailable));
      };
    } else if (!this.#isCastFrameworkAvailable) {
      customElements
        .whenDefined('google-cast-button')
        .then(() => this.#onSdkLoaded(chrome.cast.isAvailable));
    } else {
      this.#onSdkLoaded(chrome.cast.isAvailable);
    }
  };

  static async exitCast() {
    // Should the receiver application be stopped or just disconnected.
    const stopCasting = true;
    try {
      await CastableVideo.#castContext.endCurrentSession(stopCasting);
    } catch (err) {
      console.error(error);
      return;
    }
  }

  static #onSdkLoaded = (isAvailable) => {
    if (isAvailable) {
      this.#castEnabled = true;

      for (const video of this.instances) {
        video.#init();
      }
    }
  };

  static get #isChromeCastAvailable() {
    return (
      typeof chrome !== 'undefined' && chrome.cast && chrome.cast.isAvailable
    );
  }

  static get #isCastFrameworkAvailable() {
    return typeof cast !== 'undefined' && cast.framework;
  }

  static get #castContext() {
    if (this.#isCastFrameworkAvailable)
      return cast.framework.CastContext.getInstance();
  }

  #castAvailable = false;
  #localState = { paused: false };
  #remoteState = { paused: false, currentTime: 0, muted: false };
  #remotePlayer;
  #remoteListeners = [];

  constructor() {
    super();
    this.castEnabled = false;

    CastableVideo.instances.add(this);
    this.#init();
  }

  get castPlayer() {
    if (CastableVideo.castElement === this) return this.#remotePlayer;
  }

  get #isMediaLoaded() {
    return this.#remotePlayer?.isMediaLoaded;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!this.castPlayer) return;

    switch (attrName) {
      case 'cast-src':
        this.load();
        break;
    }
  }

  #disconnect() {
    if (CastableVideo.#castElement !== this) return;

    this.#remoteListeners.forEach(([event, listener]) => {
      this.#remotePlayer.controller.removeEventListener(event, listener);
    });

    CastableVideo.#castElement = undefined;

    this.muted = this.#remoteState.muted;
    this.currentTime = this.#remoteState.currentTime;
    if (this.#remoteState.paused === false) {
      this.play();
    }
  }

  #init() {
    if (!CastableVideo.#isCastFrameworkAvailable || this.#castAvailable) return;
    this.#castAvailable = true;
    this.#setOptions();

    const { CAST_STATE_CHANGED } = cast.framework.CastContextEventType;
    CastableVideo.#castContext.addEventListener(CAST_STATE_CHANGED, () => {
      this.dispatchEvent(
        new CustomEvent('caststatechanged', {
          detail: CastableVideo.#castContext.getCastState(),
        })
      );
    });

    this.dispatchEvent(
      new CustomEvent('caststatechanged', {
        detail: CastableVideo.#castContext.getCastState(),
      })
    );

    this.#remotePlayer = new cast.framework.RemotePlayer();
    new cast.framework.RemotePlayerController(this.#remotePlayer);

    this.#remoteListeners = [
      [
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        ({ value }) => {
          if (value === false) {
            this.#disconnect();
          }
          this.dispatchEvent(new Event(value ? 'entercast' : 'leavecast'));
        },
      ],
      [
        cast.framework.RemotePlayerEventType.DURATION_CHANGED,
        () => this.dispatchEvent(new Event('durationchange')),
      ],
      [
        cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
        () => this.dispatchEvent(new Event('volumechange')),
      ],
      [
        cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
        () => {
          this.#remoteState.muted = this.muted;
          this.dispatchEvent(new Event('volumechange'));
        },
      ],
      [
        cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
        () => {
          if (this.#isMediaLoaded) {
            this.#remoteState.currentTime = this.currentTime;
            this.dispatchEvent(new Event('timeupdate'));
          }
        },
      ],
      [
        cast.framework.RemotePlayerEventType.VIDEO_INFO_CHANGED,
        () => this.dispatchEvent(new Event('resize')),
      ],
      [
        cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
        () => {
          this.#remoteState.paused = this.paused;
          this.dispatchEvent(new Event(this.paused ? 'pause' : 'play'));
        },
      ],
      [
        cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        () => {
          // pause event is handled above.
          if (
            this.castPlayer?.playerState ===
            chrome.cast.media.PlayerState.PAUSED
          ) {
            return;
          }
          this.dispatchEvent(
            new Event(
              {
                [chrome.cast.media.PlayerState.PLAYING]: 'playing',
                [chrome.cast.media.PlayerState.BUFFERING]: 'waiting',
                [chrome.cast.media.PlayerState.IDLE]: 'emptied',
              }[this.castPlayer?.playerState]
            )
          );
        },
      ],
    ];
  }

  #setOptions(options) {
    return CastableVideo.#castContext.setOptions({
      // Set the receiver application ID to your own (created in the
      // Google Cast Developer Console), or optionally
      // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,

      // Auto join policy can be one of the following three:
      // ORIGIN_SCOPED - Auto connect from same appId and page origin
      // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
      // PAGE_SCOPED - No auto connect
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,

      // The following flag enables Cast Connect(requires Chrome 87 or higher)
      // https://developers.googleblog.com/2020/08/introducing-cast-connect-android-tv.html
      androidReceiverCompatible: false,

      language: 'en-US',
      resumeSavedSession: false,

      ...options,
    });
  }

  async requestCast(options = {}) {
    this.#setOptions(options);
    CastableVideo.#castElement = this;

    this.#remoteListeners.forEach(([event, listener]) => {
      this.#remotePlayer.controller.addEventListener(event, listener);
    });

    try {
      // Open browser cast menu.
      await CastableVideo.#castContext.requestSession();
    } catch (err) {
      CastableVideo.#castElement = undefined;
      // console.error(err); // Don't show an error if dismissing the menu.
      return;
    }

    // Pause locally when the session is created.
    this.#localState.paused = super.paused;
    super.pause();

    // Sync over the muted state but not volume, 100% is different on TV's :P
    this.muted = super.muted;

    try {
      await this.load();
    } catch (err) {
      console.error(err);
    }
  }

  async load() {
    if (!this.castPlayer) return super.load();

    const mediaInfo = new chrome.cast.media.MediaInfo(
      this.castSrc,
      this.contentType
    );

    if (this.streamType?.includes('live')) {
      mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
    } else {
      mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    }

    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.title = this.title;
    mediaInfo.metadata.images = [
      {
        url: this.poster,
      },
    ];

    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.currentTime = super.currentTime ?? 0;
    request.autoplay = !this.#localState.paused;

    await CastableVideo.#castContext?.getCurrentSession().loadMedia(request);

    this.dispatchEvent(new Event('volumechange'));
  }

  play() {
    if (this.castPlayer) {
      if (this.castPlayer.isPaused) {
        this.castPlayer.controller?.playOrPause();
      }
      return;
    }
    super.play();
  }

  pause() {
    if (this.castPlayer) {
      if (!this.castPlayer.isPaused) {
        this.castPlayer.controller?.playOrPause();
      }
      return;
    }
    super.pause();
  }

  // Allow the cast source url to be different than <video src>, could be a blob.
  get castSrc() {
    // Try the first <source src> for usage with even more native markup.
    return (
      this.getAttribute('cast-src') ??
      this.querySelector('source')?.src ??
      this.currentSrc
    );
  }

  set castSrc(val) {
    if (this.castSrc == val) return;
    this.setAttribute('cast-src', `${val}`);
  }

  get contentType() {
    return this.getAttribute('content-type') ?? undefined;
  }

  set contentType(val) {
    this.setAttribute('content-type', `${val}`);
  }

  get streamType() {
    return this.getAttribute('stream-type') ?? undefined;
  }

  set streamType(val) {
    this.setAttribute('stream-type', `${val}`);
  }

  get readyState() {
    if (this.castPlayer) {
      switch (this.castPlayer.playerState) {
        case chrome.cast.media.PlayerState.IDLE:
          return 0;
        case chrome.cast.media.PlayerState.BUFFERING:
          return 2;
        default:
          return 3;
      }
    }
    return super.readyState;
  }

  get paused() {
    if (this.castPlayer) return this.castPlayer.isPaused;
    return super.paused;
  }

  get muted() {
    if (this.castPlayer) return this.castPlayer?.isMuted;
    return super.muted;
  }

  set muted(val) {
    if (this.castPlayer) {
      if (
        (val && !this.castPlayer.isMuted) ||
        (!val && this.castPlayer.isMuted)
      ) {
        this.castPlayer.controller?.muteOrUnmute();
      }
      return;
    }
    super.muted = val;
  }

  get volume() {
    if (this.castPlayer) return this.castPlayer?.volumeLevel ?? 1;
    return super.volume;
  }

  set volume(val) {
    if (this.castPlayer) {
      this.castPlayer.volumeLevel = val;
      this.castPlayer.controller?.setVolumeLevel();
      return;
    }
    super.volume = val;
  }

  get duration() {
    // castPlayer duration returns `0` when no media is loaded.
    if (this.castPlayer && this.#isMediaLoaded) {
      return this.castPlayer?.duration ?? NaN;
    }
    return super.duration;
  }

  get currentTime() {
    if (this.castPlayer && this.#isMediaLoaded) {
      return this.castPlayer?.currentTime ?? 0;
    }
    return super.currentTime;
  }

  set currentTime(val) {
    if (this.castPlayer) {
      this.castPlayer.currentTime = val;
      this.castPlayer.controller?.seek();
      return;
    }
    super.currentTime = val;
  }
}

if (!customElements.get('castable-video')) {
  customElements.define('castable-video', CastableVideo, { extends: 'video' });
  globalThis.CastableVideo = CastableVideo;
}

CastableVideo.initCast();

export default CastableVideo;
