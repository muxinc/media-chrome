---
title: Create a responsive theme
description: Learn how to create a responsive theme
layout: ../../../layouts/MainLayout.astro
---

There's a few ways to implement layouts that change based on context, one is
explained in [Responsive controls](../responsive-controls) which is based on
showing / hiding elements via pure CSS. 
[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries) 
and [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
are a powerful way to change the layout and style of your theme.

The template syntax offers an alternative to implement a responsive theme by only
rendering certain DOM fragments based on a condition you specify as seen in the
[Conditionals section](../themes#conditionals). This can be beneficial as your 
theme grows larger or if you prefer to not render DOM that is hidden to the user.

Let's take a look at how a theme might look like with these conditions in place.

```html
<template id="multi-theme">
  <style>
    .spacer {
      flex-grow: 1;
      background-color: var(
        --media-control-background,
        rgba(20, 20, 30, 0.7)
      );
    }
  </style>
  <media-controller breakpoints="sm:384 md:576" audio="{{audio}}">
    <slot name="media" slot="media"></slot>
    <template if="audio">
      <template if="streamType == 'on-demand'">
        <media-control-bar>
          <media-play-button></media-play-button>
          <media-time-display show-duration></media-time-display>
          <media-time-range></media-time-range>
          <media-playback-rate-button></media-playback-rate-button>
          <media-mute-button></media-mute-button>
          <media-volume-range></media-volume-range>
        </media-control-bar>
      </template>
    </template>
    <template if="audio == null">
      <template if="streamType == 'on-demand'">
        <template if="breakpointSm == null">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <div class="spacer"></div>
            <media-time-display></media-time-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
        <template if="breakpointSm">
          <template if="breakpointMd == null">
            <div slot="centered-chrome">
              <media-play-button></media-play-button>
            </div>
            <media-control-bar>
              <media-mute-button></media-mute-button>
              <media-time-display></media-time-display>
              <media-time-range></media-time-range>
              <media-duration-display></media-duration-display>
              <media-playback-rate-button></media-playback-rate-button>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </template>
        </template>
        <template if="breakpointMd">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <media-time-display></media-time-display>
            <media-time-range></media-time-range>
            <media-duration-display></media-duration-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
      </template>
    </template>
  </media-controller>
</template>
```

<template id="multi-theme">
  <style>
    .spacer {
      flex-grow: 1;
      background-color: var(
        --media-control-background,
        rgba(20, 20, 30, 0.7)
      );
    }
  </style>
  <media-controller breakpoints="sm:384 md:576" audio="{{audio}}">
    <slot name="media" slot="media"></slot>
    <template if="audio">
      <template if="streamType == 'on-demand'">
        <media-control-bar>
          <media-play-button></media-play-button>
          <media-time-display show-duration></media-time-display>
          <media-time-range></media-time-range>
          <media-playback-rate-button></media-playback-rate-button>
          <media-mute-button></media-mute-button>
          <media-volume-range></media-volume-range>
        </media-control-bar>
      </template>
    </template>
    <template if="audio == null">
      <template if="streamType == 'on-demand'">
        <template if="breakpointSm == null">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <div class="spacer"></div>
            <media-time-display></media-time-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
        <template if="breakpointSm">
          <template if="breakpointMd == null">
            <div slot="centered-chrome">
              <media-play-button></media-play-button>
            </div>
            <media-control-bar>
              <media-mute-button></media-mute-button>
              <media-time-display></media-time-display>
              <media-time-range></media-time-range>
              <media-duration-display></media-duration-display>
              <media-playback-rate-button></media-playback-rate-button>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </template>
        </template>
        <template if="breakpointMd">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <media-time-display></media-time-display>
            <media-time-range></media-time-range>
            <media-duration-display></media-duration-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
      </template>
    </template>
  </media-controller>
</template>

## One theme to handle multiple layouts

Building multiple layouts into your theme with conditionals allows you to create a single 
theme that can handle different permutations.

### On-demand audio layout

By passing in the `audio` attribute, the user of your theme gets the audio layout:

```html
<media-theme template="multi-theme" audio mediatitle="My audio title">
  <audio
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></audio>
</media-theme>
```

<media-theme template="multi-theme" audio mediatitle="My audio title">
  <audio
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></audio>
</media-theme>

## On-demand Video Layout

Without the `audio` attribute, the user of your theme gets the video layout:

<media-theme template="multi-theme" mediatitle="My video title">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
</media-theme>

<br>

[![Edit Media Chrome Multi-layout Theme](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/media-chrome-multi-layout-theme-gwlon8?fontsize=14&hidenavigation=1&theme=dark)
