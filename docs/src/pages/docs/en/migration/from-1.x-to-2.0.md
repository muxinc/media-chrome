---
title: Migrating from v1.x to v2.0
description: Migration guide
layout: ../../../../layouts/MainLayout.astro
---

There is one breaking change in v2 that should be relatively easy to migrate to.
Here's a high level overview:

### Breaking changes

**Casting media element**
- Media Chrome v2 casting behavior requires [castable-video](https://github.com/muxinc/castable-video) v1.
- The custom built-in `<video is="castable-video">` should be replaced with `<castable-video>`.

### Example of HTML changes

If you were using `<video is="castable-video">` before, this should be replaced with `<castable-video>`.

The script loading of `cast_sender.js` is no longer required because castable-video will load it for you
if the [`video.remote`](https://developer.mozilla.org/en-US/docs/Web/API/RemotePlayback) property is accessed.

**Before**

```html
  <script defer src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/castable-video@0"></script>

  <media-controller>
    <video
      slot="media"
      is="castable-video"
      src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    ></video>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-cast-button></media-cast-button>
    </media-control-bar>
  </media-controller>
```

**After**

```html
  <script type="module" src="https://cdn.jsdelivr.net/npm/castable-video@1"></script>
  
  <media-controller>
    <castable-video
      slot="media"
      src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    ></castable-video>
    <media-control-bar>
      <media-play-button></media-play-button>
      <media-cast-button></media-cast-button>
    </media-control-bar>
  </media-controller>
```
