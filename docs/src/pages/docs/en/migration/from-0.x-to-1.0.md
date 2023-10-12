---
title: Migrating from v0.x to v1.0
description: Migration guide
layout: ../../../../layouts/MainLayout.astro
---

While there were some sweeping changes to Media Chrome, most of these should be fairly straightforward to refactor. Here's a high level overview:

### Breaking changes

**General**
- All attributes have been changed from `kebab-case` to `lowercase` (aka "`smushedcase`")
- Several CSS variables have been renamed for consistency, more consistently applied, and more consistently defaulted
- `AttributeTokenList` (e.g. `hotkeys`) removed the `keys()` method
- All state change event types have been changed from `"statenamechange"` to `"statename"`.

**Captions & Subtitles**
- Captions & Subtitles list attributes are now just subtitles attributes
- Enabling captions/subtitles by default belongs to the `<media-controller>` instead of the `<media-captions-button>`

**Loading Indicator**
- Loading indicator visibility now uses CSS vars instead of `is-loading` attribute

**Removed Components**
- `<media-title-display>` removed (use `<media-text-display>`)
- `<media-current-time-display>` removed (use `<media-time-display>`)
- `<media-container>` (deprecated) alias was removed (use `<media-controller>`)

**Themes**
- Because of the attribute renaming, all theme template variables have changed from `camelCase` to `lowercase` (aka "`smushedcase`")

**Icons**
- All components with customizable icons now have a generic `icon` slot. For components with a single icon (e.g. `<media-seek-forward-button>`), these have simply been renamed `icon`.

### New features

- Added several new CSS variables for consistency and ease of use
- All control/display components now have corresponding getter/setter properties for all attributes
- More reliable/accurate TypeScript definitions for components
- `<media-controller>` now dispatches a `"breakpointchange"` event when the breakpoint size changes
- Added `mediaended` state attribute that is applied to `<media-play-button>`

## Updating attributes

Media Chrome attributes fall roughly into two categories or "buckets": component-specific attributes and media state attributes. All of these have been migrated to `lowercase` names, so all you'll need to do is remove any hyphens wherever you are currently referencing these attributes in your code.

### HTML attribute use cases

For the "component-level" attributes, these will often be in your HTML or app-framework (e.g. Svelte, Vue, etc.) equivalent. For example,

**Before**

```html
<media-control-bar>
  <media-play-button></media-play-button>
  <media-seek-backward-button seek-offset="30"></media-seek-backward-button>
  <media-seek-forward-button seek-offset="30"></media-seek-forward-button>
  <media-mute-button></media-mute-button>
  <media-volume-range></media-volume-range>
  <media-time-range></media-time-range>
  <media-time-display show-duration remaining></media-time-display>
  <media-captions-button></media-captions-button>
  <media-playback-rate-button></media-playback-rate-button>
  <media-pip-button></media-pip-button>
  <media-fullscreen-button></media-fullscreen-button>
  <media-airplay-button></media-airplay-button>
</media-control-bar>
```

**After**

```html
<media-control-bar>
  <media-play-button></media-play-button>
  <media-seek-backward-button seekoffset="30"></media-seek-backward-button>
  <media-seek-forward-button seekoffset="30"></media-seek-forward-button>
  <media-mute-button></media-mute-button>
  <media-volume-range></media-volume-range>
  <media-time-range></media-time-range>
  <media-time-display showduration remaining></media-time-display>
  <media-captions-button></media-captions-button>
  <media-playback-rate-button></media-playback-rate-button>
  <media-pip-button></media-pip-button>
  <media-fullscreen-button></media-fullscreen-button>
  <media-airplay-button></media-airplay-button>
</media-control-bar>
```

This will also include some of our "special" attributes that are broadly applicable, like `noautohide` and `mediacontroller`. For example,

**Before**

```html
<media-loading-indicator slot="centered-chrome" no-auto-hide></media-loading-indicator>
```

**After**

```html
<media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
```

