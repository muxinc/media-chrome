---
title: <media-time-display>
description: Media Time Display
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-time-display.js
---

Display only component to show the time of the playhead.

<h3>Default</h3>

<media-time-display></media-time-display>

```html
<media-time-display></media-time-display>
```

<h3>Current time of 2 minutes</h3>

<media-time-display mediacurrenttime="120.0"></media-time-display>

```html
<media-time-display mediacurrenttime="120.0"></media-time-display>
```

<h3>Current time of one hour</h3>

<media-time-display mediacurrenttime="3600.0"></media-time-display>

```html
<media-time-display mediacurrenttime="3600.0"></media-time-display>
```

<h3>Include duration (10 minutes)</h3>

<media-time-display
  mediacurrenttime="120"
  mediaduration="600"
  showduration></media-time-display>

```html
<media-time-display
  mediacurrenttime="120"
  mediaduration="600"
  showduration
></media-time-display>
```

<h3>Show remaining time (at 2 minutes of 10)</h3>

<media-time-display
  mediacurrenttime="120"
  mediaduration="600"
  remaining></media-time-display>

```html
<media-time-display
  mediacurrenttime="120"
  mediaduration="600"
  remaining
></media-time-display>
```
