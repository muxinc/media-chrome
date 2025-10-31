import { expect, fixture, html } from '@open-wc/testing';
import '../../src/js/media-poster-image.js';
import MediaPosterImage from '../../src/js/media-poster-image.js';
import { Attributes } from '../../src/js/media-poster-image.js';

describe('<media-poster-image>', () => {
  it('passes accessibility audit', async () => {
    const el = await fixture<MediaPosterImage>(
      html`<media-poster-image></media-poster-image>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('default state', () => {
    let el: MediaPosterImage;

    beforeEach(async () => {
      el = await fixture<MediaPosterImage>(
        html`<media-poster-image></media-poster-image>`
      );
    });

    it('should render an <img> element in shadow DOM', () => {
      const img = el.shadowRoot?.querySelector('img#image');
      expect(img).to.exist;
    });

    it('should have no src or background image by default', () => {
      const img = el.shadowRoot?.querySelector('img#image') as HTMLImageElement;
      expect(img.getAttribute('src')).to.be.null;
      expect(img.style.backgroundImage).to.equal('');
    });
  });

  describe('src attribute', () => {
    let el: MediaPosterImage;

    beforeEach(async () => {
      el = await fixture<MediaPosterImage>(
        html`<media-poster-image src="https://example.com/poster.jpg"></media-poster-image>`
      );
    });

    it('should set img[src] when src attribute is present', () => {
      const img = el.shadowRoot?.querySelector('img#image') as HTMLImageElement;
      expect(img.getAttribute('src')).to.equal('https://example.com/poster.jpg');
    });

    it('should update img[src] when src changes', async () => {
      el.setAttribute(Attributes.SRC, 'https://example.com/new-poster.jpg');
      await new Promise(r => requestAnimationFrame(r));
      const img = el.shadowRoot?.querySelector('img#image') as HTMLImageElement;
      expect(img.getAttribute('src')).to.equal('https://example.com/new-poster.jpg');
    });

    it('should remove img[src] when src is removed', async () => {
      el.removeAttribute(Attributes.SRC);
      await new Promise(r => requestAnimationFrame(r));
      const img = el.shadowRoot?.querySelector('img#image') as HTMLImageElement;
      expect(img.hasAttribute('src')).to.be.false;
    });
  });

  describe('placeholdersrc attribute', () => {
    let el: MediaPosterImage;

    beforeEach(async () => {
      el = await fixture<MediaPosterImage>(
        html`<media-poster-image
          placeholdersrc="https://example.com/placeholder.png"
        ></media-poster-image>`
      );
    });

    it('should set background-image on img when placeholdersrc is present', () => {
      const img = el.shadowRoot?.querySelector('img#image') as HTMLImageElement;
      expect(img.style.backgroundImage).to.include('placeholder.png');
    });

    it('should update background-image when placeholdersrc changes', async () => {
      el.setAttribute(Attributes.PLACEHOLDER_SRC, 'https://example.com/new-placeholder.png');
      await new Promise(r => requestAnimationFrame(r));
      const img = el.shadowRoot?.querySelector('img#image') as HTMLImageElement;
      expect(img.style.backgroundImage).to.include('new-placeholder.png');
    });

    it('should remove background-image when placeholdersrc is removed', async () => {
      el.removeAttribute(Attributes.PLACEHOLDER_SRC);
      await new Promise(r => requestAnimationFrame(r));
      const img = el.shadowRoot?.querySelector('img#image') as HTMLImageElement;
      expect(img.style.backgroundImage).to.equal('');
    });
  });

  describe('property bindings', () => {
    let el: MediaPosterImage;

    beforeEach(async () => {
      el = await fixture<MediaPosterImage>(html`<media-poster-image></media-poster-image>`);
    });

    it('should reflect src property to attribute', async () => {
      el.src = 'https://example.com/foo.jpg';
      await new Promise(r => requestAnimationFrame(r));
      expect(el.getAttribute('src')).to.equal('https://example.com/foo.jpg');
    });

    it('should reflect placeholdersrc property to attribute', async () => {
      el.placeholderSrc = 'https://example.com/blur.png';
      await new Promise(r => requestAnimationFrame(r));
      expect(el.getAttribute('placeholdersrc')).to.equal('https://example.com/blur.png');
    });
  });
});
