import { globalThis } from '../utils/server-safe-globals.js';
import {
  MediaUIEvents,
  StreamTypes,
  TextTrackKinds,
  TextTrackModes,
} from '../constants.js';
import {
  getTextTracksList,
  parseTracks,
  updateTracksModeTo,
} from '../utils/captions.js';
import { getSubtitleTracks, toggleSubtitleTracks } from './util.js';

/**
 * @typedef {import('./state-mediator.js').StateMediator} StateMediator
 */

/**
 * @typedef {import('./state-mediator.js').StateOwners} StateOwners
 */

/** @TODO Duplicate definition (See media-store.js). Consolidate somewhere */
/**
 * @typedef {{
 *   [K in keyof StateMediator]: ReturnType<StateMediator[K]['get']>
 * } & {
 *   mediaPreviewTime: number;
 *   mediaPreviewImage: string;
 *   mediaPreviewCoords: [string,string,string,string]
 * }} MediaState
 */

/** @TODO Make this definition more precise (CJP) */
/**
 *
 * RequestMap provides a stateless, well-defined API for translating state change requests to related side effects to attempt to fulfill said request and
 * any other appropriate state changes that should occur as a result. Most often (but not always), those will simply rely on the StateMediator's `set()`
 * method for the corresponding state to update the StateOwners state. RequestMap is designed to be used by a MediaStore, which owns all of the wiring up
 * and persistence of e.g. StateOwners, MediaState, StateMediator, and the RequestMap.
 *
 * For any modeled state change request, the RequestMap defines a key, K, which directly maps to the state change request type (e.g. `mediapauserequest`, `mediaseekrequest`, etc.),
 * whose value is a function that defines the appropriate side effects of the request that will, under normal circumstances, (eventually) result in actual state changes.
 *
 * @typedef {{ [k: string]: (
 *  stateMediator: StateMediator,
 *  stateOwners: StateOwners,
 *  action: Partial<Pick<CustomEvent<any>, 'type' | 'detail'>>
 * ) => Partial<MediaState>|undefined|void}} RequestMap
 */

