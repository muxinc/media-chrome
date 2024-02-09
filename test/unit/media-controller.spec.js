import { fixture, assert, aTimeout, waitUntil } from '@open-wc/testing';
import { constants } from '../../src/js/index.js';
import { nextFrame } from '@open-wc/testing';
import { MediaStateReceiverAttributes } from '../../src/js/constants.js';

const {
  MediaUIEvents,
  MediaUIAttributes,
  MediaStateChangeEvents,
  MediaUIProps,
} = constants;
const isSafari = /.*Version\/.*Safari\/.*/.test(navigator.userAgent);

describe('<media-controller>', () => {
  it('associates itself to observe for state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller></media-controller>
    `);
    assert.equal(mediaController.associatedElementSubscriptions.size, 1);
    assert(mediaController.associatedElementSubscriptions.has(mediaController));
  });

  it('associates non-child elements to observe for state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const playButton = await fixture(`
      <media-play-button mediacontroller="ctrl"></media-play-button>
    `);
    assert.equal(mediaController.associatedElementSubscriptions.size, 2);
    assert(mediaController.associatedElementSubscriptions.has(playButton));
  });

  it('registers itself and child controls state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller>
        <media-play-button></media-play-button>
      </media-controller>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    const playButton = mediaController.querySelector('media-play-button');
    assert(
      mediaController.mediaStateReceivers.indexOf(playButton) >= 0,
      'registers play button'
    );
  });

  it('registers itself and non-child button state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture(`
      <media-play-button mediacontroller="ctrl"></media-play-button>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    assert(
      mediaController.mediaStateReceivers.indexOf(ui) >= 0,
      'registers button'
    );

    ui.remove();

    assert.equal(mediaController.mediaStateReceivers.length, 2);
    assert(
      !mediaController.mediaStateReceivers.includes(ui),
      'unregisters control'
    );
  });

  it('registers itself and non-child range state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture(`
      <media-time-range mediacontroller="ctrl"></media-time-range>
    `);

    // Also includes media-gesture-receiver, media-preview-thumbnail, media-preview-chapter-display, media-preview-time-display
    assert.equal(mediaController.mediaStateReceivers.length, 6);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    assert(
      mediaController.mediaStateReceivers.indexOf(ui) >= 0,
      'registers range'
    );

    ui.remove();

    assert.equal(mediaController.mediaStateReceivers.length, 2);
    assert(
      !mediaController.mediaStateReceivers.includes(ui),
      'unregisters control'
    );
  });

  it('registers itself and non-child gesture-receiver state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture(`
      <media-gesture-receiver mediacontroller="ctrl"></media-gesture-receiver>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    assert(
      mediaController.mediaStateReceivers.indexOf(ui) >= 0,
      'registers gesture-receiver'
    );

    ui.remove();

    assert.equal(mediaController.mediaStateReceivers.length, 2);
    assert(
      !mediaController.mediaStateReceivers.includes(ui),
      'unregisters control'
    );
  });

  it('registers itself and non-child loading-indicator state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture(`
      <media-loading-indicator mediacontroller="ctrl"></media-loading-indicator>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    assert(
      mediaController.mediaStateReceivers.indexOf(ui) >= 0,
      'registers loading-indicator'
    );

    ui.remove();

    assert.equal(mediaController.mediaStateReceivers.length, 2);
    assert(
      !mediaController.mediaStateReceivers.includes(ui),
      'unregisters control'
    );
  });

  it('registers itself and non-child preview-thumbnail state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture(`
      <media-preview-thumbnail mediacontroller="ctrl"></media-preview-thumbnail>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    assert(
      mediaController.mediaStateReceivers.indexOf(ui) >= 0,
      'registers preview-thumbnail'
    );

    ui.remove();

    assert.equal(mediaController.mediaStateReceivers.length, 2);
    assert(
      !mediaController.mediaStateReceivers.includes(ui),
      'unregisters control'
    );
  });

  it('registers itself and non-child time-display state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture(`
      <media-time-display mediacontroller="ctrl"></media-time-display>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    assert(
      mediaController.mediaStateReceivers.indexOf(ui) >= 0,
      'registers time-display'
    );

    ui.remove();

    assert.equal(mediaController.mediaStateReceivers.length, 2);
    assert(
      !mediaController.mediaStateReceivers.includes(ui),
      'unregisters control'
    );
  });

  it('registers itself and child simple element state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller>
        <div mediachromeattributes="mediapaused mediacurrenttime"></div>
      </media-controller>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(
      mediaController.mediaStateReceivers.indexOf(mediaController) >= 0,
      'registers itself'
    );
    const div = mediaController.querySelector('div');
    assert(
      mediaController.mediaStateReceivers.indexOf(div) >= 0,
      'registers div'
    );
  });
});

