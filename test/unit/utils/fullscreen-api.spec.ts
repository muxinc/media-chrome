import { assert } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import {
  enterFullscreen,
  exitFullscreen,
  getFullscreenElement,
  isFullscreen,
  isFullscreenEnabled,
} from '../../../src/js/utils/fullscreen-api.js';

// NOTE: These tests use plain objects as "state owners" so that nothing
// actually requests fullscreen (browsers reject that without a user gesture).
// Both unprefixed and webkit-prefixed keys are provided on fake owners since
// the module picks the key based on what the current browser's document supports.

const fakeDocument = (fullscreenElement: any, extra: any = {}) => ({
  fullscreenElement,
  webkitFullscreenElement: fullscreenElement,
  ...extra,
});

describe('fullscreen-api', () => {
  describe('enterFullscreen', () => {
    it('calls requestFullscreen on the fullscreenElement', () => {
      const fullscreenElement = { requestFullscreen: spy() };
      const media = { requestFullscreen: spy() };
      const result = enterFullscreen({ media, fullscreenElement } as any);
      assert.isUndefined(result);
      assert(fullscreenElement.requestFullscreen.calledOnce);
      assert(media.requestFullscreen.notCalled, 'media not used');
    });

    it('swallows a rejected requestFullscreen promise', async () => {
      const fullscreenElement = {
        requestFullscreen: stub().returns(Promise.reject(new Error('nope'))),
      };
      const result = enterFullscreen({ fullscreenElement } as any);
      assert.instanceOf(result, Promise);
      assert.isUndefined(await result);
    });

    it('falls back to webkitRequestFullScreen on the fullscreenElement', () => {
      const fullscreenElement = { webkitRequestFullScreen: spy() };
      enterFullscreen({ fullscreenElement } as any);
      assert(fullscreenElement.webkitRequestFullScreen.calledOnce);
    });

    it('falls back to media.webkitEnterFullscreen (iOS)', () => {
      const media = {
        webkitEnterFullscreen: spy(),
        requestFullscreen: spy(),
      };
      enterFullscreen({ media, fullscreenElement: {} } as any);
      assert(media.webkitEnterFullscreen.calledOnce);
      assert(media.requestFullscreen.notCalled);
    });

    it('falls back to media.requestFullscreen', () => {
      const media = { requestFullscreen: spy() };
      enterFullscreen({ media } as any);
      assert(media.requestFullscreen.calledOnce);
    });

    it('does nothing without any fullscreen capable owner', () => {
      assert.isUndefined(enterFullscreen({} as any));
      assert.isUndefined(enterFullscreen({ media: {} } as any));
    });

    it('logs errors thrown while requesting fullscreen', () => {
      const error = new Error('boom');
      const errorStub = stub(console, 'error');
      try {
        enterFullscreen({
          fullscreenElement: { requestFullscreen: stub().throws(error) },
        } as any);
        assert(errorStub.calledWith(error));
      } finally {
        errorStub.restore();
      }
    });
  });

  describe('exitFullscreen', () => {
    it('calls the exit method on the documentElement', () => {
      const exit = spy();
      const documentElement = {
        exitFullscreen: exit,
        webkitExitFullscreen: exit,
        webkitCancelFullScreen: exit,
      };
      assert.isUndefined(exitFullscreen({ documentElement } as any));
      assert(exit.calledOnce);
    });

    it('swallows a rejected exit promise', async () => {
      const exit = stub().callsFake(() => Promise.reject(new Error('nope')));
      const documentElement = {
        exitFullscreen: exit,
        webkitExitFullscreen: exit,
        webkitCancelFullScreen: exit,
      };
      const result = exitFullscreen({ documentElement } as any);
      assert.instanceOf(result, Promise);
      assert.isUndefined(await result);
    });

    it('does nothing without a documentElement', () => {
      assert.isUndefined(exitFullscreen({} as any));
    });
  });

  describe('getFullscreenElement', () => {
    it('returns the document fullscreen element', () => {
      const el = {};
      assert.equal(
        getFullscreenElement({
          documentElement: fakeDocument(el),
          media: {},
        } as any),
        el
      );
    });

    it('returns the media when it is displaying webkit fullscreen', () => {
      const media = {
        webkitDisplayingFullscreen: true,
        webkitPresentationMode: 'fullscreen',
      };
      assert.equal(
        getFullscreenElement({
          documentElement: fakeDocument(null),
          media,
        } as any),
        media
      );
    });

    it('does not return the media for a non-fullscreen webkit presentation mode', () => {
      const media = {
        webkitDisplayingFullscreen: true,
        webkitPresentationMode: 'picture-in-picture',
      };
      assert.isNull(
        getFullscreenElement({
          documentElement: fakeDocument(null),
          media,
        } as any)
      );
    });

    it('returns nothing when no element is fullscreen', () => {
      assert.isNotOk(
        getFullscreenElement({
          documentElement: fakeDocument(null),
          media: {},
        } as any)
      );
    });
  });

  describe('isFullscreen', () => {
    it('is false without media or documentElement', () => {
      const el = {};
      assert.isFalse(
        isFullscreen({ documentElement: fakeDocument(el) } as any)
      );
      assert.isFalse(isFullscreen({ media: el } as any));
    });

    it('is false when nothing is fullscreen', () => {
      assert.isFalse(
        isFullscreen({ media: {}, documentElement: fakeDocument(null) } as any)
      );
    });

    it('is true when the fullscreenElement owner is fullscreen', () => {
      const fullscreenElement = { localName: 'div' };
      assert.isTrue(
        isFullscreen({
          media: {},
          fullscreenElement,
          documentElement: fakeDocument(fullscreenElement),
        } as any)
      );
    });

    it('is true when the media is fullscreen (defaults fullscreenElement to media)', () => {
      const media = { localName: 'video' };
      assert.isTrue(
        isFullscreen({ media, documentElement: fakeDocument(media) } as any)
      );
      assert.isTrue(
        isFullscreen({
          media,
          fullscreenElement: { localName: 'div' },
          documentElement: fakeDocument(media),
        } as any)
      );
    });

    it('is false when an unrelated non custom element is fullscreen', () => {
      assert.isFalse(
        isFullscreen({
          media: {},
          fullscreenElement: {},
          documentElement: fakeDocument({ localName: 'div' }),
        } as any)
      );
    });

    it('traverses nested shadow roots to find the fullscreenElement', () => {
      const fullscreenElement = { localName: 'div' };
      const inner = {
        localName: 'inner-el',
        shadowRoot: fakeDocument(fullscreenElement),
      };
      const outer = { localName: 'outer-el', shadowRoot: fakeDocument(inner) };
      assert.isTrue(
        isFullscreen({
          media: {},
          fullscreenElement,
          documentElement: fakeDocument(outer),
        } as any)
      );
    });

    it('is false when nested shadow roots do not contain the fullscreenElement', () => {
      const other = { localName: 'div' };
      const outer = { localName: 'outer-el', shadowRoot: fakeDocument(other) };
      assert.isFalse(
        isFullscreen({
          media: {},
          fullscreenElement: { localName: 'div' },
          documentElement: fakeDocument(outer),
        } as any)
      );
    });

    it('falls back to containment when shadowRoot has no fullscreenElement support', () => {
      const fullscreenElement = { localName: 'div' };
      const host = {
        localName: 'legacy-el',
        shadowRoot: {},
        contains: (node: any) => node === fullscreenElement,
      };
      assert.isTrue(
        isFullscreen({
          media: {},
          fullscreenElement,
          documentElement: fakeDocument(host),
        } as any)
      );
      assert.isFalse(
        isFullscreen({
          media: {},
          fullscreenElement: { localName: 'span', getRootNode: () => ({}) },
          documentElement: fakeDocument({ ...host, contains: () => false }),
        } as any)
      );
    });
  });

  describe('isFullscreenEnabled', () => {
    it('is true when the document has fullscreen enabled', () => {
      assert.isTrue(
        isFullscreenEnabled({
          documentElement: {
            fullscreenEnabled: true,
            webkitFullscreenEnabled: true,
          },
          media: {},
        } as any)
      );
    });

    it('is true when the media supports webkit fullscreen', () => {
      assert.isTrue(
        isFullscreenEnabled({
          documentElement: {
            fullscreenEnabled: false,
            webkitFullscreenEnabled: false,
          },
          media: { webkitSupportsFullscreen: false },
        } as any)
      );
    });

    it('is falsy when neither supports fullscreen', () => {
      assert.isNotOk(
        isFullscreenEnabled({
          documentElement: {
            fullscreenEnabled: false,
            webkitFullscreenEnabled: false,
          },
          media: {},
        } as any)
      );
      assert.isNotOk(isFullscreenEnabled({} as any));
    });
  });
});
