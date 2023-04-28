---
title: <media-preview-thumbnail>
description: Media Preview Thumbnail
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-preview-thumbnail.js
---

The preview thumbnail shows an image while the user hovers over the time range.
There is no need to add this element yourself, it's automatically included by `<media-time-range>`.

<style>
  media-preview-thumbnail {
    display: block;
  }

  media-preview-thumbnail[mediapreviewimage] {
    height: 160px;
  }
</style>

<h3>Default (no src)</h3>

<media-preview-thumbnail></media-preview-thumbnail>

```html
<media-preview-thumbnail></media-preview-thumbnail>
```

<h3>With thumbnail and coords</h3>

<media-preview-thumbnail
  mediapreviewimage="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/storyboard.jpg"
  mediapreviewcoords="284 640 284 160"></media-preview-thumbnail>

```html
<media-preview-thumbnail
  mediapreviewimage="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/storyboard.jpg"
  mediapreviewcoords="284 640 284 160"
></media-preview-thumbnail>
```

## Attributes

_None_

## Slots

_None_

## Styling

See our [styling docs](./styling#Buttons)
