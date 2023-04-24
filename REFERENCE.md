# `dist/media-airplay-button.js`:

## class: `MediaAirplayButton`, `media-airplay-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Events

| Name                  | Type          | Description | Inherited From |
| --------------------- | ------------- | ----------- | -------------- |
| `mediaairplayrequest` | `CustomEvent` |             |                |

### Attributes

| Name                      | Field | Inherited From    |
| ------------------------- | ----- | ----------------- |
| `mediaairplayunavailable` |       |                   |
| `disabled`                |       | MediaChromeButton |
| `mediacontroller`         |       | MediaChromeButton |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                           | Description                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-airplay-button-display`   | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`          |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background` | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`        |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`    |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`   |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name      | Description |
| --------- | ----------- |
| `airplay` |             |

<hr/>

## Exports

| Kind                        | Name                   | Declaration        | Module                       | Package |
| --------------------------- | ---------------------- | ------------------ | ---------------------------- | ------- |
| `custom-element-definition` | `media-airplay-button` | MediaAirplayButton | dist/media-airplay-button.js |         |
| `js`                        | `default`              | MediaAirplayButton | dist/media-airplay-button.js |         |

# `dist/media-captions-button.js`:

## class: `MediaCaptionsButton`, `media-captions-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name             | Privacy | Type      | Default | Description | Inherited From    |
| ---------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `_captionsReady` |         | `boolean` | `false` |             |                   |
| `preventClick`   |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`       |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Attributes

| Name                    | Field | Inherited From    |
| ----------------------- | ----- | ----------------- |
| `mediasubtitleslist`    |       |                   |
| `mediasubtitlesshowing` |       |                   |
| `disabled`              |       | MediaChromeButton |
| `mediacontroller`       |       | MediaChromeButton |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                           | Description                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-captions-button-display`  | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`          |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background` | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`        |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`    |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`   |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name  | Description |
| ----- | ----------- |
| `on`  |             |
| `off` |             |

<hr/>

## Exports

| Kind                        | Name                    | Declaration         | Module                        | Package |
| --------------------------- | ----------------------- | ------------------- | ----------------------------- | ------- |
| `custom-element-definition` | `media-captions-button` | MediaCaptionsButton | dist/media-captions-button.js |         |
| `js`                        | `default`               | MediaCaptionsButton | dist/media-captions-button.js |         |

# `dist/media-cast-button.js`:

## class: `MediaCastButton`, `media-cast-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             |                |

### Attributes

| Name                   | Field | Inherited From    |
| ---------------------- | ----- | ----------------- |
| `mediacastunavailable` |       |                   |
| `mediaiscasting`       |       |                   |
| `disabled`             |       | MediaChromeButton |
| `mediacontroller`      |       | MediaChromeButton |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                           | Description                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-cast-button-display`      | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`          |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background` | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`        |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`    |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`   |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name    | Description |
| ------- | ----------- |
| `enter` |             |
| `exit`  |             |

<hr/>

## Exports

| Kind                        | Name                | Declaration     | Module                    | Package |
| --------------------------- | ------------------- | --------------- | ------------------------- | ------- |
| `custom-element-definition` | `media-cast-button` | MediaCastButton | dist/media-cast-button.js |         |
| `js`                        | `default`           | MediaCastButton | dist/media-cast-button.js |         |

# `dist/media-chrome-button.js`:

## class: `MediaChromeButton`, `media-chrome-button`

### Superclass

| Name | Module                      | Package |
| ---- | --------------------------- | ------- |
|      | dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From |
| -------------- | ------- | --------- | ------- | ----------- | -------------- |
| `preventClick` |         | `boolean` | `false` |             |                |
| `keysUsed`     |         |           |         |             |                |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From |
| ------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `enable`      |         |             |            |        |                |
| `disable`     |         |             |            |        |                |
| `handleClick` |         |             | `e: Event` |        |                |

### Attributes

| Name              | Field | Inherited From |
| ----------------- | ----- | -------------- |
| `disabled`        |       |                |
| `mediacontroller` |       |                |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                           | Description                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`          |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background` | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`        |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`    |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`   |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

<hr/>

## Exports

| Kind                        | Name                  | Declaration       | Module                      | Package |
| --------------------------- | --------------------- | ----------------- | --------------------------- | ------- |
| `custom-element-definition` | `media-chrome-button` | MediaChromeButton | dist/media-chrome-button.js |         |
| `js`                        | `default`             | MediaChromeButton | dist/media-chrome-button.js |         |

# `dist/media-chrome-range.js`:

## class: `MediaChromeRange`, `media-chrome-range`

### Superclass

| Name | Module                     | Package |
| ---- | -------------------------- | ------- |
|      | dist/media-chrome-range.js |         |

### Fields

| Name        | Privacy | Type                                                                                                    | Default | Description | Inherited From |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------- | ------- | ----------- | -------------- |
| `keysUsed`  |         |                                                                                                         |         |             |                |
| `container` |         |                                                                                                         |         |             |                |
| `range`     |         | `Omit<HTMLInputElement, "value" \| "min" \| "max"> &       * {value: number, min: number, max: number}` |         |             |                |

### Methods

| Name               | Privacy | Description | Parameters | Return | Inherited From |
| ------------------ | ------- | ----------- | ---------- | ------ | -------------- |
| `updatePointerBar` |         |             | `evt`      |        |                |
| `updateBar`        |         |             |            |        |                |
| `getBarColors`     |         |             |            |        |                |

### Attributes

| Name              | Field | Inherited From |
| ----------------- | ----- | -------------- |
| `disabled`        |       |                |
| `aria-disabled`   |       |                |
| `mediacontroller` |       |                |

### CSS Properties

| Name                                       | Default                                            | Description                                |
| ------------------------------------------ | -------------------------------------------------- | ------------------------------------------ |
| `--media-primary-color`                    | `rgb(238 238 238)`                                 | Default color of range track.              |
| `--media-secondary-color`                  | `rgb(20 20 30 / .7)`                               | Default color of range background.         |
| `--media-control-display`                  | `inline-block`                                     | \`display\` property of control.           |
| `--media-control-padding`                  | `10px`                                             | \`padding\` of control.                    |
| `--media-control-background`               | `var(--media-secondary-color, rgb(20 20 30 / .7))` | \`background\` of control.                 |
| `--media-control-hover-background`         | `rgb(50 50 70 / .7)`                               | \`background\` of control hover state.     |
| `--media-control-height`                   | `24px`                                             | \`height\` of control.                     |
| `--media-range-padding`                    | `var(--media-control-padding, 10px)`               | \`padding\` of range.                      |
| `--media-range-padding-left`               | `var(--_media-range-padding)`                      | \`padding-left\` of range.                 |
| `--media-range-padding-right`              | `var(--_media-range-padding)`                      | \`padding-right\` of range.                |
| `--media-range-thumb-width`                | `10px`                                             | \`width\` of range thumb.                  |
| `--media-range-thumb-height`               | `10px`                                             | \`height\` of range thumb.                 |
| `--media-range-thumb-border`               | `none`                                             | \`border\` of range thumb.                 |
| `--media-range-thumb-border-radius`        | `10px`                                             | \`border-radius\` of range thumb.          |
| `--media-range-thumb-background`           | `var(--media-primary-color, rgb(238 238 238))`     | \`background\` of range thumb.             |
| `--media-range-thumb-box-shadow`           | `1px 1px 1px transparent`                          | \`box-shadow\` of range thumb.             |
| `--media-range-thumb-transition`           | `none`                                             | \`transition\` of range thumb.             |
| `--media-range-thumb-transform`            | `none`                                             | \`transform\` of range thumb.              |
| `--media-range-thumb-opacity`              | `1`                                                | \`opacity\` of range thumb.                |
| `--media-range-track-background`           | `rgb(255 255 255 / .2)`                            | \`background\` of range track.             |
| `--media-range-track-width`                | `100%`                                             | \`width\` of range track.                  |
| `--media-range-track-height`               | `4px`                                              | \`height\` of range track.                 |
| `--media-range-track-border`               | `none`                                             | \`border\` of range track.                 |
| `--media-range-track-outline`              |                                                    | \`outline\` of range track.                |
| `--media-range-track-outline-offset`       |                                                    | \`outline-offset\` of range track.         |
| `--media-range-track-border-radius`        | `1px`                                              | \`border-radius\` of range track.          |
| `--media-range-track-box-shadow`           | `none`                                             | \`box-shadow\` of range track.             |
| `--media-range-track-transition`           | `none`                                             | \`transition\` of range track.             |
| `--media-range-track-translate-x`          | `0px`                                              | \`translate\` x-coordinate of range track. |
| `--media-range-track-translate-y`          | `0px`                                              | \`translate\` y-coordinate of range track. |
| `--media-time-range-hover-display`         | `none`                                             | \`display\` of range hover zone.           |
| `--media-time-range-hover-bottom`          | `-5px`                                             | \`bottom\` of range hover zone.            |
| `--media-time-range-hover-height`          | `max(calc(100% + 5px), 20px)`                      | \`height\` of range hover zone.            |
| `--media-range-track-pointer-background`   |                                                    | \`background\` of range track pointer.     |
| `--media-range-track-pointer-border-right` |                                                    | \`border-right\` of range track pointer.   |

<hr/>

## Exports

| Kind                        | Name                 | Declaration      | Module                     | Package |
| --------------------------- | -------------------- | ---------------- | -------------------------- | ------- |
| `custom-element-definition` | `media-chrome-range` | MediaChromeRange | dist/media-chrome-range.js |         |
| `js`                        | `default`            | MediaChromeRange | dist/media-chrome-range.js |         |

# `dist/media-container.js`:

## class: `MediaContainer`, `media-container-temp`

### Superclass

| Name | Module                          | Package |
| ---- | ------------------------------- | ------- |
|      | /dist/media-gesture-receiver.js |         |

### Fields

| Name             | Privacy | Type | Default                              | Description | Inherited From |
| ---------------- | ------- | ---- | ------------------------------------ | ----------- | -------------- |
| `media`          |         |      |                                      |             |                |
| `autohide`       |         |      |                                      |             |                |
| `resizeObserver` |         |      | `new ResizeObserver(resizeCallback)` |             |                |

### Methods

| Name                 | Privacy | Description | Parameters | Return | Inherited From |
| -------------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `mediaSetCallback`   |         |             | `media`    |        |                |
| `handleMediaUpdated` |         |             | `media`    |        |                |
| `mediaUnsetCallback` |         |             | `node`     |        |                |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             |                |

### CSS Properties

| Name                       | Default | Description                        |
| -------------------------- | ------- | ---------------------------------- |
| `--media-background-color` | `#000`  | \`background-color\` of container. |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                   | Declaration    | Module                  | Package |
| --------------------------- | ---------------------- | -------------- | ----------------------- | ------- |
| `js`                        | `Attributes`           | Attributes     | dist/media-container.js |         |
| `custom-element-definition` | `media-container-temp` | MediaContainer | dist/media-container.js |         |
| `js`                        | `default`              | MediaContainer | dist/media-container.js |         |

