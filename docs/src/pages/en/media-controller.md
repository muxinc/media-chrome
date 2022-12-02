---
title: <media-controller>
description: Media Controller
layout: ../../layouts/MainLayout.astro
---

The `<media-controller/>` manages communication of state and state change requests between a `media` element and control elements. It also provides some built in sizing and layout to make styling your player as easy as possible.

## Attributes

### autohide

`autohide (seconds, default: 2)` (video only)

Use this to autohide all controls/chrome (except for the `media`) after `n` seconds of inactivity, unless the media is paused. To disable `autohide`, set the value to -1.

Example:

```html
<media-controller autohide="2">
  ...
</media-controller>
```

<img src="https://image.mux.com/yxrSF1II82CjDSLR4100Eo5jBndsznIU7I00ZFylJbfvU/animated.gif" alt="Example autohide behavior" width="600"/>

Example (`autohide` disabled):

```html
<media-controller autohide="-1">
  ...
</media-controller>
```

### gestures-disabled

`gestures-disabled` (boolean, video only) 

Use this to turn off any built in or custom gestures, such as "click to toggle play/pause".

Example (disabling gestures via `gestures-disabled`):

```html
<media-controller gestures-disabled>
  ...
</media-controller>
```

### nohotkeys

`nohotkeys` (boolean)

Use this to turn off _all_ keyboard shortcuts.

Example (hotkeys disabled):

```html
<media-controller nohotkeys>
  ...
</media-controller>
```

### hotkeys

`hotkeys` (string of multiple values)

Use this to turn off certain hotkeys. If both `hotkeys` and `nohotkeys` are added to the MediaController, all hotkeys will be disabled.

Example (disallow seeking shortcuts):

```html
<media-controller hotkeys="noarrowleft noarrowright">
  ...
</media-controller>
```

### default-stream-type

`default-stream-type` (values: `live`, `on-demand`)

Media controller can't know the stream is live or on-demand until the media is loaded. Setting `default-stream-type` can prevent UI changes happening between when the player is loaded and when the media is loaded. This may happen when a player is built to support both stream types, and then is used to play a stream type that is different from the player's default.

[See also media-stream-type.](./stream-type)

```html
<media-controller default-stream-type="live">
  ...
</media-controller>
```