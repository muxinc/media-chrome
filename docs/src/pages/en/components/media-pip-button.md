---
title: <media-pip-button>
description: Media PiP Button
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-pip-button.js
---

Button to toggle picture-in-picture mode of the video.

<h3>Enter pip</h3>

<media-pip-button></media-pip-button>

```html
<media-pip-button></media-pip-button>
```

<h3>Exit pip</h3>

<media-pip-button mediaispip></media-pip-button>

```html
<media-pip-button mediaispip></media-pip-button>
```

<h3>Alternate content</h3>

<media-pip-button>
  <span slot="enter">PIP</span>
  <span slot="exit">Off</span>
</media-pip-button>
<media-pip-button mediaispip>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-pip-button>

```html
<media-pip-button>
  <span slot="enter">PIP</span>
  <span slot="exit">Off</span>
</media-pip-button>
<media-pip-button mediaispip>
  <span slot="enter">Enter</span>
  <span slot="exit">Exit</span>
</media-pip-button>
```
