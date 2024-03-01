---
title: <media-captions-menu>
description: Media Captions Menu
layout: ../../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-captions-menu.js
---

A menu for subtitles and captions.

### Default with content

<style>
  media-captions-menu {
    min-width: 150px;
    min-height: 85px;
  }
</style>

<media-captions-menu mediasubtitleslist="cc:en:English sb:en:Subs%20English sb:ja:Subs%20Japanese sb:sv:Subs%20Swedish"></media-captions-menu>

```html
<media-captions-menu mediasubtitleslist="cc:en:English sb:en:Subs%20English sb:ja:Subs%20Japanese sb:sv:Subs%20Swedish"></media-captions-menu>
```


### Menu button

<div class="relative">
  <media-captions-menu hidden id="menu1" anchor="menu-button1" mediasubtitleslist="cc:en:English" mediasubtitlesshowing="cc:en:English"></media-captions-menu>
  <media-captions-menu-button id="menu-button1" invoketarget="menu1" mediasubtitlesshowing="cc:en:English"></media-captions-menu-button>
</div>

```html
<div class="relative">
  <media-captions-menu hidden id="menu1" anchor="button1" mediasubtitleslist="cc:en:English" mediasubtitlesshowing="cc:en:English"></media-captions-menu>
  <media-captions-menu-button id="button1" invoketarget="menu1" mediasubtitlesshowing="cc:en:English"></media-captions-menu-button>
</div>
```

### Alternate Content

For alternative content for the button, there are the `on` and `off` slots.

<div class="relative">
  <media-captions-menu hidden id="menu2" anchor="button2" mediasubtitleslist="cc:en:English" mediasubtitlesshowing="cc:en:English"></media-captions-menu>
  <media-captions-menu-button id="button2" invoketarget="menu2">
    <span slot="on"><b><u>CC</u></b></span>
    <span slot="off">CC</span>
  </media-captions-menu-button>
</div>

```html
<div class="relative">
  <media-captions-menu hidden id="menu2" anchor="button2" mediasubtitleslist="cc:en:English" mediasubtitlesshowing="cc:en:English"></media-captions-menu>
  <media-captions-menu-button id="button2" invoketarget="menu2">
    <span slot="on"><b><u>CC</u></b></span>
    <span slot="off">CC</span>
  </media-captions-menu-button>
</div>
```
