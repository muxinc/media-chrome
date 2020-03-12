# `<player-chrome>`

Custom elements (web components) for building audio and video player controls.

*From [Mux](https://mux.com/) and the creator of [Video.js](https://videojs.com/).*

## Why?
We often put a lot of effort into making our form buttons and navigation elements look uniquely beautiful, but then use generic, default media player controls...because it's hard not to.

* Web browsers have built-in player controls that can't easily be customized and look different in every browser.
* Social sites like Youtube, Vimeo, and SoundCloud only let you customize small details of the player, like primary button color.
* Player controls are complex and hard to build from scratch. Open source players like Video.js and JW Player help, but require you to learn proprietary JS APIs, and can be difficult to use with popular Javascript frameworks.

It should be easier... `<player-chrome>` is an attempt at solving that.

## Why now?

Web components. @heff spoke about [the potential of web components for video](https://youtu.be/TwnygSWmToc?t=859) at Demuxed 2015. They allow us to extend the browser's base HTML functionality, meaning we can now build player controls as simple HTML tags that:

* Can be used like any native HTML tag in HTML, Javascript, and CSS (unleash your designer)
* Are compatible by default with Javascript frameworks (React, Angular, Stencil)
* Can be used across players when using multiple in the same site, e.g Youtube & `<video>`. (Could even be used by players as their own built-in controls)

## _Quick_ Demos

### Adding controls to a player
Just HTML. No javascripting required.

![Add controls to the player](http://image.mux.com/es7LU800gmNagIAaFuV5T25Z32xrmt6Gn/animated.gif?width=640&fps=15&end=10)

### Moving the progress bar above the controls
Simple HTML and CSS.

![Moving the playback progress bar](http://image.mux.com/NAu02gDe4qenxs8x4CKDKOb65hFcirY02p/animated.gif?width=640&fps=15&end=10)

## Example players matching the website context
* [Reddit player example](https://www.reddit.com/r/aww/comments/ffttr3/she_is_so_silly_and_i_love_her_dearly/) before/after
* Mux Homepage w/ custom Mux player?

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
    src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
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
    src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
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
* `<video>`
* `<audio>`
* HLS.js
* Video.js
* JW Player
* Youtube

### HLS.js
For HLS.js we've created a custom element that acts just like a &lt;video&gt; element but has HLS.js baked in.

1. Load the HLS.js custom element before player-chrome, so that the tag is already defined when player-chrome loads.
```html
<script type="module" src="./js/hls-video-element.js"></script>
<script type="module" src="./js/player-chrome.js"></script>
```

2. Use `<hls-video>` in place of `<video>`, and use a `m3u8`(HLS) file as the source.
```html
<player-chrome defaultControls>
  <hls-video
    slot="media"
    src="https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8"
  >
  </hls-video>
</player-chrome>
```

## Using &lt;player-chrome&gt; with javascript frameworks
* React...
* View...
* Angular...
