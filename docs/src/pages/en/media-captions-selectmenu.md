---
title: <media-captions-selectmenu> (Experimental)
description: Experimental Media Captions Selectmenu
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/experimental/media-captions-selectmenu.js
---
<script src="/node_modules/media-chrome/dist/experimental/media-captions-selectmenu.js" type="module"></script>

A menu-button for subtitles and captions.

### Default (no subtitles and captions)

<media-captions-selectmenu></media-captions-selectmenu>

```html
<media-captions-selectmenu></media-captions-selectmenu>
```

### Alternate Content

For alternative content for the button, slot a [media-captions-button](./media-captions-button).

<media-captions-selectmenu>
    <media-captions-button slot="button">
      <span slot="on"><b><u>CC</u></b></span>
      <span slot="off">CC</span>
    </media-captions-button>
</media-captions-selectmenu>

<media-captions-selectmenu>
    <media-captions-button slot="button" media-captions-showing="en:English%20Closed%20Captions">
      <span slot="on"><b><u>CC</u></b></span>
      <span slot="off">CC</span>
    </media-captions-button>
</media-captions-selectmenu>

```html
<media-captions-selectmenu>
    <media-captions-button slot="button">
      <span slot="on"><b><u>CC</u></b></span>
      <span slot="off">CC</span>
    </media-captions-button>
</media-captions-selectmenu>

<media-captions-selectmenu>
    <media-captions-button slot="button" media-captions-showing="en:English%20Closed%20Captions">
      <span slot="on"><b><u>CC</u></b></span>
      <span slot="off">CC</span>
    </media-captions-button>
</media-captions-selectmenu>
```

## Styling

media-captions-listbox puts all the children in its shadow DOM, which makes it a bit harder to style. One alternative is to slot a button or listbox element and then style them directly. However, this component also [exposes three parts](#exposed-parts) that can be targeted for styling.

Check out this example for usage, but please try and use better colors as this color scheme is for demonstration purposes only.

<style>
#mc-sm-1::part(button) {
    background-color: purple;
}
#mc-sm-1::part(listbox) {
    background-color: yellow;
    --media-listbox-background: transparent;
}
#mc-sm-1::part(listitem) {
    background-color: blue;
}
</style>
<media-captions-selectmenu id="mc-sm-1"></media-captions-selectmenu>

```html
<style>
#mc-sm-1::part(button) {
    background-color: purple;
}
#mc-sm-1::part(listbox) {
    background-color: yellow;
    --media-listbox-background: transparent;
}
#mc-sm-1::part(listitem) {
    background-color: blue;
}
</style>
<media-captions-selectmenu id="mc-sm-1"></media-captions-selectmenu>
```

### Exposed Parts

| Name | Description |
|------|-------------|
| `button` | The default [media-captions-button](./media-captions-button) that's in the shadow DOM |
| `listbox` | The default listbox that's in the shadow DOM |
| `listitem` | A part that targets each listitem of the listbox |


## Attributes

| Name                    | Type      | Default Value | Description                                                                                        |
| ----------------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `default-showing` | `boolean` | `false`       | Controls whether media-chrome will show a subtitle or captions tracks by default |
| `no-subtitles-fallback` | `boolean` | `false`       | Controls whether media-chrome will show subtitle tracks if no closed captions tracks are available |

## Slots

| Name  | Default Type | Description                                                 |
| ----- | ------------ | ----------------------------------------------------------- |
| `button`  | [`media-captions-button`](./media-captions-button)        | A button element that reflects the current state of captions and subtitles selection  |
| `listbox` | `media-captions-listbox`        | An element that displays the associated captions for the media |
