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
The below example will make this more clear.

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

<br>

Internally the `<template>` contents is cloned and appended to the shadow DOM of 
the `<media-theme>` element so you can make use of 
[`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)'s
to project HTML elements from the light DOM in the shadow DOM, like we did for
the video element in the example. This also means that the styles you define in 
the template don't bleed out in the main document.

## Template Syntax

In addition to all the features plain HTML and CSS give you we implemented
a minimal templating language. It's based on the 
[template parts proposal](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md).

We intentionally created this with approach-ability in mind in the same way
web components give you super powers without needing to write any complex JavaScript. 
Note that for most basic themes it's unlikely you'll even need this.


### Variables

The most basic tag type is the variable. A `{{name}}` tag in a basic template 
will try to find the name key in the current state that is derived from 
the `<media-theme>` attributes. Variables are escaped by default.

If you like to provide a fallback for a variable that might be empty,  
this can be done like so `{{name ?? 'Frank'}}`.

```html
<template id="tiny-theme">
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-text-display slot="top-chrome">
      {{videotitle ?? 'Unknown title'}}
    </media-text-display>
  </media-controller>
</template>

<media-theme template="tiny-theme" videotitle="My video title">
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-theme>
```

In the example above the `videotitle` attribute is provided to
`<media-theme>` element and this is then rendered in the template.

#### Special variables

There are a few special template variables that are available by default.
These are derived from the media state that the [media controller](./media-controller) 
collects.

- `streamType` - The media type that is loaded, either `on-demand` or `live`.
- `breakpointSm` - The value is `true` when the small breakpoint is activated.
- `breakpointMd` - The value is `true` when the medium breakpoint is activated.
- `breakpointLg` - The value is `true` when the large breakpoint is activated.
- `breakpointXl` - The value is `true` when the extra-large breakpoint is activated.


### Partials

Partials are defined by using an inner `<template>` element with a 
`partial` attribute which is set to a unique name in your theme.

```html
<template partial="PlayButton">
  <media-play-button></media-play-button>
</template>
```

These can then be used in other places in the theme with a partial variable 
like so `{{>PlayButton}}`. They can also accept params by adding them after 
the var name `{{>PlayButton section="center"}}`.

### Conditionals

When a single element or a multiple elements need to be left out from 
the theme when certain conditions are met it's possible to use a conditional. 
A conditional is also defined by an inner template with an `if` attribute. 
The value of this `if` attribute can be a simple equality check or just a empty check.

```html
<template if="streamType == 'on-demand'">
  <media-text-display>{{title}}</media-text-display>
</template>
```

