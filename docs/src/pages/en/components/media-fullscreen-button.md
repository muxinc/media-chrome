---
title: <media-fullscreen-button>
description: Media Fullscreen Button
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-fullscreen-button.js
---

Button to toggle fullscreen viewing

<h3>Enter fullscreen</h3>

<media-fullscreen-button></media-fullscreen-button>

```html
<media-fullscreen-button></media-fullscreen-button>
```

<h3>Exit fullscreen</h3>

<media-fullscreen-button mediaisfullscreen></media-fullscreen-button>

```html
<media-fullscreen-button mediaisfullscreen></media-fullscreen-button>
```

<h3>Alternate content</h3>

<media-fullscreen-button>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>
<media-fullscreen-button mediaisfullscreen>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>

```html
<media-fullscreen-button>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>
<media-fullscreen-button mediaisfullscreen>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-fullscreen-button>
```
