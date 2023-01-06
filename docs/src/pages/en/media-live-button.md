---
title: <media-live-button>
description: Media Live Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-live-button.js
---

The Media Live Button shows when the stream is live via an indicator (red dot, by default). It also allows the viewer to seek to the most current part of the stream by clicking on the button ("seek to live").

<h3>Default: Media is not live</h3>

<media-live-button></media-live-button>

```html
<media-live-button></media-live-button>
```

<h3>Media is live</h3>

<media-live-button media-time-is-live></media-live-button>

```html
<media-live-button media-time-is-live></media-live-button>
```

<h3>Alternate text</h3>

<media-live-button media-time-is-live>
  <span slot="text">Hello!</span>
</media-live-button>

```html
<media-live-button>
  <span slot="text">Hello</span>
</media-pip-button>
```

<h3>Alternate indicator SVG</h3>

<media-live-button>
  <svg slot="indicator" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"></circle></svg>
</media-live-button>
<media-live-button media-time-is-live>
  <svg slot="indicator" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"></circle></svg>
</media-live-button>

```html
<media-live-button media-time-is-live>
  <svg slot="indicator" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"></circle></svg>
</media-live-button>
```

<h3>Alternate indicator text or font icon</h3>

<media-live-button media-time-is-live>
  <span slot="indicator">Hello!</span>
</media-live-button>

```html
<media-live-button media-time-is-live>
  <span slot="indicator">Hello!</span>
</media-live-button>
```

<h3>Common Use: Text is also the indicator</h3>

<style>
  #textlive {
    --media-live-indicator-off-icon-color: white;
  }
</style>
<media-live-button id="textlive">
  <span slot="indicator">LIVE</span>
  <span slot="spacer"></span>
  <span slot="text"></span>
</media-live-button>
<media-live-button id="textlive" media-time-is-live>
  <span slot="indicator">LIVE</span>
  <span slot="spacer"></span>
  <span slot="text"></span>
</media-live-button>

```html
<style>
  #textlive {
    --media-live-indicator-off-icon-color: white;
  }
</style>
<media-live-button id="textlive">
  <span slot="indicator">LIVE</span>
  <span slot="spacer"></span>
  <span slot="text"></span>
</media-live-button>
```

## Attributes

| Name            | Type      | Default Value | Description |
| --------------- | --------- | ------------- | ----------- |
| `media-time-is-live` | `boolean` | `false`| Include when the media time is at or close to the most current time or _live edge_. Clicking the button will not seek to live when true. [_Set automatically by media-controller._] |
| `media-paused` | `boolean` | `false`| Include when the media is paused. The button will unpause the video if paused when seeking to live. [_Set automatically by media-controller._] |

## Slots

| Name    | Default Type | Description |
| ------- | ------------ | ----------- |
| `text` | `text` | The text content of the button, with a default of "LIVE". |
| `indicator`  | `svg` | The default is an SVG of a circle that changes to red when the video or audio is live. Can be replaced wiht your own SVG or font icon. |
| `spacer`  | `text` | A simple text space (`&nbsp;`) between the indicator and the text. |

## CSS Vars

See our [styling docs](./styling#Buttons)

| Var    | Description |
| ------ | ----------- |
| `--media-live-indicator-color` | The color of the indicator icon when the audio or video is live  |
| `--media-live-button-icon-color` | The color of the indicator icon when the audio or video is *not* live  |
