---
title: Introduction to themes
description: Understand how Media Chrome themes work and when you would want to build a theme
layout: ../../../../layouts/MainLayout.astro
---

Media Chrome provides you with [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 
that are easy to [style via CSS](./styling). This is great for media players 
that are embedded in your own webpage or require less portability. However it's 
often the case that a media player will be used by 3rd parties or 
maybe the player needs to support different layouts and styles depending on
the context.

Themes provide a great solution for changing the look and feel of your player,
and wrap your media controls up in a nice and portable package.

## Basics

Themes are created primarily with HTML + CSS and its contents are defined in a 
[`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
element. 
The web component `<media-theme>` takes the contents of the template and renders this in its 
[shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).
If you're unfamiliar with shadow DOM, you can think of it as a separate
document attached to a web component that prevents leaking styles and DOM behaviors
to the main document.

### Creating a theme

First define the `<template>` with a unique `id` attribute and add the HTML
and CSS as contents for the theme you're creating. Any valid HTML is allowed.

Next up declare a `<media-theme>` element where you would like to show the theme,
set a `template` attribute to your chosen unique template `id` to link them up. 
This is all you need for your theme to appear.


```html
<template id="hello-theme">Hello world</template>
<media-theme template="hello-theme"></media-theme>
```

<template id="hello-theme">Hello world</template>
<blockquote>
  <media-theme template="hello-theme"></media-theme>
</blockquote>

You could say `<media-theme>` is a simple template renderer and that's true for now
but it does a bit more behind the scenes as you will find out later in this article.


### Creating a Tiny theme

Outputting `Hello world` probably ain't gonna impress your boss who wants to see
a slick new media player so lets up the game by adding some Media Chrome
components.

Internally the `<template>` contents is rendered to the shadow DOM of 
the `<media-theme>` element so you can make use of 
[`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)'s
to project HTML elements from the light DOM to the shadow DOM.

In the example below we make use of a forwarding slot for the media, the video
element will end up in the layout defined by the media controller.

```html
<template id="tiny-theme">
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
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
</media-theme>
```

<br>

<template id="tiny-theme">
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
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
</media-theme>

[![Edit Media Chrome Tiny Theme](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/trusting-rhodes-7d6y0v?fontsize=14&hidenavigation=1&theme=dark)


## Variables

Themes support variables that get passed into the theme via HTML attributes. Variables
are accessed with double curly brackets inside the theme. This is an example of a theme
supporting a custom variable `username`

```html
<template id="vars-theme">
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-text-display slot="top-chrome">
      {{username ?? 'Unknown username'}}
    </media-text-display>
  </media-controller>
</template>

<media-theme template="vars-theme" username="bobbytables">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
</media-theme>
```

<br>

<template id="vars-theme">
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-text-display slot="top-chrome">
      {{username ?? 'Unknown username'}}
    </media-text-display>
  </media-controller>
</template>

<media-theme template="vars-theme" username="bobbytables">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
</media-theme>

[![Edit Media Chrome Vars Theme](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/media-chrome-vars-theme-nejd49?fontsize=14&hidenavigation=1&theme=dark)

In the example above the `username` attribute is provided to the `<media-theme>` 
element and this is then rendered in the template.

Learn more about [Handling variables in Themes here](/en/themes/handling-variables), 
including special variables that are already available in your theme.

## Partials

Partials are defined by using an inner `<template>` element with a 
`partial` attribute which is set to a unique name in your theme.

```html
<template partial="PlayButton">
  <media-play-button></media-play-button>
</template>
```

These can then be used in other places in the theme with a partial variable 
like so `{{>PlayButton}}`. They can also accept parameters by adding them after 
the var name `{{>PlayButton section="center"}}`.

Learn more about partials and how you can use them to create 
a [Responsive Theme](/en/themes/responsive-themes).

## Conditionals

When elements need to be left out from 
the theme when certain conditions are met it's possible to use a conditional. 
A conditional is also defined by an inner template with an `if` attribute. 
The value of this `if` attribute can be a simple equality check or just an empty check.

```html
<template if="streamtype == 'on-demand'">
  <media-text-display>{{title}}</media-text-display>
</template>
```

[![Edit Media Chrome Multi-layout Theme](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/media-chrome-multi-layout-theme-gwlon8?fontsize=14&hidenavigation=1&theme=dark)

Learn more about conditionals and how you can use them to create 
a [Responsive Theme](/en/themes/responsive-themes).

