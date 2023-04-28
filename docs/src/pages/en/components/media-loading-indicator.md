---
title: <media-loading-indicator>
description: Media Loading Indicator
layout: ../../../layouts/MainLayout.astro
source: https://github.com/muxinc/media-chrome/tree/main/src/js/media-loading-indicator.js
---

Shows a loading indicator when the media is buffering.

<style>
  media-loading-indicator {
    --media-icon-color: #f0f;
    display: block;
    height: 100px;
  }
</style>

<h3>Default (hidden by default, media is not buffering)</h3>

<media-loading-indicator></media-loading-indicator>

```html
<media-loading-indicator></media-loading-indicator>
```

<h3>Is loading (media is buffering)</h3>

<media-loading-indicator isloading></media-loading-indicator>

```html
<media-loading-indicator isloading></media-loading-indicator>
```

<h3>Alternate content</h3>

<media-loading-indicator isloading>
  <svg slot="loading" viewBox="-12 -15 48 60">
    <path d="M0 0h4v10H0z">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="translate"
        values="0 0; 0 20; 0 0"
        begin="0"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M10 0h4v10h-4z">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="translate"
        values="0 0; 0 20; 0 0"
        begin="0.2s"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M20 0h4v10h-4z">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="translate"
        values="0 0; 0 20; 0 0"
        begin="0.4s"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
</media-loading-indicator>

```html
<media-loading-indicator isloading>
  <svg slot="loading" viewBox="-12 -15 48 60">
    <path d="M0 0h4v10H0z">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="translate"
        values="0 0; 0 20; 0 0"
        begin="0"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M10 0h4v10h-4z">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="translate"
        values="0 0; 0 20; 0 0"
        begin="0.2s"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
    <path d="M20 0h4v10h-4z">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="translate"
        values="0 0; 0 20; 0 0"
        begin="0.4s"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
</media-loading-indicator>
```

## Attributes

| Name            | Type     | Default Value | Description                                                                                   |
| --------------- | -------- | ------------- | --------------------------------------------------------------------------------------------- |
| `loadingdelay` | `number` | `500`         | The amount of time in ms the media has to be buffering before the loading indicator is shown. |

# Slots

| Name      | Default Type | Description                                                   |
| --------- | ------------ | ------------------------------------------------------------- |
| `loading` | `svg`        | The element shown for when the media is in a buffering state. |


## Styling

See our [styling docs](./styling#Indicators)