# `dist/media-control-bar.js`:

## class: `MediaControlBar`, `media-control-bar`

### Superclass

| Name | Module                    | Package |
| ---- | ------------------------- | ------- |
|      | dist/media-control-bar.js |         |

### Attributes

| Name              | Field | Inherited From |
| ----------------- | ----- | -------------- |
| `mediacontroller` |       |                |

### CSS Properties

| Name                          | Default                                         | Description                          |
| ----------------------------- | ----------------------------------------------- | ------------------------------------ |
| `--media-primary-color`       | `rgb(238 238 238)`                              | Default color of text and icon.      |
| `--media-secondary-color`     |                                                 | Default color of button background.  |
| `--media-text-color`          | `var(--media-primary-color, rgb(238 238 238))`  | \`color\` of button text.            |
| `--media-control-bar-display` | `inline-flex`                                   | \`display\` property of control bar. |
| `--media-control-display`     | `var(--media-control-bar-display, inline-flex)` | \`display\` property of control.     |

<hr/>

## Exports

| Kind                        | Name                | Declaration     | Module                    | Package |
| --------------------------- | ------------------- | --------------- | ------------------------- | ------- |
| `custom-element-definition` | `media-control-bar` | MediaControlBar | dist/media-control-bar.js |         |
| `js`                        | `default`           | MediaControlBar | dist/media-control-bar.js |         |

# `dist/media-controller.js`:

## class: `MediaController`, `media-controller`

### Superclass

| Name             | Module                   | Package |
| ---------------- | ------------------------ | ------- |
| `MediaContainer` | /dist/media-container.js |         |

### Fields

| Name                             | Privacy | Type     | Default                              | Description | Inherited From |
| -------------------------------- | ------- | -------- | ------------------------------------ | ----------- | -------------- |
| `fullscreenElement`              |         |          |                                      |             |                |
| `hotkeys`                        |         |          |                                      |             |                |
| `mediaStateReceivers`            |         | `array`  | `[]`                                 |             |                |
| `associatedElementSubscriptions` |         |          | `new Map()`                          |             |                |
| `_mediaStatePropagators`         |         | `object` | `{}`                                 |             |                |
| `media`                          |         |          |                                      |             | MediaContainer |
| `autohide`                       |         |          |                                      |             | MediaContainer |
| `resizeObserver`                 |         |          | `new ResizeObserver(resizeCallback)` |             | MediaContainer |

### Methods

| Name                           | Privacy | Description | Parameters         | Return | Inherited From |
| ------------------------------ | ------- | ----------- | ------------------ | ------ | -------------- |
| `mediaSetCallback`             |         |             | `media`            |        | MediaContainer |
| `mediaUnsetCallback`           |         |             | `media`            |        | MediaContainer |
| `propagateMediaState`          |         |             | `stateName, state` |        |                |
| `associateElement`             |         |             | `element`          |        |                |
| `unassociateElement`           |         |             | `element`          |        |                |
| `registerMediaStateReceiver`   |         |             | `el`               |        |                |
| `unregisterMediaStateReceiver` |         |             | `el`               |        |                |
| `#keyUpHandler`                |         |             | `e`                |        |                |
| `#keyDownHandler`              |         |             | `e`                |        |                |
| `enableHotkeys`                |         |             |                    |        |                |
| `disableHotkeys`               |         |             |                    |        |                |
| `keyboardShortcutHandler`      |         |             | `e`                |        |                |
| `handleMediaUpdated`           |         |             | `media`            |        | MediaContainer |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             | MediaContainer |

### Attributes

| Name                | Field | Inherited From |
| ------------------- | ----- | -------------- |
| `defaultsubtitles`  |       |                |
| `defaultstreamtype` |       |                |
| `fullscreenelement` |       |                |
| `nohotkeys`         |       |                |
| `hotkeys`           |       |                |
| `keysused`          |       |                |
| `liveedgeoffset`    |       |                |
| `noautoseektolive`  |       |                |

### CSS Properties

| Name                       | Default | Description                        |
| -------------------------- | ------- | ---------------------------------- |
| `--media-background-color` | `#000`  | \`background-color\` of container. |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name               | Declaration     | Module                   | Package |
| --------------------------- | ------------------ | --------------- | ------------------------ | ------- |
| `js`                        | `Attributes`       | Attributes      | dist/media-controller.js |         |
| `custom-element-definition` | `media-controller` | MediaController | dist/media-controller.js |         |
| `js`                        | `default`          | MediaController | dist/media-controller.js |         |

# `dist/media-current-time-display.js`:

## class: `MediaCurrentTimeDisplay`, `media-current-time-display`

### Superclass

| Name               | Module                      | Package |
| ------------------ | --------------------------- | ------- |
| `MediaTextDisplay` | /dist/media-text-display.js |         |

### Fields

| Name          | Privacy | Type | Default | Description | Inherited From |
| ------------- | ------- | ---- | ------- | ----------- | -------------- |
| `textContent` |         |      |         |             |                |

### Attributes

| Name              | Field | Inherited From   |
| ----------------- | ----- | ---------------- |
| `mediacontroller` |       | MediaTextDisplay |

### CSS Properties

| Name                                   | Default                                                                                                                                                                                                             | Description                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-current-time-display-display` | `inline-flex`                                                                                                                                                                                                       | \`display\` property of display.       |
| `--media-primary-color`                | `rgb(238 238 238)`                                                                                                                                                                                                  | Default color of text.                 |
| `--media-secondary-color`              | `rgb(20 20 30 / .7)`                                                                                                                                                                                                | Default color of background.           |
| `--media-text-color`                   | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                      | \`color\` of text.                     |
| `--media-control-display`              |                                                                                                                                                                                                                     | \`display\` property of control.       |
| `--media-control-background`           | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                  | \`background\` of control.             |
| `--media-control-hover-background`     |                                                                                                                                                                                                                     | \`background\` of control hover state. |
| `--media-control-padding`              | `10px`                                                                                                                                                                                                              | \`padding\` of control.                |
| `--media-control-height`               | `24px`                                                                                                                                                                                                              | \`line-height\` of control.            |
| `--media-font`                         | `var(--media-font-weight, normal) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`                  | `normal`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`                  | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                               | \`font-family\` property.              |
| `--media-font-size`                    | `14px`                                                                                                                                                                                                              | \`font-size\` property.                |
| `--media-text-content-height`          | `var(--media-control-height, 24px)`                                                                                                                                                                                 | \`line-height\` of text.               |

<hr/>

## Exports

| Kind                        | Name                         | Declaration             | Module                             | Package |
| --------------------------- | ---------------------------- | ----------------------- | ---------------------------------- | ------- |
| `custom-element-definition` | `media-current-time-display` | MediaCurrentTimeDisplay | dist/media-current-time-display.js |         |
| `js`                        | `default`                    | MediaCurrentTimeDisplay | dist/media-current-time-display.js |         |

# `dist/media-duration-display.js`:

## class: `MediaDurationDisplay`, `media-duration-display`

### Superclass

| Name               | Module                      | Package |
| ------------------ | --------------------------- | ------- |
| `MediaTextDisplay` | /dist/media-text-display.js |         |

### Fields

| Name          | Privacy | Type | Default | Description | Inherited From |
| ------------- | ------- | ---- | ------- | ----------- | -------------- |
| `textContent` |         |      |         |             |                |

### Attributes

| Name              | Field | Inherited From   |
| ----------------- | ----- | ---------------- |
| `mediacontroller` |       | MediaTextDisplay |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                             | Description                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-duration-display-display` | `inline-flex`                                                                                                                                                                                                       | \`display\` property of display.       |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                  | Default color of text.                 |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                                | Default color of background.           |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                      | \`color\` of text.                     |
| `--media-control-display`          |                                                                                                                                                                                                                     | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                  | \`background\` of control.             |
| `--media-control-hover-background` |                                                                                                                                                                                                                     | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                              | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                              | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, normal) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `normal`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                               | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                              | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                                 | \`line-height\` of text.               |

<hr/>

## Exports

| Kind                        | Name                     | Declaration          | Module                         | Package |
| --------------------------- | ------------------------ | -------------------- | ------------------------------ | ------- |
| `custom-element-definition` | `media-duration-display` | MediaDurationDisplay | dist/media-duration-display.js |         |
| `js`                        | `default`                | MediaDurationDisplay | dist/media-duration-display.js |         |

# `dist/media-fullscreen-button.js`:

## class: `MediaFullscreenButton`, `media-fullscreen-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             |                |

### Attributes

| Name              | Field | Inherited From    |
| ----------------- | ----- | ----------------- |
| `disabled`        |       | MediaChromeButton |
| `mediacontroller` |       | MediaChromeButton |

### CSS Properties

| Name                                | Default                                                                                                                                                                                                           | Description                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-fullscreen-button-display` | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`             | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`           | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`                | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`                | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`           |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`        | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background`  | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`           | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`            | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                      | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`               | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`               | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                 | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`         |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`        | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`     |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`    |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name    | Description |
| ------- | ----------- |
| `enter` |             |
| `exit`  |             |

<hr/>

## Exports

| Kind                        | Name                      | Declaration           | Module                          | Package |
| --------------------------- | ------------------------- | --------------------- | ------------------------------- | ------- |
| `custom-element-definition` | `media-fullscreen-button` | MediaFullscreenButton | dist/media-fullscreen-button.js |         |
| `js`                        | `default`                 | MediaFullscreenButton | dist/media-fullscreen-button.js |         |

# `dist/media-gesture-receiver.js`:

## class: `MediaGestureReceiver`, `media-gesture-receiver`

### Superclass

| Name | Module                         | Package |
| ---- | ------------------------------ | ------- |
|      | dist/media-gesture-receiver.js |         |

### Methods

| Name               | Privacy | Description | Parameters | Return | Inherited From |
| ------------------ | ------- | ----------- | ---------- | ------ | -------------- |
| `handleEvent`      |         |             | `event`    |        |                |
| `handleTap`        |         |             | `e: Event` |        |                |
| `handleMouseClick` |         |             | `e`        |        |                |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             |                |

### Attributes

| Name              | Field | Inherited From |
| ----------------- | ----- | -------------- |
| `mediapaused`     |       |                |
| `mediacontroller` |       |                |

