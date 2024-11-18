import { TextTrackKinds, TextTrackModes } from '../constants.js';
import { getTextTracksList, updateTracksModeTo } from '../utils/captions.js';
import { TextTrackLike } from '../utils/TextTrackLike.js';

export const getSubtitleTracks = (stateOwners): TextTrackLike[] => {
  return getTextTracksList(stateOwners.media, (textTrack) => {
    return [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(
      textTrack.kind as any
    );
  }).sort((a, b) => (a.kind >= b.kind ? 1 : -1));
};

export const getShowingSubtitleTracks = (stateOwners): TextTrackLike[] => {
  return getTextTracksList(stateOwners.media, (textTrack) => {
    return (
      textTrack.mode === TextTrackModes.SHOWING &&
      [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(
        textTrack.kind as any
      )
    );
  });
};

export const toggleSubtitleTracks = (stateOwners, force: boolean): void => {
  // NOTE: Like Element::toggleAttribute(), this event uses the detail for an optional "force"
  // value. When present, this means "toggle to" "on" (aka showing, even if something's already showing)
  // or "off" (aka disabled, even if all tracks are currently disabled).
  // See, e.g.: https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute#force (CJP)

  // NOTE: Like Element::toggleAttribute(), this event uses the detail for an optional "force"
  // value. When present, this means "toggle to" "on" (aka showing, even if something's already showing)
  // or "off" (aka disabled, even if all tracks are currently disabled).
  // See, e.g.: https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute#force (CJP)
  const tracks = getSubtitleTracks(stateOwners);
  const showingSubitleTracks = getShowingSubtitleTracks(stateOwners);
  const subtitlesShowing = !!showingSubitleTracks.length;
  // If there are no tracks, this request doesn't matter, so we're done.
  if (!tracks.length) return;

  // NOTE: not early bailing on forced cases so we may pick up async cases of toggling on, particularly for HAS-style
  // (e.g. HLS) media where we may not get our preferred subtitles lang until later (CJP)
  if (force === false || (subtitlesShowing && force !== true)) {
    updateTracksModeTo(TextTrackModes.DISABLED, tracks, showingSubitleTracks);
  } else if (force === true || (!subtitlesShowing && force !== false)) {
    let subTrack = tracks[0];
    const { options } = stateOwners;
    if (!options?.noSubtitlesLangPref) {
      const subtitlesPref = globalThis.localStorage.getItem(
        'media-chrome-pref-subtitles-lang'
      );

      const userLangPrefs = subtitlesPref
        ? [subtitlesPref, ...globalThis.navigator.languages]
        : globalThis.navigator.languages;
      const preferredAvailableSubs = tracks
        .filter((textTrack) => {
          return userLangPrefs.some((lang) =>
            textTrack.language.toLowerCase().startsWith(lang.split('-')[0])
          );
        })
        .sort((textTrackA, textTrackB) => {
          const idxA = userLangPrefs.findIndex((lang) =>
            textTrackA.language.toLowerCase().startsWith(lang.split('-')[0])
          );
          const idxB = userLangPrefs.findIndex((lang) =>
            textTrackB.language.toLowerCase().startsWith(lang.split('-')[0])
          );
          return idxA - idxB;
        });

      // Since there may not have been any user preferred subs/cc match, keep the default (picking the first) as
      // the subtitle track to show for these cases.
      if (preferredAvailableSubs[0]) {
        subTrack = preferredAvailableSubs[0];
      }
    }
    const { language, label, kind } = subTrack;
    updateTracksModeTo(TextTrackModes.DISABLED, tracks, showingSubitleTracks);
    updateTracksModeTo(TextTrackModes.SHOWING, tracks, [
      { language, label, kind },
    ]);
  }
};

export const areValuesEq = (x: any, y: any): boolean => {
  // If both are strictly equal, they're equal
  if (x === y) return true;
  // If either is null, they're not equal
  if (x == null || y == null) return false;
  // If their types don't match, they're not equal
  if (typeof x !== typeof y) return false;
  // Treat NaNs as equal
  if (typeof x === 'number' && Number.isNaN(x) && Number.isNaN(y)) return true;
  // NOTE: This impl does not support function values (CJP)
  // All other "simple" types are not equal, since they have the same type and were not strictly equal
  if (typeof x !== 'object') return false;
  if (Array.isArray(x)) return areArraysEq(x, y);
  // NOTE: This impl currently assumes that if y[key] -> x[key] (aka no "extra" keys in y) (CJP)
  // For objects, if every key's value in x has a corresponding key/value entry in y, the objects are equal
  return Object.entries(x).every(
    // NOTE: Checking key in y to disambiguate between between missing keys and keys whose value are undefined (CJP)
    ([key, value]) => key in y && areValuesEq(value as number, y[key])
  );
};

export const areArraysEq = (xs: number[], ys: number[]): boolean => {
  const xIsArray = Array.isArray(xs);
  const yIsArray = Array.isArray(ys);
  // If one of the "arrays" is not an array, not equal
  if (xIsArray !== yIsArray) return false;
  // If both of the "arrays" are not arrays, equal
  if (!(xIsArray || yIsArray)) return true;
  // If arrays have different length, not equal
  if (xs.length !== ys.length) return false;
  // NOTE: presuming sort order is equivalent (CJP)
  // If and only every corresponding entry between the arrays is equal, arrays are equal
  return xs.every((x, i) => areValuesEq(x, ys[i]));
};
