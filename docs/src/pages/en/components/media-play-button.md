---
title: <media-play-button>
description: Media Play Button
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-play-button.js
---

Button to toggle media playback.

<h3>Default</h3>

<media-play-button mediapaused></media-play-button>

```html
<media-play-button mediapaused></media-play-button>
```

<h3>Pause</h3>

<media-play-button></media-play-button>

```html
<media-play-button></media-play-button>
```

<h3>Alternate content</h3>

<media-play-button mediapaused>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>
<media-play-button>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>

```html
<media-play-button mediapaused>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>
<media-play-button>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>
```


## Attributes

_None_

## Slots

| Name    | Default Type | Description                                                                                  |
| ------- | ------------ | -------------------------------------------------------------------------------------------- |
| `play`  | `svg`        | An element shown when the media is paused and pressing the button will start media playback  |
| `pause` | `svg`        | An element shown when the media is playing and pressing the button will pause media playback |


## Styling

See our [styling docs](./styling#Buttons)