### CSS Properties

| Name                               | Default                                               | Description                               |
| ---------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| `--media-gesture-receiver-display` | `inline-block`                                        | \`display\` property of gesture receiver. |
| `--media-control-display`          | `var(--media-gesture-receiver-display, inline-block)` | \`display\` property of control.          |

<hr/>

## Exports

| Kind                        | Name                     | Declaration          | Module                         | Package |
| --------------------------- | ------------------------ | -------------------- | ------------------------------ | ------- |
| `custom-element-definition` | `media-gesture-receiver` | MediaGestureReceiver | dist/media-gesture-receiver.js |         |
| `js`                        | `default`                | MediaGestureReceiver | dist/media-gesture-receiver.js |         |

# `dist/media-live-button.js`:

## class: `MediaLiveButton`, `media-live-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Events

| Name                         | Type | Description | Inherited From |
| ---------------------------- | ---- | ----------- | -------------- |
| `MEDIA_SEEK_TO_LIVE_REQUEST` |      |             |                |
| `MEDIA_PLAY_REQUEST`         |      |             |                |

### Attributes

| Name              | Field | Inherited From    |
| ----------------- | ----- | ----------------- |
| `mediapaused`     |       |                   |
| `mediatimeislive` |       |                   |
| `disabled`        |       | MediaChromeButton |
| `mediacontroller` |       | MediaChromeButton |

### CSS Properties

| Name                                  | Default                                                                                                                                                                                                           | Description                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `--media-live-button-display`         | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.                 |
| `--media-live-button-icon-color`      | `rgb(140, 140, 140)`                                                                                                                                                                                              | \`fill\` and \`color\` of not live button icon. |
| `--media-live-button-indicator-color` |                                                                                                                                                                                                                   | \`fill\` and \`color\` of live button icon.     |
| `--media-primary-color`               | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.                 |
| `--media-secondary-color`             | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.             |
| `--media-text-color`                  | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.                       |
| `--media-icon-color`                  | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.                  |
| `--media-control-display`             |                                                                                                                                                                                                                   | \`display\` property of control.                |
| `--media-control-background`          | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.                      |
| `--media-control-hover-background`    | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state.          |
| `--media-control-padding`             | `10px`                                                                                                                                                                                                            | \`padding\` of control.                         |
| `--media-control-height`              | `24px`                                                                                                                                                                                                            | \`line-height\` of control.                     |
| `--media-font`                        | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.                    |
| `--media-font-weight`                 | `bold`                                                                                                                                                                                                            | \`font-weight\` property.                       |
| `--media-font-family`                 | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.                       |
| `--media-font-size`                   | `14px`                                                                                                                                                                                                            | \`font-size\` property.                         |
| `--media-text-content-height`         | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.                 |
| `--media-button-icon-width`           |                                                                                                                                                                                                                   | \`width\` of button icon.                       |
| `--media-button-icon-height`          | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.                      |
| `--media-button-icon-transform`       |                                                                                                                                                                                                                   | \`transform\` of button icon.                   |
| `--media-button-icon-transition`      |                                                                                                                                                                                                                   | \`transition\` of button icon.                  |

### Slots

| Name        | Description |
| ----------- | ----------- |
| `indicator` |             |
| `spacer`    |             |
| `text`      |             |

<hr/>

## Exports

| Kind                        | Name                | Declaration     | Module                    | Package |
| --------------------------- | ------------------- | --------------- | ------------------------- | ------- |
| `custom-element-definition` | `media-live-button` | MediaLiveButton | dist/media-live-button.js |         |
| `js`                        | `default`           | MediaLiveButton | dist/media-live-button.js |         |

# `dist/media-loading-indicator.js`:

## class: `MediaLoadingIndicator`, `media-loading-indicator`

### Superclass

| Name | Module                          | Package |
| ---- | ------------------------------- | ------- |
|      | dist/media-loading-indicator.js |         |

### Attributes

| Name              | Field | Inherited From |
| ----------------- | ----- | -------------- |
| `loadingdelay`    |       |                |
| `mediacontroller` |       |                |
| `mediapaused`     |       |                |
| `medialoading`    |       |                |

### CSS Properties

| Name                                | Default                                                | Description                                |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `--media-primary-color`             | `rgb(238 238 238)`                                     | Default color of text and icon.            |
| `--media-icon-color`                | `var(--media-primary-color, rgb(238 238 238))`         | \`fill\` color of button icon.             |
| `--media-control-display`           | `var(--media-loading-indicator-display, inline-block)` | \`display\` property of control.           |
| `--media-loading-indicator-display` | `inline-block`                                         | \`display\` property of loading indicator. |
| `--media-loading-icon-width`        | `100px`                                                | \`width\` of loading icon.                 |
| `--media-loading-icon-height`       |                                                        | \`height\` of loading icon.                |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                      | Declaration           | Module                          | Package |
| --------------------------- | ------------------------- | --------------------- | ------------------------------- | ------- |
| `js`                        | `Attributes`              | Attributes            | dist/media-loading-indicator.js |         |
| `custom-element-definition` | `media-loading-indicator` | MediaLoadingIndicator | dist/media-loading-indicator.js |         |
| `js`                        | `default`                 | MediaLoadingIndicator | dist/media-loading-indicator.js |         |

# `dist/media-mute-button.js`:

## class: `MediaMuteButton`, `media-mute-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             |                |

### Attributes

| Name               | Field | Inherited From    |
| ------------------ | ----- | ----------------- |
| `mediavolumelevel` |       |                   |
| `disabled`         |       | MediaChromeButton |
| `mediacontroller`  |       | MediaChromeButton |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                           | Description                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-mute-button-display`      | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`          |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background` | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`        |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`    |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`   |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name     | Description |
| -------- | ----------- |
| `off`    |             |
| `low`    |             |
| `medium` |             |
| `high`   |             |

<hr/>

## Exports

| Kind                        | Name                | Declaration     | Module                    | Package |
| --------------------------- | ------------------- | --------------- | ------------------------- | ------- |
| `custom-element-definition` | `media-mute-button` | MediaMuteButton | dist/media-mute-button.js |         |
| `js`                        | `default`           | MediaMuteButton | dist/media-mute-button.js |         |

# `dist/media-pip-button.js`:

## class: `MediaPipButton`, `media-pip-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             |                |

### Attributes

| Name                  | Field | Inherited From    |
| --------------------- | ----- | ----------------- |
| `mediapipunavailable` |       |                   |
| `mediaispip`          |       |                   |
| `disabled`            |       | MediaChromeButton |
| `mediacontroller`     |       | MediaChromeButton |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                           | Description                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-pip-button-display`       | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`          |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background` | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`        |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`    |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`   |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name    | Description |
| ------- | ----------- |
| `enter` |             |
| `exit`  |             |

<hr/>

## Exports

| Kind                        | Name               | Declaration    | Module                   | Package |
| --------------------------- | ------------------ | -------------- | ------------------------ | ------- |
| `custom-element-definition` | `media-pip-button` | MediaPipButton | dist/media-pip-button.js |         |
| `js`                        | `default`          | MediaPipButton | dist/media-pip-button.js |         |

# `dist/media-play-button.js`:

## class: `MediaPlayButton`, `media-play-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Events

| Name        | Type | Description | Inherited From |
| ----------- | ---- | ----------- | -------------- |
| `eventName` |      |             |                |

### Attributes

| Name              | Field | Inherited From    |
| ----------------- | ----- | ----------------- |
| `mediapaused`     |       |                   |
| `disabled`        |       | MediaChromeButton |
| `mediacontroller` |       | MediaChromeButton |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                           | Description                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-play-button-display`      | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`          |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background` | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`        |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`       | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`    |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`   |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name    | Description |
| ------- | ----------- |
| `play`  |             |
| `pause` |             |

<hr/>

## Exports

| Kind                        | Name                | Declaration     | Module                    | Package |
| --------------------------- | ------------------- | --------------- | ------------------------- | ------- |
| `custom-element-definition` | `media-play-button` | MediaPlayButton | dist/media-play-button.js |         |
| `js`                        | `default`           | MediaPlayButton | dist/media-play-button.js |         |

# `dist/media-playback-rate-button.js`:

## class: `MediaPlaybackRateButton`, `media-playback-rate-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type                    | Default                  | Description | Inherited From    |
| -------------- | ------- | ----------------------- | ------------------------ | ----------- | ----------------- |
| `_rates`       |         | `number[] \| undefined` |                          |             |                   |
| `container`    |         |                         |                          |             |                   |
| `innerHTML`    |         |                         | `` `${DEFAULT_RATE}x` `` |             |                   |
| `preventClick` |         | `boolean`               | `false`                  |             | MediaChromeButton |
| `keysUsed`     |         |                         |                          |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Attributes

| Name                | Field | Inherited From    |
| ------------------- | ----- | ----------------- |
| `rates`             |       |                   |
| `mediaplaybackrate` |       |                   |
| `disabled`          |       | MediaChromeButton |
| `mediacontroller`   |       | MediaChromeButton |

### CSS Properties

