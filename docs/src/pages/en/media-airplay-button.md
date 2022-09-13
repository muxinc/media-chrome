---
title: <media-airplay-button>
description: Media Airplay Button
layout: ../../layouts/MainLayout.astro
---

Button to bring up the AirPlay menu and select AirPlay playback.

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-airplay-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-airplay-button.html) ([Example Source](../examples/control-elements/media-airplay-button.html))

## Attributes

_None_

## Slots

| Name      | Default Type | Description                                        |
| --------- | ------------ | -------------------------------------------------- |
| `airplay` | `svg`        | The element shown for the AirPlay button's display |

### Example

```html
<media-airplay-button>
  <svg slot="airplay"><!-- your SVG --></svg>
</media-airplay-button>
```

## Styling

See our [styling docs](./styling#Buttons)
