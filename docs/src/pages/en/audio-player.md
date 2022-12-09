---
title: Audio player
description: Build an audio player with Media Chrome
layout: ../../layouts/MainLayout.astro
---

Specify the `audio` attribute on `<media-controller>` in order to use the default layout. Using the `audio` attribute will remove the standard [positioning slots](/en/position-controls) from your player (eg: `"top-chrome"`, `"centered-chrome"`, etc.). There is only one default slot that all your markup can go into.

See the [CodePen example](https://codepen.io/heff/pen/wvdyNWd?editors=1000)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@0.16/+esm"></script>

<media-controller audio>
  <audio
    slot="media"
    src="https://stream.mux.com/O4h5z00885HEucNNa1rV02wZapcGp01FXXoJd35AHmGX7g/audio.m4a"
  ></audio>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-time-display show-duration></media-time-display>
    <media-time-range></media-time-range>
    <media-playback-rate-button></media-playback-rate-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
  </media-control-bar>
</media-controller>
```