| Name                                   | Default                                                                                                                                                                                                           | Description                            |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-playback-rate-button-display` | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`                | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`              | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`                   | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`                   | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`              |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`           | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background`     | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`              | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`               | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                         | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`                  | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`                  | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                    | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`          | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`            |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`           | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`        |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`       |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

<hr/>

## Variables

| Name            | Description | Type     |
| --------------- | ----------- | -------- |
| `Attributes`    |             | `object` |
| `DEFAULT_RATES` |             | `array`  |
| `DEFAULT_RATE`  |             | `number` |

<hr/>

## Exports

| Kind                        | Name                         | Declaration             | Module                             | Package |
| --------------------------- | ---------------------------- | ----------------------- | ---------------------------------- | ------- |
| `js`                        | `Attributes`                 | Attributes              | dist/media-playback-rate-button.js |         |
| `js`                        | `DEFAULT_RATES`              | DEFAULT\_RATES          | dist/media-playback-rate-button.js |         |
| `js`                        | `DEFAULT_RATE`               | DEFAULT\_RATE           | dist/media-playback-rate-button.js |         |
| `custom-element-definition` | `media-playback-rate-button` | MediaPlaybackRateButton | dist/media-playback-rate-button.js |         |
| `js`                        | `default`                    | MediaPlaybackRateButton | dist/media-playback-rate-button.js |         |

# `dist/media-poster-image.js`:

## class: `MediaPosterImage`, `media-poster-image`

### Superclass

| Name | Module                     | Package |
| ---- | -------------------------- | ------- |
|      | dist/media-poster-image.js |         |

### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `image` |         |      |         |             |                |

### Attributes

| Name             | Field | Inherited From |
| ---------------- | ----- | -------------- |
| `placeholdersrc` |       |                |
| `src`            |       |                |

### CSS Properties

| Name                           | Default                                | Description                              |
| ------------------------------ | -------------------------------------- | ---------------------------------------- |
| `--media-poster-image-display` | `inline-block`                         | \`display\` property of poster image.    |
| `--media-background-position`  | `var(--media-object-position, center)` | \`background-position\` of poster image. |
| `--media-background-size`      | `var(--media-object-fit, contain)`     | \`background-size\` of poster image.     |
| `--media-object-fit`           | `contain`                              | \`object-fit\` of poster image.          |
| `--media-object-position`      | `center`                               | \`object-position\` of poster image.     |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                 | Declaration      | Module                     | Package |
| --------------------------- | -------------------- | ---------------- | -------------------------- | ------- |
| `js`                        | `Attributes`         | Attributes       | dist/media-poster-image.js |         |
| `custom-element-definition` | `media-poster-image` | MediaPosterImage | dist/media-poster-image.js |         |
| `js`                        | `default`            | MediaPosterImage | dist/media-poster-image.js |         |

# `dist/media-preview-thumbnail.js`:

## class: `MediaPreviewThumbnail`, `media-preview-thumbnail`

### Superclass

| Name | Module                          | Package |
| ---- | ------------------------------- | ------- |
|      | dist/media-preview-thumbnail.js |         |

### Methods

| Name     | Privacy | Description | Parameters | Return | Inherited From |
| -------- | ------- | ----------- | ---------- | ------ | -------------- |
| `update` |         |             |            |        |                |

### Attributes

| Name                 | Field | Inherited From |
| -------------------- | ----- | -------------- |
| `time`               |       |                |
| `mediacontroller`    |       |                |
| `mediapreviewimage`  |       |                |
| `mediapreviewcoords` |       |                |

### CSS Properties

| Name                                | Default        | Description                      |
| ----------------------------------- | -------------- | -------------------------------- |
| `--media-preview-thumbnail-display` | `inline-block` | \`display\` property of display. |
| `--media-control-display`           | `inline-block` | \`display\` property of control. |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                      | Declaration           | Module                          | Package |
| --------------------------- | ------------------------- | --------------------- | ------------------------------- | ------- |
| `js`                        | `Attributes`              | Attributes            | dist/media-preview-thumbnail.js |         |
| `custom-element-definition` | `media-preview-thumbnail` | MediaPreviewThumbnail | dist/media-preview-thumbnail.js |         |
| `js`                        | `default`                 | MediaPreviewThumbnail | dist/media-preview-thumbnail.js |         |

# `dist/media-preview-time-display.js`:

## class: `MediaPreviewTimeDisplay`, `media-preview-time-display`

### Superclass

| Name               | Module                      | Package |
| ------------------ | --------------------------- | ------- |
| `MediaTextDisplay` | /dist/media-text-display.js |         |

### Fields

| Name          | Privacy | Type | Default | Description | Inherited From |
| ------------- | ------- | ---- | ------- | ----------- | -------------- |
| `textContent` |         |      |         |             |                |

### Attributes

| Name               | Field | Inherited From   |
| ------------------ | ----- | ---------------- |
| `mediapreviewtime` |       |                  |
| `mediacontroller`  |       | MediaTextDisplay |

### CSS Properties

| Name                                   | Default                                                                                                                                                                                                             | Description                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-preview-time-display-display` | `inline-flex`                                                                                                                                                                                                       | \`display\` property of display.       |
| `--media-primary-color`                | `rgb(238 238 238)`                                                                                                                                                                                                  | Default color of text.                 |
| `--media-secondary-color`              | `rgb(20 20 30 / .7)`                                                                                                                                                                                                | Default color of background.           |
| `--media-text-color`                   | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                      | \`color\` of text.                     |
| `--media-control-display`              |                                                                                                                                                                                                                     | \`display\` property of control.       |
| `--media-control-background`           | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                  | \`background\` of control.             |
| `--media-control-hover-background`     |                                                                                                                                                                                                                     | \`background\` of control hover state. |
| `--media-control-padding`              | `10px`                                                                                                                                                                                                              | \`padding\` of control.                |
| `--media-control-height`               | `24px`                                                                                                                                                                                                              | \`line-height\` of control.            |
| `--media-font`                         | `var(--media-font-weight, normal) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`                  | `normal`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`                  | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                               | \`font-family\` property.              |
| `--media-font-size`                    | `14px`                                                                                                                                                                                                              | \`font-size\` property.                |
| `--media-text-content-height`          | `var(--media-control-height, 24px)`                                                                                                                                                                                 | \`line-height\` of text.               |

<hr/>

## Exports

| Kind                        | Name                         | Declaration             | Module                             | Package |
| --------------------------- | ---------------------------- | ----------------------- | ---------------------------------- | ------- |
| `custom-element-definition` | `media-preview-time-display` | MediaPreviewTimeDisplay | dist/media-preview-time-display.js |         |
| `js`                        | `default`                    | MediaPreviewTimeDisplay | dist/media-preview-time-display.js |         |

# `dist/media-seek-backward-button.js`:

## class: `MediaSeekBackwardButton`, `media-seek-backward-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Attributes

| Name               | Field | Inherited From    |
| ------------------ | ----- | ----------------- |
| `seekoffset`       |       |                   |
| `mediacurrenttime` |       |                   |
| `disabled`         |       | MediaChromeButton |
| `mediacontroller`  |       | MediaChromeButton |

### CSS Properties

| Name                                   | Default                                                                                                                                                                                                           | Description                            |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-seek-backward-button-display` | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`                | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`              | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`                   | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`                   | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`              |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`           | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background`     | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`              | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`               | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                         | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`                  | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`                  | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                    | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`          | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`            |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`           | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`        |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`       |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name       | Description |
| ---------- | ----------- |
| `backward` |             |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                         | Declaration             | Module                             | Package |
| --------------------------- | ---------------------------- | ----------------------- | ---------------------------------- | ------- |
| `js`                        | `Attributes`                 | Attributes              | dist/media-seek-backward-button.js |         |
| `custom-element-definition` | `media-seek-backward-button` | MediaSeekBackwardButton | dist/media-seek-backward-button.js |         |
| `js`                        | `default`                    | MediaSeekBackwardButton | dist/media-seek-backward-button.js |         |

# `dist/media-seek-forward-button.js`:

## class: `MediaSeekForwardButton`, `media-seek-forward-button`

### Superclass

| Name                | Module                       | Package |
| ------------------- | ---------------------------- | ------- |
| `MediaChromeButton` | /dist/media-chrome-button.js |         |

### Fields

| Name           | Privacy | Type      | Default | Description | Inherited From    |
| -------------- | ------- | --------- | ------- | ----------- | ----------------- |
| `preventClick` |         | `boolean` | `false` |             | MediaChromeButton |
| `keysUsed`     |         |           |         |             | MediaChromeButton |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From    |
| ------------- | ------- | ----------- | ---------- | ------ | ----------------- |
| `handleClick` |         |             | `e: Event` |        | MediaChromeButton |
| `enable`      |         |             |            |        | MediaChromeButton |
| `disable`     |         |             |            |        | MediaChromeButton |

### Attributes

| Name               | Field | Inherited From    |
| ------------------ | ----- | ----------------- |
| `seekoffset`       |       |                   |
| `mediacurrenttime` |       |                   |
| `disabled`         |       | MediaChromeButton |
| `mediacontroller`  |       | MediaChromeButton |

### CSS Properties

| Name                                  | Default                                                                                                                                                                                                           | Description                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-seek-forward-button-display` | `inline-flex`                                                                                                                                                                                                     | \`display\` property of button.        |
| `--media-primary-color`               | `rgb(238 238 238)`                                                                                                                                                                                                | Default color of text and icon.        |
| `--media-secondary-color`             | `rgb(20 20 30 / .7)`                                                                                                                                                                                              | Default color of button background.    |
| `--media-text-color`                  | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`color\` of button text.              |
| `--media-icon-color`                  | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                    | \`fill\` color of button icon.         |
| `--media-control-display`             |                                                                                                                                                                                                                   | \`display\` property of control.       |
| `--media-control-background`          | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                | \`background\` of control.             |
| `--media-control-hover-background`    | `rgba(50 50 70 / .7)`                                                                                                                                                                                             | \`background\` of control hover state. |
| `--media-control-padding`             | `10px`                                                                                                                                                                                                            | \`padding\` of control.                |
| `--media-control-height`              | `24px`                                                                                                                                                                                                            | \`line-height\` of control.            |
| `--media-font`                        | `var(--media-font-weight, bold) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`                 | `bold`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`                 | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                             | \`font-family\` property.              |
| `--media-font-size`                   | `14px`                                                                                                                                                                                                            | \`font-size\` property.                |
| `--media-text-content-height`         | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`line-height\` of button text.        |
| `--media-button-icon-width`           |                                                                                                                                                                                                                   | \`width\` of button icon.              |
| `--media-button-icon-height`          | `var(--media-control-height, 24px)`                                                                                                                                                                               | \`height\` of button icon.             |
| `--media-button-icon-transform`       |                                                                                                                                                                                                                   | \`transform\` of button icon.          |
| `--media-button-icon-transition`      |                                                                                                                                                                                                                   | \`transition\` of button icon.         |

### Slots

| Name      | Description |
| --------- | ----------- |
| `forward` |             |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                        | Declaration            | Module                            | Package |
| --------------------------- | --------------------------- | ---------------------- | --------------------------------- | ------- |
| `js`                        | `Attributes`                | Attributes             | dist/media-seek-forward-button.js |         |
| `custom-element-definition` | `media-seek-forward-button` | MediaSeekForwardButton | dist/media-seek-forward-button.js |         |
| `js`                        | `default`                   | MediaSeekForwardButton | dist/media-seek-forward-button.js |         |

# `dist/media-text-display.js`:

## class: `MediaTextDisplay`, `media-text-display`

### Superclass

| Name | Module                     | Package |
| ---- | -------------------------- | ------- |
|      | dist/media-text-display.js |         |

### Attributes

| Name              | Field | Inherited From |
| ----------------- | ----- | -------------- |
| `mediacontroller` |       |                |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                             | Description                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                  | Default color of text.                 |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                                | Default color of background.           |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                      | \`color\` of text.                     |
| `--media-control-display`          |                                                                                                                                                                                                                     | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                  | \`background\` of control.             |
| `--media-control-hover-background` |                                                                                                                                                                                                                     | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                              | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                              | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, normal) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `normal`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                               | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                              | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                                 | \`line-height\` of text.               |

<hr/>

## Exports

| Kind                        | Name                 | Declaration      | Module                     | Package |
| --------------------------- | -------------------- | ---------------- | -------------------------- | ------- |
| `custom-element-definition` | `media-text-display` | MediaTextDisplay | dist/media-text-display.js |         |
| `js`                        | `default`            | MediaTextDisplay | dist/media-text-display.js |         |

# `dist/media-theme-element.js`:

## class: `MediaThemeElement`, `media-theme`

### Superclass

| Name | Module                      | Package |
| ---- | --------------------------- | ------- |
|      | dist/media-theme-element.js |         |

### Static Fields

| Name        | Privacy | Type | Default     | Description | Inherited From |
| ----------- | ------- | ---- | ----------- | ----------- | -------------- |
| `template`  |         |      |             |             |                |
| `processor` |         |      | `processor` |             |                |

### Fields

| Name              | Privacy | Type | Default | Description | Inherited From |
| ----------------- | ------- | ---- | ------- | ----------- | -------------- |
| `renderRoot`      |         |      |         |             |                |
| `renderer`        |         |      |         |             |                |
| `mediaController` |         |      |         |             |                |
| `template`        |         |      |         |             |                |
| `props`           |         |      |         |             |                |

### Methods

| Name               | Privacy | Description | Parameters | Return | Inherited From |
| ------------------ | ------- | ----------- | ---------- | ------ | -------------- |
| `#upgradeProperty` |         |             | `prop`     |        |                |
| `#updateTemplate`  |         |             |            |        |                |
| `createRenderer`   |         |             |            |        |                |
| `render`           |         |             |            |        |                |

