// NOTE: This is generic for any CSS/html list representation. Consider renaming and moving to generic module.
export const splitTextTracksStr = (textTracksStr = '') =>
  textTracksStr.split(/\s+/);
export const parseTextTrackStr = (textTrackStr = '') => {
  const [language, encodedLabel] = textTrackStr.split(':');
  const label = encodedLabel ? decodeURIComponent(encodedLabel) : undefined;
  return {
    language,
    label,
  };
};

export const parseTextTracksStr = (
  textTracksStr = '',
  textTrackLikeObj = {}
) => {
  return splitTextTracksStr(textTracksStr).map((textTrackStr) => {
    const textTrackObj = parseTextTrackStr(textTrackStr);
    return {
      ...textTrackLikeObj,
      ...textTrackObj,
    };
  });
};

export const parseTracks = (trackOrTracks) => {
  if (Array.isArray(trackOrTracks)) {
    return trackOrTracks.map((trackObjOrStr) => {
      if (typeof trackObjOrStr === 'string') {
        return parseTextTrackStr(trackObjOrStr);
      }
      return trackObjOrStr;
    });
  }
  if (typeof trackOrTracks === 'string') {
    return parseTextTracksStr(trackOrTracks);
  }
  return [trackOrTracks];
};

export const formatTextTrackObj = ({ label, language } = {}) => {
  if (!label) return language;
  return `${language}:${encodeURIComponent(label)}`;
};

export const formatTextTracks = (textTracks = []) => {
  return Array.prototype.map.call(textTracks, formatTextTrackObj).join(' ');
};

// NOTE: This is a generic higher order fn. Consider and moving to generic module.
export const isMatchingPropOf = (key, value) => (obj) => obj[key] === value;
// NOTE: This is a generic higher order fn. Consider renaming and moving to generic module.
export const textTrackObjAsPred = (filterObj) => {
  const preds = Object.entries(filterObj).map(([key, value]) => {
    return isMatchingPropOf(key, value);
  });

  return (textTrack) => preds.every((pred) => pred(textTrack));
};

export const updateTracksModeTo = (mode, tracks = [], tracksToUpdate = []) => {
  // 1. Normalize the tracksToUpdate into an array of "partial TextTrack-like" objects
  // 2. Convert each object into its own predicate function to identify that an actual TextTrack is a match
  const preds = parseTracks(tracksToUpdate).map(textTrackObjAsPred);

  // A track is identified as a track to update as long as it matches one of the preds (i.e. as long as it "looks like" one of "partial TextTrack-like" objects)
  const isTrackToUpdate = (textTrack) => {
    return preds.some((pred) => pred(textTrack));
  };

  // 1. Filter to only include tracks to update
  // 2. Update each of those tracks to the appropriate mode.
  Array.from(tracks)
    .filter(isTrackToUpdate)
    .forEach((textTrack) => {
      textTrack.mode = mode;
    });
};

export const getTextTracksList = (media, filterPredOrObj = () => true) => {
  if (!media?.textTracks) return [];

  const filterPred =
    typeof filterPredOrObj === 'function'
      ? filterPredOrObj
      : textTrackObjAsPred(filterPredOrObj);

  return Array.from(media.textTracks).filter(filterPred);
};
