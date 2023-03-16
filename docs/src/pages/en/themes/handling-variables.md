---
title: Handling variables
description: Learn how to handle variables in Media Chrome Themes
layout: ../../../layouts/MainLayout.astro
---

Custom variables that the theme author defines can be provided by users of your
theme through attributes and then used inside your theme with double curly brackets,
for example `{{username}}`

If you would like to provide a fallback for a variable that might be empty,  
this can be done like so `{{username ?? 'Unknown username'}}`.

```html
<template id="vars-theme">
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-text-display slot="top-chrome">
      {{videotitle ?? 'Unknown video title'}}
    </media-text-display>
    <media-text-display slot="top-chrome">
      {{username ?? 'Unknown user'}}
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
      {{videotitle ?? 'Unknown video title'}}
    </media-text-display>
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
element and this is then rendered in the template. The `videotitle` defaults
to the value defined after the double question-mark operator in the theme.

## Avoid native attribute names

Avoid using native HTML attributes for variables. This includes things like:

- `title`. The native `title` attribute will add a tooltip on mouse hover. You can 
use something like `videotitle` instead.
- `style`. The native `style` attribute is used for CSS

Also avoid attribute names that conflict with the [**Special variables**](#special-variables) listed below.

## Special variables

There are a few special template variables that are available by default.
These are derived from the media state that the [media controller](./media-controller) 
collects.

- `streamType` - The media type that is loaded, either `on-demand` or `live`.
- `targetLiveWindow` - The duration of the live window that can be seeked.  
  For regular live this value is `0`, for DVR this is greater than `0`.
- `breakpointSm` - The value is `true` when the small breakpoint is activated.
- `breakpointMd` - The value is `true` when the medium breakpoint is activated.
- `breakpointLg` - The value is `true` when the large breakpoint is activated.
- `breakpointXl` - The value is `true` when the extra-large breakpoint is activated.

Breakpoint variables stack so that each size will include the current size plus 
all the smaller sizes below it. Learn more about building 
[Responsive themes with breakpoints](./responsive-themes).

## Variables with dashes

If you add an attribute with a dash like `song-title` the variable name inside the template
will be the camcelCase version: `songTitle`.

