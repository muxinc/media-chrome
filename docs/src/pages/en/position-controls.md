---
title: Position controls
description: Learn how to position controls with Media Chrome 
layout: ../../layouts/MainLayout.astro
---

## Slots for layout

Slots are used to tell `<media-controller>` where you want your controls positioned. Even if you aren't explicitly naming a slot, you're still using one (the "default slot"). Most commonly, you'll put media control elements like `<media-play-button>` or `<media-fullscreen-button>` inside slots. But any arbitrary markup can be placed inside a slot.

This gives you a lot of flexibility when customizing your player. For example, here is a player that has an h3 title in the top slot and a play button in the centered slot.

```html
<media-controller>
  <video slot="media"></video>
  <div slot="top-chrome">
    <h3>Episode 2</h3>
  </div>
  <div slot="centered-chrome">
    <media-play-button></media-play-button>
  </div>
</media-controller>
```

You also may want to show different slots on mobile vs. desktop. For example, here's a player that uses `slot="centered-chrome"` on mobile and uses a `<media-control-bar>` in the default slot (aka "`bottom-chrome`") on desktop:

```html
<style>
  .desktop {
    display: none;
  }
  @media (min-width: 768px) {
    .mobile {
      display: none;
    }
    .desktop {
      display: block;
    }
  }
</style>

<media-controller>
  <video slot="media"></video>
  <div slot="top-chrome">
    <h3>Episode 2</h3>
  </div>
  <div slot="centered-chrome" class="mobile">
    <media-play-button></media-play-button>
  </div>
  <media-control-bar class="desktop">
    <!-- This will go in the default slot, effectively the "bottom-chrome" -->
    <media-play-button></media-play-button>
  </media-control-bar>
</media-controller>
```

Below is a more in-depth discussion of available slots and how they work.

(**NOTE**: slots are actually [part of the Web Components / Custom Elements specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots), but you shouldn't need to understand these technical details to work with them in `<media-chrome>`)

### Working with slots (video)

![media controller slots layout](/assets/media-controller-slots.png)

For an interactive example of how each of the slots render for `video`, check out [this demo](https://media-chrome.mux.dev/examples/vanilla/slots-demo.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/slots-demo.html)).

#### Default Slot (effectively the "`bottom-chrome`")

<br>
<img src="/assets/bottom-chrome.png" alt="Bottom Chrome Visual Description" width="800"/>
<br>
<br>

- Render Location: Each child that doesn't specify a slot will render at the bottom of the `<media-controller>`. If you have more than one element like this they will be stacked vertically.

- Common/Example use cases: showing one or more rows of controls at the bottom of the `<media-controller>`. For many use cases, you can simply add a `<media-control-bar>` for each row of controls you'd like, which will provide you with additional automatic sizing and layout behavior.
  - [Basic example](https://media-chrome.mux.dev/examples/vanilla/basic.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/basic.html))
  - [Mobile example](https://media-chrome.mux.dev/examples/vanilla/mobile.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/mobile.html))
  - [Youtube theme](https://media-chrome.mux.dev/examples/vanilla/themes/youtube-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/themes/youtube-theme.html))
  - [Netflix theme](https://media-chrome.mux.dev/examples/vanilla/themes/netflix-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/themes/netflix-theme.html))

#### `top-chrome`

<br>
<img src="/assets/top-chrome.png" alt="Top Chrome Visual Description" width="800"/>
<br>
<br>

- Render Location: Each child that specifies `slot="top-chrome"` will render at the top of the `<media-controller>`. If you have more than one element like this they will be stacked vertically.

- Common/Example use cases: showing one or more rows of controls at the top of the `<media-controller>`. For many use cases, you can simply add a `<media-control-bar>` for each row of controls you'd like.
  - [Demuxed 2021 theme](https://media-chrome.mux.dev/examples/vanilla/themes/demuxed-2021-theme.html) (mobile screen sizes only) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/themes/demuxed-2021-theme.html))

#### `middle-chrome`

<br>
<img src="/assets/middle-chrome.png" alt="Middle Chrome Visual Description" width="800"/>
<br>
<br>

- Render Location: Children that specify `slot="middle-chrome"` will show up in the available space between any "`top-chrome`" children and any default slot/"`bottom-chrome`" children.

- Common/Example use cases: `middle-chrome` would generally be used for more specific cases, such as custom subtitle/caption rendering, or additional related content you'd like to show while the media is paused or has finished playback. While you **_can_** have multiple children that are "slotted to" `middle-chrome`, most likely, you'll want to use one and style it to size/layout any custom content you'd like.
  - (Examples coming!)

#### `centered-chrome`

<br>
<img src="/assets/centered-chrome.png" alt="Centered Chrome Visual Description" width="800"/>
<br>
<br>

- Render Location: The child that specifies `slot="centered-chrome"` will show up in the center of the `<media-controller>` and will be "above" anything in the default slot, `top-chrome`, or `middle-chrome`.

- Common/Example use cases: "big button" controls that are centered and horizontally layed out "on top of" the media. While you **_can_** have multiple children that are "slotted to" `centered-chrome`, most likely, you'll want to use only one, making styling and layout easier and more predictable.
  - [Mobile example](https://media-chrome.mux.dev/examples/vanilla/mobile.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/mobile.html))
  - [Demuxed 2021 theme](https://media-chrome.mux.dev/examples/vanilla/themes/demuxed-2021-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/themes/demuxed-2021-theme.html))

#### Other use cases

<figure>
<img src="/assets/mix-and-match.png" alt="Mix and Match Usage Visual Description" width="800"/>
<figcaption>Mix and match your use of slots (e.g. using <code>&lt;media-control-bar/&gt;</code> at the top and bottom)</figcaption>
</figure>

<br>

<figure>
<img src="/assets/responsive.png" alt="Responsive Design Visual Description" width="800"/>
<figcaption>Use media queries for desktop-only or mobile-only controls, just like any HTML element</figcaption>
</figure>

### Working with slots (audio)

Since `audio` chromes vary much more than `video`, it's recommended that you only use the default slot and only add a single element (e.g. a single `<media-control-bar>`) and style it however you'd like.

As we work through other common use cases, both internally and with the community, we may start adding additional "built-in" styling and layout for `<media-control-bar>` slots used with `audio`.

- Example use cases:
  - [Basic example](https://media-chrome.mux.dev/examples/vanilla/basic.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/basic.html))
  - [Spotify theme](https://media-chrome.mux.dev/examples/vanilla/themes/spotify-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/vanilla/themes/spotify-theme.html))
