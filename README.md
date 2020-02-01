# &lt;player-chrome&gt;

An experiment with custom elements (web components) to build a UI wrapper for any video player.

## Installing &lt;player-chrome&gt; and other elements
...

## Using &lt;player-chrome&gt; in your HTML

1. Load &lt;player-chrome&gt; (async) in the head of your document.
```
<script type="module" src="./js/player-chrome.js"></script>
```

2. Wrap your HTML media element in the `<player-chrome>` tag. Include the `defaultControls` attribute to turn on basic controls.
```
<player-chrome defaultControls>
  <video
    src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
  >
  </video>
</player-chrome>
```

3. Add the `slot="media"` attribute to your media element. At the same time remove the `controls` attribute from the media element or you'll have double controls.
```
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

```
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
```
<script type="module" src="./js/hls-video-element.js"></script>
<script type="module" src="./js/player-chrome.js"></script>
```

2. Use `<hls-video>` in place of `<video>`, and use a `m3u8`(HLS) file as the source.
```
<player-chrome defaultControls>
  <hls-video
    slot="media"
    src="https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8"
  >
  </hls-video>
</player-chrome>
```
