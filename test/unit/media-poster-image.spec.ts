import { expect, fixture } from '@open-wc/testing';

import '../../src/js/media-poster-image.js';
import MediaPosterImage, {
  Attributes,
} from '../../src/js/media-poster-image.js';

// Inline data URIs so no network requests are made.
const POSTER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

describe('<media-poster-image>', () => {
  it('renders a decorative image in its shadow root', async () => {
    const el = await fixture<MediaPosterImage>(
      `<media-poster-image></media-poster-image>`
    );
    expect(el.image).to.equal(el.shadowRoot.querySelector('#image'));
    expect(el.image.getAttribute('aria-hidden')).to.equal('true');
    expect(el.image.getAttribute('part')).to.equal('poster img');
    expect(el.image.hasAttribute('src')).to.be.false;
    expect(el.image.style.backgroundImage).to.equal('');
  });

  it('is not interactive', async () => {
    const el = await fixture<MediaPosterImage>(
      `<media-poster-image></media-poster-image>`
    );
    expect(getComputedStyle(el).pointerEvents).to.equal('none');
  });

  describe('src', () => {
    it('forwards the src attribute to the image', async () => {
      const el = await fixture<MediaPosterImage>(
        `<media-poster-image src="${POSTER}"></media-poster-image>`
      );
      expect(el.src).to.equal(POSTER);
      expect(el.image.getAttribute('src')).to.equal(POSTER);
    });

    it('removes the image src when the attribute is removed', async () => {
      const el = await fixture<MediaPosterImage>(
        `<media-poster-image src="${POSTER}"></media-poster-image>`
      );
      el.removeAttribute(Attributes.SRC);
      expect(el.image.hasAttribute('src')).to.be.false;
    });

    it('reflects the src property to the attribute and image', async () => {
      const el = await fixture<MediaPosterImage>(
        `<media-poster-image></media-poster-image>`
      );
      expect(el.src).to.equal(null);
      el.src = POSTER;
      expect(el.getAttribute(Attributes.SRC)).to.equal(POSTER);
      expect(el.image.getAttribute('src')).to.equal(POSTER);
      el.src = undefined;
      expect(el.hasAttribute(Attributes.SRC)).to.be.false;
      expect(el.image.hasAttribute('src')).to.be.false;
    });
  });

  describe('placeholdersrc', () => {
    it('sets the placeholder as the image background', async () => {
      const el = await fixture<MediaPosterImage>(
        `<media-poster-image placeholdersrc="${PLACEHOLDER}"></media-poster-image>`
      );
      expect(el.placeholderSrc).to.equal(PLACEHOLDER);
      expect(el.image.style.backgroundImage).to.include(PLACEHOLDER);
      expect(el.image.style.backgroundImage).to.match(/^url\(/);
      // The placeholder does not become the image src.
      expect(el.image.hasAttribute('src')).to.be.false;
    });

    it('clears the background when the placeholder is removed', async () => {
      const el = await fixture<MediaPosterImage>(
        `<media-poster-image placeholdersrc="${PLACEHOLDER}"></media-poster-image>`
      );
      el.removeAttribute(Attributes.PLACEHOLDER_SRC);
      expect(el.image.style.backgroundImage).to.equal('');
      expect(el.placeholderSrc).to.equal(null);
    });

    it('updates the background when the placeholder changes', async () => {
      const el = await fixture<MediaPosterImage>(
        `<media-poster-image placeholdersrc="${PLACEHOLDER}"></media-poster-image>`
      );
      el.setAttribute(Attributes.PLACEHOLDER_SRC, POSTER);
      expect(el.image.style.backgroundImage).to.include(POSTER);
    });

    it('keeps the placeholder background alongside the src', async () => {
      const el = await fixture<MediaPosterImage>(
        `<media-poster-image placeholdersrc="${PLACEHOLDER}" src="${POSTER}"></media-poster-image>`
      );
      expect(el.image.getAttribute('src')).to.equal(POSTER);
      expect(el.image.style.backgroundImage).to.include(PLACEHOLDER);
    });
  });
});
