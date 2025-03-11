/** @jsxImportSource react */
import {
  MediaController,
  MediaControlBar,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaCaptionsButton,
  MediaPlaybackRateButton,
  MediaPipButton,
  MediaFullscreenButton,
  MediaPreviewThumbnail,
} from "media-chrome/react";
import type { MediaChromeListItem } from "../../../types";
// @ts-ignore
import { timeUtils, t } from "media-chrome";

const { formatAsTimePhrase } = timeUtils;

const mediaChromeListItems: MediaChromeListItem[] = [
  {
    name: "controller",
    description:
      "Controls the interaction between the media element and the controls and provides general layout of the player.",
    component: MediaController,
    a11y: {
      role: "region",
      "aria-label": t("video player"),
    },
  },
  {
    name: "control-bar",
    description: "Lay out the control elements in a single bar.",
    component: MediaControlBar,
  },
  {
    name: "play-button",
    description: "Play or pause the media.",
    component: MediaPlayButton,
    a11y: {
      role: "button",
      "aria-label": t("play"),
    },
  },
  {
    name: "seek-forward-button",
    description: "Seek the playhead time forward.",
    component: MediaSeekForwardButton,
    a11y: {
      role: "button",
      "aria-label": t("seek forward {seekOffset} seconds", { seekOffset: 30 }),
    },
  },
  {
    name: "seek-backward-button",
    description: "Seek the playhead time backward.",
    component: MediaSeekBackwardButton,
    a11y: {
      role: "button",
      "aria-label": t("seek back {seekOffset} seconds", { seekOffset: 30 }),
    },
  },
  {
    name: "mute-button",
    description: "Mute or unmute the media.",
    component: MediaMuteButton,
    a11y: {
      role: "button",
      "aria-label": t("mute"),
    },
  },
  {
    name: "volume-range",
    description: "Control the media volume.",
    component: MediaVolumeRange,
    a11y: {
      role: "slider",
      "aria-label": t("volume"),
      "aria-valuetext": `${65}%`,
    },
  },
  {
    name: "time-range",
    description:
      "See how far the playhead is through the media duration, and seek to new times.",
    component: MediaTimeRange,
    a11y: {
      role: "slider",
      "aria-label": t("seek"),
      "aria-valuetext": `${formatAsTimePhrase(-234)} of ${formatAsTimePhrase(
        360
      )}`,
    },
  },
  {
    name: "thumbnail-preview",
    description: "Show an image of the media at a particular time.",
    component: MediaPreviewThumbnail,
  },
  {
    name: "time-display",
    description:
      "Show how far the playhead is through the media duration or show the remaining playback time.",
    component: MediaTimeDisplay,
    a11y: {
      role: "slider",
      // NOTE: Should add a label for media-time-display in media-chrome!
      "aria-label": t("playback time"),
      "aria-valuetext": `${formatAsTimePhrase(-234)} of ${formatAsTimePhrase(
        360
      )}`,
    },
  },
  {
    name: "captions-button",
    description:
      "Turn closed captions on or off (or subtitles, if no captions are available).",
    component: MediaCaptionsButton,
    a11y: {
      role: "switch",
      "aria-label": t("closed captions"),
    },
  },
  {
    name: "playback-rate-button",
    description: "Change the playback rate of the media.",
    component: MediaPlaybackRateButton,
    a11y: {
      role: "button",
      "aria-label": t("Playback rate {playbackRate}", { playbackRate: 1 }),
    },
  },
  {
    name: "pip-button",
    description:
      "Enter or exit picture-in-picture mode of the player for the media.",
    component: MediaPipButton,
    a11y: {
      role: "button",
      "aria-label": t("Enter picture in picture mode"),
    },
  },
  {
    name: "fullscreen-button",
    description: "Enter or exit fullscreen mode of the player for the media.",
    component: MediaFullscreenButton,
    a11y: {
      role: "button",
      "aria-label": t("enter fullscreen mode"),
    },
  },
];

export default mediaChromeListItems;
