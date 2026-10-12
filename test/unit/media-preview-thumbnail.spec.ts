import { expect, fixture, waitUntil } from '@open-wc/testing';
import { spy } from 'sinon';
import {
  MediaStateReceiverAttributes,
  MediaUIAttributes,
} from '../../src/js/constants.js';

import '../../src/js/media-preview-thumbnail.js';
import MediaPreviewThumbnail from '../../src/js/media-preview-thumbnail.js';
import { getOrInsertCSSRule } from '../../src/js/utils/element-utils.js';

const { MEDIA_PREVIEW_IMAGE, MEDIA_PREVIEW_COORDS } = MediaUIAttributes;
const { MEDIA_CONTROLLER } = MediaStateReceiverAttributes;

// A 320x180 inline SVG storyboard so no network requests are made.
const STORYBOARD = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"></svg>'
)}`;

const hostStyle = (el: HTMLElement) =>
  getOrInsertCSSRule(el.shadowRoot, ':host').style;
const imgStyle = (el: HTMLElement) =>
  getOrInsertCSSRule(el.shadowRoot, 'img').style;
const img = (el: HTMLElement) => el.shadowRoot.querySelector('img');

describe('<media-preview-thumbnail>', () => {
  describe('mediaPreviewCoords', () => {
    it('is undefined without the attribute', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail></media-preview-thumbnail>`
      );
      expect(el.mediaPreviewCoords).to.equal(undefined);
    });

    it('parses whitespace separated coordinates into numbers', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail ${MEDIA_PREVIEW_COORDS}="10  20 160
        90"></media-preview-thumbnail>`
      );
      expect(el.mediaPreviewCoords).to.deep.equal([10, 20, 160, 90]);
    });

    it('serializes coordinates to the attribute', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail></media-preview-thumbnail>`
      );
      el.mediaPreviewCoords = [1, 2, 3, 4];
      expect(el.getAttribute(MEDIA_PREVIEW_COORDS)).to.equal('1 2 3 4');
      el.mediaPreviewCoords = undefined;
      expect(el.hasAttribute(MEDIA_PREVIEW_COORDS)).to.be.false;
    });
  });

  describe('mediaPreviewImage', () => {
    it('reflects the property to the attribute', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail></media-preview-thumbnail>`
      );
      expect(el.mediaPreviewImage).to.equal(null);
      el.mediaPreviewImage = STORYBOARD;
      expect(el.getAttribute(MEDIA_PREVIEW_IMAGE)).to.equal(STORYBOARD);
      el.mediaPreviewImage = undefined;
      expect(el.hasAttribute(MEDIA_PREVIEW_IMAGE)).to.be.false;
    });
  });

  describe('update', () => {
    it('does nothing without both an image and coords', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail ${MEDIA_PREVIEW_COORDS}="0 0 160 90"></media-preview-thumbnail>`
      );
      expect(img(el).hasAttribute('src')).to.be.false;
      expect(hostStyle(el).width).to.equal('');

      const el2 = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail ${MEDIA_PREVIEW_IMAGE}="${STORYBOARD}"></media-preview-thumbnail>`
      );
      expect(img(el2).hasAttribute('src')).to.be.false;
    });

    it('loads the image without its media fragment', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail></media-preview-thumbnail>`
      );
      el.setAttribute(MEDIA_PREVIEW_COORDS, '0 0 160 90');
      el.setAttribute(MEDIA_PREVIEW_IMAGE, `${STORYBOARD}#xywh=0,0,160,90`);
      expect(img(el).src).to.equal(STORYBOARD);
    });

    it('sizes the host to the tile at natural size when unconstrained', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail></media-preview-thumbnail>`
      );
      el.setAttribute(MEDIA_PREVIEW_IMAGE, STORYBOARD);
      el.setAttribute(MEDIA_PREVIEW_COORDS, '160 90 160 90');
      expect(hostStyle(el).width).to.equal('160px');
      expect(hostStyle(el).height).to.equal('90px');
      expect(hostStyle(el).getPropertyValue('max-width')).to.equal('initial');
      expect(imgStyle(el).transform).to.equal('translate(-160px, -90px)');
    });

    it('scales down to fit max-width/max-height, preserving aspect ratio', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail style="max-width: 80px; max-height: 80px"></media-preview-thumbnail>`
      );
      el.setAttribute(MEDIA_PREVIEW_IMAGE, STORYBOARD);
      el.setAttribute(MEDIA_PREVIEW_COORDS, '10 20 160 90');
      expect(hostStyle(el).width).to.equal('80px');
      expect(hostStyle(el).height).to.equal('45px');
      // When scaling down, min-* constraints are reset.
      expect(hostStyle(el).getPropertyValue('min-width')).to.equal('initial');
      expect(hostStyle(el).getPropertyPriority('min-width')).to.equal(
        'important'
      );
      expect(hostStyle(el).getPropertyValue('min-height')).to.equal('initial');
      expect(imgStyle(el).transform).to.equal('translate(-5px, -10px)');
    });

    it('scales up to satisfy min-width/min-height', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail style="min-width: 320px; min-height: 90px"></media-preview-thumbnail>`
      );
      el.setAttribute(MEDIA_PREVIEW_IMAGE, STORYBOARD);
      el.setAttribute(MEDIA_PREVIEW_COORDS, '10 20 160 90');
      expect(hostStyle(el).width).to.equal('320px');
      expect(hostStyle(el).height).to.equal('180px');
      // When scaling up, max-* constraints are reset.
      expect(hostStyle(el).getPropertyValue('max-width')).to.equal('initial');
      expect(hostStyle(el).getPropertyValue('max-height')).to.equal('initial');
      expect(imgStyle(el).transform).to.equal('translate(-20px, -40px)');
    });

    it('scales width and height independently in fill mode', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail style="--media-preview-thumbnail-object-fit: fill; max-width: 80px; max-height: 60px"></media-preview-thumbnail>`
      );
      el.setAttribute(MEDIA_PREVIEW_IMAGE, STORYBOARD);
      el.setAttribute(MEDIA_PREVIEW_COORDS, '160 90 160 90');
      expect(hostStyle(el).width).to.equal('80px');
      expect(hostStyle(el).height).to.equal('60px');
      expect(imgStyle(el).transform).to.equal('translate(-80px, -60px)');
    });

    it('sizes and shows the image once it loads', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail style="max-width: 80px; max-height: 80px"></media-preview-thumbnail>`
      );
      el.setAttribute(MEDIA_PREVIEW_COORDS, '0 0 160 90');
      el.setAttribute(MEDIA_PREVIEW_IMAGE, STORYBOARD);
      await waitUntil(() => el.imgWidth === 320, 'storyboard did not load');
      expect(el.imgWidth).to.equal(320);
      expect(el.imgHeight).to.equal(180);
      // Storyboard is scaled by the same 0.5 factor as the tile.
      expect(imgStyle(el).width).to.equal('160px');
      expect(imgStyle(el).height).to.equal('90px');
      expect(imgStyle(el).display).to.equal('block');
      expect(img(el).onload).to.equal(null);
    });

    it('moves to a new tile without reloading the same image', async () => {
      const el = await fixture<MediaPreviewThumbnail>(
        `<media-preview-thumbnail></media-preview-thumbnail>`
      );
      el.setAttribute(MEDIA_PREVIEW_COORDS, '0 0 160 90');
      el.setAttribute(MEDIA_PREVIEW_IMAGE, STORYBOARD);
      await waitUntil(() => el.imgWidth === 320, 'storyboard did not load');

      el.setAttribute(MEDIA_PREVIEW_COORDS, '160 90 160 90');
      expect(img(el).onload).to.equal(null);
      expect(imgStyle(el).transform).to.equal('translate(-160px, -90px)');
      expect(imgStyle(el).width).to.equal('320px');
    });
  });

  describe('mediacontroller association', () => {
    let container: HTMLElement;
    let ctrlA: HTMLElement & { associateElement?; unassociateElement? };
    let ctrlB: HTMLElement & { associateElement?; unassociateElement? };

    beforeEach(async () => {
      container = await fixture(
        `<div><div id="ctrl-a"></div><div id="ctrl-b"></div></div>`
      );
      ctrlA = container.querySelector('#ctrl-a');
      ctrlB = container.querySelector('#ctrl-b');
      [ctrlA, ctrlB].forEach((ctrl) => {
        ctrl.associateElement = spy();
        ctrl.unassociateElement = spy();
      });
    });

    it('associates on connect and unassociates on disconnect', () => {
      const el = document.createElement('media-preview-thumbnail');
      el.setAttribute(MEDIA_CONTROLLER, 'ctrl-a');
      expect(ctrlA.associateElement.called).to.be.false;

      container.append(el);
      expect(ctrlA.associateElement.calledOnceWith(el)).to.be.true;

      el.remove();
      expect(ctrlA.unassociateElement.calledOnceWith(el)).to.be.true;
    });

    it('switches controllers when the attribute changes while connected', () => {
      const el = document.createElement('media-preview-thumbnail');
      el.setAttribute(MEDIA_CONTROLLER, 'ctrl-a');
      container.append(el);

      el.setAttribute(MEDIA_CONTROLLER, 'ctrl-b');
      expect(ctrlA.unassociateElement.calledOnceWith(el)).to.be.true;
      expect(ctrlB.associateElement.calledOnceWith(el)).to.be.true;

      el.removeAttribute(MEDIA_CONTROLLER);
      expect(ctrlB.unassociateElement.calledOnceWith(el)).to.be.true;
    });
  });
});