### Attributes

| Name       | Field | Inherited From |
| ---------- | ----- | -------------- |
| `template` |       |                |

<hr/>

## Exports

| Kind                        | Name                | Declaration       | Module                      | Package                   |
| --------------------------- | ------------------- | ----------------- | --------------------------- | ------------------------- |
| `js`                        | `*`                 | \*                |                             | ./utils/template-parts.js |
| `js`                        | `MediaThemeElement` | MediaThemeElement | dist/media-theme-element.js |                           |
| `custom-element-definition` | `media-theme`       | MediaThemeElement | dist/media-theme-element.js |                           |

# `dist/media-time-display.js`:

## class: `MediaTimeDisplay`, `media-time-display`

### Superclass

| Name               | Module                      | Package |
| ------------------ | --------------------------- | ------- |
| `MediaTextDisplay` | /dist/media-text-display.js |         |

### Fields

| Name                 | Privacy | Type | Default                           | Description | Inherited From |
| -------------------- | ------- | ---- | --------------------------------- | ----------- | -------------- |
| `mediaDuration`      |         |      |                                   |             |                |
| `mediaCurrentTime`   |         |      |                                   |             |                |
| `mediaSeekable`      |         |      |                                   |             |                |
| `mediaSeekableEnd`   |         |      |                                   |             |                |
| `mediaSeekableStart` |         |      |                                   |             |                |
| `innerHTML`          |         |      | `` `${formatTimesLabel(this)}` `` |             |                |

### Methods

| Name                | Privacy | Description | Parameters | Return | Inherited From |
| ------------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `toggleTimeDisplay` |         |             |            |        |                |
| `enable`            |         |             |            |        |                |
| `disable`           |         |             |            |        |                |
| `update`            |         |             |            |        |                |

### Attributes

| Name               | Field | Inherited From   |
| ------------------ | ----- | ---------------- |
| `disabled`         |       |                  |
| `remaining`        |       |                  |
| `showduration`     |       |                  |
| `mediacurrenttime` |       |                  |
| `mediaduration`    |       |                  |
| `mediaseekable`    |       |                  |
| `mediacontroller`  |       | MediaTextDisplay |

### CSS Properties

| Name                               | Default                                                                                                                                                                                                             | Description                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `--media-time-display-display`     | `inline-flex`                                                                                                                                                                                                       | \`display\` property of display.       |
| `--media-primary-color`            | `rgb(238 238 238)`                                                                                                                                                                                                  | Default color of text.                 |
| `--media-secondary-color`          | `rgb(20 20 30 / .7)`                                                                                                                                                                                                | Default color of background.           |
| `--media-text-color`               | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                      | \`color\` of text.                     |
| `--media-control-display`          |                                                                                                                                                                                                                     | \`display\` property of control.       |
| `--media-control-background`       | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                                                                                                                  | \`background\` of control.             |
| `--media-control-hover-background` |                                                                                                                                                                                                                     | \`background\` of control hover state. |
| `--media-control-padding`          | `10px`                                                                                                                                                                                                              | \`padding\` of control.                |
| `--media-control-height`           | `24px`                                                                                                                                                                                                              | \`line-height\` of control.            |
| `--media-font`                     | `var(--media-font-weight, normal) var(--media-font-size, 14px) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.           |
| `--media-font-weight`              | `normal`                                                                                                                                                                                                            | \`font-weight\` property.              |
| `--media-font-family`              | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                               | \`font-family\` property.              |
| `--media-font-size`                | `14px`                                                                                                                                                                                                              | \`font-size\` property.                |
| `--media-text-content-height`      | `var(--media-control-height, 24px)`                                                                                                                                                                                 | \`line-height\` of text.               |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                 | Declaration      | Module                     | Package |
| --------------------------- | -------------------- | ---------------- | -------------------------- | ------- |
| `js`                        | `Attributes`         | Attributes       | dist/media-time-display.js |         |
| `custom-element-definition` | `media-time-display` | MediaTimeDisplay | dist/media-time-display.js |         |
| `js`                        | `default`            | MediaTimeDisplay | dist/media-time-display.js |         |

# `dist/media-time-range.js`:

## class: `MediaTimeRange`, `media-time-range`

### Superclass

| Name               | Module                      | Package |
| ------------------ | --------------------------- | ------- |
| `MediaChromeRange` | /dist/media-chrome-range.js |         |

### Fields

| Name                 | Privacy | Type                                                                                                    | Default | Description | Inherited From   |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------- | ------- | ----------- | ---------------- |
| `mediaPaused`        |         |                                                                                                         |         |             |                  |
| `mediaLoading`       |         |                                                                                                         |         |             |                  |
| `mediaDuration`      |         |                                                                                                         |         |             |                  |
| `mediaCurrentTime`   |         |                                                                                                         |         |             |                  |
| `mediaPlaybackRate`  |         |                                                                                                         |         |             |                  |
| `mediaBuffered`      |         |                                                                                                         |         |             |                  |
| `mediaSeekable`      |         |                                                                                                         |         |             |                  |
| `mediaSeekableEnd`   |         |                                                                                                         |         |             |                  |
| `mediaSeekableStart` |         |                                                                                                         |         |             |                  |
| `_refreshBar`        |         |                                                                                                         |         |             |                  |
| `keysUsed`           |         |                                                                                                         |         |             | MediaChromeRange |
| `container`          |         |                                                                                                         |         |             | MediaChromeRange |
| `range`              |         | `Omit<HTMLInputElement, "value" \| "min" \| "max"> &       * {value: number, min: number, max: number}` |         |             | MediaChromeRange |

### Methods

| Name               | Privacy | Description | Parameters   | Return | Inherited From   |
| ------------------ | ------- | ----------- | ------------ | ------ | ---------------- |
| `getBarColors`     |         |             |              |        | MediaChromeRange |
| `updateCurrentBox` |         |             |              |        |                  |
| `#getBoxPosition`  |         |             | `box, ratio` |        |                  |
| `#enableBoxes`     |         |             |              |        |                  |
| `#disableBoxes`    |         |             |              |        |                  |
| `updatePointerBar` |         |             | `evt`        |        | MediaChromeRange |
| `updateBar`        |         |             |              |        | MediaChromeRange |

### Attributes

| Name                 | Field | Inherited From   |
| -------------------- | ----- | ---------------- |
| `mediabuffered`      |       |                  |
| `mediaplaybackrate`  |       |                  |
| `mediaduration`      |       |                  |
| `mediaseekable`      |       |                  |
| `mediapaused`        |       |                  |
| `medialoading`       |       |                  |
| `mediacurrenttime`   |       |                  |
| `mediapreviewimage`  |       |                  |
| `mediapreviewcoords` |       |                  |
| `disabled`           |       | MediaChromeRange |
| `aria-disabled`      |       | MediaChromeRange |
| `mediacontroller`    |       | MediaChromeRange |

### CSS Properties

