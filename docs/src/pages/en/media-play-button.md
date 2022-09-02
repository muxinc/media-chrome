---
title: <media-play-button>
description: Media Play Button
layout: ../../layouts/MainLayout.astro
---

Button to toggle media playback.

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-play-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-play-button.html) ([Example Source](../examples/control-elements/media-play-button.html))

## Attributes

_None_

## Slots

| Name    | Default Type | Description                                                                                  |
| ------- | ------------ | -------------------------------------------------------------------------------------------- |
| `play`  | `svg`        | An element shown when the media is paused and pressing the button will start media playback  |
| `pause` | `svg`        | An element shown when the media is playing and pressing the button will pause media playback |

### Example

```html
<media-play-button>
  <svg slot="play"><!-- your SVG --></svg>
  <svg slot="pause"><!-- your SVG --></svg>
</media-play-button>
```

## Styling

See our [styling docs](./styling#Buttons)
