# Architecture Notes

## Element Player Discovery

Player elements either rely on the `player` attribute to set the player or search up through their ancestors to find the closest parent with a set player (e.g. the `player-chrome` element). This roughly matches the pattern of form elements (a submit button will submit its parent form).

This search happens every time the player is needed, meaning the parent (and player) can be changed easily, and also we might look for _noticeable_ inefficiencies in high frequency operations.

An alternate approach would have been to have the player-chrome inject the player into any new children using mutation observers, but that seemed less elegant.
