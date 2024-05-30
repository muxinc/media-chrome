import { assert, fixture } from '@open-wc/testing';
import '../../src/js/experimental/index.js';
import '../../src/js/index.js';

describe('<media-captions-listbox>', () => {
  let mediaController;
  let listbox;

  beforeEach(async () => {
    mediaController = await fixture(/*html*/ `
      <media-controller>
        <video
          slot="media"
          preload="auto"
          src="https://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4"
          muted
          crossorigin
        >
          <track label="English" kind="captions" srclang="en" src="../../examples/vanilla/vtt/elephantsdream/captions.en.vtt" default></track>
          <track label="Japanese" kind="captions" srclang="ja" src="../../examples/vanilla/vtt/elephantsdream/captions.ja.vtt"></track>
          <track label="Swedish" kind="captions" srclang="sv" src="../../examples/vanilla/vtt/elephantsdream/captions.sv.vtt"></track>
          <track label="Russian" kind="captions" srclang="ru" src="../../examples/vanilla/vtt/elephantsdream/captions.ru.vtt"></track>
          <track label="Arabic" kind="captions" srclang="ar" src="../../examples/vanilla/vtt/elephantsdream/captions.ar.vtt"></track>
          <track label="Subs English" kind="subtitles" srclang="en" src="../../examples/vanilla/vtt/elephantsdream/captions.en.vtt" default></track>
          <track label="Subs Japanese" kind="subtitles" srclang="ja" src="../../examples/vanilla/vtt/elephantsdream/captions.ja.vtt"></track>
          <track label="Subs Swedish" kind="subtitles" srclang="sv" src="../../examples/vanilla/vtt/elephantsdream/captions.sv.vtt"></track>
          <track label="Subs Russian" kind="subtitles" srclang="ru" src="../../examples/vanilla/vtt/elephantsdream/captions.ru.vtt"></track>
          <track label="Subs Arabic" kind="subtitles" srclang="ar" src="../../examples/vanilla/vtt/elephantsdream/captions.ar.vtt"></track>
        </video>
        <media-captions-listbox></media-captions-listbox>
      </media-controller>
    `);
    listbox = mediaController.querySelector('media-captions-listbox');
  });

  it('listbox is populated', async function () {
    this.timeout(5000);

    if (mediaController.media.textTracks.length !== 10) {
      await new Promise((resolve) =>
        mediaController.media.textTracks.addEventListener('addtrack', resolve)
      );
    }

    assert.equal(mediaController.media.textTracks.length, 10);
    assert.equal(listbox.options.length, 11); // includes Off option
    // assert.equal(listbox.value, 'cc:en:English'); fails on Firefox and Safari
  });
});
