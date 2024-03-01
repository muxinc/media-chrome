---
title: <media-playback-rate-menu>
description: Media Playback Rate Menu
layout: ../../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-playback-rate-menu.js
---

A menu for playback rates.

### Default

<style>
  media-playback-rate-menu {
    min-width: 150px;
    min-height: 85px;
  }
</style>

<media-playback-rate-menu></media-playback-rate-menu>

```html
<media-playback-rate-menu></media-playback-rate-menu>
```

### Menu button

<div class="relative">
  <media-playback-rate-menu hidden id="menu1" anchor="menu-button1"></media-playback-rate-menu>
  <media-playback-rate-menu-button id="menu-button1" invoketarget="menu1"></media-playback-rate-menu-button>
</div>

```html
<div class="relative">
  <media-playback-rate-menu hidden id="menu1" anchor="button1"></media-playback-rate-menu>
  <media-playback-rate-menu-button id="button1" invoketarget="menu1"></media-playback-rate-menu-button>
</div>
```

### Setting rates

<div class="relative">
  <media-playback-rate-menu hidden rates="1 2 3" id="menu2" anchor="button2"></media-playback-rate-menu>
  <media-playback-rate-menu-button id="button2" invoketarget="menu2"></media-playback-rate-menu-button>
</div>

```html
<div class="relative">
  <media-playback-rate-menu hidden rates="1 2 3" id="menu2" anchor="button2"></media-playback-rate-menu>
  <media-playback-rate-menu-button id="button2" invoketarget="menu2"></media-playback-rate-menu-button>
</div>
```
