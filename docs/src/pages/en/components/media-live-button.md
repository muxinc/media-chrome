---
title: <media-live-button>
description: Media Live Button
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-live-button.js
---

The Media Live Button shows when the stream is live via an indicator (red dot, by default). It also allows the viewer to seek to the most current part of the stream by clicking on the button ("seek to live").

<h3>Default: Media is not live</h3>

<media-live-button></media-live-button>

```html
<media-live-button></media-live-button>
```

<h3>Media is live</h3>

<media-live-button mediatimeislive></media-live-button>

```html
<media-live-button media-time-is-live></media-live-button>
```

<h3>Alternate text</h3>

<media-live-button mediatimeislive>
  <span slot="text">Hello!</span>
</media-live-button>

```html
<media-live-button>
  <span slot="text">Hello</span>
</media-pip-button>
```

<h3>Alternate indicator SVG</h3>

<media-live-button>
  <svg slot="indicator" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"></circle></svg>
</media-live-button>
<media-live-button mediatimeislive>
  <svg slot="indicator" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"></circle></svg>
</media-live-button>

```html
<media-live-button mediatimeislive>
  <svg slot="indicator" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"></circle></svg>
</media-live-button>
```

<h3>Alternate indicator text or font icon</h3>

<media-live-button mediatimeislive>
  <span slot="indicator">Hello!</span>
</media-live-button>

```html
<media-live-button mediatimeislive>
  <span slot="indicator">Hello!</span>
</media-live-button>
```

<h3>Common Use: Text is also the indicator</h3>

<style>
  #textlive {
    --media-live-button-icon-color: white;
  }
</style>
<media-live-button id="textlive">
  <span slot="indicator">LIVE</span>
  <span slot="spacer"></span>
  <span slot="text"></span>
</media-live-button>
<media-live-button id="textlive" mediatimeislive>
  <span slot="indicator">LIVE</span>
  <span slot="spacer"></span>
  <span slot="text"></span>
</media-live-button>

```html
<style>
  #textlive {
    --media-live-button-icon-color: white;
  }
</style>
<media-live-button id="textlive">
  <span slot="indicator">LIVE</span>
  <span slot="spacer"></span>
  <span slot="text"></span>
</media-live-button>
