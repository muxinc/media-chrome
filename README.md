# `<player-chrome>`

Custom elements (web components) for building audio and video player controls.

*From [Mux](https://mux.com/) and the creator of [Video.js](https://videojs.com/).*

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

## _Quick_ Demos

### Adding controls to a video element
Just HTML. No javascripting required.

![Add controls to the player](http://image.mux.com/es7LU800gmNagIAaFuV5T25Z32xrmt6Gn/animated.gif?width=640&fps=15&end=10)

### Moving the progress bar above the controls
Simple HTML and CSS.

![Moving the playback progress bar](http://image.mux.com/NAu02gDe4qenxs8x4CKDKOb65hFcirY02p/animated.gif?width=640&fps=15&end=10)

## Installing `<player-chrome>` and other elements

`<player-chrome>` is packaged as a javascript module (es6) only, which is supported by all evergreen browsers and Node v12+. It includes all of the other player controls with it, like `<player-play-button>`.

### Adding to your website/app using `<script>`

Load the module in the `<head>` of your HTML page. Note the `type="module"`, that's important.

> Modules are always loaded asynchronously by the browser, so it's ok to load them in the head :thumbsup:, and best for registering web components quickly.

```html
<head>
  <script type="module" src="https://unpkg.com/player-chrome"></script>
</head>
```

### Adding to your app via `npm`

```bash
npm install player-chrome --save
```
Or yarn
```bash
yarn add player-chrome
```

Include in your app javascript (e.g. src/App.js)
```js
import 'player-chrome';
```
This will register the custom elements with the browser so they can be used as HTML.

## Using in your HTML

Wrap your HTML media element in the `<player-chrome>` tag. Include the `defaultControls` attribute to turn on basic controls.

Add a `slot="media"` attribute to your media element and remove any `controls` attribute or you'll have double controls.
```html
<player-chrome defaultControls>
  <video
    slot="media"
    src="http://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
  >
  </video>
</player-chrome>
```

## Customizing the controls
To customize player-chrome, remove the `defaultControls` attribute and use the included control elements to add only the controls you want and in whatever order you want.
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

You can then use CSS to style the controls.

## Using &lt;player-chrome&gt; with specific players

Player Chrome elements expect an HTML element that exposes the same basic API as HTML Media Elements (`<video>` and `<audio>`). Through [more] custom elements, we can make it possible for any player to work with Player Chrome, by wrapping the player in a new element that translates the HTML media API to the player's specific API.

* `<video>`
* `<audio>`
* HLS.js
* Video.js
* JW Player
* Youtube

### HLS.js
For HLS.js we've created a custom element that acts just like a &lt;video&gt; element but has HLS.js baked in. It's included with the Player Chrome module.

Use `<hls-video>` in place of `<video>`, and use a `m3u8`(HLS) file as the source.
```html
<player-chrome defaultControls>
  <hls-video
    slot="media"
    src="http://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe.m3u8"
  >
  </hls-video>
</player-chrome>
```
