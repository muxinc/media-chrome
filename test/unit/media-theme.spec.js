import { fixture, assert, waitUntil } from '@open-wc/testing';
import '../../src/js/media-theme-element.js';
import '../../src/js/index.js';

describe('<media-theme>', () => {
  it('can change media between media themes and media controllers', async () => {
    await fixture(`
      <template id="netflix">
        <media-controller>
          <slot name="media" slot="media"></slot>
        </media-controller>
      </template>
    `);
    const theme1 = await fixture(`
      <media-theme template="netflix">
        <video slot="media" muted src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/low.mp4"></video>
      </media-theme>
    `);

    const media = theme1.querySelector('[slot="media"]');
    await media.play();

    assert(
      theme1.shadowRoot
        .querySelector('media-controller')
        .hasAttribute('media-current-time')
    );

    const theme2 = await fixture(`
      <media-theme template="netflix"></media-theme>
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

  it('DOM fragments are cached in `if` directives if condition stays the same', async () => {
    await fixture(`
      <template id="mytheme">
        <template if="hasText">
          <h1>{{text}}</h1>
        </template>
        <template if="text == 'Hello world'">
          <hello-world></hello-world>
        </template>
      </template>
    `);

    const theme1 = await fixture(`
      <media-theme template="mytheme" has-text="yes" text="Hello"></media-theme>
    `);

    const h1 = theme1.shadowRoot.querySelector('h1');
    assert.equal(h1.textContent, 'Hello');

    theme1.setAttribute('has-text', 'true');
    theme1.setAttribute('text', 'Hello world');

    // MutationObserver is async, wait 1 tick.
    await Promise.resolve();

    assert.equal(h1.textContent, 'Hello world');
    assert.equal(h1, theme1.shadowRoot.querySelector('h1'), 'h1 is the same element');
    assert(
      theme1.shadowRoot.querySelector('hello-world'),
      'caused a re-render and <hello-world> is available'
    );
  });
});
