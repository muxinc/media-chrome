import { MediaUIEvents, MediaUIAttributes } from '../constants.js';

// NOTE: This is generic for any CSS/html list representation. Consider renaming and moving to generic module.
/**
 * Splits a string (representing TextTracks) into an array of strings based on whitespace.
 * @param {string} [textTracksStr = ''] - a string of 1+ "items" (representing TextTracks), separated by whitespace
 * @returns {Array<string>} An array of non-whitesace strings (each representing a single TextTrack).
 */
export const splitTextTracksStr = (textTracksStr = '') =>
  textTracksStr.split(/\s+/);

/**
 * Parses a string that represents a TextTrack into a "TextTrack-like object"
 * The expected TextTrack string format is:
 * "language[:label]"
 * where the language *should* conform to BCP 47, just like TextTracks, and the (optional)
 * label *must* be URL encoded.
 * Note that this format may be expanded to include additional properties, such as
 * `id`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextTrack
 * @param {string} [textTrackStr = ''] - A well-defined TextTrack string representations
 * @returns {Object} An object that resembles a (partial) TextTrack (`{ language: string; label?: string; }`)
 */
export const parseTextTrackStr = (textTrackStr = '') => {
  const [language, encodedLabel] = textTrackStr.split(':');
  const label = encodedLabel ? decodeURIComponent(encodedLabel) : undefined;
  return {
    language,
    label,
  };
};

/**
 * Parses a whitespacae-separated string that represents list of TextTracks into an array of TextTrack-like objects,
 * where each object will have the properties identified by the corresponding string, plus any properties generically
 * provided by the (optional) `textTrackLikeObj` argument.
 * @param {string} [textTracksStr = ''] - a string of 1+ "items" (representing TextTracks), separated by whitespace
 * @param {Object} [textTrackLikeObj] An object that resembles a (partial) TextTrack, used to add generic properties to all parsed TextTracks.
 * @returns {Array<Object>} An array of "TextTrack-like objects", each with properties parsed from the string and any properties from `textTrackLikeObj`.
 * @example
 * ```js
 * const tracksStr = 'en-US:English en:English%20%28with%20descriptions%29';
 * const tracks = parseTextTracksStr(tracksStr);
 * // [{ language: 'en-US', label: 'English' }, { language: 'en', label: 'English (with descriptions)' }];
 *
 * const tracksData = { kind: 'captions' };
 * const tracksWithData = parseTextTracksStr(tracksStr, tracksData);
 * // [{ language: 'en-US', label: 'English', kind: 'captions' }, { language: 'en', label: 'English (with descriptions)', kind: 'captions' }];
 * ```
 */
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

/**
 * Takes a variety of possible representations of TextTrack(s) and "normalizes" them to an Array of 1+ TextTrack-like objects.
 * @param {Array<string|Object>|string|Object} trackOrTracks - A value representing 1+ TextTracks
 * @returns {Array<Object>} An array of TextTrack-like objects.
 */
export const parseTracks = (trackOrTracks) => {
  // Already an array, but might be an array of strings, objects, or both.
  if (Array.isArray(trackOrTracks)) {
    return trackOrTracks.map((trackObjOrStr) => {
      // If the individual track is a string representation, translate it into a TextTrack-like object.
      if (typeof trackObjOrStr === 'string') {
        return parseTextTrackStr(trackObjOrStr);
      }
      // Otherwise, assume it already is one.
      return trackObjOrStr;
    });
  }
  // A string of 1+ TextTrack representations. Parse into an array of objects.
  if (typeof trackOrTracks === 'string') {
    return parseTextTracksStr(trackOrTracks);
  }
  // Assume a single TextTrack-like object. Wrap into an array of 1.
  return [trackOrTracks];
};

/**
 * Translates a TextTrack-like object into a well-defined string representation for the TextTrack
 * @param {Object} obj - A TextTrack or TextTrack-like object
 * @param {string} [obj.label] - An optional label for the track.
 * @param {string} obj.language - The BCP-47 compliant string representing the language code of the track
 * @returns {string} A string representing a TextTrack with the format: "language[:label]"
 */
export const formatTextTrackObj = ({ label, language } = {}) => {
  if (!label) return language;
  return `${language}:${encodeURIComponent(label)}`;
};

/**
 * Translates a set of TextTracks into a well-defined, whitespace-separated string representation of the set
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextTrackList
 * @param {Array<TextTrack|object>|TextTracks} textTracks - A TextTracks object or an Array of TextTracks or TextTrack-like objects.
 * @returns A string representing a set of TextTracks, separated by whitespace.
 */
export const stringifyTextTrackList = (textTracks = []) => {
  return Array.prototype.map.call(textTracks, formatTextTrackObj).join(' ');
};