describe('receiving state / dispatching (bubbling) events', () => {
  let mediaController;
  let video;
  let div;

  beforeEach(async () => {
    mediaController = await fixture(`
      <media-controller>
        <video
          slot="media"
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/low.mp4"
          muted
          crossorigin
          playsinline
        ></video>
        <div></div>
      </media-controller>
    `);
    video = mediaController.querySelector('video');
    div = mediaController.querySelector('div');
  });

  it('receives state as attributes from the media', async () => {
    assert(mediaController.hasAttribute(MediaUIAttributes.MEDIA_PAUSED));
    assert(mediaController.hasAttribute(MediaUIAttributes.MEDIA_MUTED));
    assert.equal(
      mediaController.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME),
      '0',
      MediaUIAttributes.MEDIA_CURRENT_TIME
    );
    assert.equal(
      mediaController.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE),
      '1',
      MediaUIAttributes.MEDIA_PLAYBACK_RATE
    );
    assert.equal(
      mediaController.getAttribute(MediaUIAttributes.MEDIA_VOLUME),
      '1',
      MediaUIAttributes.MEDIA_VOLUME
    );
    assert.equal(
      mediaController.getAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL),
      'off',
      MediaUIAttributes.MEDIA_VOLUME_LEVEL
    );

    await video.play();

    assert(!mediaController.hasAttribute(MediaUIAttributes.MEDIA_PAUSED));
    video.pause();
  });

  it('can play/pause', async () => {
    assert(mediaController.hasAttribute(MediaUIAttributes.MEDIA_PAUSED));

    div.dispatchEvent(
      new Event(MediaUIEvents.MEDIA_PLAY_REQUEST, { bubbles: true })
    );
    await aTimeout(10);

    assert(!video.paused, 'video.paused is false');
    assert(
      !mediaController.hasAttribute(MediaUIAttributes.MEDIA_PAUSED),
      'has no mediapaused'
    );

    div.dispatchEvent(
      new Event(MediaUIEvents.MEDIA_PAUSE_REQUEST, { bubbles: true })
    );
    await aTimeout(10);

    assert(video.paused, 'video.paused is true');
    assert(
      mediaController.hasAttribute(MediaUIAttributes.MEDIA_PAUSED),
      'has mediapaused'
    );
  });

  it('can unmute/mute', async () => {
    assert(mediaController.hasAttribute(MediaUIAttributes.MEDIA_MUTED));

    div.dispatchEvent(
      new Event(MediaUIEvents.MEDIA_UNMUTE_REQUEST, { bubbles: true })
    );
    await aTimeout(10);

    assert(!video.muted, 'video.muted is false');
    assert(
      !mediaController.hasAttribute(MediaUIAttributes.MEDIA_MUTED),
      'has no mediamuted'
    );

    div.dispatchEvent(
      new Event(MediaUIEvents.MEDIA_MUTE_REQUEST, { bubbles: true })
    );
    await aTimeout(10);

    assert(video.muted, 'video.muted is true');
    assert(
      mediaController.hasAttribute(MediaUIAttributes.MEDIA_MUTED),
      'has mediamuted'
    );
  });

  it('can seek', async () => {
    await video.play();

    div.dispatchEvent(
      new CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
        detail: 2,
        bubbles: true,
      })
    );

    await waitUntil(
      () =>
        mediaController.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME) >= 2
    );
    assert(true, 'mediacurrenttime is 2');
  });

  (isSafari ? it.skip : it)('can change volume', async () => {
    div.dispatchEvent(
      new CustomEvent(MediaUIEvents.MEDIA_VOLUME_REQUEST, {
        detail: 0.73,
        bubbles: true,
      })
    );

    await waitUntil(
      () =>
        mediaController.getAttribute(MediaUIAttributes.MEDIA_VOLUME) == 0.73,
      10000
    );
    assert(true, 'mediavolume is 0.73');
  });
});

