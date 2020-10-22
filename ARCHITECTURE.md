# Architecture Notes

## Element Media Discovery

Media elements can rely on their `media` attribute to set the media element they will interact with. Otherwise they will find the closest `media-chrome` element, and interact with the contained media element. This roughly matches the pattern of form elements (a submit button will submit its parent form).

This search happens every time the media is needed, meaning the parent (and media) can be changed easily, and also we might look for _noticeable_ inefficiencies in high frequency operations.

An alternate approach would have been to have the media-chrome inject the media into any new children using mutation observers, but that seemed less elegant.

---

Changing to have media-chrome push the media into its children. This keeps the media chrome and media loading logic in media chrome and not in control elements.

## Element Independence

A goal of this project is that each UI element could be used independently of the project, in the same way an HTML Button can be used independently of an HTML Form. This will make it possible for other players to share these base elements.

## Support Unidirectional Data Flow

Many js application frameworks today like React follow a "unidirectional data flow" pattern. We want media chrome elements to be smart by default, e.g. understanding how to listen to media events without a ton of extra overhead, however we don't want to prohibit using them in a react-style app.

To do this the elements will have the option of being passed a media to attach listeners to, or will discover a parent element's media or media-chrome element. If those don't exist the element will assume state will be externally provided.
