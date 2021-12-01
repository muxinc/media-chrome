# `<media-mute-button/>`

Button to toggle the sound. The icon responds to volume changes and acts as part of the typical volume control.

- [Source](../src/js/media-mute-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-mute-button.html) ([Example Source](../examples/control-elements/media-mute-button.html))

# Attributes

_None_

# Slots

| Name     | Default Type | Description                                                                             |
| -------- | ------------ | --------------------------------------------------------------------------------------- |
| `off`    | `svg`        | An element shown when the media is muted or the media's volume is 0                     |
| `low`    | `svg`        | An element shown when the media's volume is "low" (less than 50% / 0.5)                 |
| `medium` | `svg`        | An element shown when the media's volume is "medium" (between 50% / 0.5 and 75% / 0.75) |
| `high`   | `svg`        | An element shown when the media's volume is "high" (75% / 0.75 or greater)              |

### Example

```html
<media-fullscreen-button>
  <svg slot="off"><!-- your SVG --></svg>
  <svg slot="low"><!-- your SVG --></svg>
  <svg slot="medium"><!-- your SVG --></svg>
  <svg slot="high"><!-- your SVG --></svg>
</media-fullscreen-button>
```

# Styling

See our [styling docs](./styling.md#Buttons)
