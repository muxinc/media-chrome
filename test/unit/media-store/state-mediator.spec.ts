import { expect, fixture } from '@open-wc/testing';
import { stateMediator } from '../../../src/js/media-store/state-mediator.js';

describe('StateMediator', () => {
  const stateMediatorEntries = Object.entries(stateMediator);
  describe('no stateOwners', () => {
    const stateOwners = {};

    stateMediatorEntries.forEach(
      ([stateName, stateValueAPI]: [string, any]) => {
        const { get: getter, set: setter } = stateValueAPI;
        it(`${stateName} getter should not throw`, () => {
          const fn = () => getter(stateOwners);
          expect(fn).to.not.throw();
        });

        if (setter) {
          it(`${stateName} setter should not throw`, () => {
            const fn = () => setter(undefined, stateOwners);
            expect(fn).to.not.throw();
          });
        }
      }
    );
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

    stateMediatorEntries.forEach(
      ([stateName, stateValueAPI]: [string, any]) => {
        const { get: getter, set: setter } = stateValueAPI;
        it(`${stateName} getter should not throw`, () => {
          const fn = () => getter(stateOwners);
          expect(fn).to.not.throw();
        });

        if (setter) {
          it(`${stateName} setter should not throw`, () => {
            const fn = () => setter(undefined, stateOwners);
            expect(fn).to.not.throw();
          });
        }
      }
    );
  });

  describe('mediaHasSeeked', () => {
    const { get } = stateMediator.mediaHasSeeked;

    it('is set by a seek and cleared when the media is emptied', () => {
      const stateOwners = { media: document.createElement('video') };

      expect(get(stateOwners)).to.be.false;
      expect(get(stateOwners, new Event('seeking'))).to.be.true;
      expect(get(stateOwners, new Event('emptied'))).to.be.false;
    });

    it('is false without media', () => {
      expect(get({}, new Event('seeking'))).to.be.false;
    });
  });
});
