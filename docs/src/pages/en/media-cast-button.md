---
title: <media-cast-button>
description: Media Cast Button
layout: ../../layouts/MainLayout.astro
---

Button to bring up the Cast menu and select playback on a Chromecast device.

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-cast-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-cast-button.html) ([Example Source](../examples/control-elements/media-cast-button.html))

## Attributes

_None_

## Slots

| Name    | Default Type | Description                                                                                                  |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `enter` | `svg`        | An element shown when the media is not in casting mode and pressing the button will open the Cast menu       |
| `exit`  | `svg`        | An element shown when the media is in casting mode and pressing the button will trigger exiting casting mode |

### Example

```html
<media-cast-button>
  <svg slot="enter"><!-- your SVG --></svg>
  <svg slot="exit"><!-- your SVG --></svg>
</media-cast-button>
```

## Styling

See our [styling docs](./styling#Buttons)
