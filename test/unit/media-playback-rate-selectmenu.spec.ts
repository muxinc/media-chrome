import { assert, fixture } from '@open-wc/testing';
import '../../src/js/experimental/index.js';
import type { MediaPlaybackRateListbox, MediaPlaybackRateSelectMenu } from '../../src/js/experimental/index.js';
import '../../src/js/index.js';

describe('<media-playback-rate-selectmenu>', () => {
  let mediaController;
  let selectmenu: MediaPlaybackRateSelectMenu;
  let listbox: MediaPlaybackRateListbox;

  beforeEach(async () => {
    mediaController = await fixture(/*html*/`
      <media-controller>
        <video
          slot="media"
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/low.mp4"
          muted
        ></video>
        <media-playback-rate-selectmenu></media-playback-rate-selectmenu>
      </media-controller>
    `);
    selectmenu = mediaController.querySelector('media-playback-rate-selectmenu');
    listbox = selectmenu!.shadowRoot!.querySelector('media-playback-rate-listbox') as MediaPlaybackRateListbox;
  });

  it('selectmenu is populated', async function () {
    assert.equal(listbox.options.length, 5);
    assert.equal(listbox.value, '1');
  });

});
