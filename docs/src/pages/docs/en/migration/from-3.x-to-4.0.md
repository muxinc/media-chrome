---
title: Migrating from v3.x to v4.0
description: Migration guide
layout: ../../../../layouts/MainLayout.astro
---

There are 3 breaking changes in v4 that should be relatively easy to migrate to.
Here's a high level overview:

### Release notes

- The Media Chrome source code is now completely written in TypeScript.
- A new component `<media-tooltip>` is introduced to show tooltips for the control buttons.
- Menu related components are moved to a separate import.


### Breaking changes

**Media Chrome source code is now written in TypeScript**
- The source code is now written in TypeScript. In most cases this should not affect your app, only in some rare cases you might have to update some types in your app. If you're importing the source code directly, you will need to update your import paths to `.ts` files.

**Tooltips are enabled by default**
- v4 comes with tooltips enabled by default. If you don't want them, you can disable them by setting the `notooltip` attribute on the specfic button. To disable all tooltips you can set the CSS var `--media-tooltip-display: none;` on the `media-controller` element.

**Deprecated experimental selectmenu related components**
- `media-chrome-listbox`, `media-chrome-option`, `media-chrome-selectmenu` and variants for captions, playback rate, rendition and audio tracks are now deprecated. Instead you can use the new menu components.

**Menu components moved to separate import**
- The menu components that were included by default in v3 are now moved to a separate import. This gives you more granular control and can save some extra weight in the final JS bundle if you don't need these components. You can import them from `media-chrome/menu`.


### Example of HTML changes

#### Disable default enabled tooltips for all buttons

**Before**

```html
  <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@3/+esm"></script>

  <media-controller>
    <mux-video
      slot="media"
      src="https://stream.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008.m3u8"
    ></mux-video>
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

  <style>
    media-controller {
      --media-tooltip-display: none;
    }
  </style>

  <media-controller>
    <mux-video
      slot="media"
      src="https://stream.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008.m3u8"
    ></mux-video>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-time-range></media-time-range>
      <media-mute-button></media-mute-button>
      <media-rendition-menu-button></media-rendition-menu-button>
      <media-fullscreen-button></media-fullscreen-button>
    </media-control-bar>
  </media-controller>
```

#### Menu components moved to separate import

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
  <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@4/menu/+esm"></script>

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
