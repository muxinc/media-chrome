---
title: Architecture
description: Architecture
layout: ../../layouts/MainLayout.astro
---

## Notes

### Components should feel like native HTML

Web components allow us to "extend the browser", and in this project we take that seriously, to the degree of aligning the design of the components to the [design of native HTML elements](https://www.w3.org/TR/design-principles/). In some cases this can seem less ideal/progressive, but it creates an intutive and predictable interface for anyone familiar with HTML concepts.

### Element Naming

- Prefix with `media-` for scoping.
- The suffix should make it clear what the primary user interaction is with the element, mapping to the matching native HTML element when possible. e.g. `-button`, `-range`, `-image`.
  - Use `-container` for elements that are purely for laying out other elements. More specific layout names like `-bar` are acceptible when the name is clear and intentional.
  - Use `-display` when the primary use is displaying a state or data detail. e.g. `media-duration-display`.

### Element Independence

A goal of this project is that each UI element could be used independently of the project, in the same way an HTML Button can be used independently of an HTML Form. This will make it possible for other players to share these base elements.

### Support Unidirectional Data Flow

Many js application frameworks today like React follow a "unidirectional data flow" pattern. We want to make sure media chrome elements are not blocked or complicated to use in these contexts.

### Connecting elements to the media

Media chrome UI elements emit events to request media state changes. These events bubble up the DOM and are caught by a parent `<media-controller>` element. The media-controller handles the request and calls the appropriate API on a child media element, designated with the attribute `slot="media"`. A media element can be `<video>`, `<audio>`, or any element with a matching API.

Media state is set on UI elements via HTML attributes, for example `<media-ui-element media-paused>`. For UI elements that are children of or associated with a media-controller, the media-controller will update these attributes automatically.

UI elements that are not children of a media-controller can be associated with a media-controller through a javascript function or the `media-controller=""` attribute.

> Note: We have been through many different approaches to the architecture:
>
> 1. A UI element "discovers" a media element by finding a parent media-container, then has a direct reference to the media element
> 2. A parent media-container injects a reference to a media element into all child UI elements
>
> Moving to a single centralized _controller_ handling all operations against the media element has made debugging, monitoring user interactions, and refactoring much easier.


## Inner Workings

Any control element can _send_ user input to the [`MediaController`](https://github.com/muxinc/media-chrome/blob/main/src/js/media-controller.js#L33) and _receive_ media state from the `MediaController`.

### Sending

The `MediaController` receives user input via [`MediaUIEvents`](https://github.com/muxinc/media-chrome/blob/main/src/js/constants.js#L1) like `MediaUIEvents.MEDIA_PLAY_REQUEST` or `MediaUIEvents.MEDIA_SEEK_REQUEST`. The `MediaController` may receive these events in one of two ways:

- From a control element that is nested under the `<media-controller>` element (see [diagram 1](#1-by-media-controller-nesting)).  
  The DOM element that will receive bubbling up events from the control element is the `<media-controller>` element, it's also called an **associated element** in the codebase.

- From a control element that is **not** nested under the `<media-controller>` element (see [diagram 2](#2-by-media-controller-id)).  
  An **associated element** is created by targeting the media controller via the `media-controller` attribute or property.

  ```html
  <media-controller id="my-ctrl">
    <video slot="media"></video>
  </media-controller>

  <media-play-button media-controller="my-ctrl"></media-play-button>
  ```

  Now the DOM events are received by the **associated element** and passed through to the `MediaController`.

  All Media Chrome elements support the `media-controller` attribute and can be made an **associated element**.  
  Simple HTML elements can be made associated elements but require some [JavaScript](https://github.com/muxinc/media-chrome/blob/main/src/js/media-control-bar.js#L60-L64) to get this to work.

### Receiving

The `MediaController` propagates media state by setting `MediaUIAttributes` on observing DOM elements.

Any **associated element** or any of its descendants can receive media state from the `MediaController`, as long as the elements are identifiable as something that should receive media state (aka identifiable as a **media state receiver**). Elements are identified as media state receivers in one of two ways:

- The native Media Chrome web components will have this built in and they do this by having the [`MediaUIAttributes`](https://github.com/muxinc/media-chrome/blob/main/src/js/constants.js#L24) listed in the web component `observedAttributes` array.

  ```js
  class MediaPlayButton extends MediaChromeButton {
    static get observedAttributes() {
      return [...super.observedAttributes, MediaUIAttributes.MEDIA_PAUSED];
    }
  }
  ```

- Simple HTML elements like a `<div>` element for example are also able to receive media state by defining a `media-chrome-attributes` attribute and listing the `MediaUIAttributes` space separated.

  ```html
  <div media-chrome-attributes="media-paused media-current-time"></div>
  ```

<br>
<br>

### 1\. by `<media-controller>` Nesting

![media chrome diagram](/assets/media-chrome-diagram-media-controller-nesting.png)

[View Figma embed](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FJfpS4VVSJgvywPHEYAr7Ie%2FMedia-Chrome-Diagrams%3Fnode-id%3D0%253A1)

<br>
<br>

### 2\. by `<media-controller>` ID

![media chrome diagram](/assets/media-chrome-diagram-media-controller-id.png)

[View Figma embed](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FJfpS4VVSJgvywPHEYAr7Ie%2FMedia-Chrome-Diagrams%3Fnode-id%3D26%253A84)