For an up to date list of attribte names, check the attribute references at the bottom of each component doc page. For example, the `<media-controller>` attributes can be found [here](../components/media-controller#reference)

### CSS use cases

For "media state attributes", these are typically used for CSS selection to [conditionally apply styles based on different media states](../styling#conditional-styling-with-media-attributes). A common case is to use the "availability state" attributes to hide certain control components when they are unavailable for a given browser, device, or environment. For example,

**Before**

```css
media-airplay-button[media-airplay-unavailable],
media-fullscreen-button[media-fullscreen-unavailable],
media-volume-range[media-volume-unavailable],
media-pip-button[media-pip-unavailable] {
  display: none;
}
```

**After**

```css
media-airplay-button[mediaairplayunavailable],
media-fullscreen-button[mediafullscreenunavailable],
media-volume-range[mediavolumeunavailable],
media-pip-button[mediapipunavailable] {
  display: none;
}
```

Another more advanced use case with CSS is [building responsive designs using `<media-controller>` breakpoints.](../responsive-controls#using-breakpoints). These breakpoint attributes are also now all `lowercase` names. For example,

**Before**

```css
media-controller .desktop-only {
  --media-control-display: none;
}

media-controller[breakpoint-md] .desktop-only {
  --media-control-display: unset;
}

media-controller[breakpoint-md] .mobile-only {
  --media-control-display: none;
}
```

**After**

```css
media-controller .desktop-only {
  --media-control-display: none;
}

media-controller[breakpointmd] .desktop-only {
  --media-control-display: unset;
}

media-controller[breakpointmd] .mobile-only {
  --media-control-display: none;
}
```

### Updating CSS variables

We've updated some of our CSS variable names based on how and where they will be applied, prefering clarity and predictability over e.g. brevity in our names.

**Renamed CSS Variables**
- `--media-live-indicator-color` -> `--media-live-button-indicator-color`
- `--media-time-buffered-color` -> `--media-time-range-buffered-color`
- `--media-background-position` -> `--media-poster-image-background-position`
- `--media-background-size` -> `--media-poster-image-background-size`

(**NOTE:** Just prior to v1.0, we also added several CSS variables, added more consistent defaulting, applied the pre-existing variables more consistently, and added a better "inheritance" chain of CSS variable values and defaults. For a list of all CSS variables currently in v1.0 and where they apply, check out our [Styling Reference](../reference/styling). For all of the aforementioned changes, check out [this PR](https://github.com/muxinc/media-chrome/pull/528).)

### Updating state change events

We've changed all of our media state change event types/names to be more consistent with `HTMLMediaElement` state change event naming conventions, dropping the "change" suffix. For example:

**Before**

```js
mediaController.addEventListener('mediapausedchange', pausedHandler);
mediaController.addEventListener('mediavolumechange', volumeHandler);
mediaController.addEventListener('mediaendedchange', endedHandler);
```

**After**

```js
mediaController.addEventListener('mediapaused', pausedHandler);
mediaController.addEventListener('mediavolume', volumeHandler);
mediaController.addEventListener('mediaended', endedHandler);
```

(**NOTE:** Non-media state change events do still have the "change" suffix, such as "userinactivechange" and "breakpointchange". You can find an example of all state change events with their types and corresponding state names and values [here](https://media-chrome.mux.dev/examples/vanilla/state-change-events-demo.html))


## Working with captions and subtitles

Before Media Chrome v1.0, our captions and subtitles were a bit more complicated than they needed to be, both with the public-facing API and "under the hood." We've simplified things in a few ways:

### Captions/subtitles attributes and events

For most users, the most relevant change will be a simplification and slight refactor of hiding captions controls via CSS when there are no captions for the media. For example:

**Before**

```css
media-captions-button:not([media-subtitles-list]):not([media-captions-list]) {
  display: none;
}
```

**After**

```css
media-captions-button:not([mediasubtitleslist]) {
  display: none;
}
```

Here's some more details of what's changed for media state attributes and events in case you need them:

**Attributes**
- `media-subtitles-list` + `media-captions-list` -> `mediasubtitleslist`
- `media-subtitles-showing` + `media-captions-showing` -> `mediasubtitlesshowing`

**Events**
- `mediadisablesubtitlesrequest` + `mediadisablecaptionsrequest` -> `mediadisablesubtitlesrequest`
- `mediashowsubtitlesrequest` + `mediashowcaptionsrequest` -> `mediashowsubtitlesrequest`

(**NOTE:** For advanced users, we've added a `cc:`|`sb:` prefix to the serialized values to differentiate the track `kind` in our attributes & events)

### Enabling captions by default

Before, enabling captions by default was managed by the `<media-captions-button>`. This led to a lot of complexity and also doesn't work well if you wanted to use other components for captions/subtitles or simply wanted to enable them without any control components to disable them. This is now owned by `<media-controller>` directly. The refactor is fairly straightforward:

**Before**

```html
<media-controller>
  <!-- ... other components -->
  <media-control-bar>
    <!-- ... other components -->
    <media-captions-button default-showing></media-captions-button>
  </media-control-bar>
</media-controller>
```

**After**

```html
<media-controller defaultsubtitles>
  <media-control-bar>
    <!-- ... other components -->
    <media-captions-button></media-captions-button>
  </media-control-bar>
</media-controller>
```

## Migrating from removed components

We removed a few components from Media Chrome. As far as we're aware, these weren't in heavy use, but just in case you were using some of them, you should be able to replace them fairly easily with other components that were capable of being used for the same purpose.

### `<media-current-time-display>`

This component can easily be replaced with `<media-time-display>`:

**Before**

```html
<media-current-time-display></media-current-time-display>
```

**After**

```html
<media-time-display></media-time-display>
```

### `<media-title-display>`

This component can easily be replaced with `<media-text-display>`:

**Before**

```html
<media-title-display>My title</media-title-display>
```

**After**

```html
<media-text-display>My title</media-text-display>
```

### `<media-container>`

This was already just an alias for `<media-controller>`, so it should also be simple:

**Before**

```html
<media-container>
  <!-- ... other components -->
</media-container>
```

**After**

```html
<media-controller>
  <!-- ... other components -->
</media-controller>
```

## Working with themes

All of the prior callouts about component attribute names, CSS variables, and the like, will need to be updated on any corresponding themes usage. In addition, just like our other components, all of our "official" themes that come with Media Chrome have been updated to have `lowercase` attribute names instead of `kebab-case`. For example,

**Before**

```html
<media-theme-microvideo control-bar-vertical control-bar-place="start start">
  <video
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
  >
  </video>
</media-theme-microvideo>
```

**After**

```html
<media-theme-microvideo controlbarvertical controlbarplace="start start">
  <video
    slot="media"
    src="https://stream.mux.com/O6LdRc0112FEJXH00bGsN9Q31yu5EIVHTgjTKRkKtEq1k/high.mp4"
  >
  </video>
</media-theme-microvideo>
```

Also, for any custom themes you may have created, as a result of moving from `kebab-case` to `lowercase`, all theme template variables based on these attributes need to change from `camelCase` to `lowercase`. For example:

**Before**

```html
<template if="streamType == 'live'">
  <template if="!targetLiveWindow">
    <template if="breakpointSm">
      <!-- ... conditionally rendered stuff for non-DVR live media content & small or larger sizes -->
    </template>
  </template>
</template>
```

**After**

```html
<template if="streamtype == 'live'">
  <template if="!targetlivewindow">
    <template if="breakpointsm">
      <!-- ... conditionally rendered stuff for non-DVR live media content & small or larger sizes -->
    </template>
  </template>
</template>
```

## Using the new `icon` slot

All components with a single icon now expose a slot called `icon` instead of a different named slot for each component. e.g:

**Before**
```html
<media-airplay-button>
  <svg slot="airplay"></svg>
</media-airplay-button>
```

**After**
```html
<media-airplay-button>
  <svg slot="icon"></svg>
</media-airplay-button>
```

**Affected components**
- `<media-airplay-button>`
- `<media-seek-forward-button>`
- `<media-seek-backward-button>`
- `<media-loading-indicator>`
