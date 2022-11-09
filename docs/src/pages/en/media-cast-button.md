---
title: <media-cast-button>
description: Media Cast Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-cast-button.js
---

Button to bring up the Cast menu and select playback on a Chromecast device.

<h3>Show cast menu</h3>

<media-cast-button></media-cast-button>

```html
<media-cast-button></media-cast-button>
```

<h3>Stop casting</h3>

<media-cast-button media-is-casting></media-cast-button>

```html
<media-cast-button media-is-casting></media-cast-button>
```

<h3>Alternate content</h3>

<media-cast-button>
  <span slot="enter">Cast</span>
  <span slot="exit">Exit</span>
</media-cast-button>
<media-cast-button media-is-casting>
  <span slot="enter">Cast</span>
  <span slot="exit">Exit</span>
</media-cast-button>

```html
<media-cast-button>
  <span slot="enter">Cast</span>
  <span slot="exit">Exit</span>
</media-cast-button>
<media-cast-button media-is-casting>
  <span slot="enter">Cast</span>
  <span slot="exit">Exit</span>
</media-cast-button>
```


## Attributes

_None_

## Slots

| Name    | Default Type | Description                                                                                                  |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `enter` | `svg`        | An element shown when the media is not in casting mode and pressing the button will open the Cast menu       |
| `exit`  | `svg`        | An element shown when the media is in casting mode and pressing the button will trigger exiting casting mode |


## Styling

See our [styling docs](./styling#Buttons)
