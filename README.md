# [`<media-chrome>`](https://media-chrome.org) [![npm version](https://img.shields.io/npm/v/media-chrome)](http://npmjs.org/media-chrome) [![size](https://img.shields.io/bundlephobia/minzip/media-chrome?label=size)](https://bundlephobia.com/result?p=media-chrome)

Your media player's dancing suit. :man_dancing:

Fully customizable media player controls using web components (native custom elements).

- [x] Compatible with any javascript framework (React, Angular, Svelte, etc.)
- [x] Compatible with the `<video>` and `<audio>` elements and [a lot of players](https://www.media-chrome.org/en/media-slot) (YouTube, HLS.js, and more)
- [x] Simple HTML to add/remove controls
- [x] Simple CSS to style the controls

_From [Mux](https://mux.com?utm_source=github&utm_medium=social&utm_campaign=media-chrome) and the creator of [Video.js](https://videojs.com/)._

## Documentation

Visit the [official documentation for Media Chrome](https://www.media-chrome.org/en/get-started) for the latest up-to-date usage instructions.

## Video Example

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome@0.16/+esm"></script>

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

<a href="https://codepen.io/heff/pen/ZEGdBzN?editors=1000" target="_blank">
  <img width="890" alt="Media Chrome Video Player Demo" src="./docs/public/assets/media-chrome-video-player.jpeg">
</a>

#### <a href="https://media-chrome.mux.dev/examples/" target="_blank">See all of the repo examples in action.</a>

## Use with React

While you technically can use Media Chrome elements directly with React, it can sometimes be a bit clunky to work with Web Components in React, and some things just don't feel idiomatic to the framework (for example: having to use `class=` instead of `className=`, see [React's official docs regarding web components](https://reactjs.org/docs/web-components.html) for more details). To help with this, we've published some React wrapper components for all of our core Elements. You can read up on using them [here](https://www.media-chrome.org/en/react).

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

## Architecture

- [Architecture Notes](./ARCHITECTURE.md)
- [Architecture Diagrams](https://www.media-chrome.org/en/architecture-diagrams)
