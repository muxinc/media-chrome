/*
<media-theme-microvideo>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme-microvideo>
*/

import { globalThis, document } from '../utils/server-safe-globals.js';
import { MediaThemeElement } from '../media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
  :host {
    --_primary-color: var(--media-primary-color, rgb(255 255 255 / .9));
    --_secondary-color: var(--media-secondary-color, rgb(0 0 0 / .75));
    --_volume-range-expand-width: 70px;
    --_volume-range-expand-height: 42px;

    --media-icon-color: var(--_primary-color);
    --media-range-thumb-background: var(--_primary-color);
    --media-range-bar-color: var(--_primary-color);
    --media-range-thumb-opacity: 0;
    --media-control-background: transparent;
    --media-control-hover-background: transparent;
    --media-control-padding: 5px 5px;
    --media-preview-time-text-shadow: none;

    color: var(--_primary-color);
  }

  [disabled]:not(media-live-button) {
    opacity: 60%;
    cursor: not-allowed;
  }

  [breakpointsm] {
    --media-control-padding: 9px 5px;
  }

  [breakpointmd] {
    --media-control-padding: 9px 7px;
  }

  media-time-range,
  media-live-button,
  media-time-display,
  media-text-display,
  media-playback-rate-button[role='button'] {
    color: inherit;
  }

  media-controller::part(centered-layer) {
    display: grid;
    justify-content: unset;
    padding-bottom: 6px;
  }

  :host([streamtype=live]:not([targetlivewindow])) media-controller::part(centered-layer),
  :host([mediastreamtype=live]:not([mediatargetlivewindow])) media-controller::part(centered-layer) {
    padding-bottom: 0;
  }

  media-loading-indicator {
    place-self: center;
    ${/* Stack the grid items on top of each other */ ''}
    grid-area: 1 / 1;
  }

  media-control-bar {
    place-self: var(--_control-bar-place-self, end center);
    grid-area: 1 / 1;
    position: relative;
    margin: 10px;
    gap: 4px;
    align-items: start;
  }

  :host([controlbarplace$="end"]) media-control-bar {
    align-items: end;
  }

  .control-group {
    background: var(--_secondary-color);
    position: relative;
    display: inline-flex;
    border-radius: 5px;
  }

  :host([controlbarvertical]) :is(media-control-bar, .control-group) {
    flex-direction: column;
  }

  .volume-group {
    position: relative;
    display: inline-flex;
    flex-direction: row;
  }

  :host([controlbarplace$="end"]) .volume-group {
    flex-direction: row-reverse;
  }

  :host([controlbarplace$="end"]) .volume-group:first-child .volume-range-span {
    --_volume-range-padding-left: 10px;
  }

  :host([controlbarvertical]) .volume-group {
    flex-direction: column;
  }

  :host([controlbarvertical][controlbarplace^="end"]) .volume-group {
    flex-direction: column-reverse;
  }

  :host([controlbarvertical][controlbarplace^="end"]) .volume-group:first-child .volume-range-span {
    --_volume-range-padding-top: 10px;
  }

  .volume-range-span {
    display: inline-flex;
    position: relative;
    overflow: hidden;
    width: 0;
  }

  .volume-group:hover .volume-range-span,
  [keyboardcontrol] .volume-group:focus-within .volume-range-span {
    width: var(--_volume-range-expand-width);
    padding-left: var(--_volume-range-padding-left);
    padding-top: var(--_volume-range-padding-top);
  }

  :host([controlbarvertical]) .volume-range-span {
    --_volume-range-padding-left: 0 !important;
    display: inline-flex;
    height: 0;
  }

  :host([controlbarvertical]) .volume-group:hover .volume-range-span,
  :host([controlbarvertical]) [keyboardcontrol] .volume-group:focus-within .volume-range-span {
    height: var(--_volume-range-expand-height);
    width: auto;
    max-width: 40px;
  }

  media-volume-range {
    --media-range-track-border-radius: 2px;
    --media-range-track-background: rgba(255, 255, 255, .2);

    width: var(--_volume-range-expand-width);
    display: var(--controls, var(--volume-range, inline-block));
    border-radius: 5px;
  }

  :host([controlbarvertical]) media-volume-range {
    width: var(--_volume-range-expand-height);
    transform: rotate(-90deg);
  }

  media-control-bar:has(.volume-group:hover),
  [keyboardcontrol] media-control-bar:has(.volume-group:focus-within) {
    top: var(--_control-bar-offset-top, 0);
    left: var(--_control-bar-offset-left, calc(var(--_volume-range-expand-width) / 2));
  }

  :host([controlbarplace$="start"]),
  :host([controlbarplace$="end"]) {
    --_control-bar-offset-left: 0;
  }

  :host([controlbarvertical]) {
    --_control-bar-offset-left: 0;
  }

  :host([controlbarvertical][controlbarplace^="center"]) {
    --_control-bar-offset-top: calc(var(--_volume-range-expand-height) / 2);
  }

  media-time-range {
    --media-range-track-height: 6px;
    --media-range-track-transition: height .1s linear;
    --media-range-track-background: rgba(20, 20, 30, .25);
    --media-time-range-buffered-color: rgba(20, 20, 30, .3);
    --media-range-track-box-shadow: 0 -1px 0 rgba(20, 20, 30, .07);
    --media-range-padding-left: 0;
    --media-range-padding-right: 0;
    --media-preview-time-background: var(--_secondary-color);
    --media-preview-box-margin: 0 0 3px;

    display: var(--controls, var(--time-range, inline-block));
    width: 100%;
    height: 10px;
    bottom: -2px;
  }

  media-live-button {
    --media-control-background: var(--_secondary-color);
    --media-control-hover-background: var(--_secondary-color);
    border-radius: 5px;
  }

  media-live-button::before {
    content: '';
    width: 5px;
  }

  media-live-button::after {
    content: '';
    width: 7px;
  }

  ${/* Turn some buttons off by default */ ''}
  media-seek-backward-button {
    display: var(--media-control-display, var(--media-seek-backward-button-display, none));
  }

  media-seek-forward-button {
    display: var(--media-control-display, var(--media-seek-forward-button-display, none));
  }

  media-pip-button {
    display: var(--media-control-display, var(--media-pip-button-display, none));
  }
