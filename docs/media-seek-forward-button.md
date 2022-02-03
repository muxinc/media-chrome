# `<media-seek-forward-button/>`

Button to jump ahead 30 seconds in the media.

- [Source](../src/js/media-seek-forward-button.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-seek-forward-button.html) ([Example Source](../examples/control-elements/media-seek-forward-button.html))

# Attributes

| Name          | Type     | Default Value | Description                                                          |
| ------------- | -------- | ------------- | -------------------------------------------------------------------- |
| `seek-offset` | `number` | `30`          | Adjusts how much time (in seconds) the playhead should seek backward |

# Slots

| Name      | Default Type | Description                                             |
| --------- | ------------ | ------------------------------------------------------- |
| `forward` | `svg`        | The element shown for the seek forward button's display |

### Example

```html
<media-seek-forward-button>
  <svg slot="forward"><!-- your SVG --></svg>
</media-seek-forward-button>
```

# Styling

See our [styling docs](./styling.md#Buttons)
