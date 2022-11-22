---
title: <media-airplay-button>
description: Media Airplay Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-airplay-button.js
---

Button to bring up the AirPlay menu and select AirPlay playback.

<h3>Default</h3>

<media-airplay-button></media-airplay-button>

```html
<media-airplay-button></media-airplay-button>
```

<h3>Alternate content</h3>

<media-airplay-button>
  <span slot="airplay">Airplay</span>
</media-airplay-button>

```html
<media-airplay-button>
  <span slot="airplay">Airplay</span>
</media-airplay-button>
```

## Attributes

_None_

## Slots

| Name      | Default Type | Description                                        |
| --------- | ------------ | -------------------------------------------------- |
| `airplay` | `svg`        | The element shown for the AirPlay button's display |

## Styling

See our [styling docs](./styling#Buttons)