</style>

<template partial="PlayButton">
  <media-play-button
    part="play button"
    disabled="{{disabled}}"
    aria-disabled="{{disabled}}"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="play">
      <path d="m6.73 20.93 14.05-8.54a.46.46 0 0 0 0-.78L6.73 3.07a.48.48 0 0 0-.73.39v17.07a.48.48 0 0 0 .73.4Z" />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="pause">
      <path
        d="M6 19.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v15ZM14.5 4a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5h-3Z"
      />
    </svg>
  </media-play-button>
</template>

<template partial="SeekBackwardButton">
  <media-seek-backward-button
    seekoffset="{{backwardseekoffset ?? 10}}"
    part="seek-backward button"
    disabled="{{disabled}}"
    aria-disabled="{{disabled}}"
  >
    <svg aria-hidden="true" viewBox="0 0 22 24" slot="icon">
      <path d="M11 6V3L5.37 7 11 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 11 6Z" />
      <text class="value" transform="translate(2.5 21)" style="font-size: 8px; font-family: 'ArialMT', 'Arial'">
        {{backwardseekoffset ?? 10}}
      </text>
    </svg>
  </media-seek-backward-button>
</template>

<template partial="SeekForwardButton">
  <media-seek-forward-button
    seekoffset="{{forwardseekoffset ?? 10}}"
    part="seek-forward button"
    disabled="{{disabled}}"
    aria-disabled="{{disabled}}"
  >
    <svg aria-hidden="true" viewBox="0 0 22 24" slot="icon">
      <path d="M11 6V3l5.61 4L11 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 11 6Z" />
      <text class="value" transform="translate(10 21)" style="font-size: 8px; font-family: 'ArialMT', 'Arial'">
        {{forwardseekoffset ?? 10}}
      </text>
    </svg>
  </media-seek-forward-button>
</template>

