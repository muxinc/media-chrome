---
title: <media-seek-forward-button>
description: Media Seek Forward Button
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-seek-forward-button.js
---

Button to jump ahead 30 seconds in the media.

<h3>Default</h3>

<media-seek-forward-button></media-seek-forward-button>

```html
<media-seek-forward-button></media-seek-forward-button>
```

<h3>Adjust seek offset (10 seconds)</h3>

<media-seek-forward-button seekoffset="10"></media-seek-forward-button>

```html
<media-seek-forward-button seekoffset="10"></media-seek-forward-button>
```

<h3>Alternate content</h3>

<media-seek-forward-button>
  <span slot="forward">Forward</span>
</media-seek-forward-button>

```html
<media-seek-forward-button>
  <span slot="forward">Forward</span>
</media-seek-forward-button>
```
