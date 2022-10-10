# [0.14.0](https://github.com/muxinc/media-chrome/compare/v0.12.0...v0.14.0) (2022-10-10)


### Bug Fixes

* a couple of fixes ([#331](https://github.com/muxinc/media-chrome/issues/331)) ([f4df42f](https://github.com/muxinc/media-chrome/commit/f4df42fb66ff33f40cc1937905f5933bec75aa38))
* properly check iphones for fullscreen unavailability ([#332](https://github.com/muxinc/media-chrome/issues/332)) ([c32c74e](https://github.com/muxinc/media-chrome/commit/c32c74ebf73219919bd96a15796ea008884cd600))
* properly unset poster image sources when they're removed ([#328](https://github.com/muxinc/media-chrome/issues/328)) ([87daae5](https://github.com/muxinc/media-chrome/commit/87daae56b9816818918b7d980e41b780caefbe8c))


### Features

* add poster object fit and position css vars ([#327](https://github.com/muxinc/media-chrome/issues/327)) ([a02bf20](https://github.com/muxinc/media-chrome/commit/a02bf20070a9462d0e085bec90f8c97a295ba4df))



# [0.13.0](https://github.com/muxinc/media-chrome/compare/v0.12.0...v0.13.0) (2022-10-06)


### Bug Fixes

* properly unset poster image sources when they're removed ([#328](https://github.com/muxinc/media-chrome/issues/328)) ([87daae5](https://github.com/muxinc/media-chrome/commit/87daae56b9816818918b7d980e41b780caefbe8c))


### Features

* add poster object fit and position css vars ([#327](https://github.com/muxinc/media-chrome/issues/327)) ([a02bf20](https://github.com/muxinc/media-chrome/commit/a02bf20070a9462d0e085bec90f8c97a295ba4df))



# [0.12.0](https://github.com/muxinc/media-chrome/compare/v0.11.0...v0.12.0) (2022-09-27)


### Bug Fixes

* Safari still uses webkitFullscreenEnabled ([#316](https://github.com/muxinc/media-chrome/issues/316)) ([3850429](https://github.com/muxinc/media-chrome/commit/3850429b2c04327290acb7cbb103c76b8303f502))


### Features

* remove minify/srcmap esm/cjs, add esm-module ([#318](https://github.com/muxinc/media-chrome/issues/318)) ([5ea0d24](https://github.com/muxinc/media-chrome/commit/5ea0d24bc18de58587b8f90137f72cfde585879f))
* support being able to disable buttons, range, and time-display ([#320](https://github.com/muxinc/media-chrome/issues/320)) ([d4129c2](https://github.com/muxinc/media-chrome/commit/d4129c2ee6ef79fafff440e0ba7b3bf9dff55a07))



## [0.11.1](https://github.com/muxinc/media-chrome/compare/v0.11.0...v0.11.1) (2022-09-23)


### Bug Fixes

* Safari still uses webkitFullscreenEnabled ([#316](https://github.com/muxinc/media-chrome/issues/316)) ([3850429](https://github.com/muxinc/media-chrome/commit/3850429b2c04327290acb7cbb103c76b8303f502))



# [0.11.0](https://github.com/muxinc/media-chrome/compare/v0.10.4...v0.11.0) (2022-09-22)


### Bug Fixes

* mark fullscreen button as unavailable if fullscreen is disabled ([#311](https://github.com/muxinc/media-chrome/issues/311)) ([a198f0a](https://github.com/muxinc/media-chrome/commit/a198f0ab8de0076df8134c993c3825af9814653c))
* set tabindex on media element, if not set ([#312](https://github.com/muxinc/media-chrome/issues/312)) ([e7450b8](https://github.com/muxinc/media-chrome/commit/e7450b80ae6954e440539ba8517be139de6478f1)), closes [#309](https://github.com/muxinc/media-chrome/issues/309)


### Features

* add a hotkey for toggling captions: c ([#308](https://github.com/muxinc/media-chrome/issues/308)) ([e76b528](https://github.com/muxinc/media-chrome/commit/e76b5289f42fae800dba5815b24616d9e652f194))



## [0.10.4](https://github.com/muxinc/media-chrome/compare/v0.10.2...v0.10.4) (2022-09-15)


### Bug Fixes

* `gestures-disabled` attribute ([#304](https://github.com/muxinc/media-chrome/issues/304)) ([0c18074](https://github.com/muxinc/media-chrome/commit/0c1807488c694b34bd64b95134ec0d6de7291ac7))
* fix [#299](https://github.com/muxinc/media-chrome/issues/299) right click on media element ([#301](https://github.com/muxinc/media-chrome/issues/301)) ([a498bb1](https://github.com/muxinc/media-chrome/commit/a498bb15a5b9eebacc177e21e8206ffcbc717940))
* gesture captured on controls bug ([#305](https://github.com/muxinc/media-chrome/issues/305)) ([917839b](https://github.com/muxinc/media-chrome/commit/917839b5d1ebd788ec4f6a44952b6c1bc3b2b512))
* keyup handlers for some keyboard behavior should only apply once ([#300](https://github.com/muxinc/media-chrome/issues/300)) ([34fb6d3](https://github.com/muxinc/media-chrome/commit/34fb6d3113acb04f0071c53f4efa3e1b03ba23ee))


### Features

* fix order of layers + add chrome CSS parts ([#298](https://github.com/muxinc/media-chrome/issues/298)) ([2c81cbc](https://github.com/muxinc/media-chrome/commit/2c81cbc15800bf6986e3d0d6e67468bc42daf6e1))



## [0.10.3](https://github.com/muxinc/media-chrome/compare/v0.10.2...v0.10.3) (2022-09-14)


### Bug Fixes

* fix [#299](https://github.com/muxinc/media-chrome/issues/299) right click on media element ([#301](https://github.com/muxinc/media-chrome/issues/301)) ([a498bb1](https://github.com/muxinc/media-chrome/commit/a498bb15a5b9eebacc177e21e8206ffcbc717940))
* keyup handlers for some keyboard behavior should only apply once ([#300](https://github.com/muxinc/media-chrome/issues/300)) ([34fb6d3](https://github.com/muxinc/media-chrome/commit/34fb6d3113acb04f0071c53f4efa3e1b03ba23ee))



## [0.10.2](https://github.com/muxinc/media-chrome/compare/v0.10.0...v0.10.2) (2022-09-09)


### Bug Fixes

* prevent hotkeys from scrolling page ([#296](https://github.com/muxinc/media-chrome/issues/296)) ([34b9882](https://github.com/muxinc/media-chrome/commit/34b9882f9b5c18fbc659383871e4ea9357be6e1a)), closes [#295](https://github.com/muxinc/media-chrome/issues/295)



## [0.10.1](https://github.com/muxinc/media-chrome/compare/v0.10.0...v0.10.1) (2022-09-07)

### Bug Fixes

* Stop progress bar when media is loading [#293](https://github.com/muxinc/media-chrome/pull/293)



# [0.10.0](https://github.com/muxinc/media-chrome/compare/v0.9.0...v0.10.0) (2022-08-29)


### Bug Fixes

* prevent media-poster-image from stretching ([07fbd55](https://github.com/muxinc/media-chrome/commit/07fbd55494fe6d34401a7839230065913bda8a69))


### Features

* add a --media-background-color css var ([a4633c6](https://github.com/muxinc/media-chrome/commit/a4633c615ecaf9c6385881f85a46a2e663661aef))
* Add hotkeys blocklist ([#286](https://github.com/muxinc/media-chrome/issues/286)) ([eb0d770](https://github.com/muxinc/media-chrome/commit/eb0d770da5667c21c39f0e858a8499066ee95d79))
* icons refresh + sizing by height ([#273](https://github.com/muxinc/media-chrome/issues/273)) ([56ddc03](https://github.com/muxinc/media-chrome/commit/56ddc0313e86a8af31c17bd8fde9939ba68173aa))



# [0.9.0](https://github.com/muxinc/media-chrome/compare/v0.8.1...v0.9.0) (2022-08-01)


### Features

* keyboard shortcut support ([#263](https://github.com/muxinc/media-chrome/issues/263)) ([7542ce7](https://github.com/muxinc/media-chrome/commit/7542ce7bc0db14928f83ba6670e1527a54cf801e))



## [0.8.1](https://github.com/muxinc/media-chrome/compare/v0.8.0...v0.8.1) (2022-07-18)


### Bug Fixes

* timerange progress jumpy w/out playback rate ([2b2d360](https://github.com/muxinc/media-chrome/commit/2b2d360cd9b6f9d08068c00869c95ea1b2ff68de))


# [0.8.0](https://github.com/muxinc/media-chrome/compare/v0.7.0...v0.8.0) (2022-07-15)


### Bug Fixes

* audio examples, spotify example ([#265](https://github.com/muxinc/media-chrome/issues/265)) ([128d5c7](https://github.com/muxinc/media-chrome/commit/128d5c780d3238b314ba10b906a9c3890180a8a7))
* box bounds element type error ([6b61552](https://github.com/muxinc/media-chrome/commit/6b615523bce9d3807432563952d90c2dde0e6324))


# [0.7.0](https://github.com/muxinc/media-chrome/compare/v0.6.8...v0.7.0) (2022-07-14)


### Features

* improve time range behavior ([#255](https://github.com/muxinc/media-chrome/issues/255)) ([2aa7223](https://github.com/muxinc/media-chrome/commit/2aa7223977a1f8106807d26852b0108efd9aaa4e))



<a name="0.6.9"></a>
## [0.6.9](https://github.com/muxinc/media-chrome/compare/v0.6.8...v0.6.9) (2022-06-21)


### Bug Fixes

* cast availability ([#251](https://github.com/muxinc/media-chrome/issues/251)) ([97d20f7](https://github.com/muxinc/media-chrome/commit/97d20f7))
* casting state on new cast-button ([fd51440](https://github.com/muxinc/media-chrome/commit/fd51440))
* chrome-button focus ring consistency ([9d83108](https://github.com/muxinc/media-chrome/commit/9d83108))
* focus ring on chrome-range input element ([a1899e9](https://github.com/muxinc/media-chrome/commit/a1899e9))
* have improved styling with host-context and chrome-range ([335b875](https://github.com/muxinc/media-chrome/commit/335b875))
* hide gesture-layer when in audio mode ([77f7005](https://github.com/muxinc/media-chrome/commit/77f7005))
* reset playbackRate UI after loadstart ([#249](https://github.com/muxinc/media-chrome/issues/249)) ([59f4ed4](https://github.com/muxinc/media-chrome/commit/59f4ed4))
* text-display should have consistent focus ring to chrome-button ([f1bad34](https://github.com/muxinc/media-chrome/commit/f1bad34))



## [0.6.8](https://github.com/muxinc/media-chrome/compare/v0.6.6...v0.6.8) (2022-06-06)


### Bug Fixes

* bug that made observedAttributes undefined ([#238](https://github.com/muxinc/media-chrome/issues/238)) ([b63e1b6](https://github.com/muxinc/media-chrome/commit/b63e1b65ba244c2c3364e614985bf3970093022e))
* cast unavailable bug ([#235](https://github.com/muxinc/media-chrome/issues/235)) ([4473e70](https://github.com/muxinc/media-chrome/commit/4473e7018c5dbd4f2940c6e7b7ac88c83c65de1e))



## [0.6.6](https://github.com/muxinc/media-chrome/compare/v0.6.5...v0.6.6) (2022-05-31)


### Bug Fixes

* don't set controls inactive when tapping on controls ([4f2ee7f](https://github.com/muxinc/media-chrome/commit/4f2ee7f9152f8d0d98408da863636069ef1c60a3))
* **seekable-edges:** Convert seekable to numeric values in media-time-range. Handle empty seekable cases better in media-controller. ([7fff378](https://github.com/muxinc/media-chrome/commit/7fff3789ac5bc6e48037e66d41fcbb9838723a45))
* set media-keyboard-control to '' when enabled ([6708749](https://github.com/muxinc/media-chrome/commit/6708749954722cd2b8d1cb2f687ba8b26b1c55a9))
* switch to pointermove from mousemove for media preview request ([#228](https://github.com/muxinc/media-chrome/issues/228)) ([f6b90e9](https://github.com/muxinc/media-chrome/commit/f6b90e9765e7139a76980530c4b7c1fd0204bd01))
* unhide controls on touch & autohide on timer ([6c47b58](https://github.com/muxinc/media-chrome/commit/6c47b589f97e95678cc58cac51e053a729e4027d))


### Features

* add cast button and castable video elements ([#220](https://github.com/muxinc/media-chrome/issues/220)) ([f47f3a9](https://github.com/muxinc/media-chrome/commit/f47f3a9f436b00b7e53e5057eb07efb991425f7c))
* toggle user-inactive on taps ([0d2e223](https://github.com/muxinc/media-chrome/commit/0d2e22354308917807c9372a124d72321eb8c0d3))



## [0.6.5](https://github.com/muxinc/media-chrome/compare/v0.6.4...v0.6.5) (2022-05-23)


### Bug Fixes

* **default-ui-times:** Forcing numeric times for media-time-display and media-time-range when none are available. ([8aa5d82](https://github.com/muxinc/media-chrome/commit/8aa5d829958877e14f6d9ef874246ed4f79994c3))
* mouseout timerange for deeply nest shadowdom ([#225](https://github.com/muxinc/media-chrome/issues/225)) ([51c5617](https://github.com/muxinc/media-chrome/commit/51c561724662e05ff5c3e392942f42fad8e80bea))
* propagate fullscreen state to potential fullscreen elements ([#226](https://github.com/muxinc/media-chrome/issues/226)) ([dec09a5](https://github.com/muxinc/media-chrome/commit/dec09a5ccc1bf39ce4f2c470a8a034a5ff310799))



## [0.6.4](https://github.com/muxinc/media-chrome/compare/v0.6.3...v0.6.4) (2022-05-19)


### Bug Fixes

* conslidate and simplfy selectors dealing with pointer-events ([#222](https://github.com/muxinc/media-chrome/issues/222)) ([575a8f2](https://github.com/muxinc/media-chrome/commit/575a8f28a3d772e54071fc2c665e9487792a1af4))
* remove stale thumbnail preview data when no thumbnails are longer visible ([#219](https://github.com/muxinc/media-chrome/issues/219)) ([f8bbd85](https://github.com/muxinc/media-chrome/commit/f8bbd850488287ad0d5958e66d05344575eb5afc))


### Features

* **seekable-ranges:** Add media-seekable/media.seekable state support. Update media-time-display and media-time-range to handle seekable. ([5fe51ce](https://github.com/muxinc/media-chrome/commit/5fe51ced54cd66a4d0768415b0560ed31565ac5c))



## [0.6.3](https://github.com/muxinc/media-chrome/compare/v0.6.2...v0.6.3) (2022-05-12)


### Features

* **media-play-gesture:** Add gesture-receiver as default-slotted in media-container. Add default styling. ([67bf32a](https://github.com/muxinc/media-chrome/commit/67bf32a150323762b74b1a70e7d930464ca660c6))
* **media-play-gesture:** Baseline impl. ([c0d0070](https://github.com/muxinc/media-chrome/commit/c0d0070c7f8fca5d827b31f8799b5a4e38a1ffbc))
* **media-play-gesture:** clean up relationship between user-inactive and gestures. Clean up gestures-disabled functionality and slotted vs. 'default slotted' behavior. ([ac767ac](https://github.com/muxinc/media-chrome/commit/ac767acdc4218d42199e4abc6e1ebae2030c5f8a))
* **media-play-gesture:** removing pen pointerType support unless/until needed. ([962dd93](https://github.com/muxinc/media-chrome/commit/962dd93dc01da04a4cd4d1cc17d9daa05527690d))
* **media-play-gesture:** removing previous impl for gestures. ([73fc058](https://github.com/muxinc/media-chrome/commit/73fc0587bcf80fc2e914e3d78a8b05d50c1178ed))
* **media-play-gesture:** renaming element per PR feedback. ([43fb8a9](https://github.com/muxinc/media-chrome/commit/43fb8a961ba804f038d1ac8ee45eb41e4fc6813e))
* **media-play-gesture:** updating docs for gestures-disabled. ([1f48c54](https://github.com/muxinc/media-chrome/commit/1f48c5491479e4d0f24d17323be70a88c5ee3684))



## [0.6.2](https://github.com/muxinc/media-chrome/compare/v0.6.1...v0.6.2) (2022-05-03)


### Bug Fixes

* **mux-themes-use-polyfills:** Make sure we use polyfills for themes. ([4227b83](https://github.com/muxinc/media-chrome/commit/4227b83636e75c806ab2ac3a29fa5fb450fd6c23))



## [0.6.1](https://github.com/muxinc/media-chrome/compare/v0.6.0...v0.6.1) (2022-04-22)


### Bug Fixes

* make media-time-display not wrap when small ([c832126](https://github.com/muxinc/media-chrome/commit/c83212680ab01b4659d34f7896d30e361cba1049))



# [0.6.0](https://github.com/muxinc/media-chrome/compare/v0.5.4...v0.6.0) (2022-04-15)



## [0.5.4](https://github.com/muxinc/media-chrome/compare/v0.5.3...v0.5.4) (2022-03-28)


### Bug Fixes

* use mouseleave instead of mouseout ([b55da54](https://github.com/muxinc/media-chrome/commit/b55da541b62095fc51f1ccc46af388279c1cc560))
* **user-inactive-autoplay:** Make default user-inactive true to handle programmatic play starts + hiding controls. ([8e6ca16](https://github.com/muxinc/media-chrome/commit/8e6ca161e4fd137ad6fb62dd81f157ad768a4771))
* **user-inactive-poster:** treat slotted poster like slotted media for pointer-events for user-inactive behavior. ([95d4126](https://github.com/muxinc/media-chrome/commit/95d41265c4fb30d0a041e31657cf906e67a016e3))


### Features

* **state-change-events:** Add example that updates table based on state change events. ([1474d45](https://github.com/muxinc/media-chrome/commit/1474d451c53d612282073b9be60b7aa21d949718))
* **state-change-events:** Add initial infrastructure to dispatch state change events based on ui attrs + user-inactive. ([6b2e422](https://github.com/muxinc/media-chrome/commit/6b2e422e73d453240fa52fe00256b3799c5d3c0b))



## [0.5.3](https://github.com/muxinc/media-chrome/compare/v0.5.2...v0.5.3) (2022-03-07)



## [0.5.2](https://github.com/muxinc/media-chrome/compare/v0.5.1...v0.5.2) (2022-02-28)



## [0.5.1](https://github.com/muxinc/media-chrome/compare/v0.5.0...v0.5.1) (2022-02-22)


### Bug Fixes

* seek back button always used default value for aria label ([#164](https://github.com/muxinc/media-chrome/issues/164)) ([d053fe9](https://github.com/muxinc/media-chrome/commit/d053fe9ea6c79c2a6302f29058f7c698c7ac358e))



# [0.5.0](https://github.com/muxinc/media-chrome/compare/v0.4.3...v0.5.0) (2022-02-11)



## [0.4.3](https://github.com/muxinc/media-chrome/compare/v0.4.0...v0.4.3) (2022-01-31)


### Bug Fixes

* **playback-rate-button:** update rates attr parsing ([#129](https://github.com/muxinc/media-chrome/issues/129)) ([e5cbf9d](https://github.com/muxinc/media-chrome/commit/e5cbf9d9dc22cb2eae5332d61254c27794296e85))



# [0.4.0](https://github.com/muxinc/media-chrome/compare/v0.2.2...v0.4.0) (2021-11-02)



## [0.2.2](https://github.com/muxinc/media-chrome/compare/v0.2.1...v0.2.2) (2021-07-28)



## [0.2.1](https://github.com/muxinc/media-chrome/compare/v0.2.0...v0.2.1) (2021-07-09)



# [0.2.0](https://github.com/muxinc/media-chrome/compare/v0.1.1...v0.2.0) (2021-07-08)



## [0.1.1](https://github.com/muxinc/media-chrome/compare/v0.1.0...v0.1.1) (2021-06-24)



# [0.1.0](https://github.com/muxinc/media-chrome/compare/v0.0.15...v0.1.0) (2021-05-25)



## [0.0.15](https://github.com/muxinc/media-chrome/compare/v0.0.14...v0.0.15) (2021-03-31)



## [0.0.14](https://github.com/muxinc/media-chrome/compare/v0.0.13...v0.0.14) (2021-02-25)



## [0.0.13](https://github.com/muxinc/media-chrome/compare/v0.0.12...v0.0.13) (2021-02-14)



## [0.0.12](https://github.com/muxinc/media-chrome/compare/v0.0.11...v0.0.12) (2021-02-13)



## [0.0.11](https://github.com/muxinc/media-chrome/compare/v0.0.10...v0.0.11) (2020-12-02)



## [0.0.10](https://github.com/muxinc/media-chrome/compare/v0.0.9...v0.0.10) (2020-12-02)



## [0.0.9](https://github.com/muxinc/media-chrome/compare/v0.0.8...v0.0.9) (2020-11-21)



## [0.0.8](https://github.com/muxinc/media-chrome/compare/v0.0.7...v0.0.8) (2020-11-21)



## [0.0.7](https://github.com/muxinc/media-chrome/compare/v0.0.6...v0.0.7) (2020-11-21)



## [0.0.6](https://github.com/muxinc/media-chrome/compare/v0.0.5...v0.0.6) (2020-11-18)



## [0.0.5](https://github.com/muxinc/media-chrome/compare/v0.0.4...v0.0.5) (2020-11-04)



## [0.0.4](https://github.com/muxinc/media-chrome/compare/v0.0.3...v0.0.4) (2020-10-22)



## [0.0.3](https://github.com/muxinc/media-chrome/compare/v0.0.2...v0.0.3) (2020-03-12)



## 0.0.2 (2020-03-12)



