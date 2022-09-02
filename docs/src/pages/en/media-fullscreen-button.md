---
title: <media-fullscreen-button>
description: Media Fullscreen Button
layout: ../../layouts/MainLayout.astro
---

Button to toggle fullscreen viewing

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-fullscreen-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-fullscreen-button.html) ([Example Source](../examples/control-elements/media-fullscreen-button.html))

## Attributes

_None_

## Slots

| Name    | Default Type | Description                                                                                                   |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| `enter` | `svg`        | An element shown when the media is not in fullscreen and pressing the button will trigger entering fullscreen |
| `exit`  | `svg`        | An element shown when the media is in fullscreen and pressing the button will trigger exiting fullscreen      |

### Example

```html
<media-fullscreen-button>
  <svg slot="enter"><!-- your SVG --></svg>
  <svg slot="exit"><!-- your SVG --></svg>
</media-fullscreen-button>
```

## Styling

See our [styling docs](./styling#Buttons)
