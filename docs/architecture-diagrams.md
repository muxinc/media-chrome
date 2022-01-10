Media Chrome - Architecture Diagrams
====================================

Any HTML element can send user input to the `MediaController` and receive media state from the `MediaController`.

### Sending

The `MediaController` receives user input via `MediaUIEvents` like `MediaUIEvents.MEDIA_PLAY_REQUEST` or `MediaUIEvents.MEDIA_SEEK_REQUEST` for example.

Either 1. (see diagram below), from events fired from the `<media-controller>` element itself or its descendants. In this case the element that receives the events is the `<media-controller>` element. The element that is receiving the events is also called a controller **associated element**. The events bubble up to this associated element.

In case 2. (see diagram below), the UI element would not be nested under the `<media-controller>` element and in turn the `<media-controller>` element will not be able to automatically receive bubbling up events.

For this case an **associated element** is created by targeting the `<media-controller>` via a `[media-controller="my-media-controller"]` attribute. The `<media-controller>` element should have a corresponding id attribute, `[id="my-media-controller"]` in this instance.

All Media Chrome elements support the `[media-controller]` attribute and can be made an **associated element**. Simple HTML elements can be made associated elements but require some JavaScript to get this to work.

### Receiving

The `MediaController` propagates media state by setting `MediaUIAttributes` on observing UI elements.

Any **associated element** or any of its descendants can receive media state from the `MediaController`, as long as the elements are identifiable as something that should receive media state (aka identifiable as a **media state receiver**). Elements are identified as media state receivers in one of two ways:

- The native Media Chrome web components will have this built in and they do this by having the `MediaUIAttributes` listed in the web component `observedAttributes` array.

- Simple HTML elements like a `<div>` element for example are also able to receive media state by defining a `[media-chrome-attributes]` attribute and listing the `MediaUIAttributes` space separated.

  e.g. `<div media-chrome-attributes="media-paused media-current-time"></div>`
  
<br>
<br>

### 1\. by `<media-controller>` Nesting


![media chrome diagram](./assets/media-chrome-diagram-media-controller-nesting.png)

[View Figma embed](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FJfpS4VVSJgvywPHEYAr7Ie%2FMedia-Chrome-Diagrams%3Fnode-id%3D0%253A1)
  
<br>
<br>

### 2\. by `<media-controller>` ID

![media chrome diagram](./assets/media-chrome-diagram-media-controller-id.png)

[View Figma embed](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FJfpS4VVSJgvywPHEYAr7Ie%2FMedia-Chrome-Diagrams%3Fnode-id%3D26%253A84)
