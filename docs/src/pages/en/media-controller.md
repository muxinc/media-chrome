---
title: <media-controller>
description: Media Controller
layout: ../../layouts/MainLayout.astro
---

The `<media-controller>` manages communication of state and state change requests between a `media` element and control elements. It also provides some built in sizing and layout to make styling your player as easy as possible.

## Attributes

### audio

`audio` (boolean)

Use this to enable audio chrome UI, which will not have any of the slots described in the [Position controls guide]("/en/position-controls"), but instead have a single default slot for adding markup.

```html
<media-controller audio>
  ...
</media-controller>
```

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

### breakpoints

`breakpoints` (string of multiple values, default: `sm:384 md:576 lg:768 xl:960`)

Change the default breakpoints that will get activated once the player width
equals or is greater than the breakpoint value. The breakpoints are propagated
as `breakpointx` attributes on media-controller and as `breakpointx`
[theme variables](./themes/handling-variables).

```html
<media-controller breakpoints="sm:300 md:700">
  ...
</media-controller>
```

### defaultsubtitles

`defaultsubtitles` (boolean)

When enabled, this will cause captions or subtitles to be turned on by default, if available.

### defaultstreamtype

`defaultstreamtype` (values: `live`, `on-demand`)

Media controller can't know the stream is live or on-demand until the media is loaded. Setting `defaultstreamtype` can prevent UI changes happening between when the player is loaded and when the media is loaded. This may happen when a player is built to support both stream types, and then is used to play a stream type that is different from the player's default.

[See also mediastreamtype.](./stream-type)

```html
<media-controller defaultstreamtype="live">
  ...
</media-controller>
```

### fullscreenelement

`fullscreenelement` (`id` string)

By default, the media-controller will be the target element when entering fullscreen. However, you may specify a different element by setting `fullscreenelement` to that
element's `id` attribute.

```html
<div id="wrapper">
  <media-controller fullscreenelement="wrapper">
    ...
  </media-controller>
  <div>This will show up when in fullscreen.</div>
  ...
</div>
```

NOTE: For more advanced use cases, there is also the `fullscreenElement` property, which allows you to set the target fullscreen element by reference instead.

```js
mediaControllerEl.fullscreenElement = myWrapperEl;
```

### gesturesdisabled

`gesturesdisabled` (boolean, video only)

Use this to turn off any built in or custom gestures, such as "click to toggle play/pause".

Example (disabling gestures via `gesturesdisabled`):

```html
<media-controller gesturesdisabled>
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

### liveedgeoffset

`liveedgeoffset` (positive number, seconds)

For live media streams, you may want to know a range of times that, when playing, count as playing "the live edge". The `liveedgeoffset` defines the delta, in seconds, from the latest playable/seekable time that should count as the live edge. By default this value is 10 (seconds). The `<media-live-button>` element uses this to indicate when playback is or is not live.

See also:
- [defaultstreamtype attribute](#default-stream-type)
- [mediastreamtype description](./stream-type)
- [```<media-live-button>``` element](./media-live-button)

```html
<media-controller liveedgeoffset="5">
  ...
</media-controller>
```

### noautoseektolive

`noautoseektolive` (boolean)

By default, when a user unpauses a live stream, media-controller will also automatically seek to the most current time (or live edge) in the live stream. If you don't want media-controller to do this you can include the `noautoseektolive` attribute.

```html
<media-controller noautoseektolive>
  ...
</media-controller>
```
