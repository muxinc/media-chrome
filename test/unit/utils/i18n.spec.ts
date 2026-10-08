import { assert } from '@open-wc/testing';
import { En } from '../../../src/js/lang/en.js';
import {
  addTranslation,
  setLanguage,
  t,
} from '../../../src/js/utils/i18n.js';

describe('i18n', () => {
  afterEach(() => {
    addTranslation('en', En);
    setLanguage('en');
  });

  it('addTranslation accepts a partial dictionary', function () {
    addTranslation('xx', { Play: 'Jouer' });
    setLanguage('xx');

    assert.equal(t('Play'), 'Jouer');
    // Keys missing from the dictionary fall back to English.
    assert.equal(t('Pause'), En['Pause']);
  });
});
