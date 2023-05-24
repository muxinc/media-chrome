---
title: <media-playback-rate-selectmenu> (Experimental)
description: Experimental Media Playback Rate Selectmenu
layout: ../../../layouts/ComponentLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/experimental/media-playback-rate-selectmenu.mjs
---

A menu-button for playback rates.

### Default

Defaults to the same values as the [media-playback-rate-button](./media-playback-rate-button).

<media-playback-rate-selectmenu></media-playback-rate-selectmenu>

```html
<media-playback-rate-selectmenu></media-playback-rate-selectmenu>
```

### Setting rates

<media-playback-rate-selectmenu rates="1 2 3"></media-playback-rate-selectmenu>

```html
<media-playback-rate-selectmenu rates="1 2 3"></media-playback-rate-selectmenu>
```

### Alternate Content

For alternative content for the button, slot a [media-playback-rate-button](./media-playback-rate-button).

<media-playback-rate-selectmenu>
    <media-playback-rate-button slot="button"></media-playback-rate-button>
</media-playback-rate-selectmenu>

```html
<media-playback-rate-selectmenu>
    <media-playback-rate-button slot="button"></media-playback-rate-button>
</media-playback-rate-selectmenu>
```

## Styling

media-playback-rate-listbox puts all the children in its shadow DOM, which makes it a bit harder to style. One alternative is to slot a button or listbox element and then style them directly. However, this component also [exposes three parts](#exposed-parts) that can be targeted for styling.

Check out this example for usage, but please try and use better colors as this color scheme is for demonstration purposes only.

<style>
#mpr-sm-1::part(button) {
    background-color: purple;
}
#mpr-sm-1::part(listbox) {
    background-color: yellow;
    --media-listbox-background: transparent;
}
#mpr-sm-1::part(listitem) {
    background-color: blue;
}
</style>
<media-playback-rate-selectmenu id="mpr-sm-1"></media-playback-rate-selectmenu>

```html
<style>
#mpr-sm-1::part(button) {
    background-color: purple;
}
#mpr-sm-1::part(listbox) {
    background-color: yellow;
    --media-listbox-background: transparent;
}
#mpr-sm-1::part(listitem) {
    background-color: blue;
}
</style>
<media-playback-rate-selectmenu id="mpr-sm-1"></media-playback-rate-selectmenu>
```
