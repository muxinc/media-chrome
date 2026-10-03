import { expect, fixture, waitUntil } from '@open-wc/testing';
import { stub } from 'sinon';
import { MediaUIEvents } from '../../../src/js/constants.js';
import { createMediaStore } from '../../../src/js/media-store/media-store.js';
import { requestMap } from '../../../src/js/media-store/request-map.js';
import { stateMediator } from '../../../src/js/media-store/state-mediator.js';

describe('RequestMap', () => {
  it('retries playback after a media source error', async () => {
    const media = document.createElement('video');
    let error = { code: 4, message: 'Failed to open media' };

    Object.defineProperty(media, 'error', {
      configurable: true,
      get: () => error,
    });
    const load = stub(media, 'load').callsFake(() => {
      error = null;
      media.dispatchEvent(new Event('emptied'));
    });
    const play = stub(media, 'play').resolves();
    const store = createMediaStore({
      media,
      monitorStateOwnersOnlyWithSubscriptions: false,
    });

    await waitUntil(() => store.getState().mediaErrorCode === 4);
    store.dispatch({ type: MediaUIEvents.MEDIA_PLAY_REQUEST });

    expect(load.calledOnce).to.be.true;
    expect(play.calledOnce).to.be.true;
    expect(load.calledBefore(play)).to.be.true;
  });

  const requestMapEntries = Object.entries(requestMap);
  describe('no stateOwners', () => {
    const stateOwners = {};

    requestMapEntries.forEach(([type, stateChangeRequestFn]) => {
      it(`${type} state change request fn should not throw`, () => {
        const fn = () =>
          stateChangeRequestFn(stateMediator, stateOwners, { type });
        expect(fn).to.not.throw();
      });
    });
  });

  describe('simple stateOwners', () => {
    let stateOwners;

    before(async () => {
      const fullscreenElement = await fixture('<div><video></video></div>');
      const media = fullscreenElement.querySelector('video');
      const rootNode = document;
      const options = {};
      stateOwners = {
        fullscreenElement,
        media,
        rootNode,
        options,
      };
    });

    after(() => {
      stateOwners = undefined;
    });

    requestMapEntries.forEach(([type, stateChangeRequestFn]) => {
      it(`${type} state change request fn should not throw`, () => {
        const fn = () =>
          stateChangeRequestFn(stateMediator, stateOwners, { type });
        expect(fn).to.not.throw();
      });
    });
  });
});
