---
title: <media-seek-backward-button>
description: Media Seek Backward Button
layout: ../../layouts/MainLayout.astro
---

Button to jump back 30 seconds in the media.

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-seek-backward-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-seek-backward-button.html) ([Example Source](../examples/control-elements/media-seek-backward-button.html))

## Attributes

| Name          | Type     | Default Value | Description                                                         |
| ------------- | -------- | ------------- | ------------------------------------------------------------------- |
| `seek-offset` | `number` | `30`          | Adjusts how much time (in seconds) the playhead should seek forward |

## Slots

| Name       | Default Type | Description                                              |
| ---------- | ------------ | -------------------------------------------------------- |
| `backward` | `svg`        | The element shown for the seek backward button's display |

### Example

```html
<media-seek-backward-button>
  <svg slot="backward"><!-- your SVG --></svg>
</media-seek-backward-button>
```

## Styling

See our [styling docs](./styling#Buttons)
