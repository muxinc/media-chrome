---
title: Styling
description: Styling Media Chrome
layout: ../../layouts/MainLayout.astro
---

Arguably the primary purpose—the raison d'etre—of Media Chrome is creating custom media player user interfaces and experiences. It should come as no surprise that we provide a whole lot of ways to easily change its look and feel. In this guide, we'll go over some of the central ways of styling your Media Chrome UI, using a few .

## The Basics - Customizing the `<media-play-button>`

Let's start with a simple UI that uses `<media-play-button>`:

<!-- Migrate to sandpack/codesandbox when resolved -->

```html
<media-controller>
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
    muted
  ></video>
  <media-play-button></media-play-button>
</media-controller>
```

<media-controller class="example-1">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
    muted
  ></video>
  <media-play-button></media-play-button>
</media-controller>

### Media Chrome + CSS Variables

While the component looks pretty good out of box, maybe you want a slightly different color palette. To help make this process easier, Media Chrome provides a set of well defined [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (also known as "CSS Variables"). Here's an example where we've
changed the default color of the `<media-play-button>`'s icon, background, and hover background.

<!-- Migrate to sandpack/codesandbox when resolved -->

```css
media-play-button {
  --media-control-background: lightskyblue;
  --media-icon-color: lightpink;
  --media-control-hover-background: lightseagreen;
}
```

<style>
  .example-2 media-play-button {
    --media-control-background: lightskyblue;
    --media-icon-color: lightpink;
    --media-control-hover-background: lightseagreen;
  }
</style>
<media-controller class="example-2">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
    muted
  ></video>
  <media-play-button></media-play-button>
</media-controller>

You may have noticed that the names of these variables make no specific mention of buttons or even play buttons. That's intentional. Many of our CSS variables are shared across many of our components, and we've intentionally named them to account for the scope of where they apply. If you only want them to apply to a particular component, you can use standard CSS selectors to scope them, like the the example above.

Each Media Chrome component has a pretty wide set of useful variables, including font related styles, padding and sizing styles, and several others, which you can find in the reference section of each component's documentation. For example, you can find a full list of `<media-play-button>` CSS Variables [here](./components/media-play-button#css-custom-properties).

### Media Chrome + Custom Icons

Being able to easily customize a variety

```html
<media-play-button>
  <svg
    slot="play"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 58.752 58.752"
  >
    <path
      d="M52.524,23.925L12.507,0.824c-1.907-1.1-4.376-1.097-6.276,0C4.293,1.94,3.088,4.025,3.088,6.264v46.205
      c0,2.24,1.204,4.325,3.131,5.435c0.953,0.555,2.042,0.848,3.149,0.848c1.104,0,2.192-0.292,3.141-0.843l40.017-23.103
      c1.936-1.119,3.138-3.203,3.138-5.439C55.663,27.134,54.462,25.05,52.524,23.925z M49.524,29.612L9.504,52.716
      c-0.082,0.047-0.18,0.052-0.279-0.005c-0.084-0.049-0.137-0.142-0.137-0.242V6.263c0-0.1,0.052-0.192,0.14-0.243
      c0.042-0.025,0.09-0.038,0.139-0.038c0.051,0,0.099,0.013,0.142,0.038l40.01,23.098c0.089,0.052,0.145,0.147,0.145,0.249
      C49.663,29.47,49.611,29.561,49.524,29.612z"
    />
  </svg>
  <svg
    slot="pause"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 332.145 332.146"
  >
    <path
      d="M121.114,0H25.558c-8.017,0-14.517,6.5-14.517,14.515v303.114c0,8.017,6.5,14.517,14.517,14.517h95.556
      c8.017,0,14.517-6.5,14.517-14.517V14.515C135.631,6.499,129.131,0,121.114,0z M106.6,303.113H40.072V29.031H106.6V303.113z"
    />
    <path
      d="M306.586,0h-95.541c-8.018,0-14.518,6.5-14.518,14.515v303.114c0,8.017,6.5,14.517,14.518,14.517h95.541
      c8.016,0,14.518-6.5,14.518-14.517V14.515C321.102,6.499,314.602,0,306.586,0z M292.073,303.113h-66.514V29.031h66.514V303.113z"
    />
  </svg>
</media-play-button>
```

<style>
  .example-3 media-play-button {
    --media-control-background: lightskyblue;
    --media-icon-color: lightpink;
    --media-control-hover-background: lightseagreen;
  }
  .example-3 img {
    width: 24px;
  }
</style>
<media-controller class="example-3">
  <video
    slot="media"
    src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
    muted
  ></video>
  <media-play-button>
      <!--
        NOTE: "Lying" in the actual code since it looks like there's some friction in using SVGs directly in Astro. See: https://docs.astro.build/en/guides/images/
        However, confirmed the example code worked in an example html page. This can be changed if we get sandpack/codesandbox working.
      -->
      <img slot="play" src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg fill='lightpink' height='800px' width='800px' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 58.752 58.752' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M52.524,23.925L12.507,0.824c-1.907-1.1-4.376-1.097-6.276,0C4.293,1.94,3.088,4.025,3.088,6.264v46.205 c0,2.24,1.204,4.325,3.131,5.435c0.953,0.555,2.042,0.848,3.149,0.848c1.104,0,2.192-0.292,3.141-0.843l40.017-23.103 c1.936-1.119,3.138-3.203,3.138-5.439C55.663,27.134,54.462,25.05,52.524,23.925z M49.524,29.612L9.504,52.716 c-0.082,0.047-0.18,0.052-0.279-0.005c-0.084-0.049-0.137-0.142-0.137-0.242V6.263c0-0.1,0.052-0.192,0.14-0.243 c0.042-0.025,0.09-0.038,0.139-0.038c0.051,0,0.099,0.013,0.142,0.038l40.01,23.098c0.089,0.052,0.145,0.147,0.145,0.249 C49.663,29.47,49.611,29.561,49.524,29.612z'/%3E%3C/g%3E%3C/svg%3E">
      <img slot="pause" src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg fill='lightpink' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='800px' height='800px' viewBox='0 0 332.145 332.146' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath d='M121.114,0H25.558c-8.017,0-14.517,6.5-14.517,14.515v303.114c0,8.017,6.5,14.517,14.517,14.517h95.556 c8.017,0,14.517-6.5,14.517-14.517V14.515C135.631,6.499,129.131,0,121.114,0z M106.6,303.113H40.072V29.031H106.6V303.113z'/%3E%3Cpath d='M306.586,0h-95.541c-8.018,0-14.518,6.5-14.518,14.515v303.114c0,8.017,6.5,14.517,14.518,14.517h95.541 c8.016,0,14.518-6.5,14.518-14.517V14.515C321.102,6.499,314.602,0,306.586,0z M292.073,303.113h-66.514V29.031h66.514V303.113z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E">
  </media-play-button>
</media-controller>

## Buttons

### Elements

- `<media-captions-button>` ([docs](./components/media-captions-button))
- `<media-fullscreen-button>` ([docs](./components/media-fullscreen-button))
- `<media-mute-button>` ([docs](./components/media-mute-button))
- `<media-pip-button>` ([docs](./components/media-pip-button))
- `<media-play-button>` ([docs](./components/media-play-button))
- `<media-playback-rate-button>` ([docs](./components/media-playback-rate-button)) ([See notes below \*](#notes))
- `<media-seek-backward-button>` ([docs](./components/media-seek-backward-button))
- `<media-seek-forward-button>` ([docs](./components/media-seek-forward-button))

| Name                               | CSS Property  | Default Value                                      | Description                                                                                       | Notes                                                                                                                                                                |
| ---------------------------------- | ------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--media-control-background`       | `background`  | `var(--media-secondary-color, rgb(20 20 30 / .7))` | background color of the component                                                                 | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                 |
| `--media-control-hover-background` | `background`  | `rgb(50 50 70 / .7)`                               | background color of the button when hovered                                                       | Applied by the `:hover` [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) Applies to other components as well ([See notes below \*\*](#notes)) |
| `--media-control-height`           | `height`      | `24px`                                             | default height of buttons, ranges and text displays                                               | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                 |
| `--media-control-padding`          | `padding`     | `10px`                                             | default padding of buttons, ranges and text displays                                              | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                 |
| `--media-text-content-height`      | `line-height` | `var(--media-control-height, 24px)`                | default line-height of buttons and text displays                                                  | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                 |
| `--media-button-icon-width`        | `width`       | none                                               | default width of button icons                                                                     | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-button-icon-height`       | `height`      | `var(--media-control-height, 24px)`                | default height of button icons                                                                    | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-icon-color`               | `fill`        | `var(--media-primary-color, rgb(238 238 238))`     | default fill color of button icons                                                                | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-text-color`               | `color`       | `var(--media-primary-color, rgb(238 238 238))`     | default color of button text                                                                      |                                                                                                                                                                      |
| `--media-button-icon-transform`    | `transform`   | none                                               | apply a [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to button icons   | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-button-icon-transition`   | `transform`   | none                                               | apply a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) to button icons | Only applies to `<img>` and `<svg>` tags                                                                                                                             |

## Ranges

### Elements

- `<media-time-range>` ([docs](./components/media-time-range))
- `<media-volume-range>` ([docs](./components/media-volume-range))

| Name                                | CSS Property          | Default Value                                      | Description                                                                                                                | Notes                                                                                                                                                                  |
| ----------------------------------- | --------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--media-control-background`        | `background`          | `var(--media-secondary-color, rgb(20 20 30 / .7))` | background color of the component                                                                                          | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                   |
| `--media-control-hover-background`  | `background`          | `rgb(50 50 70 / .7)`                               | background color of the button when hovered                                                                                | Applied by the `:hover` [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) Applies to other components as well ([See notes below \*\*](#notes))   |
| `--media-control-height`            | `height`              | `24px`                                             | default height of buttons, ranges and text displays                                                                        | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                   |
| `--media-control-padding`           | `padding`             | `10px`                                             | default padding of buttons, ranges and text displays                                                                       | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                   |
| `--media-range-thumb-height`        | `height`              | `10px`                                             | height of the underlying slider's drag thumb                                                                               | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-width`         | `width`               | `10px`                                             | width of the underlying slider's drag thumb                                                                                | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-border`        | `border`              | `none`                                             | border of the underlying slider's drag thumb                                                                               | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-border-radius` | `border-radius`       | `10px`                                             | border radius of the underlying slider's drag thumb                                                                        | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-background`    | `background`          | `var(--media-primary-color, rgb(238 238 238))`     | background color of the underlying slider's drag thumb                                                                     | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-box-shadow`    | `box-shadow`          | `1px 1px 1px transparent`                          | box shadow of the underlying slider's drag thumb                                                                           | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-transition`    | `transition`          | `none`                                             | apply a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) to the underlying slider's drag thumb    | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-transform`     | `transform`           | `none`                                             | apply a [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to the underlying slider's drag thumb      | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-opacity`       | `opacity`             | `1`                                                | opacity of the underlying slider's drag thumb                                                                              | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-bar-color`.          | `<linear-color-stop>` | `#fff`                                             | color of the track's progressed range                                                                                      | This is a `<linear-color-stop>` part of the `linear-gradient()` CSS function.                                                                                          |
| `--media-range-track-color`.        | `<linear-color-stop>` | `transparent`                                      | color of the track's negative space                                                                                        | This is a `<linear-color-stop>` part of the `linear-gradient()` CSS function.                                                                                          |
| `--media-range-track-height`        | `height`              | `4px`                                              | height of the underlying slider's track display                                                                            | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-width`         | `width`               | `100%`                                             | width of the underlying slider's track display                                                                             | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-border`        | `border`              | `none`                                             | border of the underlying slider's track display                                                                            | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-border-radius` | `border-radius`       | `0`                                                | border radius of the underlying slider's track display                                                                     | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-background`    | `background`          | `rgb(255 255 255 / .2)`                            | background color of the underlying slider's track display                                                                  | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-box-shadow`    | `box-shadow`          | `none`                                             | box shadow of the underlying slider's track display                                                                        | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-transition`    | `transition`          | `none`                                             | apply a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) to the underlying slider's track display | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-translate-x`   | `translate`           | `0`                                                | apply a [translation](https://developer.mozilla.org/en-US/docs/Web/CSS/translate) to the underlying slider's track display | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-translate-y`   | `translate`           | `0`                                                | apply a [translation](https://developer.mozilla.org/en-US/docs/Web/CSS/translate) to the underlying slider's track display | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |

- `<media-time-range>` ([docs](./components/media-time-range))

| Name                                      | CSS Property          | Default Value           | Description                            | Notes                                                                                      |
| ----------------------------------------- | --------------------- | ----------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| `--media-time-range-buffered-color`       | `<linear-color-stop>` | `rgb(255 255 255 / .4)` | background color of the buffered range | This is a `<linear-color-stop>` part of the `linear-gradient()` CSS function.              |
| `--media-preview-thumbnail-border`        | `border`              | `2px solid #fff`        | border of the thumbnail preview        |                                                                                            |
| `--media-preview-thumbnail-border-radius` | `border-radius`       | `2px`                   | border radius of the thumbnail preview |                                                                                            |
| `--media-preview-thumbnail-min-width`     | `width`               | `120px`                 | minimum thumbnail preview width        | The maximum CSS properties have priority over the minimum. Only `px` values are supported. |
| `--media-preview-thumbnail-max-width`     | `width`               | `200px`                 | maximum thumbnail preview width        | The maximum CSS properties have priority over the minimum. Only `px` values are supported. |
| `--media-preview-thumbnail-min-height`    | `height`              | `80px`                  | minimum thumbnail preview height       | The maximum CSS properties have priority over the minimum. Only `px` values are supported. |
| `--media-preview-thumbnail-max-height`    | `height`              | `160px`                 | maximum thumbnail preview height       | The maximum CSS properties have priority over the minimum. Only `px` values are supported. |

## Text Displays

### Elements

- `<media-time-display>` ([docs](./components/media-time-display))

| Name                          | CSS Property | Default Value                                      | Description                                                     | Notes                                                                |
| ----------------------------- | ------------ | -------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `--media-control-background`  | `background` | `var(--media-secondary-color, rgb(20 20 30 / .7))` | background color of the component                               | Applies to other components as well ([See notes below \*\*](#notes)) |
| `--media-control-height`      | `height`     | `24px`                                             | default height of buttons, ranges and text displays             | Applies to other components as well ([See notes below \*\*](#notes)) |
| `--media-control-padding`     | `padding`    | `10px`                                             | default padding of buttons, ranges and text displays            | Applies to other components as well ([See notes below \*\*](#notes)) |
| `--media-text-color`          | `color`      | `var(--media-primary-color, rgb(238 238 238))`     | default color of button text                                    |                                                                      |
| `--media-text-content-height` | `height`     | `var(--media-control-height, 24px)`                | height of the underlying text container for text-based elements | Also applies to `<media-captions-button>` ([See §Buttons](#Buttons)) |

## Indicators

### Elements

- `<media-loading-indicator>` ([docs](./components/media-loading-indicator))

| Name                          | CSS Property | Default Value                                  | Description                | Notes                               |
| ----------------------------- | ------------ | ---------------------------------------------- | -------------------------- | ----------------------------------- |
| `--media-loading-icon-width`  | `width`      | `100px`                                        | width of the loading icon  |                                     |
| `--media-loading-icon-height` | `height`     | `auto`                                         | height of the loading icon |                                     |
| `--media-icon-color`          | `fill`       | `var(--media-primary-color, rgb(238 238 238))` | color of the loading icon  | Only applies to `<img>` and `<svg>` |

# Notes

\* Unlike most Media Chrome buttons, the `<media-playback-rate-button>` button displays text (and not an icon/svg), so many [button styles](#buttons) don't apply to it and some [text display styles](#text-displays) do apply to it (unlike most buttons).

\*\* A few CSS Variables are more "global" in their application, so make sure you define and scope them via selectors appropriately.

## Images

### Elements

- `<media-poster-image>` ([docs](./components/media-poster-image))

| Name                                       | CSS Property          | Default Value | Description                                                                                     | Notes |
| ------------------------------------------ | --------------------- | ------------- | ----------------------------------------------------------------------------------------------- | ----- |
| `--media-object-fit`                       | `object-fit`          | `contain`     | how the content of the image should be resized to fit the custom element                        |       |
| `--media-object-position`                  | `object-position`     | `center`      | specifies the alignment of the image within the custom element's box                            |       |
| `--media-poster-image-background-size`     | `background-size`     | `contain`     | how the content of the background placeholder image should be resized to fit the custom element |       |
| `--media-poster-image-background-position` | `background-position` | `center`      | specifies the alignment of the background placeholder image within the custom element's box     |       |
