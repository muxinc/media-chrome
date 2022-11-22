---
title: <media-playback-rate-button>
description: Media Playback Rate Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-playback-rate-button.js
---

Button to change the speed of playback.

<media-playback-rate-button></media-playback-rate-button>

```html
<media-playback-rate-button></media-playback-rate-button>
```

<h3>Setting rates</h3>

<media-playback-rate-button rates="1 2 3"></media-playback-rate-button>

```html
<media-playback-rate-button rates="1 2 3"></media-playback-rate-button>
```


## Attributes

| Name    | Type   | Default Value       | Description                                                       |
| ------- | ------ | ------------------- | ----------------------------------------------------------------- |
| `rates` | `list` | `1 1.25 1.5 1.75 2` | List of playback rates to toggle through when pressing the button |

## Slots

_None_

## Styling

See our [styling docs](./styling#Buttons)
