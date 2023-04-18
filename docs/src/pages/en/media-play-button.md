---
title: <media-play-button>
description: Media Play Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-play-button.js
---

The `<media-play-button>` component is used to toggle your media playback state. In simpler terms, it is used to both play and pause your media content.

The contents and behavior of the `<media-play-button>` will update automatically once your media playback state changes.
  - When your media begins to play, the `<media-play-button>` component will switch to show the contents of its `pause` slot.
  - When your media is paused, the `<media-play-button>` component will display the contents of its `play` slot.

<h3>Play control appearance (paused state)</h3>

<media-play-button media-paused></media-play-button>

```html
<media-play-button media-paused></media-play-button>
```

<h3>Pause control appearance (playing state)</h3>

<media-play-button></media-play-button>

```html
<media-play-button></media-play-button>
```

<h3>Modifying the default appearance</h3>
You can modify the contents of the `<media-play-button>` component using slots. This is useful if you'd like to use your own custom play button instead of the default one provided by media-chrome.

Here's an example of how you can replace the default Play and Pause icons with the literal words "Play" and "Pause":

<media-play-button media-paused>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>
<media-play-button>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>

```html
<media-play-button media-paused>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>
<media-play-button>
  <span slot="play">Play</span>
  <span slot="pause">Pause</span>
</media-play-button>
```

## Attributes reference
The `<media-play-button>` does not expose any configuration attributes. However, it will be updated with **readonly** attributes any time your media playback state changes. 

`media-paused`

You can use these readonly attributes to apply custom styles to your `<media-play-button>` element under different state conditions:

```css
media-play-button[media-paused] {
  animation: glow 2s;
}
```

## Slots reference

| Name    | Default Type | Description                                                                                  |
| ------- | ------------ | -------------------------------------------------------------------------------------------- |
| `play`  | `svg`        | An element shown when the media is paused and pressing the button will start media playback  |
| `pause` | `svg`        | An element shown when the media is playing and pressing the button will pause media playback |


## Styling

See our [styling docs](./styling#Buttons)
