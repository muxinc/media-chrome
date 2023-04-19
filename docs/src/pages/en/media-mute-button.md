---
title: <media-mute-button>
description: Media Mute Button
layout: ../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-mute-button.js
---

Button to toggle the sound. The icon responds to volume changes and acts as part of the typical volume control.

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
}
.grid p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-inline: 1rem;
}
.grid pre {
  margin-top: 0 !important;
}
</style>

<div class="grid">

**Default**
<media-mute-button></media-mute-button>

```html
<media-mute-button></media-mute-button>
```

**Volume Off / Muted**
<media-mute-button mediavolumelevel="off"></media-mute-button>

```html
<media-mute-button mediavolumelevel="off"></media-mute-button>
```

**Volume Low**
<media-mute-button mediavolumelevel="low"></media-mute-button>

```html
<media-mute-button mediavolumelevel="low"></media-mute-button>
```

**Volume Medium**
<media-mute-button mediavolumelevel="medium"></media-mute-button>

```html
<media-mute-button mediavolumelevel="medium"></media-mute-button>
```

**Volume High**
<media-mute-button mediavolumelevel="high"></media-mute-button>

```html
<media-mute-button mediavolumelevel="high"></media-mute-button>
```

</div>


<h3>Alternate content</h3>

<div class="grid">

**Default**
<media-mute-button><span slot="high">High</span></media-mute-button>

```html
<media-mute-button><span slot="high">High</span></media-mute-button>
```

**Volume Off / Muted**
<media-mute-button mediavolumelevel="off"><span slot="off">Off</span></media-mute-button>

```html
<media-mute-button mediavolumelevel="off"><span slot="off">Off</span></media-mute-button>
```

**Volume Low**
<media-mute-button mediavolumelevel="low"><span slot="low">Low</span></media-mute-button>

```html
<media-mute-button mediavolumelevel="low"><span slot="low">Low</span></media-mute-button>
```

**Volume Medium**
<media-mute-button mediavolumelevel="medium"><span slot="medium">Med</span></media-mute-button>

```html
<media-mute-button mediavolumelevel="medium"><span slot="medium">Med</span></media-mute-button>
```

**Volume High**
<media-mute-button mediavolumelevel="high"><span slot="high">High</span></media-mute-button>

```html
<media-mute-button mediavolumelevel="high"><span slot="high">High</span></media-mute-button>
```

</div>

## Attributes

_None_

## Slots

| Name     | Default Type | Description                                                                             |
| -------- | ------------ | --------------------------------------------------------------------------------------- |
| `off`    | `svg`        | An element shown when the media is muted or the media's volume is 0                     |
| `low`    | `svg`        | An element shown when the media's volume is "low" (less than 50% / 0.5)                 |
| `medium` | `svg`        | An element shown when the media's volume is "medium" (between 50% / 0.5 and 75% / 0.75) |
| `high`   | `svg`        | An element shown when the media's volume is "high" (75% / 0.75 or greater)              |


## Styling

See our [styling docs](./styling#Buttons)