<template partial="MuteButton">
  <media-mute-button part="mute button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="high">
      <path
        d="m11.14 4.86-4 4a.49.49 0 0 1-.35.14H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.5.5 0 0 0 .85-.36V5.21a.5.5 0 0 0-.86-.35Zm2.74-1.56v1.52A7.52 7.52 0 0 1 19.47 12a7.52 7.52 0 0 1-5.59 7.18v1.52A9 9 0 0 0 21 12a9 9 0 0 0-7.12-8.7Zm3.56 8.7a5.49 5.49 0 0 0-3.56-5.1v1.66a3.93 3.93 0 0 1 0 6.88v1.66a5.49 5.49 0 0 0 3.56-5.1Z"
      />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="medium">
      <path
        d="m11.14 4.853-4 4a.49.49 0 0 1-.35.14H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.5.5 0 0 0 .85-.36V5.203a.5.5 0 0 0-.86-.35Zm6.3 7.14a5.49 5.49 0 0 0-3.56-5.1v1.66a3.93 3.93 0 0 1 0 6.88v1.66a5.49 5.49 0 0 0 3.56-5.1Z"
      />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="low">
      <path
        d="m11.14 4.853-4 4a.49.49 0 0 1-.35.14H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.5.5 0 0 0 .85-.36V5.203a.5.5 0 0 0-.86-.35Zm6.3 7.14a5.49 5.49 0 0 0-3.56-5.1v1.66a3.93 3.93 0 0 1 0 6.88v1.66a5.49 5.49 0 0 0 3.56-5.1Z"
      />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="off">
      <path
        d="m3 4.05 4.48 4.47-.33.33a.49.49 0 0 1-.36.15H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.48.48 0 0 0 .36.15.5.5 0 0 0 .5-.5v-5.75l4.67 4.66a7.71 7.71 0 0 1-2.79 1.47v1.52a9.32 9.32 0 0 0 3.87-1.91L20 21l1-1L4.06 3 3 4.05Zm5.36 5.36 2.39 2.39V17L8 14.26a1.74 1.74 0 0 0-1.24-.51H4.25v-3.5h2.54A1.74 1.74 0 0 0 8 9.74l.36-.33ZM19.47 12a7.19 7.19 0 0 1-.89 3.47l1.11 1.1A8.64 8.64 0 0 0 21 12a9 9 0 0 0-7.12-8.7v1.52A7.52 7.52 0 0 1 19.47 12ZM12 8.88V5.21a.5.5 0 0 0-.5-.5.48.48 0 0 0-.36.15L9.56 6.44 12 8.88ZM15.91 12a4.284 4.284 0 0 1-.07.72l1.22 1.22a5.2 5.2 0 0 0 .38-1.94 5.49 5.49 0 0 0-3.56-5.1v1.66A4 4 0 0 1 15.91 12Z"
      />
    </svg>
  </media-mute-button>
</template>

