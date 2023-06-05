---
title: Audio player
description: Build an audio player with Media Chrome
layout: ../../../layouts/MainLayout.astro
---

While most of our examples have shown how to use Media Chrome for video playback, it’s just as practical to use it to build an audio player as well.

Since audio players don’t use the same visual layout as video players do, we can present a much simpler UI to the user. You can use the `audio` attribute to strip away the unused standard [positioning slots](./position-controls) from your player.

<media-controller audio>
  <audio
    slot="media"
    src="https://stream.mux.com/O4h5z00885HEucNNa1rV02wZapcGp01FXXoJd35AHmGX7g/audio.m4a"
  ></audio>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-time-display showduration></media-time-display>
    <media-time-range></media-time-range>
    <media-playback-rate-button></media-playback-rate-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
  </media-control-bar>
</media-controller>

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@1/+esm"></script>

<media-controller audio>
  <audio
    slot="media"
    src="https://stream.mux.com/O4h5z00885HEucNNa1rV02wZapcGp01FXXoJd35AHmGX7g/audio.m4a"
  ></audio>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-time-display showduration></media-time-display>
    <media-time-range></media-time-range>
    <media-playback-rate-button></media-playback-rate-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
  </media-control-bar>
</media-controller>
```
