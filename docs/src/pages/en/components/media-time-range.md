---
title: <media-time-range>
description: Media Time Range
layout: ../../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-time-range.js
---

Slider to see how far the playhead is through the media duration, and seek to new times.

<h3>Default (no time or duration)</h3>

<media-time-range></media-time-range>

```html
<media-time-range></media-time-range>
```

<h3>Time 0s (buffered 15s, duration 60s)</h3>

<media-time-range
  mediacurrenttime="0"
  mediabuffered="0:15"
  mediaduration="60"></media-time-range>

```html
<media-time-range
  mediacurrenttime="0"
  mediabuffered="0:15"
  mediaduration="60"
></media-time-range>
```

<h3>Time 30s (buffered 60s, duration 60s)</h3>

<media-time-range
  mediacurrenttime="30"
  mediabuffered="0:60"
  mediaduration="60"></media-time-range>

```html
<media-time-range
  mediacurrenttime="30"
  mediabuffered="0:60"
  mediaduration="60"
></media-time-range>
```

<h3>Time 60s (duration 60s)</h3>

<media-time-range
  mediacurrenttime="60"
  mediaduration="60"></media-time-range>

```html
<media-time-range
  mediacurrenttime="60"
  mediaduration="60"
></media-time-range>
```

## Attributes

_None_

## Slots

_None_

## Styling

See our [styling docs](./styling#Ranges)
