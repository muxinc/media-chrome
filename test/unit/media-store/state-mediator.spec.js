import { expect } from '@open-wc/testing';
import { stateMediator } from '../../../src/js/media-store/state-mediator';

describe('StateMediator', () => {
  describe('No stateOwners tests', () => {
    const stateOwners = {};

    Object.entries(stateMediator).forEach(([stateName, stateValueAPI]) => {
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
    });
  });
});