// NOTE: This is a generic higher order fn. Consider and moving to generic module.
/**
 * A generic higher-order function that yields a predicate to assert whether or not some value has the provided key/value pair
 * @param {string|number} key - The property key/name against which we'd like to match
 * @param {*} value - The value of the key we expect for a match
 * @returns {Function} - A predicate function that yields true if the provided object has the expected key/value pair, otherwise false.
 * @example
 * ```js
 * const hasShowingMode = isMatchingPropOf('mode', 'showing');
 * hasShowingMode({ mode: 'showing' }); // true
 * hasShowingMode({ mode: 'disabled' }); // false
 * hasShowingMode({ no_mode: 'any' }); // false
 * ```
 */
export const isMatchingPropOf = (key, value) => (obj) => obj[key] === value;

// NOTE: This is a generic higher order fn. Consider renaming and moving to generic module.
/**
 * A higher-order function that yields a single predicate to assert whether or not some value has *every* key/value pair defined in `filterObj`.
 * @param {object} filterObj - An object of key/value pairs that we expect on a given object
 * @returns {Function} - A predicate function that yields true iff the provided object has *every* key/value pair in `filterObj`, otherwise false
 * @example
 * ```js
 * const track1 = { label: 'English', kind: 'captions', language: 'en-US' };
 * const track1a = { label: 'English', kind: 'captions', language: 'en-US', id: '1', mode: 'showing' };
 * const track2 = { label: 'English (with descriptions)', kind: 'captions', language: 'en-US', id: '2', mode: 'disabled' };
 * const track3 = { label: 'Español', kind: 'subtitles', language: 'es-MX', id: '3', mode: 'disabled' };
 * const track4 = { label: 'English', language: 'en-US', mode: 'showing' };
 *
 * const isMatchingTrack = textTrackObjAsPred({ label: 'English', kind: 'captions', language: 'en-US' });
 * isMatchingTrack(track1); // true
 * isMatchingTrack(track1a); // true
 * isMatchingTrack(track2); // false
 * isMatchingTrack(track3); // false
 * isMatchingTrack(track4); // false
 * isMatchingTrack({ no_corresponding_props: 'any' }); // false
 * ```
 */
export const textTrackObjAsPred = (filterObj) => {
  const preds = Object.entries(filterObj).map(([key, value]) => {
    // Translate each key/value pair into a single predicate
    return isMatchingPropOf(key, value);
  });

  // Return a predicate function that takes the array of single key/value pair predicates and asserts that *every* pred in the array is true of the (TextTrack-like) object
  return (textTrack) => preds.every((pred) => pred(textTrack));
};

/**
 * Updates any `tracks` that match one of the `tracksToUpdate` to be in the provided TextTrack `mode`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/mode
 * @see {@link parseTracks}
 * @param {string} mode - The desired mode for any matching TextTracks. Should be one of "disabled"|"hidden"|"showing"
 * @param {TextTracks|Array<TextTrack|Object>} tracks - A TextTracks object or array of TextTracks that should contain any matching TextTracks to update
 * @param {Array<string|Object>|string|Object} tracksToUpdate - A value representing a set of TextTracks
 */
export const updateTracksModeTo = (mode, tracks = [], tracksToUpdate = []) => {
  // 1. Normalize the tracksToUpdate into an array of "partial TextTrack-like" objects
  // 2. Convert each object into its own predicate function to identify that an actual TextTrack is a match
  const preds = parseTracks(tracksToUpdate).map(textTrackObjAsPred);

  // A track is identified as a track to update as long as it matches *one* of the preds (i.e. as long as it "looks like" one of "partial TextTrack-like" objects)
  const isTrackToUpdate = (textTrack) => {
    return preds.some((pred) => pred(textTrack));
  };

  Array.from(tracks)
    // 1. Filter to only include tracks to update
    .filter(isTrackToUpdate)
    // 2. Update each of those tracks to the appropriate mode.
    .forEach((textTrack) => {
      textTrack.mode = mode;
    });
};

