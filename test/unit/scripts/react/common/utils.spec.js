import { expect } from '@open-wc/testing';
import { toNativeProps } from '../../../../../scripts/react/common/utils';

describe('module: scripts/react/common/utils', () => {
  describe('toNativeProps()', () => {
    it('should rename camelCase props to lowercase ("smushedcase") for generic props', async () => {
      const props = {
        camelCase: 'foo',
        nocamelcase: 'bar',
      };

      const actual = toNativeProps(props);

      expect(actual).to.deep.equal({ camelcase: 'foo', nocamelcase: 'bar' });
    });

    it('should appropriately translate special React props to their DOM equivalent names, even for camelCase', async () => {
      const props = {
        className: 'foo',
        htmlFor: 'id',
        viewBox: '0 0 20 20',
      };

      const actual = toNativeProps(props);

      expect(actual).to.deep.equal({
        class: 'foo',
        for: 'id',
        viewBox: '0 0 20 20',
      });
    });

    it('should appropriately translate true values to empty strings, per standard DOM representation of booleans', async () => {
      const props = {
        bool: true,
      };

      const actual = toNativeProps(props);

      expect(actual).to.deep.equal({ bool: '' });
    });

    it('should appropriately remove false values as props, per standard DOM representation of booleans', async () => {
      const props = {
        bool: false,
      };

      const actual = toNativeProps(props);

      expect(actual).to.deep.equal({});
    });
  });
});
