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

  describe('poster visibility', () => {
    let mediaContainer: MediaContainer;
    const posterDisplay = () =>
      getComputedStyle(
        mediaContainer.shadowRoot.querySelector('slot[name=poster]')
      ).display;

    beforeEach(async () => {
      mediaContainer = await fixture<MediaContainer>(`
        <media-container>
          <img slot="poster" alt="">
        </media-container>
      `);
    });

    it('shows the poster before playback starts', () => {
      assert.notEqual(posterDisplay(), 'none');
      mediaContainer.setAttribute('mediastreamtype', 'on-demand');
      mediaContainer.setAttribute('mediacurrenttime', '0');
      assert.notEqual(posterDisplay(), 'none');
    });

    it('hides the poster once the media has played', () => {
      mediaContainer.setAttribute('mediahasplayed', '');
      mediaContainer.setAttribute('mediacurrenttime', '0');
      assert.equal(posterDisplay(), 'none');
    });

    it('hides the poster when on-demand current time moves off 0', () => {
      mediaContainer.setAttribute('mediastreamtype', 'on-demand');
      mediaContainer.setAttribute('mediacurrenttime', '2.5');
      assert.equal(posterDisplay(), 'none');

      mediaContainer.setAttribute('mediacurrenttime', '0');
      assert.notEqual(posterDisplay(), 'none');
    });

    it('keeps the poster for live or unknown streams until played', () => {
      mediaContainer.setAttribute('mediacurrenttime', '120');
      assert.notEqual(posterDisplay(), 'none', 'no stream type');

      mediaContainer.setAttribute('mediastreamtype', 'unknown');
      assert.notEqual(posterDisplay(), 'none', 'unknown stream type');

      mediaContainer.setAttribute('mediastreamtype', 'live');
      assert.notEqual(posterDisplay(), 'none', 'live stream type');

      mediaContainer.setAttribute('mediahasplayed', '');
      assert.equal(posterDisplay(), 'none', 'hidden after play');
    });

    it('keeps the poster visible in audio mode', () => {
      mediaContainer.setAttribute('audio', '');
      mediaContainer.setAttribute('mediastreamtype', 'on-demand');
      mediaContainer.setAttribute('mediacurrenttime', '2.5');
      assert.notEqual(posterDisplay(), 'none');
    });
  });
});
