import { expect, fixture } from '@open-wc/testing';
import { requestMap } from '../../../src/js/media-store/request-map.js';
import { stateMediator } from '../../../src/js/media-store/state-mediator.js';

describe('RequestMap', () => {
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
