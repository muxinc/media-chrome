---
title: Themes
description: Learn how to make themes with Media Chrome
layout: ../../layouts/MainLayout.astro
---

Media Chrome provides us with [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 
that are easy to [style via CSS](./styling.md) which is great for media players 
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
A shiny new web component called `<media-theme>` can then take the contents of
the template and render this in its 
[shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).
If you're unfamiliar with shadow DOM, you can think of it as a separate
document attached to a web component that prevents leaking styles and DOM behaviors
to the main document.

### Creating a theme

First we define the `<template>` with a unique `id` attribute and add the HTML
and CSS as contents for the theme of our dreams. Any valid HTML is allowed.

Next up declare a `<media-theme>` element where you would like to show the theme,
set a `template` attribute to your chosen unique template `id` to link them up
and voila your theme will appear!


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

If you would like to provide a fallback for a variable that might be empty,  
this can be done like so `{{name ?? 'Frank'}}`.

```html
<template id="vars-theme">
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-text-display slot="top-chrome">
      {{videotitle ?? 'Unknown title'}}
    </media-text-display>
  </media-controller>
</template>

<media-theme template="vars-theme" videotitle="My video title">
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
      {{videotitle ?? 'Unknown title'}}
    </media-text-display>
  </media-controller>
</template>

<media-theme template="vars-theme" videotitle="My video title">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
</media-theme>

[![Edit Media Chrome Vars Theme](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/media-chrome-vars-theme-nejd49?fontsize=14&hidenavigation=1&theme=dark)

In the example above the `videotitle` attribute is provided to the `<media-theme>` 
element and this is then rendered in the template.

> It's recommended not to use the native `title` attribute because this will add
a tooltip on mouse hover.

If you add an attribute with a dash like `song-title` make sure to access the
variable in the template with a camelCase name like `songTitle`.

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
like so `{{>PlayButton}}`. They can also accept parameters by adding them after 
the var name `{{>PlayButton section="center"}}`.

### Conditionals

When elements need to be left out from 
the theme when certain conditions are met it's possible to use a conditional. 
A conditional is also defined by an inner template with an `if` attribute. 
The value of this `if` attribute can be a simple equality check or just an empty check.

```html
<template if="streamType == 'on-demand'">
  <media-text-display>{{title}}</media-text-display>
</template>
```

### Creating a multi-layout theme

There's a few ways to implement layouts that change based on context, one is
explained in [Responsive controls](./responsive-controls). This is based on
showing / hiding elements via pure CSS. 
[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries) 
and [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
are a powerful way to change the layout and style of your theme.

The template syntax offers an alternative to implement a multi-layout theme by only
rendering certain DOM fragments based on a condition you specify as seen in the
Conditionals section above. This can be beneficial as your theme grows larger or
if you prefer to not render DOM that is hidden to the user.

Let's take a look at how a theme might look like with these conditions in place.

```html
<template id="multi-theme">
  <style>
    :host {
      display: block;
      line-height: 0;
    }
    :host([audio]) {
      min-height: 44px;
    }
    media-controller {
      width: 100%;
      height: 100%;
    }
    .spacer {
      flex-grow: 1;
      background-color: var(
        --media-control-background,
        rgba(20, 20, 30, 0.7)
      );
    }
  </style>
  <media-controller>
    <slot name="media" slot="media"></slot>
    <template if="audio">
      <template if="streamType == 'on-demand'">
        <template if="title">
          <media-control-bar>{{mediatitle}}</media-control-bar>
        </template>
        <media-control-bar>
          <media-play-button></media-play-button>
          <media-time-display show-duration></media-time-display>
          <media-time-range></media-time-range>
          <media-playback-rate-button></media-playback-rate-button>
          <media-mute-button></media-mute-button>
          <media-volume-range></media-volume-range>
        </media-control-bar>
      </template>
    </template>
    <template if="audio == null">
      <template if="streamType == 'on-demand'">
        <template if="breakpointSm == null">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <div class="spacer"></div>
            <media-time-display></media-time-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
        <template if="breakpointSm">
          <template if="breakpointMd == null">
            <div slot="centered-chrome">
              <media-play-button></media-play-button>
            </div>
            <media-control-bar>
              <media-mute-button></media-mute-button>
              <media-time-display></media-time-display>
              <media-time-range></media-time-range>
              <media-duration-display></media-duration-display>
              <media-playback-rate-button></media-playback-rate-button>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </template>
        </template>
        <template if="breakpointMd">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <media-time-display></media-time-display>
            <media-time-range></media-time-range>
            <media-duration-display></media-duration-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
      </template>
    </template>
  </media-controller>
</template>
```

<template id="multi-theme">
  <style>
    :host {
      display: block;
      line-height: 0;
    }
    :host([audio]) {
      min-height: 44px;
    }
    media-controller {
      width: 100%;
      height: 100%;
    }
    .spacer {
      flex-grow: 1;
      background-color: var(
        --media-control-background,
        rgba(20, 20, 30, 0.7)
      );
    }
  </style>
  <media-controller>
    <slot name="media" slot="media"></slot>
    <template if="audio">
      <template if="streamType == 'on-demand'">
        <template if="title">
          <media-control-bar>{{mediatitle}}</media-control-bar>
        </template>
        <media-control-bar>
          <media-play-button></media-play-button>
          <media-time-display show-duration></media-time-display>
          <media-time-range></media-time-range>
          <media-playback-rate-button></media-playback-rate-button>
          <media-mute-button></media-mute-button>
          <media-volume-range></media-volume-range>
        </media-control-bar>
      </template>
    </template>
    <template if="audio == null">
      <template if="streamType == 'on-demand'">
        <template if="breakpointSm == null">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <div class="spacer"></div>
            <media-time-display></media-time-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
        <template if="breakpointSm">
          <template if="breakpointMd == null">
            <div slot="centered-chrome">
              <media-play-button></media-play-button>
            </div>
            <media-control-bar>
              <media-mute-button></media-mute-button>
              <media-time-display></media-time-display>
              <media-time-range></media-time-range>
              <media-duration-display></media-duration-display>
              <media-playback-rate-button></media-playback-rate-button>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </template>
        </template>
        <template if="breakpointMd">
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <media-time-display></media-time-display>
            <media-time-range></media-time-range>
            <media-duration-display></media-duration-display>
            <media-playback-rate-button></media-playback-rate-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </template>
      </template>
    </template>
  </media-controller>
</template>

#### On-demand Audio Layout

<media-theme template="multi-theme" audio mediatitle="My audio title">
  <audio
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></audio>
</media-theme>

#### On-demand Video Layout

<media-theme template="multi-theme" mediatitle="My video title">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
</media-theme>

<br>

[![Edit Media Chrome Multi-layout Theme](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/media-chrome-multi-layout-theme-gwlon8?fontsize=14&hidenavigation=1&theme=dark)
