import { assert, expect, fixture, waitUntil } from '@open-wc/testing';
import '../../src/js/index.js';
import { MediaErrorDialog } from '../../src/js/media-error-dialog.js';

describe('<media-error-dialog>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaErrorDialog>(
      `<media-error-dialog></media-error-dialog>`
    );
    expect(el).shadowDom.to.be.accessible();
  });

  it('should open on media error', async () => {
    const el = await fixture<MediaErrorDialog>(
      `<media-error-dialog></media-error-dialog>`
    );
    el.mediaErrorCode = 3;
    await waitUntil(() => el.open, 'dialog opened');
    assert(el.open, 'dialog opened');
  });

  it('should close on media error cleared', async () => {
    const el = await fixture<MediaErrorDialog>(
      `<media-error-dialog></media-error-dialog>`
    );
    el.mediaErrorCode = 3;
    await waitUntil(() => el.open, 'dialog opened');
    el.mediaErrorCode = 0;
    await waitUntil(() => !el.open, 'dialog closed');
    assert(!el.open, 'dialog closed');
  });
});
