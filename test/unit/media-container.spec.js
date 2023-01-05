import { spy } from 'sinon';
import { fixture, assert, aTimeout } from '@open-wc/testing';
import '../../src/js/index.js';

describe('<media-container>', () => {

  it('calls media callbacks', async () => {
    const mediaController = await fixture(`
      <media-controller></media-controller>
    `);

    spy(mediaController, 'handleMediaUpdated');
    spy(mediaController, 'mediaSetCallback');
    spy(mediaController, 'mediaUnsetCallback');

    const video = await fixture(`
      <video slot="media"></video>
    `);

    mediaController.append(video);
    // MutationObserver is async, wait a bit
    await aTimeout(10);

    assert.equal(mediaController.handleMediaUpdated.callCount, 1);
    assert.equal(mediaController.mediaSetCallback.callCount, 1);
    assert.equal(mediaController.mediaUnsetCallback.callCount, 0);

    video.remove();
    // MutationObserver is async, wait a bit
    await aTimeout(10);

    assert.equal(mediaController.handleMediaUpdated.callCount, 1);
    assert.equal(mediaController.mediaSetCallback.callCount, 1);
    assert.equal(mediaController.mediaUnsetCallback.callCount, 1);
  });

  it('has a media getter to the slotted media element', async () => {
    const mediaController = await fixture(`
      <media-controller></media-controller>
    `);
    const video = await fixture(`
      <video slot="media"></video>
    `);
    mediaController.append(video);

    assert.equal(mediaController.media, video);
    video.remove();
    assert.equal(mediaController.media, null);
  });

});
