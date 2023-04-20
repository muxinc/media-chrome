import { expect } from '@open-wc/testing';
import {
  getTextTracksList,
  formatTextTrackObj,
} from '../../../src/js/utils/captions';

describe('module: util/captions', () => {
  const fakeSubsTrackES = Object.freeze({
    label: 'Spanish',
    kind: 'subtitles',
    language: 'es',
  });
  const fakeSubsTrackEN = Object.freeze({
    label: 'English',
    kind: 'subtitles',
    language: 'en-US',
  });
  const fakeCCTrackEN = Object.freeze({
    label: 'English (with descriptions)',
    kind: 'captions',
    language: 'en',
  });
  const fakeDataTrackThumbnails = Object.freeze({
    label: 'thumbnails',
    kind: 'metadata',
  });

  // Use an "array-like" to demonstrate cases that should work with TextTrackLists
  const fakeTracksList = Object.freeze({
    0: fakeSubsTrackES,
    1: fakeSubsTrackEN,
    2: fakeCCTrackEN,
    3: fakeDataTrackThumbnails,
    length: 4,
  });

  describe('getTextTracksList()', () => {
    it('should yield an array of all TextTrack objects by default', async () => {
      const media = { textTracks: fakeTracksList };

      const actual = getTextTracksList(media);

      expect(actual).to.be.an('array').with.lengthOf(4);
      expect(actual).to.have.deep.members([
        { label: 'Spanish', kind: 'subtitles', language: 'es' },
        { label: 'English', kind: 'subtitles', language: 'en-US' },
        {
          label: 'English (with descriptions)',
          kind: 'captions',
          language: 'en',
        },
        { label: 'thumbnails', kind: 'metadata' },
      ]);
    });

    it('should only include TextTracks that match the provided predicate', async () => {
      const media = { textTracks: fakeTracksList };

      const actual = getTextTracksList(media, (textTrack) =>
        textTrack.language?.startsWith('en')
      );

      expect(actual).to.be.an('array').with.lengthOf(2);
      expect(actual).to.have.deep.members([
        { label: 'English', kind: 'subtitles', language: 'en-US' },
        {
          label: 'English (with descriptions)',
          kind: 'captions',
          language: 'en',
        },
      ]);
      expect(actual).to.not.have.deep.members([
        { label: 'Spanish', kind: 'subtitles', language: 'es' },
        { label: 'thumbnails', kind: 'metadata' },
      ]);
    });

    it('should only include TextTracks that match the provided filter object', async () => {
      const media = { textTracks: fakeTracksList };

      const actual = getTextTracksList(media, { kind: 'metadata' });

      expect(actual).to.be.an('array').with.lengthOf(1);
      expect(actual).to.have.deep.members([
        { label: 'thumbnails', kind: 'metadata' },
      ]);
      expect(actual).to.not.have.deep.members([
        {
          label: 'English (with descriptions)',
          kind: 'captions',
          language: 'en',
        },
        { label: 'Spanish', kind: 'subtitles', language: 'es' },
        { label: 'English', kind: 'subtitles', language: 'en-US' },
      ]);
    });
  });

  describe('formatTextTrackObj()', () => {
    it('should format to a well-defined string representation for label and language', () => {
      const track = { label: 'Spanish', kind: 'subtitles', language: 'es' };

      const actual = formatTextTrackObj(track);
      const expected = 'es:Spanish';

      expect(actual).to.equal(expected);
    });

    it('should treat label as optional', () => {
      const track = { kind: 'subtitles', language: 'es' };

      const actual = formatTextTrackObj(track);
      const expected = 'es';

      expect(actual).to.equal(expected);
    });

    it('should url encode strings to avoid special character conflation', () => {
      const track = {
        label: 'English: with descriptions',
        kind: 'captions',
        language: 'en',
      };

      const actual = formatTextTrackObj(track);
      const expected = 'cc:en:English%3A%20with%20descriptions';

      expect(actual).to.equal(expected);
    });
  });
});
