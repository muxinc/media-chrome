# `<media-chrome>`

Your media player's dancing suit. :man_dancing:

Fully customizable media player controls using web components (native custom elements).

- [x] Compatible with any javascript framework (React, Angular, Svelte, etc.)
- [x] Compatible with the `<video>` and `<audio>` elements and [a lot of players](#compatible-players) (YouTube, HLS.js, and more)
- [x] Simple HTML to add/remove controls
- [x] Simple CSS to style the controls

*From [Mux](https://mux.com/) and the creator of [Video.js](https://videojs.com/).*

```html
<script type="module" src="https://unpkg.com/media-chrome"></script>

<media-container>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
    crossorigin
  >
    <track label="thumbnails" default kind="metadata" src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"></track>
  </video>
  <media-control-bar>
    <media-play-button>Play</media-play-button>
    <media-mute-button>Mute</media-mute-button>
    <media-volume-range>Volume</media-volume-range>
    <media-progress-range>Progress</media-progress-range>
    <media-pip-button>PIP</media-pip-button>
    <media-fullscreen-button>Fullscreen</media-fullscreen-button>
  </media-control-bar>
</media-container>
```

#### Results (<a href="https://codepen.io/heff/pen/ZEGdBzN?editors=1000" target="_blank">Try the CodePen example</a>)
<a href="https://codepen.io/heff/pen/ZEGdBzN?editors=1000" target="_blank"><img width="719" alt="Media Chrome Demo" src="https://user-images.githubusercontent.com/166/78526967-834bcb80-7790-11ea-98a3-a5b355e7a55a.png"></a>

## _Quick_ Demos

(GIFs still use old name of `<player-chrome>` and need to be updated)

### Adding controls to a video element
Just HTML. No javascripting required.

![Add controls to the media](https://image.mux.com/es7LU800gmNagIAaFuV5T25Z32xrmt6Gn/animated.gif?width=640&fps=15&end=10)

### Moving the progress bar above the controls
Simple HTML and CSS.

![Moving the playback progress bar](https://image.mux.com/NAu02gDe4qenxs8x4CKDKOb65hFcirY02p/animated.gif?width=640&fps=15&end=10)

## Usage

`<media-chrome>` is only packaged as a javascript module (es6), which is supported by all evergreen browsers and Node v12+. The package includes all of the existing media controls.

### Include with `<script>`

Load the module in the `<head>` of your HTML page. Note the `type="module"`, that's important.

> Modules are always loaded asynchronously by the browser, so it's ok to load them in the head :thumbsup:, and best for registering web components quickly.

```html
<script type="module" src="https://unpkg.com/media-chrome"></script>
```

### Include with `import` and npm.

```bash
npm install media-chrome --save
```

Or `yarn`
```bash
yarn add media-chrome
```

Include in your app javascript (e.g. src/App.js)
```js
import 'media-chrome';
```
This will register the custom elements with the browser so they can be used as HTML.

### Using in your HTML

Each control element can be used independently. When using outside of a `<media-container>` element, a control needs to be told which media it's controlling via the `media` attribute or property.

Using the `media` attribute and CSS selector.

```html
<video id="my-media"></video>
<media-play-button media="#my-media">
```

Using the `media` property and a direct reference to the media element.

```javascript
const video = document.createElement('video');
const playButton = document.createElement('media-play-button');
playButton.media = video;
```

Or set automatically by wrapping both the media element and control element in a `<media-container>` element. Include the `slot="media"` attribute in the tag of your [compatible player](#compatible-players)'s element.

```javascript
<media-container>
  <video slot="media"></video>
  <media-play-button>Play</media-play-button>
</media-container>
```

## Customizing the controls
Use HTML to add or remove any of the controls. Then you can use CSS to style the controls as you would other HTML elements.

```html
<media-container>
  <video
    slot="media"
    src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <media-control-bar>
    <media-play-button>Play</media-play-button>
    <media-mute-button>Mute</media-mute-button>
    <media-volume-range>Volume</media-volume-range>
    <media-progress-range>Progress</media-progress-range>
    <media-pip-button>PIP</media-pip-button>
    <media-fullscreen-button>Fullscreen</media-fullscreen-button>
  </media-control-bar>
</media-container>
```

You can then use CSS to style the controls as you would other HTML elements.

### Included elements

| Element                      | Description                                                                                           |
|------------------------------|-------------------------------------------------------------------------------------------------------|
| `<media-container>`       | An optional container for the other controls and media elements.
| `<media-control-bar>`       | Optional controls container to help align the controls in the standard fashion.                       |
| `<media-play-button>`       | Toggle media playback                                                                                 |
| `<media-mute-button>`       | Toggle the sound. The icon responds to volume changes and acts as part of the typical volume control. |
| `<media-volume-range>`      | Change the volume of the sound.                                                                       |
| `<media-progress-range>`    | See how far the playhead is through the media duration, and seek to new times.                        |
| `<media-fullscreen-button>` | Toggle fullscreen viewing                                                                             |
| `<media-pip-button>`        | Toggle picture-in-picture mode of the video                                                           |
| `<media-playback-rate-button>` | Change the speed of playback                                                           |
| More to come                 | Requests and contributions welcome                                                                    |

## Compatible players

Media Chrome will work with any HTML element that exposes the same API as HTML Media Elements (`<video>` and `<audio>`).

Some "players" add on to existing video and audio elements, so nothing more is needed to work with Media Chrome. Other players need an additional custom element to translate the player's API to match the HTMLMediaElement's API.

| "player"                                                  | Notes                                                                                                       |
|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [HLS.js](http://hlsjs.com/)                               | Nothing else needed. Can also use the [`<hls-video>` element](https://github.com/muxinc/hls-video-element). |
| [dash.js](https://github.com/Dash-Industry-Forum/dash.js) | Nothing else needed.                                                                                        |
| [Shaka Player](https://github.com/google/shaka-player)    | Nothing else needed.                                                                                        |
| YouTube                                                   | Requires the [`<youtube-video>` element](https://github.com/muxinc/youtube-video-element).                  |

If using the `<media-container>` element, be sure to include the `slot="media"` attribute in the player's tag.

```html
<media-container>
  <youtube-video
    slot="media"
    src="https://www.youtube.com/watch?v=rubNgGj3pYo"
  >
  </youtube-video>
</media-container>
```

## Why?
More often than not web designers and developers just use the default media player controls, even when creating a beautiful custom design theme. It's hard not to.

* Web browsers have built-in media controls that can't easily be customized and look different in every browser.
* Social sites like Youtube, Vimeo, and SoundCloud only let you customize small details of the player, like primary button color.
* Media controls are complex and hard to build from scratch. Open source players like Video.js and JW Player help, but require you to learn proprietary JS APIs, and can be difficult to use with popular Javascript frameworks.

It should be easier... `<media-chrome>` is an attempt at solving that.

## Why now?

Web components. @heff spoke about [the potential of web components for video](https://youtu.be/TwnygSWmToc?t=859) at Demuxed 2015. They allow us to extend the browser's base HTML functionality, meaning we can now build media player controls as simple HTML tags that:

* Can be used like any native HTML tag in HTML, Javascript, and CSS (unleash your designer)
* Are compatible by default with Javascript frameworks (React, Angular, Svelte)
* Can be used across players when using multiple in the same site, e.g Youtube & `<video>`. (Could even be used by players as their own built-in controls)
