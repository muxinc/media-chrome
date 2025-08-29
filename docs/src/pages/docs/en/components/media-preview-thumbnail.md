---
title: <media-preview-thumbnail>
description: Media Preview Thumbnail
layout: ../../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-preview-thumbnail.js
---

> This component is automatically rendered internally by [`<media-time-range>`](media-time-range). While the default implementation covers most use cases, the documentation below describes how the component works for applications with advanced use cases.

The `<media-preview-thumbnail>` component is automatically shown when the user hovers over the media time range. It appears if a metadata text track labeled **"thumbnails"** is provided, for example:

```html
<track default label="thumbnails" kind="metadata" src="thumbnails.vtt">
```

The VTT file defines the images (and their coordinates) that are displayed as preview thumbnails. This enables the hover-to-preview functionality.

For more details on how thumbnails are integrated and controlled, see [`<media-time-range>`](media-time-range#preview-thumbnails).

<style>
  media-preview-thumbnail {
    display: block;
  }

  media-preview-thumbnail[mediapreviewimage] {
    height: 160px;
  }
</style>

### Default (no src)

<media-preview-thumbnail></media-preview-thumbnail>

```html
<media-preview-thumbnail></media-preview-thumbnail>
```

### With thumbnail and coords

<media-preview-thumbnail
  mediapreviewimage="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/storyboard.jpg"
  mediapreviewcoords="284 640 284 160"></media-preview-thumbnail>

```html
<media-preview-thumbnail
  mediapreviewimage="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/storyboard.jpg"
  mediapreviewcoords="284 640 284 160"
></media-preview-thumbnail>
```
