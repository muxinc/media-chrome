---
title: Design Principles
description: Design Principles
layout: ../../../layouts/MainLayout.astro
---

## Elements should feel like native HTML

Web components allow us to "extend the browser", and in this project we take that seriously, to the degree of aligning the design of the components to the [design of native HTML elements](https://www.w3.org/TR/design-principles/). In some cases this can seem less ideal/progressive, but it creates an intutive and predictable interface for anyone familiar with HTML concepts.

## Elements should be named consistently

- Prefix with `media-` for scoping.
- The suffix should make it clear what the primary user interaction is with the element, mapping to the matching native HTML element when possible. e.g. `-button`, `-range`, `-image`.
  - Use `-container` for elements that are purely for laying out other elements. More specific layout names like `-bar` are acceptible when the name is clear and intentional.
  - Use `-display` when the primary use is displaying a state or data detail. e.g. `media-duration-display`.

## Elements should be independently usable

A goal of this project is that each UI element could be used independently of the project, in the same way an HTML Button can be used independently of an HTML Form. This will make it possible for other players to share these base elements, and open the door for unpredicable uses.

## The architecture should be compatible with unidirectional data flow

Many js application frameworks today like React follow a "unidirectional data flow" pattern. We want to make sure media chrome elements are not blocked or complicated to use in these contexts.

## Events for user actions, attrs/props for media state

Media chrome UI elements emit events to request media state changes. These events bubble up the DOM and are caught by a parent `<media-controller>` element. The media-controller handles the request and calls the appropriate API on a child media element, designated with the attribute `slot="media"`. A media element can be `<video>`, `<audio>`, or any element with a matching API.

Media state is set on UI elements via HTML attributes, for example `<media-ui-element mediapaused>`. For UI elements that are children of or associated with a media-controller, the media-controller will update these attributes automatically.

UI elements that are not children of a media-controller can be associated with a media-controller through a javascript function or the `mediacontroller=""` attribute.

> Note: We have been through many different approaches to the architecture:
>
> 1. A UI element "discovers" a media element by finding a parent media-container, then has a direct reference to the media element
> 2. A parent media-container injects a reference to a media element into all child UI elements
>
> Moving to a single centralized _controller_ handling all operations against the media element has made debugging, monitoring user interactions, and refactoring much easier.
