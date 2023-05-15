---
title: Media Element
description: Learn how to create a custom media element that works with Media Chrome
layout: ../../layouts/MainLayout.astro
---

Media Chrome intentionally is not concerned with the media playback engine, 
it works with any element that exposes the same API as the HTML media elements (`<video>` and `<audio>`).  

This means that you can replace these elements with your own if they conform 
to the same API. You can read more about the 
[HTMLMediaElement API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement).

## Media Slot

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
