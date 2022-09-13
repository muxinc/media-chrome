---
title: <media-pip-button>
description: Media PiP Button
layout: ../../layouts/MainLayout.astro
---

Button to toggle picture-in-picture mode of the video.

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-pip-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-pip-button.html) ([Example Source](../examples/control-elements/media-pip-button.html))

## Attributes

_None_

## Slots

| Name    | Default Type | Description                                                                                               |
| ------- | ------------ | --------------------------------------------------------------------------------------------------------- |
| `enter` | `svg`        | An element shown when the media is not in PIP mode and pressing the button will trigger entering PIP mode |
| `exit`  | `svg`        | An element shown when the media is in PIP and pressing the button will trigger exiting PIP mode           |

### Example

```html
<media-pip-button>
  <svg slot="enter"><!-- your SVG --></svg>
  <svg slot="exit"><!-- your SVG --></svg>
</media-pip-button>
```

## Styling

See our [styling docs](./styling#Buttons)
