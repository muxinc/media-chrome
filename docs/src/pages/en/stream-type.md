---
title: Media Stream Type
description: Build layouts or controls that adjust to the type of stream - live or on-demand (a.k.a. VOD)
layout: ../../layouts/MainLayout.astro
---

One of the states the media-controller can provide is `mediastreamtype`, with potential values of `live`, `on-demand`, or empty (unknown).

Media streams come in two major _types_, live and on-demand (often called VOD or "Video On-Demand" for video). The core difference between the two is that with a live stream the duration of the media is unknown, because it hasn't finished yet or may never finish in the case of 24/7 live streams. This has implications for the progress bar (media-time-range) and often comes with other UI differences like a red light icon to signal the content is live, or features allowing the viewer/listener to interact with the live streamer. An on-demand UI may also include unique features like chapters and episodes menus.

The `mediastreamtype` state makes it possible to build a player UI that adapts to the current stream type.

For example, you can hide the media time range (progress bar) during a live stream.

```html
<style>
  media-controller[mediastreamtype=live] media-time-range {
    display: none;
  }
</style>

<media-controller>
  <video slot="media"></video>
  <media-control-bar>
    <media-play-button></media-play-button>
    <!-- The time range will be hidden for a live stream -->
    <media-time-range></media-time-range>
  </media-control-bar>
</media-controller>
```

[See also default-stream-type.](./media-controller#default-stream-type)
