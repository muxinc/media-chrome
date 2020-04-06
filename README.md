# `<player-chrome>`

Your media player's dancing suit. :man_dancing:

Fully customizable media player controls using web components (native custom elements).

- [x] Compatible with any javascript framework (React, Angular, Svelte, etc.)
- [x] Compatible with the `<video>` and `<audio>` elements and [a lot of players](#compatible-players) (YouTube, HLS.js, and more)
- [x] Simple HTML to add/remove controls
- [x] Simple CSS to style the controls

*From [Mux](https://mux.com/) and the creator of [Video.js](https://videojs.com/).*

```html
<script type="module" src="https://unpkg.com/player-chrome"></script>

<player-chrome>
  <video
    slot="media"
    src="http://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4">
  </video>
  <player-control-bar>
    <player-play-button>Play</player-play-button>
    <player-mute-button>Mute</player-mute-button>
    <player-volume-range>Volume</player-volume-range>
    <player-progress-range>Progress</player-progress-range>
    <player-pip-button>PIP</player-pip-button>
    <player-fullscreen-button>Fullscreen</player-fullscreen-button>
  </player-control-bar>
</player-chrome>
```

#### Results (<a href="https://codepen.io/heff/pen/ZEGdBzN?editors=1000" target="_blank">Try the CodePen example</a>)
<a href="https://codepen.io/heff/pen/ZEGdBzN?editors=1000" target="_blank"><img width="719" alt="Player Chrome Demo" src="https://user-images.githubusercontent.com/166/78526967-834bcb80-7790-11ea-98a3-a5b355e7a55a.png"></a>

## _Quick_ Demos

### Adding controls to a video element
Just HTML. No javascripting required.

![Add controls to the player](http://image.mux.com/es7LU800gmNagIAaFuV5T25Z32xrmt6Gn/animated.gif?width=640&fps=15&end=10)

### Moving the progress bar above the controls
Simple HTML and CSS.

![Moving the playback progress bar](http://image.mux.com/NAu02gDe4qenxs8x4CKDKOb65hFcirY02p/animated.gif?width=640&fps=15&end=10)

## Usage

`<player-chrome>` is only packaged as a javascript module (es6), which is supported by all evergreen browsers and Node v12+. The package includes all of the existing player controls.

### Include with `<script>`

Load the module in the `<head>` of your HTML page. Note the `type="module"`, that's important.

> Modules are always loaded asynchronously by the browser, so it's ok to load them in the head :thumbsup:, and best for registering web components quickly.

```html
<script type="module" src="https://unpkg.com/player-chrome"></script>
```

### Include with `import` and npm.

```bash
npm install player-chrome --save
```

Or `yarn`
```bash
yarn add player-chrome
```

Include in your app javascript (e.g. src/App.js)
```js
import 'player-chrome';
```
This will register the custom elements with the browser so they can be used as HTML.

### Using in your HTML

Each control element can be used independently. When using outside of a `<player-chrome>` element, a control needs to be told which player it's controlling via the `player` attribute or property.

Using the `player` attribute and CSS selector.

```html
<video id="my-player"></video>
<player-play-button player="#my-player">
```

Using the `player` property and a direct reference to the media player element.

```javascript
const video = document.createElement('video');
const playButton = document.createElement('player-play-button');
playButton.player = video;
```

Or set automatically by wrapping both the media element and control element in a `<player-chrome>` element. Include the `slot="media"` attribute in the tag of your [compatible player](#compatible-players)'s element.

```javascript
<player-chrome>
  <video slot="media"></video>
  <player-play-button>Play</player-play-button>
</player-chrome>
```

## Customizing the controls
Use HTML to add or remove any of the controls. Then you can use CSS to style the controls as you would other HTML elements.

```html
<player-chrome>
  <video
    slot="media"
    src="http://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  ></video>
  <player-control-bar>
    <player-play-button>Play</player-play-button>
    <player-mute-button>Mute</player-mute-button>
    <player-volume-range>Volume</player-volume-range>
    <player-progress-range>Progress</player-progress-range>
    <player-pip-button>PIP</player-pip-button>
    <player-fullscreen-button>Fullscreen</player-fullscreen-button>
  </player-control-bar>
</player-chrome>
```

You can then use CSS to style the controls as you would other HTML elements.

### Included elements

| Element                      | Description                                                                                           |
|------------------------------|-------------------------------------------------------------------------------------------------------|
| `<player-chrome>`       | An optional container for the other controls and media elements.
| `<player-control-bar>`       | Optional controls container to help align the controls in the standard fashion.                       |
| `<player-play-button>`       | Toggle media playback                                                                                 |
| `<player-mute-button>`       | Toggle the sound. The icon responds to volume changes and acts as part of the typical volume control. |
| `<player-volume-range>`      | Change the volume of the sound.                                                                       |
| `<player-progress-range>`    | See how far the playhead is through the media duration, and seek to new times.                        |
| `<player-fullscreen-button>` | Toggle fullscreen viewing                                                                             |
| `<player-pip-button>`        | Toggle picture-in-picture mode of the video                                                           |
| More to come                 | Requests and contributions welcome                                                                    |

## Compatible players

Player Chrome will work with any HTML element that exposes the same API as HTML Media Elements (`<video>` and `<audio>`).

Some "players" add on to existing video and audio elements, so nothing more is needed to work with Player Chrome. Other players need an additional custom element to translate the player's API to match the HTMLMediaElement's API.

| "player"                                                  | Notes                                                                                                       |
|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [HLS.js](http://hlsjs.com/)                               | Nothing else needed. Can also use the [`<hls-video>` element](https://github.com/muxinc/hls-video-element). |
| [dash.js](https://github.com/Dash-Industry-Forum/dash.js) | Nothing else needed.                                                                                        |
| [Shaka Player](https://github.com/google/shaka-player)    | Nothing else needed.                                                                                        |
| YouTube                                                   | Requires the [`<youtube-video>` element](https://github.com/muxinc/youtube-video-element).                  |

If using the `<player-chrome>` element, be sure to include the `slot="media"` attribute in the player's tag.

```html
<player-chrome defaultControls>
  <youtube-video
    slot="media"
    src="https://www.youtube.com/watch?v=rubNgGj3pYo"
  >
  </youtube-video>
</player-chrome>
```

## Why?
More often than not web designers and developers just use the default media player controls, even when creating a beautiful custom design theme. It's hard not to.

* Web browsers have built-in player controls that can't easily be customized and look different in every browser.
* Social sites like Youtube, Vimeo, and SoundCloud only let you customize small details of the player, like primary button color.
* Player controls are complex and hard to build from scratch. Open source players like Video.js and JW Player help, but require you to learn proprietary JS APIs, and can be difficult to use with popular Javascript frameworks.

It should be easier... `<player-chrome>` is an attempt at solving that.

## Why now?

Web components. @heff spoke about [the potential of web components for video](https://youtu.be/TwnygSWmToc?t=859) at Demuxed 2015. They allow us to extend the browser's base HTML functionality, meaning we can now build player controls as simple HTML tags that:

* Can be used like any native HTML tag in HTML, Javascript, and CSS (unleash your designer)
* Are compatible by default with Javascript frameworks (React, Angular, Svelte)
* Can be used across players when using multiple in the same site, e.g Youtube & `<video>`. (Could even be used by players as their own built-in controls)
