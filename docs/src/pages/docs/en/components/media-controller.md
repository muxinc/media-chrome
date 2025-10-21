---
title: <media-controller>
description: Media Controller
layout: ../../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-controller.js
---

The `<media-controller>` manages communication of state and state change requests between a `media` element and control elements. It also provides some built in sizing and layout to make styling your player as easy as possible.

## Attributes

### audio

`audio` (boolean)

Use this to enable audio chrome UI, which will not have any of the slots described in the [Position controls guide](/docs/en/position-controls), but instead have a single default slot for adding markup.

```html
<media-controller audio>
  ...
</media-controller>
```

### autohide

`autohide (seconds, default: 2)` (video only)

Use this to autohide all controls/chrome (except for the `media`) and the cursor after `n` seconds of inactivity, unless the media is paused. This only works if the controls are not being hovered. To disable `autohide`, set the value to -1.

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

### autohideovercontrols

`autohideovercontrols (boolean)` 

This attribute extends `autohide` by also hiding the controls and cursor, even if they are being hovered, in addition to the usual `autohide` behavior. If the media is paused, the controls and cursor remains visible.

Example:

```html
<media-controller autohide autohideovercontrols>
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

### lang

`lang` (string)

Use this to manually set the language for the controls. This can be useful if you have the preferred user language stored somewhere outside of Media Chrome. The default value is the preferred language based on their browser settings with a fallback to `en` (English).

NOTE: Only English is included in the main Media Chrome bundle. If you want to use another language, you will need to import the appropriate localization file in your project. See [adding language support](../internationalization/adding-language-support).

Example:

```html
<media-controller lang="fr">
  ...
</media-controller>
```

This will set the language to French. The media-controller will use this value to determine which translations to use for any text displayed in the UI.


### defaultsubtitles

`defaultsubtitles` (boolean)

When enabled, this will cause captions or subtitles to be turned on by default, if available.

### defaultduration

`defaultduration` (number, in seconds)

When enabled, this will use the value of `defaultduration` as the `mediaduration` before the media has been loaded. This is useful when you want to avoid preloading the media (e.g. for cost or network usage reasons) but still want the UI to show what the (already known) duration will be.

Example:

```html
<media-controller defaultduration="134"> <!-- aka 2:14 -->
  <video slot="media" src="..." preload="none"></video> <!-- don't automatically load the media -->
  <media-time-display showduration></media-time-display> <!-- This will show 0:00 / 2:14 before the media is loaded and the actual duration after -->
</media-controller>
```

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

### keyboardforwardseekoffset

`keyboardforwardseekoffset` (positive number, seconds)

Use this to override the default seek forward offset (10s) when using `hotkeys` (right arrow).

Example (right arrow key press seeks forward 15 seconds):

```html
<media-controller keyboardforwardseekoffset="15">
  ...
</media-controller>
```

### keyboardbackwardseekoffset

`keyboardbackwardseekoffset` (positive number, seconds)

Use this to override the default seek backward offset (10s) when using `hotkeys` (left arrow).

Example (left arrow key press seeks backward 5 seconds):

```html
<media-controller keyboardbackwardseekoffset="5">
  ...
</media-controller>
```

### liveedgeoffset

`liveedgeoffset` (positive number, seconds)

For live media streams, you may want to know a range of times that, when playing, count as playing "the live edge". The `liveedgeoffset` defines the delta, in seconds, from the latest playable/seekable time that should count as the live edge. By default this value is 10 (seconds). The `<media-live-button>` element uses this to indicate when playback is or is not live.

See also:
- [defaultstreamtype attribute](#defaultstreamtype)
- [mediastreamtype description](../stream-type)
- [```<media-live-button>``` element](./media-live-button)

```html
<media-controller liveedgeoffset="5">
  ...
</media-controller>
```

### seektoliveoffset

`seektoliveoffset` (positive number, seconds)

For live media streams the `seektoliveoffset` defines the delta, in seconds, from the latest playable/seekable time that should count as the target time when seeking to live. 

By default, this value is equal to the value of `liveedgeoffset` attribute. The `<media-live-button>` element uses this to seek to the live edge. This value is also used when user unpauses a live stream, if `noaautoseektolive` attribute is not specified.

One may want to use this attribute with a value lower than `liveedgeoffset` to prevent `<media-live-button>` indicator flickering after the seek to live request.

See also:
- [liveedgeoffset attribute](#liveedgeoffset)
- [noautoseektolive attribute](#noautoseektolive)
- [mediastreamtype description](../stream-type)

```html
<media-controller liveedgeoffset="10" seektoliveoffset="7">
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
