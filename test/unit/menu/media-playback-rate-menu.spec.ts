import { assert, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-playback-rate-menu.js';
import '../../../src/js/menu/media-playback-rate-menu-button.js';
import { MediaPlaybackRateMenu } from '../../../src/js/menu/media-playback-rate-menu.js';
import { AttributeTokenList } from '../../../src/js/utils/attribute-token-list.js';
import { MediaUIEvents } from '../../../src/js/constants.js';

const labels = (menu: MediaPlaybackRateMenu) =>
  menu.items.map((item) => item.textContent.trim());

const checkedValues = (menu: MediaPlaybackRateMenu) =>
  menu.checkedItems.map((item) => item.value);

describe('<media-playback-rate-menu>', () => {
  let menu: MediaPlaybackRateMenu;

  beforeEach(async () => {
    menu = await fixture<MediaPlaybackRateMenu>(
      html`<media-playback-rate-menu></media-playback-rate-menu>`
    );
  });

  it('renders the default rates with 1x checked', () => {
    assert.instanceOf(menu.rates, AttributeTokenList);
    assert.equal(menu.rates.toString(), '1 1.2 1.5 1.7 2');
    assert.equal(menu.mediaPlaybackRate, 1);
    assert.deepEqual(labels(menu), ['1x', '1.2x', '1.5x', '1.7x', '2x']);
    assert.deepEqual(checkedValues(menu), ['1']);
  });

  it('checks the item matching mediaplaybackrate', () => {
    menu.setAttribute('mediaplaybackrate', '1.5');
    assert.equal(menu.mediaPlaybackRate, 1.5);
    assert.deepEqual(checkedValues(menu), ['1.5']);
  });

  it('adds the current rate to the list when it is not one of the rates', () => {
    menu.mediaPlaybackRate = 0.75;
    assert.equal(menu.getAttribute('mediaplaybackrate'), '0.75');
    assert.deepEqual(labels(menu), [
      '0.75x',
      '1x',
      '1.2x',
      '1.5x',
      '1.7x',
      '2x',
    ]);
    assert.deepEqual(checkedValues(menu), ['0.75']);
  });

  it('normalizes float drift in the playback rate', () => {
    // Safari can report 1.15 as 1.1499999999999999.
    menu.setAttribute('rates', '1 1.15 2');
    menu.setAttribute('mediaplaybackrate', '1.1499999999999999');
    assert.deepEqual(labels(menu), ['1x', '1.15x', '2x']);
    assert.deepEqual(checkedValues(menu), ['1.15']);
  });

  it('renders custom rates from the rates attribute, sorted and deduplicated', () => {
    menu.setAttribute('rates', '2 0.5 1 0.5');
    assert.deepEqual(labels(menu), ['0.5x', '1x', '2x']);
    assert.deepEqual(checkedValues(menu), ['1']);
  });

  it('accepts rates as an array or a string', () => {
    menu.rates = [0.25, 3];
    assert.equal(menu.getAttribute('rates'), '0.25 3');
    assert.deepEqual(labels(menu), ['0.25x', '1x', '3x']);

    menu.rates = '1 4';
    assert.equal(menu.getAttribute('rates'), '1 4');
    assert.deepEqual(labels(menu), ['1x', '4x']);
  });

  it('renders rates set before connecting', async () => {
    const el = await fixture<MediaPlaybackRateMenu>(
      html`<media-playback-rate-menu
        rates="0.5 1 1.5"
        mediaplaybackrate="1.5"
      ></media-playback-rate-menu>`
    );
    assert.deepEqual(labels(el), ['0.5x', '1x', '1.5x']);
    assert.deepEqual(checkedValues(el), ['1.5']);
  });

  it('dispatches a playback rate request when a rate is selected', async () => {
    const container = await fixture<HTMLElement>(html`
      <div><media-playback-rate-menu></media-playback-rate-menu></div>
    `);
    const nested = container.querySelector(
      'media-playback-rate-menu'
    ) as MediaPlaybackRateMenu;
    const handler = spy();
    container.addEventListener(
      MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
      handler
    );

    nested.items.find((item) => item.value === '2').click();

    assert.equal(handler.callCount, 1);
    const event = handler.firstCall.args[0] as CustomEvent;
    assert.equal(event.detail, '2');
    assert.isTrue(event.bubbles);
    assert.isTrue(event.composed);
    assert.deepEqual(checkedValues(nested), ['2']);
  });

  it('does not dispatch when the checked rate is clicked again', () => {
    const handler = spy();
    menu.addEventListener(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, handler);
    menu.items.find((item) => item.value === '1').click();
    assert.equal(handler.callCount, 0);
  });

  it('stops dispatching requests after being disconnected', () => {
    const handler = spy();
    menu.addEventListener(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, handler);
    menu.remove();
    menu.value = '2';
    assert.equal(menu.value, '2');
    assert.equal(handler.callCount, 0);
  });

  it('resolves the anchor element to the playback rate menu button in the media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-playback-rate-menu
          anchor="auto"
          hidden
        ></media-playback-rate-menu>
        <media-playback-rate-menu-button></media-playback-rate-menu-button>
      </media-controller>
    `);
    const nested = controller.querySelector(
      'media-playback-rate-menu'
    ) as MediaPlaybackRateMenu;
    assert.equal(
      nested.anchorElement,
      controller.querySelector('media-playback-rate-menu-button')
    );
  });
});
