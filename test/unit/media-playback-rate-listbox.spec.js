import { assert, fixture } from '@open-wc/testing';
import '../../src/js/index.js';
import '../../src/js/experimental/index.js';

describe('<media-playback-rate-listbox>', () => {
  let mediaController;
  let listbox;

  beforeEach(async () => {
    mediaController = await fixture(/*html*/`
      <media-controller>
        <video
          slot="media"
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/low.mp4"
          muted
        ></video>
        <media-playback-rate-listbox></media-playback-rate-listbox>
      </media-controller>
    `);
    listbox = mediaController.querySelector('media-playback-rate-listbox');
  });

  it('listbox is populated', async function () {
    assert.equal(listbox.options.length, 5);
    assert.equal(listbox.value, 1);
  });

});
