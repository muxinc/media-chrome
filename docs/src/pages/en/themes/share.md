---
title: Share themes
description: Share a theme via an NPM package
layout: ../../../layouts/MainLayout.astro
---

At some point you'd might want to share your theme with the world or
just make it exportable and packaged in a separate file.

There's a few ways to go about this but a flexible option is to wrap
the theme template in a 
[custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) 
in a Javascript ESM module.

If we take the [tiny-theme example](./#creating-a-tiny-theme) from 
the introduction this is how the Javascript theme file would look like.

```js
// media-theme-tiny.js
import { MediaThemeElement } from 'media-chrome/dist/media-theme-element.js';

const template = document.createElement('template');
template.innerHTML = `
  <media-controller>
    <slot name="media" slot="media"></slot>
    <media-control-bar>
      <media-play-button></media-play-button>
    </media-control-bar>
  </media-controller>
`;

class MediaThemeTiny extends MediaThemeElement {
  static template = template;
}

if (!globalThis.customElements.get('media-theme-tiny')) {
  globalThis.customElements.define('media-theme-tiny', MediaThemeTiny);
}

export default MediaThemeTiny;
```

And this is how it could be used in your web page or app.

```html
<script type="module" src="./media-theme-tiny.js"></script>

<media-theme-tiny>
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
  ></video>
<media-theme-tiny>
```
