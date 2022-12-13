---
title: Media slot
description: Understand how the media slot and the media element works in Media Chrome
layout: ../../layouts/MainLayout.astro
---

The key insight with Media Chrome is separating the UI from the media playback. Media Chrome is agnostic to whatever playback engine you are using to play your media. Media Chrome is purely about building the UI.

Media Chrome uses the media slot specified with `slot="media"` in order to interact with the media. For example, when a viewer clicks the "play" button, Media Chrome will call `play()` on whatever element is specified in the media slot.

<h2>Media Slot</h2>

The simplest media slot is the browser's native `<video>` tag. For example:

```html
<media-controller>
  <video slot="media" src="https://....mp4" >
</media-controller>
```

In this example, Media controller will:

* Listen for events emitted from the `<video>` element
* Understand the current state of the `<video>` element by using the known props
* Call methods on the `<video>` element like `play()`, `pause()`, etc.

The superpower of Media Chrome is that the media slot does not have to be a `<video>` element. It can be any HTML element that [implements the HTML5 Video Element API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). See the list of Media Elements below for examples of compatible elements that can be used with `slot="media"`.


<h2>Media Elements</h2>

All of these elements are web components that can be used as `slot="media"` because they mirror the HTML5 video element API. Note that all of these media elements are responsible solely for playing the media, they don't implement any UI controls.

- [`<hls-video>`](https://github.com/muxinc/hls-video-element) to play arbitrary HLS videos with Hls.js
- [`<mux-video>`](https://github.com/muxinc/elements/tree/main/packages/mux-video) to play videos hosted by [Mux](https://mux.com)
- [`<shaka-video>`](https://github.com/muxinc/shaka-video-element) to play videos with Shaka Player playback engine
- [`<videojs-video>`](https://github.com/luwes/videojs-video-element) to play videos with the [Video.js playback engine](https://videojs.com/)
- [`<youtube-video>`](https://github.com/muxinc/youtube-video-element) to play videos that are hosted on YouTube
- [`<vimeo-video>`](https://github.com/luwes/vimeo-video-element) to play videos that are hosted on Vimeo
- [`<wistia-video>`](https://github.com/luwes/wistia-video-element) to play videos that are hosted on Wistia
- [`<jwplayer-video>`](https://github.com/luwes/jwplayer-video-element) to play videos that are hosted on JWPlayer

Did you create a media element that should be added to this list? Click "Edit this page" in the right sidebar and let us know!
