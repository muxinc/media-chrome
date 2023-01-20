---
title: Themes
description: Learn how to make themes with Media Chrome
layout: ../../layouts/MainLayout.astro
---

Media Chrome provides us with [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 
that are easy to [style via CSS](./styling.md). This is great for media players 
which are embedded in your own webpage or require less portability.

However it's often the case that a media player will be used by 3rd parties or 
maybe the player needs to support different permutations in look and feel.
Themes provide a great solution for changing the look and feel of your player,
and wrapping your media controls up in nice and portable package.

## Basics

Themes are created primarily with HTML + CSS and are defined in a [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) 
element. This can then be rendered by the `<media-theme>` web component. 
A small example will make this clear.

```html
<template id="tiny-theme">
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }
  </style>
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-control-bar>
      <media-play-button></media-play-button>
    </media-control-bar>
  </media-controller>
</template>

<media-theme template="tiny-theme">
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme>
```

<br>

<template id="tiny-theme">
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }
  </style>
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-control-bar>
      <media-play-button></media-play-button>
    </media-control-bar>
  </media-controller>
</template>

<media-theme template="tiny-theme">
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme>
