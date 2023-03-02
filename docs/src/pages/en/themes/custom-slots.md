---
title: Custom slots
description: Add an extra level of customization to your theme with custom slots
layout: ../../../layouts/MainLayout.astro
---

Custom slots are a way for you to allow users of your theme to insert their
own custom HTML into specified areas of your theme.

The same way users pass in the media slot for their media element, they can pass in
other markup for a custom slot that you define.

For example, if you want to create a `"cta"` slot for users to pass in a call to
action button, you can create a slot called `"cta"`.

```html
<template id="my-slots-theme">
  <media-controller>
    <slot name="media" slot="media"></slot>
    <slot name="cta" slot="centered-chrome"></slot>
  </media-controller>
</template>

<media-theme template="my-slots-theme">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
  <a slot="cta" href="/buy" class="button">Buy my course!</a>
</media-theme>
```

<br>

<template id="my-slots-theme">
  <media-controller>
    <slot name="media" slot="media"></slot>
    <slot name="cta" slot="centered-chrome"></slot>
  </media-controller>
</template>

<media-theme template="my-slots-theme">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
  <a slot="cta" href="/buy" class="button">Buy my course!</a>
</media-theme>

## Slots exist in the light DOM

Slots exist in the light DOM (as opposed to the Shadow DOM). This has the advantage of being able
to use styles from the parent page. In the example above the class `button` are styles
coming from the user's application, not the theme itself.
