---
title: <media-seek-backward-button>
description: Media Seek Backward Button
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-seek-backward-button.js
---

Button to jump back 30 seconds in the media.

<h3>Default</h3>

<media-seek-backward-button></media-seek-backward-button>

```html
<media-seek-backward-button></media-seek-backward-button>
```

<h3>Adjust seek offset (10 seconds)</h3>

<media-seek-backward-button seekoffset="10"></media-seek-backward-button>

```html
<media-seek-backward-button seekoffset="10"></media-seek-backward-button>
```

<h3>Alternate content</h3>
<media-seek-backward-button>
  <span slot="backward">Back</span>
</media-seek-backward-button>

```html
<media-seek-backward-button>
  <span slot="backward">Back</span>
</media-seek-backward-button>
```
