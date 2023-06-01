---
title: Prevent layout shift
description: Learn how to prevent media chrome players from causing cumulative layout shift
layout: ../../../layouts/MainLayout.astro
---

Cumulative Layout Shift is when content on your page shifts. The site visitor could lose track of what they are looking at or reading as the page loads. It's a sub-optimal user experience and it negatively impacts performance measurements like [Lighthouse](https://web.dev/performance-scoring/). Learn more about [CLS](https://web.dev/cls/).

Video players are notorious for causing CLS because the dimensions/metadata of the media file are unknown until sufficient data is loaded. Use this guide to make sure your Media Chrome player is not causing CLS in your web application.

## Set aspect-ratio

The best way is to set an aspect ratio on `<media-controller>`

The `aspect-ratio` style is [standard CSS](https://css-tricks.com/almanac/properties/a/aspect-ratio/) supported by all evergreen browsers. Most often, you'll want the `aspect-ratio` to match your video content's aspect ratio.

Example with a video that has a 16/9 aspect ratio:

```html
<media-controller style="aspect-ratio: 16/9">
  <video
    slot="media"
    src="https://stream.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/high.mp4"
    poster="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"
    muted
    preload="none"
    crossorigin
  ></video>
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
</media-controller>
```

If your browser doesn't support `aspect-ratio`, you can always set width and height explicitly:

```html
<media-controller style="width: 800px; height: calc(800px * 9/16)">
  <!-- for 16:9 aspect ratio where you want an explicit width and a "derived" height -->
  <video
    slot="media"
    src="https://stream.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/high.mp4"
    poster="https://image.mux.com/BlSb4AuUfA00wchgJ3D00bz4VTppg3eo5Y/thumbnail.jpg"
    muted
    preload="none"
    crossorigin
  ></video>
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
</media-controller>
```
