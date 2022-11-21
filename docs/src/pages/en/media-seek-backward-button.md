---
title: <media-seek-backward-button>
description: Media Seek Backward Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-seek-backward-button.js
---

Button to jump back 30 seconds in the media.

<h3>Default</h3>

<media-seek-backward-button></media-seek-backward-button>

```html
<media-seek-backward-button></media-seek-backward-button>
```

<h3>Adjust seek offset (10 seconds)</h3>

<media-seek-backward-button seek-offset="10"></media-seek-backward-button>

```html
<media-seek-backward-button seek-offset="10"></media-seek-backward-button>
```

<h3>Alternate content</h3>
<media-seek-backward-button>
  <span slot="backward">Back</span>
</media-seek-backward-button>

```html
<media-seek-backward-button>
  <span slot="backward">Back</span>
</media-seek-backward-button>
```

## Attributes

| Name          | Type     | Default Value | Description                                                         |
| ------------- | -------- | ------------- | ------------------------------------------------------------------- |
| `seek-offset` | `number` | `30`          | Adjusts how much time (in seconds) the playhead should seek forward |

## Slots

| Name       | Default Type | Description                                              |
| ---------- | ------------ | -------------------------------------------------------- |
| `backward` | `svg`        | The element shown for the seek backward button's display |


## Styling

See our [styling docs](./styling#Buttons)
