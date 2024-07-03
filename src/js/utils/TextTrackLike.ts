import { TextTrackKinds } from '../constants.js';

export type TextTrackLike = {
  /**
   * The id of the track.
   */
  id?: string;

  /**
   * Whether the track is enabled.
   */
  enabled?: boolean;

  /**
   * A required kind for the track.
   */
  kind: TextTrackKind | TextTrackKinds;

  /**
   * An optional label for the track.
   */
  language?: string;

  /**
   * The BCP-47 compliant string representing the language code of the track
   */
  label?: string;

  /**
   * The mode of the track.
   */
  mode?: TextTrackMode;

  /**
   * The cue list for the track.
   */
  cues?: TextTrackCueList;
};
