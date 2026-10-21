import { assert, expect, fixture, waitUntil } from '@open-wc/testing';
import '../../src/js/index.js';
import { MediaErrorDialog } from '../../src/js/media-error-dialog.js';

const markup = '"><img src="x" onerror="window.__errorDialogMarkupRan = true">';
const escapedMarkup =
  '&quot;&gt;&lt;img src=&quot;x&quot; onerror=&quot;window.__errorDialogMarkupRan = true&quot;&gt;';

describe('<media-error-dialog>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaErrorDialog>(
      `<media-error-dialog></media-error-dialog>`
    );
    await expect(el).shadowDom.to.be.accessible();
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

  it('renders the default title and message for a known code', async () => {
    const el = await fixture<MediaErrorDialog>(
      `<media-error-dialog mediaerrorcode="2"></media-error-dialog>`
    );
    const content = el.shadowRoot.querySelector('#content') as HTMLSlotElement;
    assert.equal(content.name, 'error-2');
    assert.equal(content.querySelector('h3').textContent, 'Network Error');
    assert.equal(
      content.querySelector('p').textContent,
      'A network error caused the media download to fail.'
    );
  });

  describe('attribute values as text', () => {
    beforeEach(() => {
      delete (window as any).__errorDialogMarkupRan;
    });

    const assertNoMarkup = (el: MediaErrorDialog) => {
      assert.equal(el.shadowRoot.querySelectorAll('img').length, 0);
      assert.notOk((window as any).__errorDialogMarkupRan);
    };

    it('renders the message attribute as text on first render', async () => {
      const el = await fixture<MediaErrorDialog>(
        `<media-error-dialog mediaerrorcode="6" mediaerrormessage="${escapedMarkup}"></media-error-dialog>`
      );
      assertNoMarkup(el);
      assert.equal(el.shadowRoot.querySelector('p').textContent, markup);
    });

    it('renders the message attribute as text after a change', async () => {
      const el = await fixture<MediaErrorDialog>(
        `<media-error-dialog></media-error-dialog>`
      );
      el.mediaErrorMessage = markup;
      el.mediaErrorCode = 6;
      await waitUntil(() => el.open, 'dialog opened');
      assertNoMarkup(el);
      assert.equal(el.shadowRoot.querySelector('p').textContent, markup);
    });

    it('does not parse the code attribute into the template', async () => {
      const el = await fixture<MediaErrorDialog>(
        `<media-error-dialog mediaerrorcode="6${escapedMarkup}"></media-error-dialog>`
      );
      assertNoMarkup(el);
      assert.equal(
        el.shadowRoot.querySelectorAll('slot[name^="error-"]').length,
        el.shadowRoot.querySelectorAll('slot').length
      );
    });

    it('renders the mediaError property values as text', async () => {
      const el = await fixture<MediaErrorDialog>(
        `<media-error-dialog></media-error-dialog>`
      );
      el.mediaError = { code: markup as any, message: markup };
      el.mediaErrorCode = 6;
      await waitUntil(() => el.open, 'dialog opened');
      assertNoMarkup(el);
      assert.equal(
        el.shadowRoot.querySelector('h3').textContent,
        `Error ${markup}`
      );
      assert.equal(el.shadowRoot.querySelector('p').textContent, markup);
    });
  });

  it('renders markup returned by an overridden formatErrorMessage', async () => {
    class LinkErrorDialog extends MediaErrorDialog {
      static formatErrorMessage = () =>
        '<p>See <a href="https://example.com/help">help</a></p>';
    }
    customElements.define('link-error-dialog', LinkErrorDialog);

    const el = await fixture<LinkErrorDialog>(
      `<link-error-dialog></link-error-dialog>`
    );
    el.mediaErrorCode = 6;
    await waitUntil(() => el.open, 'dialog opened');
    const link = el.shadowRoot.querySelector('a');
    assert.equal(link?.getAttribute('href'), 'https://example.com/help');
  });
});
