---
title: <media-captions-button>
description: Media Captions Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-captions-button.js
---

Button to show/disable captions

<h3>Default (no captions or subtitles)</h3>

<media-captions-button></media-captions-button>

```html
<media-captions-button></media-captions-button>
```

<h3>Closed Captions on ("captions showing")</h3>

<media-captions-button
  media-captions-showing="en:English%20Closed%20Captions"
  media-captions-list="en:English%20Closed%20Captions"></media-captions-button>

```html
<media-captions-button
  media-captions-showing="en:English%20Closed%20Captions"
  media-captions-list="en:English%20Closed%20Captions"
></media-captions-button>

```

<h3>Alternate Content</h3>

<media-captions-button media-captions-showing="en:English%20Closed%20Captions">
  <span slot="on"><b><u>CC</u></b></span>
  <span slot="off">CC</span>
</media-captions-button>
<media-captions-button>
  <span slot="on"><b><u>CC</u></b></span>
  <span slot="off">CC</span>
</media-captions-button>

```html
<media-captions-button media-captions-showing="en:English%20Closed%20Captions">
  <span slot="on"><b><u>CC</u></b></span>
  <span slot="off">CC</span>
</media-captions-button>
<media-captions-button>
  <span slot="on"><b><u>CC</u></b></span>
  <span slot="off">CC</span>
</media-captions-button>
```

## Attributes

| Name                    | Type      | Default Value | Description                                                                                        |
| ----------------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `no-subtitles-fallback` | `boolean` | `false`       | Controls whether media-chrome will show subtitle tracks if no closed captions tracks are available |

## Slots

| Name  | Default Type | Description                                                 |
| ----- | ------------ | ----------------------------------------------------------- |
| `on`  | `svg`        | An element that will be shown while closed captions are on  |
| `off` | `svg`        | An element that will be shown while closed captions are off |


## Styling

See our [styling docs](./styling#Buttons)
