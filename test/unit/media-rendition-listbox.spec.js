import { assert, fixture } from '@open-wc/testing';
import 'https://cdn.jsdelivr.net/npm/hls-video-element@0.5/+esm';
import '../../src/js/index.js';
import '../../src/js/experimental/index.js';

describe('<media-rendition-listbox>', () => {
  let mediaController;
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
        <media-rendition-listbox></media-rendition-listbox>
      </media-controller>
    `);
    listbox = mediaController.querySelector('media-rendition-listbox');
  });

  it('listbox is populated', async function () {
    await new Promise(resolve => mediaController.media.videoRenditions.addEventListener('addrendition', resolve));

    assert.equal(listbox.options.length, 6);
    assert.equal(listbox.value, 'auto');
  });

});
