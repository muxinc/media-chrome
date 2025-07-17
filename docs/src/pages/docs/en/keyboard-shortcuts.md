---
title: Keyboard shortcuts
description: Understand how keyboard shortcuts work with Media Chrome
layout: ../../../layouts/MainLayout.astro
---

By default, Media Controller has keyboard shortcuts that will trigger behavior when specific keys are pressed when the focus is inside the Media Controller.
The following controls are supported:

| Key     | Name to turn off | Behavior |
|---------|------------------|----------|
| `Space` | `nospace`        | Toggle Playback |
| `k`     | `nok`            | Toggle Playback |
| `m`     | `nom`            | Toggle mute |
| `f`     | `nof`            | Toggle fullscreen |
| `c`     | `noc`            | Toggle captions or subtitles, if available |
| `ArrowLeft`       | `noarrowleft`    | Seek back 10s |
| `ArrowRight`       | `noarrowright`   | Seek forward 10s |
| `ArrowUp`       | `noarrowup`   | Turn volume up |
| `ArrowDown`       | `noarrowdown`   | Turn volume down |

If you are implementing an interactive element that uses any of these keys, you can `stopPropagation` in your `keyup` handler. Alternatively, you can add a `keysUsed` property on the element or a `keysused` attribute. The values are those that match the `key` property on the KeyboardEvent. You can find a list of those values [on mdn](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values). Additionally, since the DOM list can't have the Space key represented as `" "`, we will accept `Space` as an alternative name for it.
Example (`keysused` attribute):

```html
<media-time-range keysused="ArrowLeft ArrowRight Space"></media-time-range>
```

Example (`keysUsed` property):

```js
class MyInteractiveElement extends globalThis.HTMLElement {
  get keysUsed() {
    return ['Enter', ' '];
  }
}
```

## hotkeys property

A `hotkeys` property is available on the Media Controller. It is an [AttributeTokenList](https://github.com/muxinc/media-chrome/blob/main/src/js/utils/attribute-token-list.ts), which is based on the [DOMTokenList API](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList) (like `classList`). This allows you to add and remove which shortcuts are allowed.

If you have a live player with no DVR functionality, you might want to turn off the seeking hotkeys. You can do this programmatically like so:

```js
const mc = document.querySelector('media-controller');
mc.hotkeys.add('noarrowleft', 'noarrowright);
```
