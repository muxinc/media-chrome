# Styling Media Chrome

Media Chrome is written using [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components). As such, you can do a lot of styling to the component through standard CSS properties, style attributes, and selectors. However, there are enough situations where you might want to style more specific details of some `<media-chrome/>` elements (e.g. the size or color of the drag thumb on the `<media-volume-range/>`) or easily update some styles more globally for `<media-chrome/` elements (e.g. changing the background color for all the control/display elements). To accomplish this, `<media-chrome/>` relies primarily on [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to update specific styles for various elements.

### An Important Caveat

Our current styling architecture is still quite nascent and is very likely to undergo changes, including quite large ones (all hopefully for the better!). Be sure to keep this in mind when upgrading versions of media-chrome.

## Buttons

### Elements

- `<media-captions-button/>` ([docs](./media-captions-button.md))
- `<media-fullscreen-button/>` ([docs](./media-fullscreen-button.md))
- `<media-mute-button/>` ([docs](./media-mute-button.md))
- `<media-pip-button/>` ([docs](./media-pip-button.md))
- `<media-play-button/>` ([docs](./media-play-button.md))
- `<media-playback-rate-button/>` ([docs](./media-playback-rate-button.md)) ([See notes below \*](#notes))
- `<media-seek-backward-button/>` ([docs](./media-seek-backward-button.md))
- `<media-seek-forward-button/>` ([docs](./media-seek-forward-button.md))

| Name                               | CSS Property | Default Value         | Description                                                                                       | Notes                                                                                                                                                                |
| ---------------------------------- | ------------ | --------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--media-control-background`       | `background` | `rgba(20,20,30, 0.7)` | background color of the component                                                                 | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                 |
| `--media-control-hover-background` | `background` | `rgba(50,50,70, 0.7)` | background color of the button when hovered                                                       | Applied by the `:hover` [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) Applies to other components as well ([See notes below \*\*](#notes)) |
| `--media-button-icon-width`        | `width`      | `24px`                | default width of button icons                                                                     | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-button-icon-height`       | `height`     | none                  | default height of button icons                                                                    | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-icon-color`               | `fill`       | `#eee`                | default fill color of button icons                                                                | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-button-icon-transform`    | `transform`  | none                  | apply a [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to button icons   | Only applies to `<img>` and `<svg>` tags                                                                                                                             |
| `--media-button-icon-transition`   | `transform`  | none                  | apply a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) to button icons | Only applies to `<img>` and `<svg>` tags                                                                                                                             |

## Ranges

### Elements

- `<media-time-range/>` ([docs](./media-time-range.md))
- `<media-volume-range/>` ([docs](./media-volume-range.md))

| Name                                   | CSS Property    | Default Value             | Description                                                                                                                | Notes                                                                                                                                                                  |
| -------------------------------------- | --------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--media-control-background`           | `background`    | `rgba(20,20,30, 0.7)`     | background color of the component                                                                                          | Applies to other components as well ([See notes below \*\*](#notes))                                                                                                   |
| `--media-control-hover-background`     | `background`    | `rgba(50,50,70, 0.7)`     | background color of the button when hovered                                                                                | Applied by the `:hover` [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) Applies to other components as well ([See notes below \*\*](#notes))   |
| `--media-range-thumb-height`           | `height`        | `10px`                    | height of the underlying slider's drag thumb                                                                               | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-width`            | `width`         | `10px`                    | width of the underlying slider's drag thumb                                                                                | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-border`           | `border`        | `none`                    | border of the underlying slider's drag thumb                                                                               | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-border-radius`    | `border-radius` | `10px`                    | border radius of the underlying slider's drag thumb                                                                        | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-background`       | `background`    | `#fff`                    | background color of the underlying slider's drag thumb                                                                     | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-box-shadow`       | `box-shadow`    | `1px 1px 1px transparent` | box shadow of the underlying slider's drag thumb                                                                           | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-transition`       | `transition`    | `none`                    | apply a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) to the underlying slider's drag thumb    | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-transform`        | `transform`     | `none`                    | apply a [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to the underlying slider's drag thumb      | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-thumb-opacity`          | `opacity`       | `1`                       | opacity of the underlying slider's drag thumb                                                                              | Applied via `::-webkit-slider-thumb` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb)                   |
| `--media-range-track-height`           | `height`        | `4px`                     | height of the underlying slider's track display                                                                            | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-width`            | `width`         | `100%`                    | width of the underlying slider's track display                                                                             | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-border`           | `border`        | `none`                    | border of the underlying slider's track display                                                                            | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-border-radius`    | `border-radius` | `0`                       | border radius of the underlying slider's track display                                                                     | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-background-color` | `background`    | `#eee`                    | background color of the underlying slider's track display                                                                  | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-box-shadow`       | `box-shadow`    | `none`                    | box shadow of the underlying slider's track display                                                                        | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |
| `--media-range-track-transition`       | `transition`    | `none`                    | apply a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) to the underlying slider's track display | Applied via `::-webkit-slider-runnable-track` and similar [pseudo-element selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-runnable-track) |

- `<media-time-range/>` ([docs](./media-time-range.md))

| Name                          | CSS Property          | Default Value | Description                            | Notes                                                                         |
| ----------------------------- | --------------------- | ------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| `--media-time-buffered-color` | `<linear-color-stop>` | `#777`        | background color of the buffered range | This is a `<linear-color-stop>` part of the `linear-gradient()` CSS function. |

## Text Displays

### Elements

- `<media-time-display/>` ([docs](./media-time-display.md))

| Name                          | CSS Property | Default Value         | Description                                                     | Notes                                                                |
| ----------------------------- | ------------ | --------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `--media-control-background`  | `background` | `rgba(20,20,30, 0.7)` | background color of the component                               | Applies to other components as well ([See notes below \*\*](#notes)) |
| `--media-text-content-height` | `height`     | `24px`                | height of the underlying text container for text-based elements | Also applies to `<media-captions-button>` ([See §Buttons](#Buttons)) |

## Indicators

### Elements

- `<media-loading-indicator/>` ([docs](./media-loading-indicator.md))

| Name                          | CSS Property | Default Value | Description                | Notes                               |
| ----------------------------- | ------------ | ------------- | -------------------------- | ----------------------------------- |
| `--media-loading-icon-width`  | `width`      | `44px`        | width of the loading icon  |                                     |
| `--media-loading-icon-height` | `height`     | `auto`        | height of the loading icon |                                     |
| `--media-icon-color`          | `fill`       | `#fff`        | color of the loading icon  | Only applies to `<img>` and `<svg>` |

# Notes

\* Unlike most Media Chrome buttons, the `<media-playback-rate-button/>` button displays text (and not an icon/svg), so many [button styles](#buttons) don't apply to it and some [text display styles](#text-displays) do apply to it (unlike most buttons).

\*\* A few CSS Variables are more "global" in their application, so make sure you define and scope them via selectors appropriately.
