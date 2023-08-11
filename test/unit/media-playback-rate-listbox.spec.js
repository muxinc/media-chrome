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
          preload="auto"
          src="https://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4"
          muted
          crossorigin
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