/** @type {RequestMap} */
export const requestMap = {
  /**
   * @TODO Consider adding state to `StateMediator` for e.g. `mediaThumbnailCues` and use that for derived state here (CJP)
   */
  [MediaUIEvents.MEDIA_PREVIEW_REQUEST](
    stateMediator,
    stateOwners,
    { detail }
  ) {
    const { media } = stateOwners;

    const mediaPreviewTime = detail ?? undefined;
    let mediaPreviewImage = undefined;
    let mediaPreviewCoords = undefined;

    // preview-related state should be reset to nothing
    // when there is no media or the preview time request is null/undefined
    if (media && mediaPreviewTime != null) {
      // preview thumbnail image-related derivation
      const [track] = getTextTracksList(media, {
        kind: TextTrackKinds.METADATA,
        label: 'thumbnails',
      });
      if (track?.cues?.length) {
        let cue;
        // If our first preview image cue starts after mediaPreviewTime, use it.
        if (track.cues[0].startTime > mediaPreviewTime) {
          cue = track.cues[0];
          // If our last preview image cue ends at or before mediaPreviewTime, use it.
        } else if (
          track.cues[track.cues.length - 1].endTime <= mediaPreviewTime
        ) {
          cue = track.cues[track.cues.length - 1];
          // Otherwise, use the cue that contains mediaPreviewTime
        } else {
          cue = Array.prototype.find.call(
            track?.cues ?? [],
            (c) =>
              c.startTime <= mediaPreviewTime && c.endTime > mediaPreviewTime
          );
        }
        if (cue) {
          const base = !/'^(?:[a-z]+:)?\/\//i.test(cue.text)
            ? /** @type {HTMLTrackElement | null} */ (
                media?.querySelector('track[label="thumbnails"]')
              )?.src
            : undefined;
          const url = new URL(cue.text, base);
          const previewCoordsStr = new URLSearchParams(url.hash).get('#xywh');
          mediaPreviewCoords = previewCoordsStr.split(',');
          mediaPreviewImage = url.href;
        }
      }
    }

    // chapters cues
    const mediaPreviewChapter = stateMediator.mediaChaptersCues
      .get(stateOwners)
      .find(
        (c) => c.startTime <= mediaPreviewTime && c.endTime > mediaPreviewTime
      )?.text;

    // NOTE: Example of directly updating state from a request action/event (CJP)
    return {
      mediaPreviewTime,
      mediaPreviewImage,
      mediaPreviewCoords,
      mediaPreviewChapter,
    };
  },
  [MediaUIEvents.MEDIA_PAUSE_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaPaused';
    const value = true;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_PLAY_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaPaused';
    const value = false;
    /** @TODO Only do this for non-dvr live (CJP) */
    if (stateMediator.mediaStreamType.get(stateOwners) === StreamTypes.LIVE) {
      const liveEdgeTime = stateMediator.mediaSeekable.get(stateOwners)?.[1];
      // Only seek to live if we are live and have a known seekable end
      if (liveEdgeTime) {
        stateMediator.mediaCurrentTime.set(liveEdgeTime, stateOwners);
      }
    }
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST](
    stateMediator,
    stateOwners,
    { detail }
  ) {
    const key = 'mediaPlaybackRate';
    const value = detail;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_MUTE_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaMuted';
    const value = true;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_UNMUTE_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaMuted';
    const value = false;
    // If we've unmuted but our volume is currently 0, automatically set it to some low volume
    if (!stateMediator.mediaVolume.get(stateOwners)) {
      stateMediator.mediaVolume.set(0.25, stateOwners);
    }
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_VOLUME_REQUEST](stateMediator, stateOwners, { detail }) {
    const key = 'mediaVolume';
    const value = detail;
    // If we've adjusted the volume to some non-0 number and are muted, automatically unmute.
    // NOTE: "pseudo-muted" is currently modeled via MEDIA_VOLUME_LEVEL === "off" (CJP)
    if (value && stateMediator.mediaMuted.get(stateOwners)) {
      stateMediator.mediaMuted.set(false, stateOwners);
    }
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_SEEK_REQUEST](stateMediator, stateOwners, { detail }) {
    const key = 'mediaCurrentTime';
    const value = detail;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_SEEK_TO_LIVE_REQUEST](stateMediator, stateOwners) {
    // This is an example of a specialized state change request "action" that doesn't need a specialized
    // state facade model
    const key = 'mediaCurrentTime';
    const value = stateMediator.mediaSeekable.get(stateOwners)?.[1];
    // If we don't have a known seekable end (which represents the live edge), bail early
    if (!Number.isNaN(Number(value))) return;
    stateMediator[key].set(value, stateOwners);
  },
  // Text Tracks state change requests
  [MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST](
    _stateMediator,
    stateOwners,
    { detail }
  ) {
    const { options } = stateOwners;
    const tracks = getSubtitleTracks(stateOwners);
    const tracksToUpdate = parseTracks(detail);
    const preferredLanguage = tracksToUpdate[0]?.language;
    if (preferredLanguage && !options.noSubtitlesLangPref) {
      globalThis.localStorage.setItem(
        'media-chrome-pref-subtitles-lang',
        preferredLanguage
      );
    }
    updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
  },
  [MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST](
    _stateMediator,
    stateOwners,
    { detail }
  ) {
    const tracks = getSubtitleTracks(stateOwners);
    const tracksToUpdate = detail ?? [];
    updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
  },
  [MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST](
    _stateMediator,
    stateOwners,
    { detail }
  ) {
    toggleSubtitleTracks(stateOwners, detail);
  },
  // Renditions/Tracks state change requests
  [MediaUIEvents.MEDIA_RENDITION_REQUEST](
    stateMediator,
    stateOwners,
    { detail }
  ) {
    const key = 'mediaRenditionSelected';
    const value = detail;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_AUDIO_TRACK_REQUEST](
    stateMediator,
    stateOwners,
    { detail }
  ) {
    const key = 'mediaAudioTrackEnabled';
    const value = detail;
    stateMediator[key].set(value, stateOwners);
  },
  // State change requests dependent on root node
  [MediaUIEvents.MEDIA_ENTER_PIP_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaIsPip';
    const value = true;
    // Exit fullscreen if in fullscreen and entering PiP
    if (stateMediator.mediaIsFullscreen.get(stateOwners)) {
      // Should be async
      stateMediator.mediaIsFullscreen.set(false, stateOwners);
    }
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_EXIT_PIP_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaIsPip';
    const value = false;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaIsFullscreen';
    const value = true;
    // Exit PiP if in PiP and entering fullscreen
    if (stateMediator.mediaIsPip.get(stateOwners)) {
      // Should be async
      stateMediator.mediaIsPip.set(false, stateOwners);
    }
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaIsFullscreen';
    const value = false;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_ENTER_CAST_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaIsCasting';
    const value = true;
    // Exit fullscreen if in fullscreen and attempting to cast
    if (stateMediator.mediaIsFullscreen.get(stateOwners)) {
      // Should be async
      stateMediator.mediaIsFullscreen.set(false, stateOwners);
    }
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_EXIT_CAST_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaIsCasting';
    const value = false;
    stateMediator[key].set(value, stateOwners);
  },
  [MediaUIEvents.MEDIA_AIRPLAY_REQUEST](stateMediator, stateOwners) {
    const key = 'mediaIsAirplaying';
    const value = true;
    stateMediator[key].set(value, stateOwners);
  },
};
