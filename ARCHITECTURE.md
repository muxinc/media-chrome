# Architecture Notes

## Element Player Discovery

Player elements can rely on their `player` attribute to set the media element they will interact with. Otherwise they will find the closest `player-chrome` element, and interact with the contained media element. This roughly matches the pattern of form elements (a submit button will submit its parent form).

This search happens every time the player is needed, meaning the parent (and player) can be changed easily, and also we might look for _noticeable_ inefficiencies in high frequency operations.

An alternate approach would have been to have the player-chrome inject the player into any new children using mutation observers, but that seemed less elegant.

## Element Independence

A goal of this project is that each UI element could be used independently of the project, in the same way an HTML Button can be used independently of an HTML Form. This will make it possible for other players to share these base elements.