<template partial="CaptionsButton">
  <media-captions-button
    part="captions button"
    disabled="{{disabled}}"
    aria-disabled="{{disabled}}"
  >
    <svg aria-hidden="true" viewBox="0 0 26 24" slot="on">
      <path
        d="M22.832 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.41 10.1a3.63 3.63 0 0 1-1.51.32 4.76 4.76 0 0 1-1.63-.27 4 4 0 0 1-1.28-.83 3.67 3.67 0 0 1-.84-1.26 4.23 4.23 0 0 1-.3-1.63 4.28 4.28 0 0 1 .3-1.64 3.53 3.53 0 0 1 .84-1.21 3.89 3.89 0 0 1 1.29-.8 4.76 4.76 0 0 1 1.63-.27 4.06 4.06 0 0 1 1.35.24c.225.091.44.205.64.34a2.7 2.7 0 0 1 .55.52l-1.27 1a1.79 1.79 0 0 0-.6-.46 2 2 0 0 0-.83-.16 2 2 0 0 0-1.56.69 2.35 2.35 0 0 0-.46.77 2.78 2.78 0 0 0-.16 1c-.009.34.046.68.16 1 .104.283.26.545.46.77.188.21.415.38.67.5a2 2 0 0 0 .84.18 1.87 1.87 0 0 0 .9-.21 1.78 1.78 0 0 0 .65-.6l1.38 1a2.88 2.88 0 0 1-1.22 1.01Zm7.52 0a3.63 3.63 0 0 1-1.51.32 4.76 4.76 0 0 1-1.63-.27 3.89 3.89 0 0 1-1.28-.83 3.55 3.55 0 0 1-.85-1.26 4.23 4.23 0 0 1-.3-1.63 4.28 4.28 0 0 1 .3-1.64 3.43 3.43 0 0 1 .85-1.25 3.75 3.75 0 0 1 1.28-.8 4.76 4.76 0 0 1 1.63-.27 4 4 0 0 1 1.35.24c.225.091.44.205.64.34.21.144.395.32.55.52l-1.27 1a1.79 1.79 0 0 0-.6-.46 2 2 0 0 0-.83-.16 2 2 0 0 0-1.56.69 2.352 2.352 0 0 0-.46.77 3.01 3.01 0 0 0-.16 1c-.003.34.05.678.16 1 .108.282.263.542.46.77.188.21.416.38.67.5a2 2 0 0 0 .84.18 1.87 1.87 0 0 0 .9-.21 1.78 1.78 0 0 0 .65-.6l1.38 1a2.82 2.82 0 0 1-1.21 1.05Z"
      />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 26 24" slot="off">
      <path
        d="M22.832 5.68a2.58 2.58 0 0 0-2.3-2.5c-1.81-.12-4.67-.18-7.53-.18-2.86 0-5.72.06-7.53.18a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c1.81.12 4.67.18 7.53.18 2.86 0 5.72-.06 7.53-.18a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.137-.21-8.283 0-12.42a1.11 1.11 0 0 1 .91-1.11c1.67-.11 4.43-.18 7.43-.18s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.137.21 8.283 0 12.42ZM10.843 14a1.55 1.55 0 0 1-.76.18 1.57 1.57 0 0 1-.71-.18 1.69 1.69 0 0 1-.57-.42 2.099 2.099 0 0 1-.38-.58 2.47 2.47 0 0 1 0-1.64 2 2 0 0 1 .39-.66 1.73 1.73 0 0 1 .58-.42c.23-.103.479-.158.73-.16.241-.004.48.044.7.14.199.088.373.222.51.39l1.08-.89a2.179 2.179 0 0 0-.47-.44 2.81 2.81 0 0 0-.54-.32 2.91 2.91 0 0 0-.58-.15 2.71 2.71 0 0 0-.56 0 4.08 4.08 0 0 0-1.38.15 3.27 3.27 0 0 0-1.09.67 3.14 3.14 0 0 0-.71 1.06 3.62 3.62 0 0 0-.26 1.39 3.57 3.57 0 0 0 .26 1.38 3 3 0 0 0 .71 1.06c.316.293.687.52 1.09.67.443.16.91.238 1.38.23a3.2 3.2 0 0 0 1.28-.27c.401-.183.747-.47 1-.83l-1.17-.88a1.42 1.42 0 0 1-.53.52Zm6.62 0a1.58 1.58 0 0 1-.76.18 1.54 1.54 0 0 1-.7-.18 1.69 1.69 0 0 1-.57-.42 2.12 2.12 0 0 1-.43-.58 2.29 2.29 0 0 1 .39-2.3 1.84 1.84 0 0 1 1.32-.58c.241-.003.48.045.7.14.199.088.373.222.51.39l1.08-.92a2.43 2.43 0 0 0-.47-.44 3.22 3.22 0 0 0-.53-.29 2.999 2.999 0 0 0-.57-.15 2.87 2.87 0 0 0-.57 0 4.06 4.06 0 0 0-1.36.15 3.17 3.17 0 0 0-1.09.67 3 3 0 0 0-.72 1.06 3.62 3.62 0 0 0-.25 1.39 3.57 3.57 0 0 0 .25 1.38c.16.402.405.764.72 1.06a3.17 3.17 0 0 0 1.09.67c.44.16.904.237 1.37.23.441 0 .877-.092 1.28-.27a2.45 2.45 0 0 0 1-.83l-1.15-.85a1.49 1.49 0 0 1-.54.49Z"
      />
    </svg>
  </media-captions-button>
