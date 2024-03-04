---
title: Migrating from v2.x to v3.0
description: Migration guide
layout: ../../../../layouts/MainLayout.astro
---

There is one breaking change in v3 that should be relatively easy to migrate to, assuming you use it.
Here's a high level overview:

### Breaking changes

**Media state change events**
- Media state change events no longer bubble.

**Menu related components moved to stable**
- All components formerly in `./experimental/menu` are now stable in `./`.

**Time range boxes (tooltips) visual change**
- The time range boxes (tooltips) have been visually updated to include an arrow by default.

### New features

The primary reason for this major version bump is because we've completely reworked our media state management architecture under the hood. All of the ways you currently use Media Chrome should be identical, but this will unlock some new possibilities going forward. Stay tuned!

### Example of media state change event usage change

If you were relying on Media Chrome's media state change events (events that Media Controller dispatched whenever the corresponding media state changed; [example](https://media-chrome.mux.dev/examples/vanilla/state-change-events-demo.html)), you'll now want to add your event listeners directly to the Media Controller instance. That's it.
**_NOTE:_** This should not impact events propagating across web component boundaries, such as themes or bundled web component players like [Mux Player](https://www.mux.com/player), as these state change events are still [composed](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed).

**Before**

```html
  <div class="some-ancestor-element">
    <media-controller>
      <video
        slot="media"
        src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
      ></video>
      <media-control-bar>
        <media-play-button></media-play-button>
      </media-control-bar>
    </media-controller>
  </div>
  <script>
    const rootMonitorEl = document.querySelector('.some-ancestor-element');
    rootMonitorEl.addEventListener(
      'mediahasplayed',
      () => {
        // do some stuff when the media has played
      },
      { once: true }
    );
  </script>
```

**After**

```html
  <div class="some-ancestor-element">
    <media-controller>
      <video
        slot="media"
        src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
      ></video>
      <media-control-bar>
        <media-play-button></media-play-button>
      </media-control-bar>
    </media-controller>
  </div>
  <script>
    const mcEl = document.querySelector('media-controller');
    mcEl.addEventListener(
      'mediahasplayed',
      () => {
        // do some stuff when the media has played. Maybe still notify .some-ancestor-element.
      },
      { once: true }
    );
  </script>
```


