import {
  aTimeout,
  assert,
  fixture,
  nextFrame,
  waitUntil,
} from '@open-wc/testing';
import { MediaStateReceiverAttributes } from '../../src/js/constants.js';
import { constants } from '../../src/js/index.js';
import '../../src/js/media-controller.js';
import { MediaController } from '../../src/js/media-controller.js';
import { spy } from 'sinon';

const {
  MediaUIEvents,
  MediaUIAttributes,
  MediaStateChangeEvents,
  MediaUIProps,
} = constants;
const isSafari = /.*Version\/.*Safari\/.*/.test(navigator.userAgent);

describe('<media-controller>', () => {
  it('associates itself to observe for state receivers', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller></media-controller>
    `);
    assert.equal(mediaController.associatedElementSubscriptions.size, 1);
    assert(mediaController.associatedElementSubscriptions.has(mediaController));
  });

  it('associates non-child elements to observe for state receivers', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller id="ctrl"></media-controller>
    `);
    const playButton = await fixture<HTMLElement>(`
      <media-play-button mediacontroller="ctrl"></media-play-button>
    `);
    assert.equal(mediaController.associatedElementSubscriptions.size, 2);
    assert(mediaController.associatedElementSubscriptions.has(playButton));
  });

  it('registers itself and child controls state receivers', async () => {
    const mediaController = await fixture<MediaController>(`
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
    const playButton = mediaController.querySelector(
      'media-play-button'
    ) as HTMLElement;
    assert(
      mediaController.mediaStateReceivers.indexOf(playButton) >= 0,
      'registers play button'
    );
  });

  it('registers itself and non-child button state receivers', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture<HTMLElement>(`
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
    const mediaController = await fixture<MediaController>(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture<HTMLElement>(`
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
    const mediaController = await fixture<MediaController>(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture<HTMLElement>(`
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
    const mediaController = await fixture<MediaController>(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture<HTMLElement>(`
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
    const mediaController = await fixture<MediaController>(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture<HTMLElement>(`
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
    const mediaController = await fixture<MediaController>(`
      <media-controller id="ctrl"></media-controller>
    `);
    const ui = await fixture<HTMLElement>(`
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
    const mediaController = await fixture<MediaController>(`
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
    const div = mediaController.querySelector('div') as HTMLElement;
    assert(
      mediaController.mediaStateReceivers.indexOf(div) >= 0,
      'registers div'
    );
  });

  it('toggles hotkeys on and off with nohotkeys attribute', async () => {
    const addEventListenerSpy = spy(
      MediaController.prototype,
      'addEventListener'
    );
    const removeEventListenerSpy = spy(
      MediaController.prototype,
      'removeEventListener'
    );

    const mediaController = await fixture<MediaController>(`
      <media-controller nohotkeys>
        <video 
          slot="media" 
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/low.mp4"
          muted 
          crossorigin 
          playsinline
        ></video>
      </media-controller>
    `);
    await nextFrame();

    // On creation with nohotkeys, should call removeEventListener for keydown
    const removedKeydown = removeEventListenerSpy.calledWith('keydown');
    assert.isTrue(
      removedKeydown,
      'Should remove keydown listener when nohotkeys is present'
    );

    // Remove nohotkeys attribute (should enable hotkeys)
    mediaController.removeAttribute('nohotkeys');
    await nextFrame();
    const addedKeydown = addEventListenerSpy.calledWith('keydown');
    assert.isTrue(
      addedKeydown,
      'Should add keydown listener when nohotkeys is removed'
    );

    // Add nohotkeys attribute again (should disable hotkeys)
    mediaController.setAttribute('nohotkeys', '');
    await nextFrame();
    const removedKeydownCalls = removeEventListenerSpy
      .getCalls()
      .filter((call) => call.args[0] === 'keydown').length;
    assert.isTrue(
      removedKeydownCalls > 1,
      'Should remove keydown listener again when nohotkeys is set'
    );

    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });
});

describe('receiving state / dispatching (bubbling) events', () => {
  let mediaController: MediaController;
  let video: HTMLVideoElement;
  let div: HTMLDivElement;

  beforeEach(async () => {
    mediaController = await fixture<MediaController>(`
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
    video = mediaController.querySelector('video') as HTMLVideoElement;
    div = mediaController.querySelector('div') as HTMLDivElement;
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

    await aTimeout(200);

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
        // @ts-ignore
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
        // @ts-ignore
        mediaController.getAttribute(MediaUIAttributes.MEDIA_VOLUME) == 0.73,
      // @ts-ignore
      10000
    );
    assert(true, 'mediavolume is 0.73');
  });
});

describe('state propagation behaviors', () => {
  let mediaController: MediaController;
  let mediaAllReceiver: HTMLDivElement;

  beforeEach(async () => {
    mediaController = await fixture<MediaController>(`
      <media-controller>
        <video
          slot="media"
          preload="auto"
          muted
        />
        <div ${
          MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES
        }="${Object.values(MediaUIAttributes).join(' ')}"></div>
      </media-controller>
    `);
    mediaAllReceiver = mediaController.querySelector('div') as HTMLDivElement;
  });

  afterEach(() => {
    // @ts-ignore
    mediaController = undefined;
    // @ts-ignore
    mediaAllReceiver = undefined;
  });

  // NOTE: Examples of ad hoc state update tests. These could be moved into higher order functions if preferred (CJP)
  // it(`should dispatch event ${MediaStateChangeEvents.MEDIA_MUTED} when ${MediaUIProps.MEDIA_MUTED} changes`, (done) => {
  //   const eventType = MediaStateChangeEvents[MediaUIProps.MEDIA_MUTED];
  //   mediaController.addEventListener(eventType, () => {
  //     done()
  //   });
  //   // NOTE: Since everything else should be generic, this part of the code could be passed in via a callback if we wanted
  //   // to use the higher order function approach (CJP)
  //   mediaEl.muted = !mediaEl.muted;
  // });

  // it(`should not dispatch event ${MediaStateChangeEvents.MEDIA_MUTED} when ${MediaUIProps.MEDIA_MUTED} does not change`, (done) => {
  //   const eventType = MediaStateChangeEvents.MEDIA_MUTED;
  //   mediaController.addEventListener(eventType, () =>
  //     done('Event should not fire!')
  //   );
  //   // NOTE: Since everything else should be generic, this part of the code could be passed in via a callback if we wanted
  //   // to use the higher order function approach (CJP)
  //   mediaEl.muted = mediaEl.muted;
  //   nextFrame().then(done);
  // });

  Object.entries(MediaUIProps).forEach(([key, propName]) => {
    const eventType = MediaStateChangeEvents[key];

    /**
     * @TODO propagateMediaState no longer "owns" the state change event dispatch. Currently, will need to explicitly map
     * change requests explicitly to test this behavior (aka cannot be ad hoc and depends on things like the media element as a "source of truth")
     * (CJP)
     **/
    it.skip(`should dispatch event ${eventType} when ${propName} changes`, (done) => {
      const nextState = !mediaAllReceiver.hasAttribute(propName.toLowerCase());
      assert.exists(eventType);
      mediaController.addEventListener(eventType, () => done());
      mediaController.propagateMediaState(propName, nextState);
    });

    it.skip(`should not dispatch event ${eventType} when ${propName} does not change`, (done) => {
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
    const MediaUIAttributeValues = Object.values(MediaUIAttributes);

    class MediaStateReceiverWC extends HTMLElement {
      static observedAttributes = MediaUIAttributeValues;
    }

    const MEDIA_STATE_RECEIVER_WC_NAME = 'media-state-receiver';
    customElements.define(MEDIA_STATE_RECEIVER_WC_NAME, MediaStateReceiverWC);

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
        MediaUIAttributeValues.join(' ')
      );

      MediaUIAttributeValues.forEach((attrName) => {
        div.setAttribute(attrName, INITIAL_VALUE);
      });

      wc = await fixture(
        `<${MEDIA_STATE_RECEIVER_WC_NAME}></${MEDIA_STATE_RECEIVER_WC_NAME}>`
      );

      MediaUIAttributeValues.forEach((attrName) => {
        wc.setAttribute(attrName, INITIAL_VALUE);
      });
    });

    afterEach(() => {
      mediaStateReceiverObj = undefined;
      div = undefined;
      wc = undefined;
    });

    Object.entries(MediaUIProps).forEach(([key, propName]) => {
      it(`should propagate ${propName} to a media state receiver with a corresponding property when its value changes`, () => {
        mediaController.registerMediaStateReceiver(mediaStateReceiverObj);
        assert.notEqual(mediaStateReceiverObj[propName], INITIAL_VALUE);
      });

      it(`should not propagate ${propName} to a media state receiver if it has no corresponding property when its value changes`, () => {
        delete mediaStateReceiverObj[propName];
        mediaController.registerMediaStateReceiver(mediaStateReceiverObj);
        assert(!(propName in mediaStateReceiverObj));
      });

      const attrName = MediaUIAttributes[key];

      it(`should propagate ${propName} via attrs to a media state receiver if ${attrName} is listed in ${MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES}`, () => {
        mediaController.registerMediaStateReceiver(div);
        /** @TODO Should we still propagate true boolean attrs so the value is explicitly '' if it was previously set to some other value? (CJP) */
        const propIsTrue =
          mediaController.mediaStore.getState()[propName] === true;
        if (!propIsTrue) {
          assert.notEqual(div.getAttribute(attrName), INITIAL_VALUE);
        } else {
          assert.equal(div.getAttribute(attrName), INITIAL_VALUE);
        }
      });

      it(`should not propagate ${propName} via attrs to a media state receiver if ${attrName} is not listed in ${MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES}`, () => {
        div.setAttribute(
          MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES,
          Object.values(MediaUIAttributes)
            .filter((name) => name !== attrName)
            .join(' ')
        );
        mediaController.registerMediaStateReceiver(div);
        assert.equal(div.getAttribute(attrName), INITIAL_VALUE);
      });

      it(`should propagate ${propName} via props to a media state receiver if prop exists, even if a corresponding ${attrName} attr is listed in ${MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES}`, () => {
        div[propName] = INITIAL_VALUE;
        mediaController.registerMediaStateReceiver(div);
        assert.equal(div.getAttribute(attrName), INITIAL_VALUE);
        assert.notEqual(div[propName], INITIAL_VALUE);
      });

      it(`should propagate ${propName} via attrs to a web component media state receiver if ${attrName} is an observed attr`, () => {
        mediaController.registerMediaStateReceiver(wc);
        const propIsTrue =
          mediaController.mediaStore.getState()[propName] === true;
        if (!propIsTrue) {
          assert.notEqual(wc.getAttribute(attrName), INITIAL_VALUE);
        } else {
          assert.equal(wc.getAttribute(attrName), INITIAL_VALUE);
        }
      });

      it(`should propagate ${propName} via props to a web component media state receiver if prop exists, even if ${attrName} is an observed attr`, () => {
        wc[propName] = INITIAL_VALUE;
        mediaController.registerMediaStateReceiver(wc);
        assert.equal(wc.getAttribute(attrName), INITIAL_VALUE);
        assert.notEqual(wc[propName], INITIAL_VALUE);
      });
    });
  });
});
