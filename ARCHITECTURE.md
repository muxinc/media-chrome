# Architecture Notes

## Connecting elements to the media

Media chrome elements rely on their `media=''` attribute to set the media element (`<video>` or `<audio>`) they will interact with.

Any media chrome element inside of a `<media-container>` element will have the media element automaticallly injected via their `el.media` property (by the media-container's mutation observer). This roughly matches the pattern of HTML `<form>` elements (a submit button will submit its parent form if no `form=''` attribute is set).

Note: Originally it was built into the media-chrome-element to find the media via a parent media-container, but switched this to have the logic in media-container to simplify the relationhip and avoid a search everytime the media API is needed.

## Element Independence

A goal of this project is that each UI element could be used independently of the project, in the same way an HTML Button can be used independently of an HTML Form. This will make it possible for other players to share these base elements.

## Support Unidirectional Data Flow

Many js application frameworks today like React follow a "unidirectional data flow" pattern. We want media chrome elements to be smart by default, understanding how to listen to media events without a ton of extra overhead, however we don't want to prohibit using them in a react-style app.

To do this the elements will have the option of being passed a media to attach listeners to. And alternatively allow the element state to be set externally.

## Element Naming
* Prefix with `media-` for scoping.
* The suffix should make it clear what the primary user iteraction is with the element, mapping to the matching native HTML element when possible. e.g. `-button`, `-range`, `-img`.
  * Use `-container` for elements that are purely for laying out other elements. More specific layout names like `-bar` are acceptible when the name is clear and intentional.
  * Use `-display` when the primary use is displaying a state or data detail. e.g. `media-duration-display`.