describe('state propagation behaviors', () => {
  let mediaController;
  let mediaAllReceiver;

  beforeEach(async () => {
    mediaController = await fixture(`
      <media-controller>
        <div ${MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES}="${Object.values(MediaUIAttributes).join(' ')}"></div>
      </media-controller>
    `);
    mediaAllReceiver = mediaController.querySelector('div');
  });

  afterEach(() => {
    mediaController = undefined;
    mediaAllReceiver = undefined;
  });

  Object.entries(MediaUIProps).forEach(([key, propName]) => {
    const eventType = MediaStateChangeEvents[key];

    it(`should dispatch event ${eventType} when ${propName} changes`, (done) => {
      const nextState = !mediaAllReceiver.hasAttribute(propName.toLowerCase());
      assert.exists(eventType);
      mediaController.addEventListener(eventType, () => done());
      mediaController.propagateMediaState(propName, nextState);
    });

    it(`should not dispatch event ${eventType} when ${propName} does not change`, (done) => {
      const nextState = !mediaAllReceiver.hasAttribute(propName.toLowerCase());
      assert.exists(eventType);
      mediaController.propagateMediaState(propName, nextState);
      mediaController.addEventListener(eventType, () =>
        done('Event should not fire!')
      );
      mediaController.propagateMediaState(propName, nextState);
      nextFrame().then(done);
    });
  });

  describe('media state receivers', () => {
    class MediaStateReceiverWC extends HTMLElement {
      static observedAttributes = Object.values(MediaUIAttributes);
    }

    const MEDIA_STATE_RECEIVER_WC_NAME = 'media-state-receiver';
    customElements.define(
      MEDIA_STATE_RECEIVER_WC_NAME,
      MediaStateReceiverWC
    );

    let mediaStateReceiverObj;
    let div;
    let wc;
    const INITIAL_VALUE = '@@placeholder@@';

    beforeEach(async () => {
      mediaStateReceiverObj = Object.values(MediaUIProps).reduce(
        (obj, propName) => {
          obj[propName] = INITIAL_VALUE;
          return obj;
        },
        {}
      );

      div = await fixture('<div></div>');
      div.setAttribute(
        MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES,
        Object.values(MediaUIAttributes).join(' ')
      );

      wc = await fixture(`<${MEDIA_STATE_RECEIVER_WC_NAME}></${MEDIA_STATE_RECEIVER_WC_NAME}>`);
    });

    afterEach(() => {
      mediaStateReceiverObj = undefined;
      div = undefined;
      wc = undefined;
    });

    Object.entries(MediaUIProps).forEach(([key, propName]) => {
      it(`should propagate ${propName} to a media state receiver with a corresponding property when its value changes`, () => {
        mediaController.registerMediaStateReceiver(mediaStateReceiverObj);
        const nextState = !mediaController.hasAttribute(propName.toLowerCase());
        mediaController.propagateMediaState(propName, nextState);
        assert.notEqual(mediaStateReceiverObj[propName], INITIAL_VALUE);
        assert.equal(mediaStateReceiverObj[propName], nextState);
      });

      it(`should not propagate ${propName} to a media state receiver if it has no corresponding property when its value changes`, () => {
        delete mediaStateReceiverObj[propName];
        mediaController.registerMediaStateReceiver(mediaStateReceiverObj);
        const nextState = !mediaController.hasAttribute(propName.toLowerCase());
        mediaController.propagateMediaState(propName, nextState);
        assert.notEqual(mediaStateReceiverObj[propName], nextState);
        assert(!(propName in mediaStateReceiverObj));
      });

      const attrName = MediaUIAttributes[key];

      it(`should propagate ${propName} via attrs to a media state receiver if ${attrName} is listed in ${MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES}`, () => {
        mediaController.registerMediaStateReceiver(div);
        const nextState = !mediaController.hasAttribute(propName.toLowerCase());
        mediaController.propagateMediaState(propName, nextState);
        assert.equal(div.hasAttribute(attrName), nextState);
      });

      it(`should not propagate ${propName} via attrs to a media state receiver if ${attrName} is not listed in ${MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES}`, () => {
        div.setAttribute(
          MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES,
          Object.values(MediaUIAttributes)
            .filter((name) => name !== attrName)
            .join(' ')
        );
        mediaController.registerMediaStateReceiver(div);
        // NOTE: Given the generic values here, we need to update state twice to ensure a toggle between true & false
        // (which is represented by removing an attribute from a media state receiver)
        const nextState = !mediaController.hasAttribute(propName.toLowerCase());
        mediaController.propagateMediaState(propName, nextState);
        assert(!div.hasAttribute(attrName));
        mediaController.propagateMediaState(propName, !nextState);
        assert(!div.hasAttribute(attrName));
      });

      it(`should propagate ${propName} via props to a media state receiver if prop exists, even if a corresponding ${attrName} attr is listed in ${MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES}`, () => {
        div[propName] = INITIAL_VALUE;
        mediaController.registerMediaStateReceiver(div);
        const nextState = !mediaController.hasAttribute(propName.toLowerCase());
        mediaController.propagateMediaState(propName, nextState);
        assert(!div.hasAttribute(attrName));
        assert.equal(div[propName], nextState);
      });

      it(`should propagate ${propName} via attrs to a web component media state receiver if ${attrName} is an observed attr`, () => {
        mediaController.registerMediaStateReceiver(wc);
        const nextState = !mediaController.hasAttribute(propName.toLowerCase());
        mediaController.propagateMediaState(propName, nextState);
        assert.equal(wc.hasAttribute(attrName), nextState);
      });

      it(`should propagate ${propName} via props to a web component media state receiver if prop exists, even if ${attrName} is an observed attr`, () => {
        wc[propName] = INITIAL_VALUE;
        mediaController.registerMediaStateReceiver(wc);
        const nextState = !mediaController.hasAttribute(propName.toLowerCase());
        mediaController.propagateMediaState(propName, nextState);
        assert(!div.hasAttribute(attrName));
        assert.equal(wc[propName], nextState);
      });
    });
  });
});
