import { fixture, assert } from '@open-wc/testing';
import '../../src/js/index.js';

describe('<media-controller>', () => {

  it('associates itself to observe for state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller></media-controller>
    `);
    assert.equal(mediaController.associatedElementSubscriptions.size, 1);
    assert(mediaController.associatedElementSubscriptions.has(mediaController));
  });

  it('associates non-child elements to observe for state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const playButton = await fixture(`
      <media-play-button media-controller="ctrl"></media-play-button>
    `);
    assert.equal(mediaController.associatedElementSubscriptions.size, 2);
    assert(mediaController.associatedElementSubscriptions.has(playButton));
  });

  it('registers itself and child state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller>
        <media-play-button></media-play-button>
      </media-controller>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(mediaController.mediaStateReceivers.indexOf(mediaController) >= 0, 'registers itself');
    const playButton = mediaController.querySelector('media-play-button');
    assert(mediaController.mediaStateReceivers.indexOf(playButton) >= 0, 'registers play button');
  });

  it('registers itself and non-child state receivers', async () => {
    const mediaController = await fixture(`
      <media-controller id="ctrl"></media-controller>
    `);
    const playButton = await fixture(`
      <media-play-button media-controller="ctrl"></media-play-button>
    `);

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(mediaController.mediaStateReceivers.indexOf(mediaController) >= 0, 'registers itself');
    assert(mediaController.mediaStateReceivers.indexOf(playButton) >= 0, 'registers play button');
  });


});
