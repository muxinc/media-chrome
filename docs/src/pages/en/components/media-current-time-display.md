---
title: <media-current-time-display>
description: Media Current Time Display
layout: ../../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-current-time-display.js
---

Display only component to show the current time of the playhead.

<h3>Default</h3>

<media-current-time-display></media-current-time-display>

```html
<media-current-time-display></media-current-time-display>
```

<h3>Current time of 2 minutes</h3>

<media-current-time-display mediacurrenttime="120.0"></media-current-time-display>

```html
<media-current-time-display mediacurrenttime="120.0"></media-current-time-display>
```

<h3>Current time of one hour</h3>

<media-current-time-display mediacurrenttime="3600.0"></media-current-time-display>

```html
<media-current-time-display mediacurrenttime="3600.0"></media-current-time-display>
```

## Attributes

_None_

## Slots

_None_

## Styling

See our [styling docs](./styling#Text-Displays)
