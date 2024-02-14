import { assert, fixture } from '@open-wc/testing';
import 'https://cdn.jsdelivr.net/npm/hls-video-element@1.1/+esm';
import '../../src/js/index.js';
import '../../src/js/experimental/index.js';

describe('<media-rendition-selectmenu>', () => {
  let mediaController;
  let selectmenu;
  let listbox;

  beforeEach(async () => {
    mediaController = await fixture(/*html*/`
      <media-controller>
        <hls-video
          slot="media"
          preload="auto"
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg.m3u8"
          muted
          crossorigin
        ></hls-video>
        <media-rendition-selectmenu></media-rendition-selectmenu>
      </media-controller>
    `);
    selectmenu = mediaController.querySelector('media-rendition-selectmenu');
    listbox = selectmenu.shadowRoot.querySelector('media-rendition-listbox');
  });

  it('selectmenu is populated', async function () {
    await new Promise(resolve => mediaController.media.videoRenditions.addEventListener('addrendition', resolve));

    assert.equal(listbox.options.length, 6);
    assert.equal(listbox.value, 'auto');
  });

});
