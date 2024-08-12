---
title: Migrating from v3.x to v4.0
description: Migration guide
layout: ../../../../layouts/MainLayout.astro
---

There are 3 breaking changes in v4 that should be relatively easy to migrate to.
Here's a high level overview:

### Breaking changes

**Tooltips are enabled by default**
- v4 comes with tooltips enabled by default. If you don't want them, you can disable them by setting the `notooltip` attribute on the specfic button. To disable all tooltips you can set the CSS var `--media-tooltip-display: none;` in `:host` or target a specific element.

**Deprecated experimental selectmenu related components**
- `media-chrome-listbox`, `media-chrome-option`, `media-chrome-selectmenu` and variants for captions, playback rate, rendition and audio tracks are now deprecated. Instead you can use the new menu components.

**Menu components moved to separate import**
- The menu components that were included by default in v3 are now moved to a separate import. This gives you more granular control and can save some extra weight in the final JS bundle if you don't need these components. You can import them from `media-chrome/dist/menu/index.js`.

### Example of HTML changes

**Before**

```html
  <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@3/+esm"></script>

  <media-controller>
    <mux-video
      slot="media"
      src="https://stream.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008.m3u8"
    ></mux-video>
    <media-rendition-menu anchor="auto" hidden></media-rendition-menu>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-time-range></media-time-range>
      <media-mute-button></media-mute-button>
      <media-rendition-menu-button></media-rendition-menu-button>
      <media-fullscreen-button></media-fullscreen-button>
    </media-control-bar>
  </media-controller>
```

**After**

```html
  <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@4/+esm"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@4/dist/menu/index.js/+esm"></script>

  <media-controller>
    <mux-video
      slot="media"
      src="https://stream.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008.m3u8"
    ></mux-video>
    <media-rendition-menu anchor="auto" hidden></media-rendition-menu>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-time-range></media-time-range>
      <media-mute-button></media-mute-button>
      <media-rendition-menu-button></media-rendition-menu-button>
      <media-fullscreen-button></media-fullscreen-button>
    </media-control-bar>
  </media-controller>
```
