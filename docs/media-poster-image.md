# `<media-poster-image/>`

Shows a poster image before the media has been played, optionally showing a placeholder image before the poster has loaded.

- [Source](../src/js/media-poster-image.js)
- [Example](https://media-chrome.mux.dev/examples/control-elements/media-poster-image.html) ([Example Source](../examples/control-elements/media-poster-image.html))

# Attributes

| Name              | Type     | Default Value | Description                                                                                |
| ----------------- | -------- | ------------- | ------------------------------------------------------------------------------------------ |
| `src`             | `string` | none          | The src URL or or [data URI](https://css-tricks.com/data-uris/) for the image.             |
| `placeholder-src` | `string` | none          | The src URL or or [data URI](https://css-tricks.com/data-uris/) for the placeholder image. |

# Slots

_None_

### Example

```html
<media-poster-image
  slot="poster"
  src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/thumbnail.jpg"
  placeholder-src="data:image/jpeg;base64,/9j/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAASACADASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAMEAgUGCP/EACkQAAEDAgMIAgMAAAAAAAAAAAEAAgMEBgUREgcUITFSkZTRQaEiscH/xAAYAQACAwAAAAAAAAAAAAAAAAAABQIDBv/EAB0RAAICAQUAAAAAAAAAAAAAAAABAgMFERUxwfD/2gAMAwEAAhEDEQA/AOZh2P2k/LOhq/Lf7VuPYvZxLQ6iqgXchvrxn9rpY7ojYCBU0IJ5HU3h9rU3NcGJVcVNJh2K4fDPTztlbm5reGRDhnxIzBPwkUc9RJ6dDHaLYojj2HWYeeH1nmSe1OzYXZJ54fW+ZJ7VeWrbO4SPuedpI/IOnB/TgsxJh4yIuGYu+TvAH9UXnafItWJmuTy1oZ0t7JoZ0t7Ii0InGhnS3smhnS3siIA//9k="
></media-poster-image>
```

# Styling

See our [styling docs](./styling.md)
