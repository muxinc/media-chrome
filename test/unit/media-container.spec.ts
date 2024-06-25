import { aTimeout, assert, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../src/js/media-container.js';
import { MediaContainer } from '../../src/js/media-container.js';

describe('<media-container>', () => {
  it('calls media callbacks', async () => {
    const mediaContainer = await fixture<MediaContainer>(`
      <media-container></media-container>
    `);

    const handleMediaUpdated = spy(mediaContainer, 'handleMediaUpdated');
    const mediaSetCallback = spy(mediaContainer, 'mediaSetCallback');
    const mediaUnsetCallback = spy(mediaContainer, 'mediaUnsetCallback');

    const video = await fixture(`
      <video slot="media"></video>
    `);

    mediaContainer.append(video);
    // MutationObserver is async, wait a bit
    await aTimeout(10);

    assert.equal(handleMediaUpdated.callCount, 1);
    assert.equal(mediaSetCallback.callCount, 1);
    assert.equal(mediaUnsetCallback.callCount, 0);

    video.remove();
    // MutationObserver is async, wait a bit
    await aTimeout(10);

    assert.equal(handleMediaUpdated.callCount, 1);
    assert.equal(mediaSetCallback.callCount, 1);
    assert.equal(mediaUnsetCallback.callCount, 1);
  });

  it('has a media getter to the slotted media element', async () => {
    const mediaContainer = await fixture<MediaContainer>(`
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
