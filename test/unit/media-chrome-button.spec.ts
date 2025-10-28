import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../../src/js/media-chrome-button.js';
import MediaChromeButton from '../../src/js/media-chrome-button.js';

describe('<media-chrome-button>', () => {
  let el: MediaChromeButton;

  beforeEach(async () => {
    el = await fixture(html`<media-chrome-button></media-chrome-button>`);
  });

  it('passes accessibility audit', async () => {
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('default behavior', () => {
    it('renders a slot', () => {
      const slot = el.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });

    it('has role="button"', () => {
      expect(el.getAttribute('role')).to.equal('button');
    });

    it('clicking triggers handleClick', () => {
      const handleClickSpy = sinon.spy(el, 'handleClick');
      el.click();
      expect(handleClickSpy.calledOnce).to.be.true;
      handleClickSpy.restore();
    });
  });

  describe('disabled attribute', () => {
    it('clicking does not trigger handleClick when disabled', () => {
      el.disabled = true;
      const handleClickSpy = sinon.spy(el, 'handleClick');
      el.click();
      expect(handleClickSpy.called).to.be.false;
      handleClickSpy.restore();
    });

    it('clicking triggers handleClick after removing disabled', async () => {
      el.disabled = true;
      el.disabled = false;
      await new Promise(resolve => requestAnimationFrame(resolve));
      const handleClickSpy = sinon.spy(el, 'handleClick');
      el.click();
      expect(handleClickSpy.calledOnce).to.be.true;
      handleClickSpy.restore();
    });
  });

  describe('tooltip placement attribute', () => {
    it('updates tooltipEl.placement when attribute changes', async () => {
      el.setAttribute('tooltip-placement', 'top');
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(el.tooltipEl?.placement).to.equal('top');

      el.setAttribute('tooltip-placement', 'bottom');
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(el.tooltipEl?.placement).to.equal('bottom');
    });
  });

  describe('media controller attribute', () => {
    const mediaController = document.createElement('div');

    it('stores reference when media-controller attribute is set', async () => {
      el.setAttribute('media-controller', '');
      // @ts-ignore access private property
      el.mediaController = mediaController;
      await new Promise(resolve => requestAnimationFrame(resolve));
      // @ts-ignore
      expect(el.mediaController).to.equal(mediaController);
    });

    it('unassociates when media-controller attribute is removed', async () => {
      el.setAttribute('media-controller', '');
      // @ts-ignore access private property
      el.mediaController = mediaController;
      await new Promise(resolve => requestAnimationFrame(resolve));
      el.removeAttribute('media-controller');
      await new Promise(resolve => requestAnimationFrame(resolve));
      // @ts-ignore
      expect(el.mediaController).to.be.undefined;
    });
  });
});
