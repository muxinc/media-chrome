# CSS Variables

## Buttons

### Elements

- `<media-captions-button/>` ([docs](./media-captions-button.md))
- `<media-fullscreen-button/>` ([docs](./media-fullscreen-button.md))
- `<media-mute-button/>` ([docs](./media-mute-button.md))
- `<media-pip-button/>` ([docs](./media-pip-button.md))
- `<media-play-button/>` ([docs](./media-play-button.md))
- `<media-playback-rate-button/>` ([docs](./media-playback-rate-button.md))
- `<media-seek-backward-button/>` ([docs](./media-seek-backward-button.md))
- `<media-seek-forward-button/>` ([docs](./media-seek-forward-button.md))

| Name                               | CSS Property       | Default Value         | Description                                                                                       | Notes                                                                                           |
| ---------------------------------- | ------------------ | --------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `--media-control-background`       | `background-color` | `rgba(20,20,30, 0.7)` | background color of the button                                                                    |                                                                                                 |
| `--media-control-hover-background` | `background-color` | `rgba(50,50,70, 0.7)` | background color of the button when hovered                                                       | Applied by the `:hover` [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) |
| `--media-button-icon-width`        | `width`            | `24px`                | default width of button icons                                                                     | Only applies to `<img>` and `<svg>` tags                                                        |
| `--media-button-icon-height`       | `height`           | none                  | default height of button icons                                                                    | Only applies to `<img>` and `<svg>` tags                                                        |
| `--media-icon-color`               | `fill`             | `#eee`                | default fill color of button icons                                                                | Only applies to `<img>` and `<svg>` tags                                                        |
| `--media-button-icon-transform`    | `transform`        | none                  | apply a [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to button icons   | Only applies to `<img>` and `<svg>` tags                                                        |
| `--media-button-icon-transition`   | `transform`        | none                  | apply a [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) to button icons | Only applies to `<img>` and `<svg>` tags                                                        |
