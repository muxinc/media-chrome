---
title: <media-controller>
description: Media Controller
layout: ../../layouts/MainLayout.astro
---

The `<media-controller>` manages communication of state and state change requests between a `media` element and control elements. It also provides some built in sizing and layout to make styling your player as easy as possible.

## Attributes

- `autohide (seconds, default: 0)` - (`video` only) Use this to autohide all controls/chrome (except for the `media`) after `n` seconds of inactivity, unless the media is paused. To disable `autohide`, set the value to -1.

Example:

```html
<media-controller autohide="2">
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <div slot="centered-chrome">
    <media-seek-backward-button></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button></media-seek-forward-button>
  </div>
  <media-control-bar class="seek-control-bar">
    <media-time-range></media-time-range>
    <media-time-display show-duration remaining></media-time-display>
  </media-control-bar>
  <media-control-bar>
    <media-mute-button></media-mute-button>
    <media-playback-rate-button></media-playback-rate-button>
    <media-pip-button></media-pip-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```

<img src="https://image.mux.com/yxrSF1II82CjDSLR4100Eo5jBndsznIU7I00ZFylJbfvU/animated.gif" alt="Example autohide behavior" width="600"/>

Example (`autohide` disabled):

```html
<media-controller autohide="-1">
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <div slot="centered-chrome">
    <media-seek-backward-button></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button></media-seek-forward-button>
  </div>
  <media-control-bar class="seek-control-bar">
    <media-time-range></media-time-range>
    <media-time-display show-duration remaining></media-time-display>
  </media-control-bar>
  <media-control-bar>
    <media-mute-button></media-mute-button>
    <media-playback-rate-button></media-playback-rate-button>
    <media-pip-button></media-pip-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```

- `gestures-disabled` - (`video` only) Use this to turn off any built in or custom gestures, such as "click to toggle play/pause".

Example (disabling gestures via `gestures-disabled`):

```html
<media-controller gestures-disabled>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <media-control-bar>
    <media-seek-backward-button></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button></media-seek-forward-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <media-time-display></media-time-display>
  </media-control-bar>
</media-controller>
```

- `nohotkeys` - Use this to turn off _all_ keyboard shortcuts.

Example (hotkeys disabled):

```html
<media-controller nohotkeys>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <media-control-bar>
    <media-seek-backward-button></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button></media-seek-forward-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <media-time-display></media-time-display>
  </media-control-bar>
</media-controller>
```

- `hotkeys` - Use this to turn off certain hotkeys.

If both `hotkeys` and `nohotkeys` are added to the MediaController, all hotkeys will be disabled.

Example (disallow seeking shortcuts):

```html
<media-controller hotkeys="noarrowleft noarrowright">
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <media-control-bar>
    <media-seek-backward-button></media-seek-backward-button>
    <media-play-button></media-play-button>
    <media-seek-forward-button></media-seek-forward-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <media-time-display></media-time-display>
  </media-control-bar>
</media-controller>
```
