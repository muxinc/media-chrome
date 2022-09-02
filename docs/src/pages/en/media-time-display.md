---
title: <media-time-display>
description: Media Time Display
layout: ../../layouts/MainLayout.astro
---

Display only component to show the time of the playhead.

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-time-display.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-time-display.html) ([Example Source](../examples/control-elements/media-time-display.html))

## Attributes

| Name            | Type      | Default Value | Description                                                   |
| --------------- | --------- | ------------- | ------------------------------------------------------------- |
| `remaining`     | `boolean` | `false`       | Show as remaining time (i.e. negative "count down") when true |
| `show-duration` | `boolean` | `false`       | Also show the duration after a slash when true                |

## Slots

_None_

### Example

## Styling

See our [styling docs](./styling#Text-Displays)