| Name                                       | Default                                                                                                              | Description                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `--media-time-range-display`               | `inline-block`                                                                                                       | \`display\` property of range.                      |
| `--media-preview-transition-property`      | `visibility, opacity`                                                                                                | \`transition-property\` of range hover preview.     |
| `--media-preview-transition-duration-out`  | `.25s`                                                                                                               | \`transition-duration\` out of range hover preview. |
| `--media-preview-transition-delay-out`     | `0s`                                                                                                                 | \`transition-delay\` out of range hover preview.    |
| `--media-preview-transition-duration-in`   | `.5s`                                                                                                                | \`transition-duration\` in of range hover preview.  |
| `--media-preview-transition-delay-in`      | `.25s`                                                                                                               | \`transition-delay\` in of range hover preview.     |
| `--media-preview-thumbnail-background`     | `var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))))` | \`background\` of range preview thumbnail.          |
| `--media-preview-thumbnail-box-shadow`     | `0 0 4px rgb(0 0 0 / .2)`                                                                                            | \`box-shadow\` of range preview thumbnail.          |
| `--media-preview-thumbnail-max-width`      | `180px`                                                                                                              | \`max-width\` of range preview thumbnail.           |
| `--media-preview-thumbnail-max-height`     | `160px`                                                                                                              | \`max-height\` of range preview thumbnail.          |
| `--media-preview-thumbnail-min-width`      | `120px`                                                                                                              | \`min-width\` of range preview thumbnail.           |
| `--media-preview-thumbnail-min-height`     | `80px`                                                                                                               | \`min-height\` of range preview thumbnail.          |
| `--media-preview-thumbnail-border-radius`  | `var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0`                                          | \`border-radius\` of range preview thumbnail.       |
| `--media-preview-thumbnail-border`         |                                                                                                                      | \`border\` of range preview thumbnail.              |
| `--media-preview-time-background`          | `var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))))` | \`background\` of range preview time display.       |
| `--media-preview-time-border-radius`       | `0 0 var(--media-preview-border-radius) var(--media-preview-border-radius)`                                          | \`border-radius\` of range preview time display.    |
| `--media-preview-time-padding`             | `1px 10px 0`                                                                                                         | \`padding\` of range preview time display.          |
| `--media-preview-time-margin`              | `0 0 10px`                                                                                                           | \`margin\` of range preview time display.           |
| `--media-preview-time-text-shadow`         | `0 0 4px rgb(0 0 0 / .75)`                                                                                           | \`text-shadow\` of range preview time display.      |
| `--media-primary-color`                    | `rgb(238 238 238)`                                                                                                   | Default color of range track.                       |
| `--media-secondary-color`                  | `rgb(20 20 30 / .7)`                                                                                                 | Default color of range background.                  |
| `--media-control-display`                  | `inline-block`                                                                                                       | \`display\` property of control.                    |
| `--media-control-padding`                  | `10px`                                                                                                               | \`padding\` of control.                             |
| `--media-control-background`               | `var(--media-secondary-color, rgb(20 20 30 / .7))`                                                                   | \`background\` of control.                          |
| `--media-control-hover-background`         | `rgb(50 50 70 / .7)`                                                                                                 | \`background\` of control hover state.              |
| `--media-control-height`                   | `24px`                                                                                                               | \`height\` of control.                              |
| `--media-range-padding`                    | `var(--media-control-padding, 10px)`                                                                                 | \`padding\` of range.                               |
| `--media-range-padding-left`               | `var(--_media-range-padding)`                                                                                        | \`padding-left\` of range.                          |
| `--media-range-padding-right`              | `var(--_media-range-padding)`                                                                                        | \`padding-right\` of range.                         |
| `--media-range-thumb-width`                | `10px`                                                                                                               | \`width\` of range thumb.                           |
| `--media-range-thumb-height`               | `10px`                                                                                                               | \`height\` of range thumb.                          |
| `--media-range-thumb-border`               | `none`                                                                                                               | \`border\` of range thumb.                          |
| `--media-range-thumb-border-radius`        | `10px`                                                                                                               | \`border-radius\` of range thumb.                   |
| `--media-range-thumb-background`           | `var(--media-primary-color, rgb(238 238 238))`                                                                       | \`background\` of range thumb.                      |
| `--media-range-thumb-box-shadow`           | `1px 1px 1px transparent`                                                                                            | \`box-shadow\` of range thumb.                      |
| `--media-range-thumb-transition`           | `none`                                                                                                               | \`transition\` of range thumb.                      |
| `--media-range-thumb-transform`            | `none`                                                                                                               | \`transform\` of range thumb.                       |
| `--media-range-thumb-opacity`              | `1`                                                                                                                  | \`opacity\` of range thumb.                         |
| `--media-range-track-background`           | `rgb(255 255 255 / .2)`                                                                                              | \`background\` of range track.                      |
| `--media-range-track-width`                | `100%`                                                                                                               | \`width\` of range track.                           |
| `--media-range-track-height`               | `4px`                                                                                                                | \`height\` of range track.                          |
| `--media-range-track-border`               | `none`                                                                                                               | \`border\` of range track.                          |
| `--media-range-track-outline`              |                                                                                                                      | \`outline\` of range track.                         |
| `--media-range-track-outline-offset`       |                                                                                                                      | \`outline-offset\` of range track.                  |
| `--media-range-track-border-radius`        | `1px`                                                                                                                | \`border-radius\` of range track.                   |
| `--media-range-track-box-shadow`           | `none`                                                                                                               | \`box-shadow\` of range track.                      |
| `--media-range-track-transition`           | `none`                                                                                                               | \`transition\` of range track.                      |
| `--media-range-track-translate-x`          | `0px`                                                                                                                | \`translate\` x-coordinate of range track.          |
| `--media-range-track-translate-y`          | `0px`                                                                                                                | \`translate\` y-coordinate of range track.          |
| `--media-time-range-hover-display`         | `none`                                                                                                               | \`display\` of range hover zone.                    |
| `--media-time-range-hover-bottom`          | `-5px`                                                                                                               | \`bottom\` of range hover zone.                     |
| `--media-time-range-hover-height`          | `max(calc(100% + 5px), 20px)`                                                                                        | \`height\` of range hover zone.                     |
| `--media-range-track-pointer-background`   |                                                                                                                      | \`background\` of range track pointer.              |
| `--media-range-track-pointer-border-right` |                                                                                                                      | \`border-right\` of range track pointer.            |

<hr/>

## Exports

| Kind                        | Name               | Declaration    | Module                   | Package |
| --------------------------- | ------------------ | -------------- | ------------------------ | ------- |
| `custom-element-definition` | `media-time-range` | MediaTimeRange | dist/media-time-range.js |         |
| `js`                        | `default`          | MediaTimeRange | dist/media-time-range.js |         |

# `dist/media-volume-range.js`:

## class: `MediaVolumeRange`, `media-volume-range`

### Superclass

| Name               | Module                      | Package |
| ------------------ | --------------------------- | ------- |
| `MediaChromeRange` | /dist/media-chrome-range.js |         |

### Fields

| Name        | Privacy | Type                                                                                                    | Default | Description | Inherited From   |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------- | ------- | ----------- | ---------------- |
| `max`       |         | `number`                                                                                                | `100`   |             |                  |
| `keysUsed`  |         |                                                                                                         |         |             | MediaChromeRange |
| `container` |         |                                                                                                         |         |             | MediaChromeRange |
| `range`     |         | `Omit<HTMLInputElement, "value" \| "min" \| "max"> &       * {value: number, min: number, max: number}` |         |             | MediaChromeRange |

### Methods

| Name               | Privacy | Description | Parameters | Return | Inherited From   |
| ------------------ | ------- | ----------- | ---------- | ------ | ---------------- |
| `updatePointerBar` |         |             | `evt`      |        | MediaChromeRange |
| `updateBar`        |         |             |            |        | MediaChromeRange |
| `getBarColors`     |         |             |            |        | MediaChromeRange |

### Attributes

| Name                     | Field | Inherited From   |
| ------------------------ | ----- | ---------------- |
| `mediavolume`            |       |                  |
| `mediamuted`             |       |                  |
| `mediavolumeunavailable` |       |                  |
| `disabled`               |       | MediaChromeRange |
| `aria-disabled`          |       | MediaChromeRange |
| `mediacontroller`        |       | MediaChromeRange |

### CSS Properties

| Name                                       | Default                                            | Description                                |
| ------------------------------------------ | -------------------------------------------------- | ------------------------------------------ |
| `--media-volume-range-display`             | `inline-block`                                     | \`display\` property of range.             |
| `--media-primary-color`                    | `rgb(238 238 238)`                                 | Default color of range track.              |
| `--media-secondary-color`                  | `rgb(20 20 30 / .7)`                               | Default color of range background.         |
| `--media-control-display`                  | `inline-block`                                     | \`display\` property of control.           |
| `--media-control-padding`                  | `10px`                                             | \`padding\` of control.                    |
| `--media-control-background`               | `var(--media-secondary-color, rgb(20 20 30 / .7))` | \`background\` of control.                 |
| `--media-control-hover-background`         | `rgb(50 50 70 / .7)`                               | \`background\` of control hover state.     |
| `--media-control-height`                   | `24px`                                             | \`height\` of control.                     |
| `--media-range-padding`                    | `var(--media-control-padding, 10px)`               | \`padding\` of range.                      |
| `--media-range-padding-left`               | `var(--_media-range-padding)`                      | \`padding-left\` of range.                 |
| `--media-range-padding-right`              | `var(--_media-range-padding)`                      | \`padding-right\` of range.                |
| `--media-range-thumb-width`                | `10px`                                             | \`width\` of range thumb.                  |
| `--media-range-thumb-height`               | `10px`                                             | \`height\` of range thumb.                 |
| `--media-range-thumb-border`               | `none`                                             | \`border\` of range thumb.                 |
| `--media-range-thumb-border-radius`        | `10px`                                             | \`border-radius\` of range thumb.          |
| `--media-range-thumb-background`           | `var(--media-primary-color, rgb(238 238 238))`     | \`background\` of range thumb.             |
| `--media-range-thumb-box-shadow`           | `1px 1px 1px transparent`                          | \`box-shadow\` of range thumb.             |
| `--media-range-thumb-transition`           | `none`                                             | \`transition\` of range thumb.             |
| `--media-range-thumb-transform`            | `none`                                             | \`transform\` of range thumb.              |
| `--media-range-thumb-opacity`              | `1`                                                | \`opacity\` of range thumb.                |
| `--media-range-track-background`           | `rgb(255 255 255 / .2)`                            | \`background\` of range track.             |
| `--media-range-track-width`                | `100%`                                             | \`width\` of range track.                  |
| `--media-range-track-height`               | `4px`                                              | \`height\` of range track.                 |
| `--media-range-track-border`               | `none`                                             | \`border\` of range track.                 |
| `--media-range-track-outline`              |                                                    | \`outline\` of range track.                |
| `--media-range-track-outline-offset`       |                                                    | \`outline-offset\` of range track.         |
| `--media-range-track-border-radius`        | `1px`                                              | \`border-radius\` of range track.          |
| `--media-range-track-box-shadow`           | `none`                                             | \`box-shadow\` of range track.             |
| `--media-range-track-transition`           | `none`                                             | \`transition\` of range track.             |
| `--media-range-track-translate-x`          | `0px`                                              | \`translate\` x-coordinate of range track. |
| `--media-range-track-translate-y`          | `0px`                                              | \`translate\` y-coordinate of range track. |
| `--media-time-range-hover-display`         | `none`                                             | \`display\` of range hover zone.           |
| `--media-time-range-hover-bottom`          | `-5px`                                             | \`bottom\` of range hover zone.            |
| `--media-time-range-hover-height`          | `max(calc(100% + 5px), 20px)`                      | \`height\` of range hover zone.            |
| `--media-range-track-pointer-background`   |                                                    | \`background\` of range track pointer.     |
| `--media-range-track-pointer-border-right` |                                                    | \`border-right\` of range track pointer.   |

<hr/>

## Exports

| Kind                        | Name                 | Declaration      | Module                     | Package |
| --------------------------- | -------------------- | ---------------- | -------------------------- | ------- |
| `custom-element-definition` | `media-volume-range` | MediaVolumeRange | dist/media-volume-range.js |         |
| `js`                        | `default`            | MediaVolumeRange | dist/media-volume-range.js |         |

# `dist/experimental/media-captions-listbox.js`:

## class: `MediaCaptionsListbox`, `media-captions-listbox`

### Superclass

| Name                 | Module                                     | Package |
| -------------------- | ------------------------------------------ | ------- |
| `MediaChromeListbox` | /dist/experimental/media-chrome-listbox.js |         |

### Fields

| Name              | Privacy | Type     | Default | Description | Inherited From     |
| ----------------- | ------- | -------- | ------- | ----------- | ------------------ |
| `value`           |         | `string` | `'off'` |             | MediaChromeListbox |
| `textContent`     |         | `string` | `'Off'` |             |                    |
| `selectedOptions` |         |          |         |             | MediaChromeListbox |
| `keysUsed`        |         |          |         |             | MediaChromeListbox |

### Methods

| Name                 | Privacy | Description | Parameters           | Return | Inherited From     |
| -------------------- | ------- | ----------- | -------------------- | ------ | ------------------ |
| `#perTypeUpdate`     |         |             | `newValue, oldItems` |        |                    |
| `#renderTracks`      |         |             | `tracks`             |        |                    |
| `#render`            |         |             |                      |        |                    |
| `#onChange`          |         |             |                      |        |                    |
| `focus`              |         |             |                      |        | MediaChromeListbox |
| `#handleKeyListener` |         |             | `e`                  |        | MediaChromeListbox |
| `enable`             |         |             |                      |        | MediaChromeListbox |
| `disable`            |         |             |                      |        | MediaChromeListbox |
| `#getItem`           |         |             | `e`                  |        | MediaChromeListbox |
| `handleSelection`    |         |             | `e, toggle`          |        | MediaChromeListbox |
| `#selectItem`        |         |             | `item, toggle`       |        | MediaChromeListbox |
| `handleMovement`     |         |             | `e`                  |        | MediaChromeListbox |
| `handleClick`        |         |             | `e`                  |        | MediaChromeListbox |
| `#searchItem`        |         |             | `key`                |        | MediaChromeListbox |
| `#clearKeysOnDelay`  |         |             |                      |        | MediaChromeListbox |

