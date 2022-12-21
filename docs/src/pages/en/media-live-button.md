---
title: <media-live-button>
description: Media Live Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-live-button.js
---

The Media Live Button does two things:
1. Shows when the stream is live via an indicator (red dot, by default)
2. Allows the viewer to seek back to the most current part of the stream by clicking on the button.

<h3>Media is not live (default)</h3>

<media-live-button></media-live-button>

```html
<media-live-button></media-live-button>
```

<h3>Media is live</h3>

<media-live-button media-time-is-live></media-live-button>

```html
<media-live-button media-time-is-live></media-live-button>
```

<h3>Alternate content</h3>

<media-live-button media-time-is-live>
  <span slot="indicator">Indicator!</span>
  <span>Hello</span>
</media-live-button>

```html
<media-live-button>
  <span slot="indicator">Indicator!</span>
  <span>Hello</span>
</media-pip-button>
```

## Attributes

_None_

## Slots

| Name    | Default Type | Description                                                                                               |
| ------- | ------------ | --------------------------------------------------------------------------------------------------------- |
| `enter` | `svg`        | An element shown when the media is not in PIP mode and pressing the button will trigger entering PIP mode |
| `exit`  | `svg`        | An element shown when the media is in PIP and pressing the button will trigger exiting PIP mode           |

## Styling

See our [styling docs](./styling#Buttons)
