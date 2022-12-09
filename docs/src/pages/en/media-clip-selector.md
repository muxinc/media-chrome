---
title: <media-clip-selector>
description: Media Clip Selector
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/extras/media-clip-selector/index.js
---

A draggle UI on the time range for creating media clips.

<img src="/assets/clip-selector.png" alt="Media Clip Selector" />

Note: <media-clip-selector> is an extra, which means it is not imported with the default bundle. To use it, you will need to import it from the dist directory manually. For example:

```
import 'media-chrome/dist/extras/media-clip-selector';
```

## Usage

```js
const mediaClipSelector = document.querySelector('media-clip-selector');

mediaClipSelector.addEventListener('update', (evt) => {
  const { startTime, endTime } = evt.detail;
  console.log('clip selection updated:', startTime, endTime);
});
```

Here's a [live example](https://media-chrome.mux.dev/examples/control-elements/media-clip-selector.html) of the media clip selector in action.

## Attributes

_None_

## Slots

_None_

## Events

- `update` fires when the clip selector range has been updated. See [usage](#usage) example.

