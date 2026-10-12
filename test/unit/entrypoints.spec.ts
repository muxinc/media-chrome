import { assert } from '@open-wc/testing';
import '../../src/js/all.js';
import '../../src/js/extras/media-clip-selector/index.js';
import { En } from '../../src/js/lang/en.js';
import { De } from '../../src/js/lang/de.js';
import { Es } from '../../src/js/lang/es.js';
import { Fr } from '../../src/js/lang/fr.js';
import { Pt } from '../../src/js/lang/pt.js';
import { ZhCn } from '../../src/js/lang/zh-CN.js';
import { ZhTw } from '../../src/js/lang/zh-TW.js';
import { setLanguage, t } from '../../src/js/utils/i18n.js';

// The menu elements, media-theme and extras are not reachable from index.ts,
// so importing the public entrypoints here also keeps them in the coverage report.
describe('entrypoints', () => {
  it('all.js registers the menu elements', () => {
    [
      'media-chrome-menu',
      'media-chrome-menu-item',
      'media-chrome-menu-button',
      'media-settings-menu',
      'media-settings-menu-item',
      'media-settings-menu-button',
      'media-audio-track-menu',
      'media-audio-track-menu-button',
      'media-captions-menu',
      'media-captions-menu-button',
      'media-playback-rate-menu',
      'media-playback-rate-menu-button',
      'media-rendition-menu',
      'media-rendition-menu-button',
      'media-context-menu',
      'media-context-menu-item',
      'media-theme',
    ].forEach((name) => {
      assert.exists(customElements.get(name), `${name} is defined`);
    });
  });

  it('registers media-clip-selector', () => {
    assert.exists(customElements.get('media-clip-selector'));
  });

  describe('lang', () => {
    afterEach(() => setLanguage('en'));

    const dictionaries = {
      de: De,
      es: Es,
      fr: Fr,
      pt: Pt,
      'zh-CN': ZhCn,
      'zh-TW': ZhTw,
    };

    Object.entries(dictionaries).forEach(([lang, dict]) => {
      it(`${lang} translates every English key`, () => {
        assert.hasAllKeys(dict, Object.keys(En));
        setLanguage(lang);
        assert.equal(t('Play'), dict['Play']);
      });
    });
  });
});