### Events

| Name     | Type    | Description | Inherited From     |
| -------- | ------- | ----------- | ------------------ |
| `change` | `Event` |             | MediaChromeListbox |

### Attributes

| Name                   | Field | Inherited From     |
| ---------------------- | ----- | ------------------ |
| `aria-multiselectable` |       |                    |
| `disabled`             |       | MediaChromeListbox |

### CSS Properties

| Name                                        | Default                                                                                                                                                                                                            | Description                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `--media-primary-color`                     | `rgb(238 238 238)`                                                                                                                                                                                                 | Default color of icon.                    |
| `--media-icon-color`                        | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                     | \`fill\` color of icon.                   |
| `--media-captions-indicator-height`         | `1em`                                                                                                                                                                                                              | \`height\` of captions indicator.         |
| `--media-captions-indicator-vertical-align` | `bottom`                                                                                                                                                                                                           | \`vertical-align\` of captions indicator. |
| `--media-captions-listbox-white-space`      | `nowrap`                                                                                                                                                                                                           | \`white-space\` of captions list item.    |
| `--media-secondary-color`                   | `rgb(20 20 30 / .8)`                                                                                                                                                                                               | Default color of background.              |
| `--media-text-color`                        | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                     | \`color\` of text.                        |
| `--media-control-background`                | `var(--media-secondary-color, rgb(20 20 30 / .8))`                                                                                                                                                                 | \`background\` of control.                |
| `--media-listbox-background`                | `var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8)))`                                                                                                                                | \`background\` of listbox.                |
| `--media-listbox-selected-background`       | `rgb(122 122 184 / .8)`                                                                                                                                                                                            | \`background\` of selected listbox item.  |
| `--media-listbox-hover-background`          | `rgb(82 82 122 / .8)`                                                                                                                                                                                              | \`background\` of hovered listbox item.   |
| `--media-listbox-hover-outline`             | `none`                                                                                                                                                                                                             | \`outline\` of hovered listbox item.      |
| `--media-font`                              | `var(--media-font-weight, normal) var(--media-font-size, 1em) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.              |
| `--media-font-weight`                       | `normal`                                                                                                                                                                                                           | \`font-weight\` property.                 |
| `--media-font-family`                       | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                              | \`font-family\` property.                 |
| `--media-font-size`                         | `1em`                                                                                                                                                                                                              | \`font-size\` property.                   |
| `--media-text-content-height`               | `var(--media-control-height, 24px)`                                                                                                                                                                                | \`line-height\` of text.                  |

<hr/>

## Exports

| Kind                        | Name                     | Declaration          | Module                                      | Package |
| --------------------------- | ------------------------ | -------------------- | ------------------------------------------- | ------- |
| `custom-element-definition` | `media-captions-listbox` | MediaCaptionsListbox | dist/experimental/media-captions-listbox.js |         |
| `js`                        | `default`                | MediaCaptionsListbox | dist/experimental/media-captions-listbox.js |         |

# `dist/experimental/media-captions-selectmenu.js`:

## class: `MediaCaptionsSelectMenu`, `media-captions-selectmenu`

### Superclass

| Name                    | Module                                        | Package |
| ----------------------- | --------------------------------------------- | ------- |
| `MediaChromeSelectMenu` | /dist/experimental/media-chrome-selectmenu.js |         |

### Fields

| Name       | Privacy | Type | Default | Description | Inherited From        |
| ---------- | ------- | ---- | ------- | ----------- | --------------------- |
| `keysUsed` |         |      |         |             | MediaChromeSelectMenu |

### Methods

| Name                  | Privacy | Description | Parameters  | Return | Inherited From        |
| --------------------- | ------- | ----------- | ----------- | ------ | --------------------- |
| `init`                |         |             |             |        |                       |
| `#handleClick_`       |         |             |             |        | MediaChromeSelectMenu |
| `#handleChange_`      |         |             |             |        | MediaChromeSelectMenu |
| `#toggle`             |         |             | `closeOnly` |        | MediaChromeSelectMenu |
| `#updateMenuPosition` |         |             |             |        | MediaChromeSelectMenu |
| `#toggleExpanded`     |         |             | `closeOnly` |        | MediaChromeSelectMenu |
| `enable`              |         |             |             |        | MediaChromeSelectMenu |
| `disable`             |         |             |             |        | MediaChromeSelectMenu |

### Attributes

| Name       | Field | Inherited From        |
| ---------- | ----- | --------------------- |
| `disabled` |       | MediaChromeSelectMenu |

<hr/>

## Exports

| Kind                        | Name                        | Declaration             | Module                                         | Package |
| --------------------------- | --------------------------- | ----------------------- | ---------------------------------------------- | ------- |
| `custom-element-definition` | `media-captions-selectmenu` | MediaCaptionsSelectMenu | dist/experimental/media-captions-selectmenu.js |         |
| `js`                        | `default`                   | MediaCaptionsSelectMenu | dist/experimental/media-captions-selectmenu.js |         |

# `dist/experimental/media-chrome-listbox.js`:

## class: `MediaChromeListbox`, `media-chrome-listbox`

### Superclass

| Name | Module                                    | Package |
| ---- | ----------------------------------------- | ------- |
|      | dist/experimental/media-chrome-listbox.js |         |

### Fields

| Name              | Privacy | Type | Default | Description | Inherited From |
| ----------------- | ------- | ---- | ------- | ----------- | -------------- |
| `selectedOptions` |         |      |         |             |                |
| `value`           |         |      |         |             |                |
| `keysUsed`        |         |      |         |             |                |

### Methods

| Name                 | Privacy | Description | Parameters     | Return | Inherited From |
| -------------------- | ------- | ----------- | -------------- | ------ | -------------- |
| `focus`              |         |             |                |        |                |
| `#handleKeyListener` |         |             | `e`            |        |                |
| `enable`             |         |             |                |        |                |
| `disable`            |         |             |                |        |                |
| `#getItem`           |         |             | `e`            |        |                |
| `handleSelection`    |         |             | `e, toggle`    |        |                |
| `#selectItem`        |         |             | `item, toggle` |        |                |
| `handleMovement`     |         |             | `e`            |        |                |
| `handleClick`        |         |             | `e`            |        |                |
| `#searchItem`        |         |             | `key`          |        |                |
| `#clearKeysOnDelay`  |         |             |                |        |                |

### Events

| Name     | Type    | Description | Inherited From |
| -------- | ------- | ----------- | -------------- |
| `change` | `Event` |             |                |

### Attributes

| Name       | Field | Inherited From |
| ---------- | ----- | -------------- |
| `disabled` |       |                |

### CSS Properties

| Name                                  | Default                                                                                                                                                                                                            | Description                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `--media-primary-color`               | `rgb(238 238 238)`                                                                                                                                                                                                 | Default color of text.                   |
| `--media-secondary-color`             | `rgb(20 20 30 / .8)`                                                                                                                                                                                               | Default color of background.             |
| `--media-text-color`                  | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                     | \`color\` of text.                       |
| `--media-control-background`          | `var(--media-secondary-color, rgb(20 20 30 / .8))`                                                                                                                                                                 | \`background\` of control.               |
| `--media-listbox-background`          | `var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8)))`                                                                                                                                | \`background\` of listbox.               |
| `--media-listbox-selected-background` | `rgb(122 122 184 / .8)`                                                                                                                                                                                            | \`background\` of selected listbox item. |
| `--media-listbox-hover-background`    | `rgb(82 82 122 / .8)`                                                                                                                                                                                              | \`background\` of hovered listbox item.  |
| `--media-listbox-hover-outline`       | `none`                                                                                                                                                                                                             | \`outline\` of hovered listbox item.     |
| `--media-font`                        | `var(--media-font-weight, normal) var(--media-font-size, 1em) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.             |
| `--media-font-weight`                 | `normal`                                                                                                                                                                                                           | \`font-weight\` property.                |
| `--media-font-family`                 | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                              | \`font-family\` property.                |
| `--media-font-size`                   | `1em`                                                                                                                                                                                                              | \`font-size\` property.                  |
| `--media-text-content-height`         | `var(--media-control-height, 24px)`                                                                                                                                                                                | \`line-height\` of text.                 |

<hr/>

## Exports

| Kind                        | Name                   | Declaration        | Module                                    | Package |
| --------------------------- | ---------------------- | ------------------ | ----------------------------------------- | ------- |
| `custom-element-definition` | `media-chrome-listbox` | MediaChromeListbox | dist/experimental/media-chrome-listbox.js |         |
| `js`                        | `default`              | MediaChromeListbox | dist/experimental/media-chrome-listbox.js |         |

# `dist/experimental/media-chrome-listitem.js`:

## class: `MediaChromeListitem`, `media-chrome-listitem`

### Superclass

| Name | Module                                     | Package |
| ---- | ------------------------------------------ | ------- |
|      | dist/experimental/media-chrome-listitem.js |         |

### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `value` |         |      |         |             |                |

### Methods

| Name          | Privacy | Description | Parameters | Return | Inherited From |
| ------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `enable`      |         |             |            |        |                |
| `disable`     |         |             |            |        |                |
| `handleClick` |         |             |            |        |                |

### Attributes

| Name            | Field | Inherited From |
| --------------- | ----- | -------------- |
| `disabled`      |       |                |
| `aria-selected` |       |                |

<hr/>

## Variables

| Name         | Description | Type     |
| ------------ | ----------- | -------- |
| `Attributes` |             | `object` |

<hr/>

## Exports

| Kind                        | Name                    | Declaration         | Module                                     | Package |
| --------------------------- | ----------------------- | ------------------- | ------------------------------------------ | ------- |
| `js`                        | `Attributes`            | Attributes          | dist/experimental/media-chrome-listitem.js |         |
| `custom-element-definition` | `media-chrome-listitem` | MediaChromeListitem | dist/experimental/media-chrome-listitem.js |         |
| `js`                        | `default`               | MediaChromeListitem | dist/experimental/media-chrome-listitem.js |         |

# `dist/experimental/media-chrome-selectmenu.js`:

## class: `MediaChromeSelectMenu`, `media-chrome-selectmenu`

### Superclass

| Name | Module                       | Package |
| ---- | ---------------------------- | ------- |
|      | /dist/media-chrome-button.js |         |

### Fields

| Name       | Privacy | Type | Default | Description | Inherited From |
| ---------- | ------- | ---- | ------- | ----------- | -------------- |
| `keysUsed` |         |      |         |             |                |

### Methods

| Name                  | Privacy | Description | Parameters  | Return | Inherited From |
| --------------------- | ------- | ----------- | ----------- | ------ | -------------- |
| `#handleClick_`       |         |             |             |        |                |
| `#handleChange_`      |         |             |             |        |                |
| `#toggle`             |         |             | `closeOnly` |        |                |
| `#updateMenuPosition` |         |             |             |        |                |
| `#toggleExpanded`     |         |             | `closeOnly` |        |                |
| `enable`              |         |             |             |        |                |
| `disable`             |         |             |             |        |                |

