# [`<media-chrome>`](https://media-chrome.org)

Your media player's dancing suit. :man_dancing:

Fully customizable media player controls using web components (native custom elements).

- [x] Compatible with any javascript framework (React, Angular, Svelte, etc.)
- [x] Compatible with the `<video>` and `<audio>` elements and [a lot of players](#compatible-players) (YouTube, HLS.js, and more)
- [x] Simple HTML to add/remove controls
- [x] Simple CSS to style the controls

_From [Mux](https://mux.com?utm_source=github&utm_medium=social&utm_campaign=media-chrome) and the creator of [Video.js](https://videojs.com/)._

## Video Example

```html
<script type="module" src="https://unpkg.com/media-chrome@0.7"></script>

<media-controller>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
    crossorigin
  >
    <track
      label="thumbnails"
      default
      kind="metadata"
      src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"
    />
  </video>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <media-pip-button></media-pip-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```

#### Results (<a href="https://codepen.io/heff/pen/ZEGdBzN?editors=1000" target="_blank">Try the CodePen example</a>)

<a href="https://codepen.io/heff/pen/ZEGdBzN?editors=1000" target="_blank"><img width="719" alt="Media Chrome Demo" src="https://user-images.githubusercontent.com/166/78526967-834bcb80-7790-11ea-98a3-a5b355e7a55a.png"></a>

#### <a href="https://media-chrome.mux.dev/examples/" target="_blank">See all of the repo examples in action.</a>

## Audio Example

```html
<script type="module" src="https://unpkg.com/media-chrome@0.7"></script>

<media-controller audio>
  <audio
    slot="media"
    src="https://stream.mux.com/O4h5z00885HEucNNa1rV02wZapcGp01FXXoJd35AHmGX7g/audio.m4a"
  ></audio>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-time-display show-duration></media-time-display>
    <media-time-range></media-time-range>
    <media-playback-rate-button></media-playback-rate-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
  </media-control-bar>
</media-controller>
```

#### Results (<a href="https://codepen.io/heff/pen/wvdyNWd?editors=1000" target="_blank">Try the CodePen example</a>)

<a href="https://codepen.io/heff/pen/wvdyNWd?editors=1000" target="_blank"><img width="719" alt="Media Chrome Demo" src="https://user-images.githubusercontent.com/166/127259205-b36e237c-a37b-4bd1-9eff-852868e458a6.png"></a>

## Advanced Usage

For a more in depth discussion of working with `<media-controller/>`, including more complex controls layouts, check out [the docs](./docs/media-controller.md).

## _Quick_ Demo

### Adding controls to a video element

Just HTML. No javascripting required.

[![Add controls to the media](https://image.mux.com/fbrV01YkyMrnp01BItrdWL029IurCj2gxlS/animated.gif?width=640&end=10&fps=15)](https://stream.new/v/fhRqeSkHntHb2IZ3AyduTK02l3b9j1EyZTjGHdyERg018)

## Using/installing

`<media-chrome>` is only packaged as a javascript module (es6), which is supported by all evergreen browsers and Node v12+. The package includes all of the existing media controls.

### Option 1: Hosted

Load the module in the `<head>` of your HTML page. Note the `type="module"`, that's important.

> Modules are always loaded asynchronously by the browser, so it's ok to load them in the head :thumbsup:, and best for registering web components quickly.

```html
<script type="module" src="https://unpkg.com/media-chrome@0.7"></script>
```

### Option 2: Bundled via npm

```bash
npm install media-chrome --save
```

Include in your app javascript (e.g. src/App.js)

```js
import 'media-chrome';
```

This will register the custom elements with the browser so they can be used as HTML.

### Using in your HTML

The `<media-controller>` is the star of the show. It handles the communication between control elements and the media. Start by wrapping your media element with a `<media-controller>`, and adding `slot="media"` to your video or audio tag, or other [compatible player](#compatible-players).

```html
<media-controller>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
</media-controller>
```

After that, each control element can be used independently. When using outside of a `<media-controller>` element, a control needs to be told which media controller it's associated with via the `media-controller` attribute or property.

```html
<media-controller id="myController">
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <media-play-button></media-play-button>
</media-controller>

<media-play-button media-controller="myController"></media-play-button>
```

## Customizing the controls

Use HTML to add or remove any of the controls. Then you can use CSS to style the controls as you would other HTML elements.

```html
<media-controller>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <media-pip-button></media-pip-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```

### Included elements

| Element                        | Description                                                                                                                                                                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<media-controller>`           | Wraps controls and the media element, and handles communication between them. ([docs](./docs/media-controller.md))                                                                                                                                                             |
| `<media-control-bar>`          | Optional controls container to help align the controls in the standard fashion.                                                                                                                                                                                                |
| `<media-play-button>`          | Toggle media playback. ([docs](./docs/media-play-button.md))                                                                                                                                                                                                                   |
| `<media-mute-button>`          | Toggle the sound. The icon responds to volume changes and acts as part of the typical volume control. ([docs](./docs/media-mute-button.md))                                                                                                                                    |
| `<media-volume-range>`         | Change the volume of the sound. ([docs](./docs/media-volume-range.md))                                                                                                                                                                                                         |
| `<media-time-range>`           | See how far the playhead is through the media duration, and seek to new times. ([docs](./docs/media-time-range.md))                                                                                                                                                            |
| `<media-time-display>`         | Show the time of the playhead.<br><br>Options: <br>`<media-time-display remaining>` Show as remaining time <br>`<media-time-display show-duration>` Also show the duration after a slash. Ex: `1:00 / 2:00`. ([docs](./docs/media-time-display.md))                            |
| `<media-duration-display>`     | Show the duration of the media                                                                                                                                                                                                                                                 |
| `<media-fullscreen-button>`    | Toggle fullscreen viewing. ([docs](./docs/media-fullscreen-button.md))                                                                                                                                                                                                         |
| `<media-pip-button>`           | Toggle picture-in-picture mode of the video. ([docs](./docs/media-pip-button.md))                                                                                                                                                                                              |
| `<media-playback-rate-button>` | Change the speed of playback. ([docs](./docs/media-playback-rate-button.md))                                                                                                                                                                                                   |
| `<media-seek-backward-button>` | Jump back `n` seconds in the media (default 30). ([docs](./docs/media-seek-backward-button.md))                                                                                                                                                                                |
| `<media-seek-forward-button>`  | Jump ahead `n` seconds in the media (default 30). ([docs](./docs/media-seek-forward-button.md))                                                                                                                                                                                |
| `<media-captions-button>`      | Show/disable captions (if no captions are available, will fallback to subtitles by default unless `no-subtitles-fallback` attribute is set). ([docs](./docs/media-captions-button.md))                                                                                         |
| `<media-poster-image>`         | Show a poster image that's displayed until media begins playing for the first time. Optionally also accepts a `placeholder-src` attribute that can be used for content that immediately loads, such as an inlined, low-resolution image. ([docs](./docs/media-poster-image.md) |
| `<media-airplay-button>`       | Bring up the AirPlay menu to select/deselect AirPlay playback (Safari only). ([docs](./docs/media-airplay-button.md))                                                                                                                                                          |
| `<media-loading-indicator>`    | Show when your media content is loading/buffering. ([docs](./docs/media-loading-indicator.md))                                                                                                                                                                                 |
| More to come                   | Requests and contributions welcome                                                                                                                                                                                                                                             |

### Extras

Extras are not shipped with the core library, but can be imported as-needed by importing the element from the dist direcotry, for example:

```js
import 'media-chrome/dist/extras/media-clip-selector';
```

```html
<script
  type="module"
  src="https://unpkg.com/media-chrome@0.7/dist/extras/media-clip-selector"
></script>
```

| Element                 | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `<media-clip-selector>` | Create selector handles that allow a user to select a sub-section of the media element. |

## Compatible players

Media Chrome will work with any HTML element that exposes the same API as HTML Media Elements (`<video>` and `<audio>`).

Some "players" add on to existing video and audio elements, so nothing more is needed to work with Media Chrome. Other players need an additional custom element to translate the player's API to match the HTMLMediaElement's API.

| "player"                                                  | Notes                                                                                                                                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [HLS.js](http://hlsjs.com/)                               | Nothing else needed. Can also use the [`<hls-video>` element](https://github.com/muxinc/hls-video-element). ([example](https://media-chrome.mux.dev/examples/media-elements/hls.html))                 |
| [dash.js](https://github.com/Dash-Industry-Forum/dash.js) | Nothing else needed. Can also use the [`<dash-video>` element](https://github.com/Dash-Industry-Forum/dash-video-element). ([example](https://media-chrome.mux.dev/examples/media-elements/dash.html)) |
| [Shaka Player](https://github.com/google/shaka-player)    | Nothing else needed.                                                                                                                                                                                   |
| [video.js](https://github.com/videojs/video.js/)          | Requires the [`<videojs-video>` element](https://github.com/luwes/videojs-video-element). ([example](https://media-chrome.mux.dev/examples/media-elements/videojs.html))                               |
| YouTube                                                   | Requires the [`<youtube-video>` element](https://github.com/muxinc/youtube-video-element). ([example](https://media-chrome.mux.dev/examples/media-elements/youtube.html))                              |
| Vimeo                                                     | Requires the [`<vimeo-video>` element](https://github.com/luwes/vimeo-video-element). ([example](https://media-chrome.mux.dev/examples/media-elements/vimeo.html))                                     |
| Wistia                                                    | Requires the [`<wistia-video>` element](https://github.com/luwes/wistia-video-element). ([example](https://media-chrome.mux.dev/examples/media-elements/wistia.html))                                  |
| JW Player                                                 | Requires the [`<jwplayer-video>` element](https://github.com/luwes/jwplayer-video-element). ([example](https://media-chrome.mux.dev/examples/media-elements/jwplayer.html))                            |

Be sure to include the `slot="media"` attribute in the player's tag.

```html
<media-controller>
  <youtube-video slot="media" src="https://www.youtube.com/watch?v=rubNgGj3pYo">
  </youtube-video>
</media-controller>
```

## Use with React

While you technically can use the Media Chrome directly with React, it can sometimes be a bit clunky to work with Web Components in React, and some things just don't feel idiomatic to the framework. To help with this, we've published some React wrapper components for all of our core Elements. You can read up on using them [here](./docs/react.md).

## Why?

More often than not web designers and developers just use the default media player controls, even when creating a beautiful custom design theme. It's hard not to.

- Web browsers have built-in media controls that can't easily be customized and look different in every browser.
- Social sites like Youtube, Vimeo, and SoundCloud only let you customize small details of the player, like primary button color.
- Media controls are complex and hard to build from scratch. Open source players like Video.js and JW Player help, but require you to learn proprietary JS APIs, and can be difficult to use with popular Javascript frameworks.

It should be easier... `<media-chrome>` is an attempt at solving that.

## Why now?

Web components. @heff spoke about [the potential of web components for video](https://youtu.be/TwnygSWmToc?t=859) at Demuxed 2015, and [again in 2020](https://www.youtube.com/watch?v=qMcNDWyRw20). They allow us to extend the browser's base HTML functionality, meaning we can now build media player controls as simple HTML tags that:

- Can be used like any native HTML tag in HTML, Javascript, and CSS (unleash your designer)
- Are compatible by default with Javascript frameworks (React, Angular, Svelte)
- Can be used across players when using multiple in the same site, e.g Youtube & `<video>`. (Could even be used by players as their own built-in controls)

## Other demos

### Use `media-clip-selector` to select segments of a video

`media-clip-selector` is a built-in component that can build a UI for selecting portions of your media.

Listen for the `update` event on the element to get the selected start and end timestamps. Full example in examples/clip-selector.html.

![media clip selector example](./docs/assets/media-clip-selector.gif?raw=true)

## Architecture

- [Architecture Notes](./ARCHITECTURE.md)
- [Architecture Diagrams](./docs/architecture-diagrams.md)
