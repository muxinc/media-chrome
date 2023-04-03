---
title: Responsive controls
description: Learn how to make controls responsive with Media Chrome 
layout: ../../layouts/MainLayout.astro
---

One thing you'll quickly notice is that Media Chrome is not responsive out of
the box. This is by design, there are way too many permutations possible to
provide one configuration for a responsive media player.

There are different techniques available to make your Media Chrome controls 
responsive. We'll show you a future facing method using
[Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
(CQ) and a simple but cross browser method using a
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
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
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
  #mc1 {
    display: block;
    aspect-ratio: 16 / 9;
  }
  #mc1 video {
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
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
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

## Using Container Queries

You might already be familiar with [Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
in CSS. They allow you to have different CSS selectors depending on the size of the page itself.
However, since we're building a video player, that doesn't help us much.
Instead, we are finally getting Container Queries, which allows us to create CSS selectors
that apply depending on the size of an element itself, which is exactly what we want
for a responsive video player, where the dimensions of the player itself are what matters
rather than the dimensions of the page that the player is on.

### Browser Support

Since CQ is quite new, it's not available everywhere yet.
Depending on the browsers that you need to support, that may not be an issue.
However, to support the most users, it's recommended to write your styles in a progressive enhancement approach,
which we will go over, and consider including the
[Containuer Queries Polyfill](https://github.com/GoogleChromeLabs/container-query-polyfill) as well.

### Simple Responsive Layout

Let's make a [simple responsive layout](https://media-chrome-mux.vercel.app/sandbox/vanilla/responsive.html).
In addition to the media-control-bar above, we want to add some center controls.
```html
<div class="center" slot="centered-chrome">
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
</div>
```

When the player dimensions are small, we can hide the control bar and only show these center controls.
When the player is medium sized, we can keep the control bar but hide the buttons that are available in the center controls.
In a large player size, we can show just the control bar.

The combined HTML for the player should look like this:
```html
<media-controller>
  <video
    playsinline
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    poster="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/thumbnail.jpg?time=56"
  ></video>
  <div class="center" slot="centered-chrome">
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
  </div>
  <media-control-bar class="bottom">
    <media-play-button></media-play-button>
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
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

### Default behavior

Now, we have a working player, but the center controls are always showing up.
We only want them to show up in some specific cases, so, let's hide them by default.
```css
.center {
  display: none;
}
```
This would also help for progressive enhancement, because then on browsers without CQ,
we'll have a player that only has the bottom control bar, which looks better.

### Making it responsive
Now, let's make it responsive with container queries.

First, we need to declare the `media-controller` as a `container`
```css
media-controller {
  container: media-chrome / inline-size;
}
```
This marks `media-controller` as a container named `media-chrome` should we
have multiple containers that we need to refer to by name. We also tell CQ that
we only care about the inline-size of this element, in this case it's the width
of the player.

### The small player size

For the smaller player, we want to show the center controls,
since they are hidden by default, and then hide the control bar.
```css
@container (inline-size < 420px) {
  .center {
    display: block;
  }
  media-control-bar {
    display: none;
  }
}
```
This tells CSS that apply `display: block` to the `.center` class if the `inline-size`,
aka the width player, is less than `420px`.
This range syntax is brand new and may not be supported everywhere yet.
We can use `max-width` instead, like so:
```css
@container (max-width: 420px) {
  .center {
    display: block;
  }
  media-control-bar {
    display: none;
  }
}
```
This isn't a big difference yet, but the new syntax will be especially nice in the medium player size.

### The medium player size.

For the medium player, we want to show the center controls and control bar.
However, because space is a bit cramped, we'll hide the controls available
in the center controls from the control bar.
```css
@container (420px <= inline-size <= 590px) {
  .center {
    display: block;
  }
  media-control-bar {
    display: flex;
  }
  media-control-bar media-play-button,
  media-control-bar media-seek-backward-button,
  media-control-bar media-seek-forward-button {
    display: none;
  }
}
```
Once again, since the new range syntax isn't available yet,
you can use `min-width`, `max-width`, and `and`, but it's not quite as nice as the range syntax.
```css
@container (min-width: 420px) and (max-width: 590px) {
  .center {
    display: block;
  }
  media-control-bar {
    display: flex;
  }
  media-control-bar media-play-button,
  media-control-bar media-seek-backward-button,
  media-control-bar media-seek-forward-button {
    display: none;
  }
}
```

### The large player size
Now, since we already have a default that hides the center controls in the cases where
the player isn't small or medium, we don't strictly need another container query,
but let's add one for the sake of completeness.
```css
@container (inline-size > 590px) {
  .center {
    display: none;
  }
  media-control-bar {
    display: flex;
  }
}
```

### Putting it all together.
```css
.center {
  display: none;
}

/* declare media-controller as a containuer for CQ */
media-controller {
  container: media-chrome / inline-size;
}

/* small player size */
@container (inline-size < 420px) {
  .center {
    display: block;
  }
  media-control-bar {
    display: none;
  }
}

/* medium player size */
@container (420px <= inline-size <= 590px) {
  .center {
    display: block;
  }
  media-control-bar {
    display: flex;
  }
  media-control-bar media-play-button,
  media-control-bar media-seek-backward-button,
  media-control-bar media-seek-forward-button {
    display: none;
  }
}

/* large (default) player size */
@container (inline-size > 590px) {
  .center {
    display: none;
  }
  media-control-bar {
    display: flex;
  }
}
```

#### Responsive Player using Container Queries
Together, it'll give you a player like this.
You can resize the page and see how the player responds to the page width.
Or select a width with the following radio buttons.

<style>
.width-controls {
  padding-block: 1rem;
}
.width-controls label {
  padding-inline: 0.5rem 1rem;
}
</style>
<div class="width-controls">
  <input name="width" id="auto-width" type="radio" value checked>
  <label for="auto-width">auto (default)</label>
  <input name="width" id="small-width" type="radio" value="400px">
  <label for="small-width">small</label>
  <input name="width" id="medium-width" type="radio" value="500px">
  <label for="medium-width">medium</label>
  <input name="width" id="large-width" type="radio" value="600px">
  <label for="large-width">large</label>
</div>
<script>
document.querySelectorAll('[name=width]').forEach(radio => {
  radio.addEventListener('click', function(e) {
    const responsivePlayer = document.querySelector('#res-final');
    const value = e.target.value;
    <!-- if (value) { -->
      responsivePlayer.style.width = value;
    <!-- } else { -->

  });
});
</script>

<style>
.center {
  display: none;
}

/* declare media-controller as a containuer for CQ */
#res-final {
  display: block;
  aspect-ratio: 16 / 9;
  container: media-chrome / inline-size;
}
#res-final video {
  width: 100%;
}

/* small player size */
@container (inline-size < 420px) {
  #res-final .center {
    display: block;
  }
  #res-final media-control-bar {
    display: none;
  }
}

/* medium player size */
@container (420px <= inline-size <= 590px) {
  #res-final .center {
    display: block;
  }
  #res-final media-control-bar {
    display: flex;
  }
  #res-final media-control-bar media-play-button,
  #res-final media-control-bar media-seek-backward-button,
  #res-final media-control-bar media-seek-forward-button {
    display: none;
  }
}

/* large (default) player size */
@container (inline-size > 590px) {
  #res-final .center {
    display: none;
  }
  #res-final media-control-bar {
    display: flex;
  }
}
</style>
<media-controller id="res-final">
  <video
    playsinline
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
    poster="https://image.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/thumbnail.jpg?time=56"
  ></video>
  <div class="center" slot="centered-chrome">
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
  </div>
  <media-control-bar class="bottom">
    <media-play-button></media-play-button>
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-display></media-time-display>
    <media-time-range></media-time-range>
    <media-duration-display></media-duration-display>
    <media-playback-rate-button></media-playback-rate-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>

## Using Resize Observer

### Observe player resizing

Since we're still waiting for 
[CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries) 
to get [wider adoption](https://caniuse.com/css-container-queries), 
this will require [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
to detect any size changes to the container of the player. 

You might be tempted to use media queries for this but that solution will probably 
backfire because a media query listens to the browser viewport dimensions, 
not the player container dimensions.

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

### CSS classes & properties

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
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
  </div>
  <media-control-bar class="bottom">
    <media-play-button></media-play-button>
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
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

### Responsive Media Chrome player

Try changing the size of the player embed below to see if the controls
show and hide like expected.

<style>
  #mc2 {
    display: block;
    aspect-ratio: 16 / 9;
  }
  #mc2 video {
    width: 100%;
  }
  /* Hide most of the bottom controls on a tiny player. */
  #mc2:not(.sm) .bottom :not(media-time-range) {
    display: none;
  }
  /* Hide the big center play button on a larger player. */
  #mc2.sm .center {
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
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
  </div>
  <media-control-bar class="bottom">
    <media-play-button></media-play-button>
    <media-seek-backward-button seek-offset="15"></media-seek-backward-button>
    <media-seek-forward-button seek-offset="15"></media-seek-forward-button>
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