/**
 * Takes an `HTMLMediaElement media` and yields an array of `TextTracks` that match the provided `filterPredOrObj` criteria (or all `TextTracks` by default).
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/textTracks
 * @see {@link textTrackObjAsPred}
 * @param {HTMLMediaElement} media - An HTMLMediaElement with an expected textTracks value
 * (NOTE: This uses "structural polymorphism", so as long as `media` has an Array-like `textTracks` value of TextTrack-like objects, this function will work).
 * @param {Function|Object} [filterPredOrObj] Either a predicate function or an object that can be translated into a predicate function of matching key/value pairs.
 * @returns {Array<TextTrack>} An array of TextTracks that match the given `filterPredOrObj` (or all TextTracks on `media` by default)
 * @example
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <head></head>
 * <body>
 * <video src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4">
 *   <track label="Spanish" kind="subtitles" srclang="es" src="./vtt/en-sub.vtt">
 *   <track label="English" kind="subtitles" srclang="en" src="./vtt/es-sub.vtt">
 *   <track label="English" kind="captions" srclang="en" src="./vtt/en-cc.vtt">
  </video>
 * </body>
 * </html>
 * ```
 * ```js
 * // js ...
 * const media = document.querySelector('video');
 * getTextTracksList(media, { kind: 'subtitles' });
 * // [{ label: 'Spanish', kind: 'subtitles', language: 'es' }, { label: 'English', kind: 'subtitles', language: 'en' }]
 * getTextTracksList(media, { kind: 'captions' });
 * // [{ label: 'English', kind: 'captions', language: 'en' }]
 * getTextTracksList(media);
 * // [{ label: 'Spanish', kind: 'subtitles', language: 'es' }, { label: 'English', kind: 'subtitles', language: 'en' }, { label: 'English', kind: 'captions', language: 'en' }]
 * ```
 */
export const getTextTracksList = (media, filterPredOrObj = () => true) => {
  if (!media?.textTracks) return [];

  const filterPred =
    typeof filterPredOrObj === 'function'
      ? filterPredOrObj
      : textTrackObjAsPred(filterPredOrObj);

  return Array.from(media.textTracks).filter(filterPred);
};


/**
 * Are captions enabled?
 *
 * @param {HTMLElement} el - An HTMLElement that has caption related attributes on it.
 * @returns {boolean} Whether captions are enabled or not
 */
export const isCCOn = (el) => {
  const showingCaptions = !!el.getAttribute(
    MediaUIAttributes.MEDIA_CAPTIONS_SHOWING
  );
  const showingSubtitlesAsCaptions =
    !el.hasAttribute('no-subtitles-fallback') &&
    !!el.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING);
  return showingCaptions || showingSubtitlesAsCaptions;
};

/**
 * Trigger the appropriate event on the provided element that will toggle either captions or subtitles as appropriate.
 *
 * This was originally in media-captions-button.
 *
 * @param {HTMLElement} el - An HTMLElement that has caption related attributes on it.
 */
export const toggleSubsCaps = (el) => {
  const ccIsOn = isCCOn(el);
  if (ccIsOn) {
    // Closed Captions is on. Clicking should disable any currently showing captions (and subtitles, if relevant)
    // For why we are requesting tracks to `mode="disabled"` and not `mode="hidden"`, see: https://github.com/muxinc/media-chrome/issues/60
    const captionsShowingStr = el.getAttribute(
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING
    );
    // If we have currently showing captions track(s), request for them to be disabled.
    if (captionsShowingStr) {
      const evt = new window.CustomEvent(
        MediaUIEvents.MEDIA_DISABLE_CAPTIONS_REQUEST,
        { composed: true, bubbles: true, detail: captionsShowingStr }
      );
      el.dispatchEvent(evt);
    }
    const subtitlesShowingStr = el.getAttribute(
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
    );
    // If we have currently showing subtitles track(s) and we're using subtitle fallback (true/"on" by default), request for them to be disabled.
    if (subtitlesShowingStr && !el.hasAttribute('no-subtitles-fallback')) {
      const evt = new window.CustomEvent(
        MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST,
        { composed: true, bubbles: true, detail: subtitlesShowingStr }
      );
      el.dispatchEvent(evt);
    }
  } else {
    // Closed Captions is off. Clicking should show the first relevant captions track or subtitles track if we're using subtitle fallback (true/"on" by default)
    const [ccTrackStr] =
      splitTextTracksStr(
        el.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_LIST) ?? ''
      ) ?? [];
    if (ccTrackStr) {
      // If we have at least one captions track, request for the first one to be showing.
      const evt = new window.CustomEvent(
        MediaUIEvents.MEDIA_SHOW_CAPTIONS_REQUEST,
        { composed: true, bubbles: true, detail: ccTrackStr }
      );
      el.dispatchEvent(evt);
    } else if (!el.hasAttribute('no-subtitles-fallback')) {
      // If we don't have a captions track and we're using subtitles fallback (true/"on" by default), check if we have any subtitles available.
      const [subTrackStr] =
        splitTextTracksStr(
          el.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST) ?? ''
        ) ?? [];
      if (subTrackStr) {
        // If we have at least one subtitles track (and didn't have any captions tracks), request for the first one to be showing as a fallback for captions.
        const evt = new window.CustomEvent(
          MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
          { composed: true, bubbles: true, detail: subTrackStr }
        );
        el.dispatchEvent(evt);
      }
    } else {
      // If we end up here, it means we have an enabled CC-button that a user has clicked on but there are no captions and no subtitles (or we've disabled subtitles fallback).
      console.error(
        'Attempting to enable closed captions but none are available! Please verify your media content if this is unexpected.'
      );
    }
  }
};
