import { assert } from '@open-wc/testing';
import * as x from 'resolve.exports';
import pkg from '../../package.json';

const resolves = it;

function to(expects: string|string[], options?: x.Options) {
  return function() {
    const out = x.resolve(pkg, this.test.title, options);
    if (typeof expects === 'string') {
      assert.ok(Array.isArray(out));
      assert.equal(out[0], expects);
      assert.equal(out.length, 1);
    } else {
      // Array | null | undefined
      assert.equal(out, expects);
    }
  }
}

resolves('media-chrome', to('./dist/index.js'));

resolves('media-chrome/menu', to('./dist/menu/index.js'));
resolves('media-chrome/menu/index.js', to('./dist/menu/index.js'));
resolves('media-chrome/dist/menu/index.js', to('./dist/menu/index.js'));
resolves('media-chrome/menu/media-settings-menu', to('./dist/menu/media-settings-menu.js'));
resolves('media-chrome/menu/media-settings-menu.js', to('./dist/menu/media-settings-menu.js'));

resolves('media-chrome/react', to('./dist/react/index.js'));
resolves('media-chrome/react/menu', to('./dist/react/menu/index.js'));
resolves('media-chrome/react/media-store', to('./dist/react/media-store.js'));
resolves('media-chrome/react/media-store.js', to('./dist/react/media-store.js'));
resolves('media-chrome/react/media-store', to('./dist/cjs/react/media-store.js', { require: true }));
resolves('media-chrome/dist/cjs/react/media-store.js', to('./dist/cjs/react/media-store.js', { require: true }));

resolves('media-chrome/lang/fr', to('./dist/lang/fr.js'));
resolves('media-chrome/lang/fr.js', to('./dist/lang/fr.js'));
resolves('media-chrome/dist/lang/fr.js', to('./dist/lang/fr.js'));
resolves('media-chrome/lang/fr', to('./dist/cjs/lang/fr.js', { require: true }));
resolves('media-chrome/dist/cjs/lang/fr.js', to('./dist/cjs/lang/fr.js', { require: true }));
