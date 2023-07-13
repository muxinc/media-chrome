import { spy } from 'sinon';
import { fixture, assert, aTimeout } from '@open-wc/testing';
import MediaContainer from '../../src/js/media-container.js';

describe('<media-container>', () => {
  // NOTE: Although MediaContainer isn't designed for independent use, registering it
  // here to test behavior independent of <media-controller>
  before(async () => {
    customElements.define('media-container', MediaContainer);
    await customElements.whenDefined('media-container');
  });

  it('calls media callbacks', async () => {
    const mediaContainer = await fixture(`
      <media-container></media-container>
    `);

    spy(mediaContainer, 'handleMediaUpdated');
    spy(mediaContainer, 'mediaSetCallback');
    spy(mediaContainer, 'mediaUnsetCallback');

    const video = await fixture(`
      <video slot="media"></video>
    `);

    mediaContainer.append(video);
    // MutationObserver is async, wait a bit
    await aTimeout(10);

    assert.equal(mediaContainer.handleMediaUpdated.callCount, 1);
    assert.equal(mediaContainer.mediaSetCallback.callCount, 1);
    assert.equal(mediaContainer.mediaUnsetCallback.callCount, 0);

    video.remove();
    // MutationObserver is async, wait a bit
    await aTimeout(10);

    assert.equal(mediaContainer.handleMediaUpdated.callCount, 1);
    assert.equal(mediaContainer.mediaSetCallback.callCount, 1);
    assert.equal(mediaContainer.mediaUnsetCallback.callCount, 1);
  });

  it('has a media getter to the slotted media element', async () => {
    const mediaContainer = await fixture(`
      <media-container></media-container>
    `);
    const video = await fixture(`
      <video slot="media"></video>
    `);
    mediaContainer.append(video);

    assert.equal(mediaContainer.media, video);
    video.remove();
    assert.equal(mediaContainer.media, null);
  });

});
