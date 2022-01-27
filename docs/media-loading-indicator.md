# `<media-loading-indicator/>`

Shows a loading indicator when the media is buffering.

- [Source](../src/js/media-loading-indicator.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-loading-indicator.html) ([Example Source](../examples/control-elements/media-loading-indicator.html))

# Attributes

| Name            | Type     | Default Value | Description                                                                                 |
| --------------- | -------- | ------------- | ------------------------------------------------------------------------------------------- |
| `loading-delay` | `number` | `500`         | The amount of time in ms the media has to be buffering before the loading indicator is shown. |

# Slots

| Name      | Default Type | Description                                                 |
| --------- | ------------ | ----------------------------------------------------------- |
| `loading` | `svg`        | The element shown for when the media is in a buffering state. |

### Example

```html
<media-loading-indicator>
  <svg slot="loading"><!-- your SVG --></svg>
</media-loading-indicator>
```

# Styling

See our [styling docs](./styling.md#Indicators)
