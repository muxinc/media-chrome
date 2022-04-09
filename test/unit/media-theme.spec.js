import { spy } from 'sinon';
import { fixture, assert, waitUntil } from '@open-wc/testing';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants';
import '../../src/js/index.js';
import '../../src/js/themes/media-theme-netflix.js';

describe('<media-theme/>', () => {
  it('can change media between media themes and media controllers', async () => {
    const theme1 = await fixture(`
      <media-theme-netflix>
        <video slot="media" muted src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/low.mp4"></video>
      </media-theme-netflix>
    `);

    const media = theme1.querySelector('[slot="media"]');
    await media.play();

    assert(
      theme1.shadowRoot
        .querySelector('media-controller')
        .hasAttribute('media-current-time')
    );

    const theme2 = await fixture(`
      <media-theme-netflix></media-theme-netflix>
    `);

    theme2.append(media);

    await waitUntil(() =>
      theme1.shadowRoot
        .querySelector('media-controller')
        .hasAttribute('media-paused')
    );

    assert(
      theme1.shadowRoot
        .querySelector('media-controller')
        .hasAttribute('media-paused'),
      'should be reset to paused state on mediaUnsetCallback'
    );

    await waitUntil(() =>
      theme2.shadowRoot
        .querySelector('media-controller')
        .hasAttribute('media-current-time')
    );

    assert(
      theme2.shadowRoot
        .querySelector('media-controller')
        .hasAttribute('media-current-time'),
      'should have a media-current-time attribute on mediaSetCallback'
    );
  });
});
