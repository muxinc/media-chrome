---
title: <media-fullscreen-button>
description: Media Fullscreen Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-fullscreen-button.js
---

Button to toggle fullscreen viewing

<h3>Enter fullscreen</h3>

<media-fullscreen-button></media-fullscreen-button>

```html
<media-fullscreen-button></media-fullscreen-button>
```

<h3>Exit fullscreen</h3>

<media-fullscreen-button media-is-fullscreen></media-fullscreen-button>

```html
<media-fullscreen-button media-is-fullscreen></media-fullscreen-button>
```

<h3>Alternate content</h3>

<media-fullscreen-button media-paused>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>
<media-fullscreen-button media-is-fullscreen>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>

```html
<media-fullscreen-button media-paused>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>
<media-fullscreen-button media-is-fullscreen>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>
```

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