</template>

<template partial="PipButton">
  <media-pip-button part="pip button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
    <svg aria-hidden="true" viewBox="0 0 26 24" slot="enter">
      <path
        d="M22 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6.75v-1.25h-6.5V4.25h17.5v6.5H23V4a1 1 0 0 0-1-1Zm0 10h-8a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1Zm-.5 6.5h-7v-5h7v5Z"
      />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 26 24" slot="exit">
      <path
        d="M22 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6.75v-1.25h-6.5V4.25h17.5v6.5H23V4a1 1 0 0 0-1-1Zm0 10h-8a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1Zm-.5 6.5h-7v-5h7v5Z"
      />
    </svg>
  </media-pip-button>
</template>

<template partial="AirplayButton">
  <media-airplay-button part="airplay button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
    <svg aria-hidden="true" viewBox="0 0 26 24" slot="icon">
      <path
        d="M13.19 14.22a.25.25 0 0 0-.38 0l-5.46 6.37a.25.25 0 0 0 .19.41h10.92a.25.25 0 0 0 .19-.41l-5.46-6.37Z"
      />
      <path
        d="M22 3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h2.94L8 16.75H4.25V4.25h17.5v12.5H18L19.06 18H22a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
      />
    </svg>
  </media-airplay-button>
</template>

<template partial="CastButton">
  <media-cast-button part="cast button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
    <svg aria-hidden="true" viewBox="0 0 26 24" slot="enter">
      <path d="M3 15.5V17c2.206 0 4 1.794 4 4h1.5A5.5 5.5 0 0 0 3 15.5Zm0 3V21h2.5A2.5 2.5 0 0 0 3 18.5Z" />
      <path d="M3 12.5V14c3.86 0 7 3.14 7 7h1.5A8.5 8.5 0 0 0 3 12.5Z" />
      <path
        d="M22 3H4a1 1 0 0 0-1 1v6.984c.424 0 .84.035 1.25.086V4.25h17.5v15.5h-8.82c.051.41.086.826.086 1.25H22a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
      />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 26 24" slot="exit">
      <path d="M3 15.5V17c2.206 0 4 1.794 4 4h1.5A5.5 5.5 0 0 0 3 15.5Zm0 3V21h2.5A2.5 2.5 0 0 0 3 18.5Z" />
      <path d="M3 12.5V14c3.86 0 7 3.14 7 7h1.5A8.5 8.5 0 0 0 3 12.5Z" />
      <path
        d="M22 3H4a1 1 0 0 0-1 1v6.984c.424 0 .84.035 1.25.086V4.25h17.5v15.5h-8.82c.051.41.086.826.086 1.25H22a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
      />
      <path d="M20.5 5.5h-15v5.811c3.52.906 6.283 3.67 7.189 7.19H20.5V5.5Z" />
    </svg>
  </media-cast-button>
</template>

<template partial="FullscreenButton">
  <media-fullscreen-button
    part="fullscreen button"
    disabled="{{disabled}}"
    aria-disabled="{{disabled}}"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="enter">
      <path
        d="M20.25 14.5a.76.76 0 0 0-.75.75v4.25h-4.25a.75.75 0 1 0 0 1.5h5a.76.76 0 0 0 .75-.75v-5a.76.76 0 0 0-.75-.75Zm0-11.5h-5a.76.76 0 0 0-.75.75.76.76 0 0 0 .75.75h4.25v4.25a.75.75 0 1 0 1.5 0v-5a.76.76 0 0 0-.75-.75ZM8.75 19.5H4.5v-4.25a.76.76 0 0 0-.75-.75.76.76 0 0 0-.75.75v5a.76.76 0 0 0 .75.75h5a.75.75 0 1 0 0-1.5Zm0-16.5h-5a.76.76 0 0 0-.75.75v5a.76.76 0 0 0 .75.75.76.76 0 0 0 .75-.75V4.5h4.25a.76.76 0 0 0 .75-.75.76.76 0 0 0-.75-.75Z"
      />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" slot="exit">
      <path
        d="M20.25 14.5h-5a.76.76 0 0 0-.75.75v5a.75.75 0 1 0 1.5 0V16h4.25a.75.75 0 1 0 0-1.5Zm-5-5h5a.75.75 0 1 0 0-1.5H16V3.75a.75.75 0 1 0-1.5 0v5a.76.76 0 0 0 .75.75Zm-6.5 5h-5a.75.75 0 1 0 0 1.5H8v4.25a.75.75 0 1 0 1.5 0v-5a.76.76 0 0 0-.75-.75Zm0-11.5a.76.76 0 0 0-.75.75V8H3.75a.75.75 0 0 0 0 1.5h5a.76.76 0 0 0 .75-.75v-5A.76.76 0 0 0 8.75 3Z"
      />
    </svg>
  </media-fullscreen-button>
