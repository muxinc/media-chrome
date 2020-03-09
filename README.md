# &lt;player-chrome&gt;

Custom elements (web components) for making audio and video player controls.

*From the creator of [Video.js](https://videojs.com/).*

## Why?

Video and audio are integral parts of the web, but it's still difficult to create a player experience that's unique to a site or brand.
* Web browsers have built-in players that can't easily be customized and look different from every other browser.
* Social sites like Youtube, Vimeo, and SoundCloud let you control small details of the player, like primary button color.
* Open source players like Video.js and JW Player let you control much more, but require you to learn proprietary JS APIs and CSS.

## Why now?

Web components. I spoke about [the potential of web components for video](https://youtu.be/TwnygSWmToc?t=859) at the original Demuxed conference in 2015. They allow us to extend the browser's base HTML functionality, meaning we can now build player controls as simple HTML tags that:
* Can be used like any native HTML tag in HTML, Javascript, and CSS (unleash your designer)
* Are compatible by default with any Javascript framework (React, Angular, Vue, etc.)
* Could be used by any player (Youtube, Netflix, Video.js) as their built-in controls; sharing knowledge, functionality, and accessibility between players.

## Examples

### Adding controls

...

### Removing controls

...

### Changing colors with CSS
...

### Moving controls with CSS

...

## Player compatibility
* Native `<video>` & HLS.js (components)...
* Video.js, Youtube (Player.video)...

## Installing &lt;player-chrome&gt; and other elements
...

## Using &lt;player-chrome&gt; in your HTML

1. Load &lt;player-chrome&gt; (async) in the head of your document.
```html
<script type="module" src="./js/player-chrome.js"></script>
```

2. Wrap your HTML media element in the `<player-chrome>` tag. Include the `defaultControls` attribute to turn on basic controls.
```html
<player-chrome defaultControls>
  <video
    src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
  >
  </video>
</player-chrome>
```

3. Add the `slot="media"` attribute to your media element. At the same time remove the `controls` attribute from the media element or you'll have double controls.
```html
<player-chrome defaultControls>
  <video
    slot="media"
    src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
  >
  </video>
</player-chrome>
```

## Using &lt;player-chrome&gt; with other frameworks
* React...
* View...
* Angular...

## Customizing &lt;player-chrome&gt;
To customize player-chrome, remove the `defaultControls` attribute and use the built in control elements to include only the controls you want and customize how they look.
```html
<player-chrome>
  <video
    slot="media"
    src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
  ></video>
  <player-control-bar>
    <player-play-button>Play</player-play-button>
    <player-mute-button>Mute</player-mute-button>
    <player-volume-slider>Volume</player-volume-slider>
    <player-progress-slider>Progress</player-progress-slider>
    <player-pip-button>PIP</player-pip-button>
    <player-fullscreen-button>Fullscreen</player-fullscreen-button>
  </player-control-bar>
</player-chrome>
```

## Using &lt;player-chrome&gt; with other video players
* HLS.js
* Video.js
* JW Player

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
