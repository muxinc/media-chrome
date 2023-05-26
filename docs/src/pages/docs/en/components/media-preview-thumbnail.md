---
title: <media-preview-thumbnail>
description: Media Preview Thumbnail
layout: ../../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-preview-thumbnail.js
---

> This component is automatically rendered internally by [`<media-time-range>`](media-time-range). While the default implementation covers most use cases, the documentation below describes how the component works for applications with advanced use cases.

The `<media-preview-thumbnail>` component displays an image while the user hovers over the media time range.

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