</template>

<template partial="LiveButton">
  <media-live-button
    part="live seek-live button"
    disabled="{{disabled}}"
    aria-disabled="{{disabled}}"
  >
    <span slot="text">Live</span>
  </media-live-button>
</template>

<template partial="TimeRange">
  <media-time-range
    part="time range"
    disabled="{{disabled}}"
    aria-disabled="{{disabled}}"
  ></media-time-range>
</template>

<template partial="VolumeRange">
  <span class="volume-range-span">
    <media-volume-range
      part="volume range"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-volume-range>
  </span>
</template>

<media-controller
  nodefaultstore="{{nodefaultstore}}"
  defaultsubtitles="{{defaultsubtitles}}"
  style="--_control-bar-place-self:{{controlbarplace ?? 'unset'}}"
  gesturesdisabled="{{disabled}}"
  hotkeys="{{hotkeys}}"
  nohotkeys="{{nohotkeys}}"
  audio="{{audio}}"
  exportparts="layer, media-layer, poster-layer, vertical-layer, centered-layer, gesture-layer"
>
  <slot name="media" slot="media"></slot>
  <slot name="poster" slot="poster"></slot>
  <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>

  <template if="streamtype == 'on-demand'">

    <media-control-bar slot="centered-chrome">
      <div class="control-group">
        {{>PlayButton}}
        {{>SeekBackwardButton}}
        {{>SeekForwardButton}}
        <span class="volume-group">
          {{>MuteButton}}
          {{>VolumeRange}}
        </span>
        {{>CaptionsButton}}
        {{>AirplayButton}}
        {{>CastButton}}
        {{>PipButton}}
        {{>FullscreenButton}}
      </div>
    </media-control-bar>
    {{>TimeRange}}

  </template>

  <template if="streamtype == 'live'">

    <template if="!targetlivewindow">

      <media-control-bar slot="centered-chrome">
        {{>LiveButton}}
        <div class="control-group">
          <span class="volume-group">
            {{>MuteButton}}
            {{>VolumeRange}}
          </span>
          {{>CaptionsButton}}
          {{>AirplayButton}}
          {{>CastButton}}
          {{>PipButton}}
          {{>FullscreenButton}}
        </div>
      </media-control-bar>

    </template>

    <template if="targetlivewindow > 0">

      <media-control-bar slot="centered-chrome">
        {{>LiveButton}}
        <div class="control-group">
          {{>PlayButton}}
          {{>SeekBackwardButton}}
          {{>SeekForwardButton}}
          <span class="volume-group">
            {{>MuteButton}}
            {{>VolumeRange}}
          </span>
          {{>CaptionsButton}}
          {{>AirplayButton}}
          {{>CastButton}}
          {{>PipButton}}
          {{>FullscreenButton}}
        </div>
      </media-control-bar>
      {{>TimeRange}}

    </template>

  </template>

  <slot></slot>

</media-controller>
`;

class MediaThemeMicrovideo extends MediaThemeElement {
  static template = template;
}

if (!globalThis.customElements.get('media-theme-microvideo')) {
  globalThis.customElements.define(
    'media-theme-microvideo',
    MediaThemeMicrovideo
  );
}

export default MediaThemeMicrovideo;