### Attributes

| Name       | Field | Inherited From |
| ---------- | ----- | -------------- |
| `disabled` |       |                |

<hr/>

## Exports

| Kind                        | Name                      | Declaration           | Module                                       | Package |
| --------------------------- | ------------------------- | --------------------- | -------------------------------------------- | ------- |
| `custom-element-definition` | `media-chrome-selectmenu` | MediaChromeSelectMenu | dist/experimental/media-chrome-selectmenu.js |         |
| `js`                        | `default`                 | MediaChromeSelectMenu | dist/experimental/media-chrome-selectmenu.js |         |

# `dist/experimental/media-playback-rate-listbox.js`:

## class: `MediaPlaybackrateListbox`, `media-playback-rate-listbox`

### Superclass

| Name                 | Module                                     | Package |
| -------------------- | ------------------------------------------ | ------- |
| `MediaChromeListbox` | /dist/experimental/media-chrome-listbox.js |         |

### Fields

| Name              | Privacy | Type | Default | Description | Inherited From     |
| ----------------- | ------- | ---- | ------- | ----------- | ------------------ |
| `selectedOptions` |         |      |         |             | MediaChromeListbox |
| `value`           |         |      |         |             | MediaChromeListbox |
| `keysUsed`        |         |      |         |             | MediaChromeListbox |

### Methods

| Name                 | Privacy | Description | Parameters     | Return | Inherited From     |
| -------------------- | ------- | ----------- | -------------- | ------ | ------------------ |
| `#onChange`          |         |             |                |        |                    |
| `focus`              |         |             |                |        | MediaChromeListbox |
| `#handleKeyListener` |         |             | `e`            |        | MediaChromeListbox |
| `enable`             |         |             |                |        | MediaChromeListbox |
| `disable`            |         |             |                |        | MediaChromeListbox |
| `#getItem`           |         |             | `e`            |        | MediaChromeListbox |
| `handleSelection`    |         |             | `e, toggle`    |        | MediaChromeListbox |
| `#selectItem`        |         |             | `item, toggle` |        | MediaChromeListbox |
| `handleMovement`     |         |             | `e`            |        | MediaChromeListbox |
| `handleClick`        |         |             | `e`            |        | MediaChromeListbox |
| `#searchItem`        |         |             | `key`          |        | MediaChromeListbox |
| `#clearKeysOnDelay`  |         |             |                |        | MediaChromeListbox |

### Events

| Name     | Type    | Description | Inherited From     |
| -------- | ------- | ----------- | ------------------ |
| `change` | `Event` |             | MediaChromeListbox |

### Attributes

| Name                   | Field | Inherited From     |
| ---------------------- | ----- | ------------------ |
| `aria-multiselectable` |       |                    |
| `disabled`             |       | MediaChromeListbox |

### CSS Properties

| Name                                        | Default                                                                                                                                                                                                            | Description                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `--media-playback-rate-listbox-white-space` | `nowrap`                                                                                                                                                                                                           | \`white-space\` of playback rate list item. |
| `--media-primary-color`                     | `rgb(238 238 238)`                                                                                                                                                                                                 | Default color of text.                      |
| `--media-secondary-color`                   | `rgb(20 20 30 / .8)`                                                                                                                                                                                               | Default color of background.                |
| `--media-text-color`                        | `var(--media-primary-color, rgb(238 238 238))`                                                                                                                                                                     | \`color\` of text.                          |
| `--media-control-background`                | `var(--media-secondary-color, rgb(20 20 30 / .8))`                                                                                                                                                                 | \`background\` of control.                  |
| `--media-listbox-background`                | `var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8)))`                                                                                                                                | \`background\` of listbox.                  |
| `--media-listbox-selected-background`       | `rgb(122 122 184 / .8)`                                                                                                                                                                                            | \`background\` of selected listbox item.    |
| `--media-listbox-hover-background`          | `rgb(82 82 122 / .8)`                                                                                                                                                                                              | \`background\` of hovered listbox item.     |
| `--media-listbox-hover-outline`             | `none`                                                                                                                                                                                                             | \`outline\` of hovered listbox item.        |
| `--media-font`                              | `var(--media-font-weight, normal) var(--media-font-size, 1em) / var(--media-text-content-height, var(--media-control-height, 24px)) var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif)` | \`font\` shorthand property.                |
| `--media-font-weight`                       | `normal`                                                                                                                                                                                                           | \`font-weight\` property.                   |
| `--media-font-family`                       | `helvetica neue, segoe ui, roboto, arial, sans-serif`                                                                                                                                                              | \`font-family\` property.                   |
| `--media-font-size`                         | `1em`                                                                                                                                                                                                              | \`font-size\` property.                     |
| `--media-text-content-height`               | `var(--media-control-height, 24px)`                                                                                                                                                                                | \`line-height\` of text.                    |

<hr/>

## Exports

| Kind                        | Name                          | Declaration              | Module                                           | Package |
| --------------------------- | ----------------------------- | ------------------------ | ------------------------------------------------ | ------- |
| `custom-element-definition` | `media-playback-rate-listbox` | MediaPlaybackrateListbox | dist/experimental/media-playback-rate-listbox.js |         |
| `js`                        | `default`                     | MediaPlaybackrateListbox | dist/experimental/media-playback-rate-listbox.js |         |

# `dist/experimental/media-playback-rate-selectmenu.js`:

## class: `MediaPlaybackrateSelectMenu`, `media-playback-rate-selectmenu`

### Superclass

| Name                    | Module                                        | Package |
| ----------------------- | --------------------------------------------- | ------- |
| `MediaChromeSelectMenu` | /dist/experimental/media-chrome-selectmenu.js |         |

### Fields

| Name       | Privacy | Type | Default | Description | Inherited From        |
| ---------- | ------- | ---- | ------- | ----------- | --------------------- |
| `keysUsed` |         |      |         |             | MediaChromeSelectMenu |

### Methods

| Name                  | Privacy | Description | Parameters  | Return | Inherited From        |
| --------------------- | ------- | ----------- | ----------- | ------ | --------------------- |
| `init`                |         |             |             |        |                       |
| `#handleClick_`       |         |             |             |        | MediaChromeSelectMenu |
| `#handleChange_`      |         |             |             |        | MediaChromeSelectMenu |
| `#toggle`             |         |             | `closeOnly` |        | MediaChromeSelectMenu |
| `#updateMenuPosition` |         |             |             |        | MediaChromeSelectMenu |
| `#toggleExpanded`     |         |             | `closeOnly` |        | MediaChromeSelectMenu |
| `enable`              |         |             |             |        | MediaChromeSelectMenu |
| `disable`             |         |             |             |        | MediaChromeSelectMenu |

### Attributes

| Name       | Field | Inherited From        |
| ---------- | ----- | --------------------- |
| `rates`    |       |                       |
| `disabled` |       | MediaChromeSelectMenu |

<hr/>

## Exports

| Kind                        | Name                             | Declaration                 | Module                                              | Package |
| --------------------------- | -------------------------------- | --------------------------- | --------------------------------------------------- | ------- |
| `custom-element-definition` | `media-playback-rate-selectmenu` | MediaPlaybackrateSelectMenu | dist/experimental/media-playback-rate-selectmenu.js |         |
| `js`                        | `default`                        | MediaPlaybackrateSelectMenu | dist/experimental/media-playback-rate-selectmenu.js |         |

# `dist/experimental/media-settings-popup.js`:

## class: `MediaSettingsPopup`, `media-settings-popup`

### Superclass

| Name | Module                                    | Package |
| ---- | ----------------------------------------- | ------- |
|      | dist/experimental/media-settings-popup.js |         |

<hr/>

## Exports

| Kind                        | Name                   | Declaration        | Module                                    | Package |
| --------------------------- | ---------------------- | ------------------ | ----------------------------------------- | ------- |
| `custom-element-definition` | `media-settings-popup` | MediaSettingsPopup | dist/experimental/media-settings-popup.js |         |
| `js`                        | `default`              | MediaSettingsPopup | dist/experimental/media-settings-popup.js |         |

# `dist/experimental/media-title-element.js`:

## class: `MediaTitleBar`, `media-title-bar`

### Superclass

| Name | Module                                   | Package |
| ---- | ---------------------------------------- | ------- |
|      | dist/experimental/media-title-element.js |         |

<hr/>

## Exports

| Kind                        | Name              | Declaration   | Module                                   | Package |
| --------------------------- | ----------------- | ------------- | ---------------------------------------- | ------- |
| `custom-element-definition` | `media-title-bar` | MediaTitleBar | dist/experimental/media-title-element.js |         |
| `js`                        | `default`         | MediaTitleBar | dist/experimental/media-title-element.js |         |
