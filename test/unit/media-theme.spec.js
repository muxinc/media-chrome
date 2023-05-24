import { fixture, assert, waitUntil } from '@open-wc/testing';
import '../../src/js/media-theme-element.mjs';
import '../../src/js/index.mjs';
import { MediaUIAttributes } from '../../src/js/constants.mjs';

describe('<media-theme>', () => {
  it(`<media-theme> with template attribute works w/ delayed document append`, async () => {

    const template = document.createElement('template');
    template.id = 'not-yet';
    template.innerHTML = /*html*/`
      <media-controller>
        <slot name="media" slot="media"></slot>
        <media-control-bar>
          <media-play-button></media-play-button>
        </media-control-bar>
      </media-controller>
    `;

    const theme = document.createElement('media-theme');
    theme.setAttribute('template', 'not-yet');

    document.body.append(template, theme);

    assert(theme.shadowRoot.innerHTML.includes('media-play-button'), 'shadow root contains a play button');
  });

  it(`<media-theme> w/ template HTML file URL doesn't duplicate fetch/render `, async function() {
    this.timeout(5000);

    const theme = document.createElement('media-theme');
    theme.setAttribute('template', 'https://gist.githubusercontent.com/luwes/5812c419830fee000d3463c496d18e19/raw/c295dad03a33ea8ad93870fa55de40a3308c8f45/media-theme-micro.html');

    await waitUntil(() => theme.shadowRoot.querySelector('media-controller'), 5000);
    const mediaController = theme.shadowRoot.querySelector('media-controller');

    document.body.append(theme);

    assert.equal(
      mediaController,
      theme.shadowRoot.querySelector('media-controller'),
      'should have not re-rendered and media-controller stayed the same'
    );
  });

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
        .hasAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME)
    );

    const theme2 = await fixture(`
      <media-theme template="netflix"></media-theme>
    `);

    theme2.append(media);

    await waitUntil(() =>
      theme1.shadowRoot
        .querySelector('media-controller')
        .hasAttribute(MediaUIAttributes.MEDIA_PAUSED)
    );

    assert(
      theme1.shadowRoot
        .querySelector('media-controller')
        .hasAttribute(MediaUIAttributes.MEDIA_PAUSED),
      'should be reset to paused state on mediaUnsetCallback'
    );

    await waitUntil(() =>
      theme2.shadowRoot
        .querySelector('media-controller')
        .hasAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME)
    );

    assert(
      theme2.shadowRoot
        .querySelector('media-controller')
        .hasAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME),
      'should have a mediacurrenttime attribute on mediaSetCallback'
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

  it('registers media-controller and non-child controls state receivers', async () => {
    await fixture(`
      <template id="decoupled-controller">
        <media-controller id="ctrl">
          <slot name="media" slot="media"></slot>
        </media-controller>
        <media-play-button mediacontroller="ctrl"></media-play-button>
      </template>
    `);

    const theme = await fixture(`
      <media-theme template="decoupled-controller">
        <video slot="media" muted src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/low.mp4"></video>
      </media-theme>
    `);
    const mediaController = theme.mediaController;
    const playButton = theme.shadowRoot.querySelector('media-play-button');

    // Also includes the media-gesture-receiver by default
    assert.equal(mediaController.mediaStateReceivers.length, 3);
    assert(mediaController.mediaStateReceivers.includes(mediaController), 'registers itself');
    assert(mediaController.mediaStateReceivers.includes(playButton), 'registers play button');

    playButton.remove();

    assert.equal(mediaController.mediaStateReceivers.length, 2);
    assert(!mediaController.mediaStateReceivers.includes(playButton), 'unregisters play button');
  });
});
