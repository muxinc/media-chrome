---
title: <media-captions-button>
description: Media Captions Button
layout: ../../layouts/MainLayout.astro
---

Button to show/disable captions

- [Source](https://github.com/muxinc/media-chrome/tree/main/src/js/media-captions-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-captions-button.html) ([Example Source](../examples/control-elements/media-captions-button.html))

## Attributes

| Name                    | Type      | Default Value | Description                                                                                        |
| ----------------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `no-subtitles-fallback` | `boolean` | `false`       | Controls whether media-chrome will show subtitle tracks if no closed captions tracks are available |

## Slots

| Name  | Default Type | Description                                                 |
| ----- | ------------ | ----------------------------------------------------------- |
| `on`  | `svg`        | An element that will be shown while closed captions are on  |
| `off` | `svg`        | An element that will be shown while closed captions are off |

### Example

```html
<media-captions-button>
  <svg slot="on"><!-- your SVG --></svg>
  <svg slot="off"><!-- your SVG --></svg>
</media-captions-button>
```

## Styling

See our [styling docs](./styling#Buttons)
