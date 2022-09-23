---
title: Responsive controls
description: Learn how to make controls responsive with Media Chrome 
layout: ../../layouts/MainLayout.astro
---

One thing you'll quickly notice is that Media Chrome is not responsive out of
the box. This is by design, there are way too many permutations possible to
provide one configuration for a responsive media player. However media themes
will be introduced soon that can provide responsive behavior by default.

There are different techniques available to make your Media Chrome controls 
responsive but we'll keep it simple in this guide and make use of 
[`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
and CSS classes.

## Basic unresponsive layout

Lets create a basic layout for our Media Chrome player.

```html
<style>
  media-controller {
    display: block;
    aspect-ratio: 16 / 9;
  }
  video {
    width: 100%;
  }
</style>
<media-controller>
  <video
    playsinline
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    poster="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/thumbnail.jpg?time=56"
  ></video>
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
</media-controller>
```

<style>
  media-controller {
    display: block;
    aspect-ratio: 16 / 9;
  }
  video {
    width: 100%;
  }
</style>
<media-controller id="mc1">
  <video
    playsinline
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    poster="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/thumbnail.jpg?time=56"
  ></video>
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
</media-controller>

That looks pretty good but the controls are static no matter the size of the player. 
Lets change that, for this exercise we'll make a big center play button when the player 
width is smaller than `484px` and only show the timerange at the bottom of the player. 

## Observe player resizing

This will require the [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
to detect any size changes to the container of the player. You might be tempted
to use media queries for this but that solution will probably backfire because
a media query listens to the browser viewport dimensions, not the player container
dimensions. Soon we'll be able to use a CSS only solution called 
[CSS container queries](https://caniuse.com/css-container-queries) 
but until that's widely supported a little Javascript will do.

```html
<script>
  const breakpoints = { xs: 396, sm: 484, md: 576, lg: 768, xl: 960 };
  const resizeObserver = new ResizeObserver(function (entries) {
    entries.forEach((entry) => {
      const classNames = getBreakpoints(breakpoints, entry.contentRect);
      console.log(classNames);
    });
  });
  resizeObserver.observe(document.querySelector('media-controller'));

  function getBreakpoints(breakpoints, rect) {
    return Object.keys(breakpoints).filter((key) => {
      return rect.width >= breakpoints[key];
    });
  }
</script>
```

This little snippet will output the defined breakpoints as class names whenever
the width of the player is smaller than the defined breakpoint.

## CSS classes & properties

Now it's as simple as adding some CSS classes and CSS properties to hide and show controls based
on the breakpoints. 

```html
<style>
  media-controller {
    display: block;
    aspect-ratio: 16 / 9;
  }
  video {
    width: 100%;
  }

  /* Hide most of the bottom controls on a tiny player. */
  media-controller:not(.sm) .bottom :not(media-time-range) {
    display: none;
  }

  /* Hide the big center play button on a larger player. */
  media-controller.sm .center {
    display: none;
  }
</style>
<media-controller id="mc2">
  <video
    playsinline
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    poster="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/thumbnail.jpg?time=56"
  ></video>
  <div class="center" slot="centered-chrome">
    <media-play-button></media-play-button>
  </div>
  <media-control-bar class="bottom">
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-display></media-time-display>
    <media-time-range></media-time-range>
    <media-duration-display></media-duration-display>
    <media-playback-rate-button></media-playback-rate-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
<script>
  const breakpoints = { xs: 396, sm: 484, md: 576, lg: 768, xl: 960 };
  const mc = document.querySelector('#mc2');
  const resizeObserver = new ResizeObserver(function (entries) {
    entries.forEach((entry) => {
      const classNames = getBreakpoints(breakpoints, entry.contentRect);
      entry.target.className = classNames.join(' ');
    });
  });
  resizeObserver.observe(mc);

  function getBreakpoints(breakpoints, rect) {
    return Object.keys(breakpoints).filter((key) => {
      return rect.width >= breakpoints[key];
    });
  }
</script>
```

## Responsive Media Chrome player

Try changing the size of the player embed below to see if the controls
show and hide like expected.

<style>
  media-controller {
    display: block;
    aspect-ratio: 16 / 9;
  }
  video {
    width: 100%;
  }
  /* Hide most of the bottom controls on a tiny player. */
  media-controller:not(.sm) .bottom :not(media-time-range) {
    display: none;
  }
  /* Hide the big center play button on a larger player. */
  media-controller.sm .center {
    display: none;
  }
</style>
<media-controller id="mc2">
  <video
    playsinline
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    poster="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/thumbnail.jpg?time=56"
  ></video>
  <div class="center" slot="centered-chrome">
    <media-play-button></media-play-button>
  </div>
  <media-control-bar class="bottom">
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-display></media-time-display>
    <media-time-range></media-time-range>
    <media-duration-display></media-duration-display>
    <media-playback-rate-button></media-playback-rate-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
<script>
  const breakpoints = { xs: 396, sm: 484, md: 576, lg: 768, xl: 960 };
  const mc = document.querySelector('#mc2');
  const resizeObserver = new ResizeObserver(function (entries) {
    entries.forEach((entry) => {
      const classNames = getBreakpoints(breakpoints, entry.contentRect);
      entry.target.className = classNames.join(' ');
    });
  });
  resizeObserver.observe(mc);

  function getBreakpoints(breakpoints, rect) {
    return Object.keys(breakpoints).filter((key) => {
      return rect.width >= breakpoints[key];
    });
  }
</script>
