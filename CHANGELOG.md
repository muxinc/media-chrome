# [4.14.0](https://github.com/muxinc/media-chrome/compare/v4.13.1...v4.14.0) (2025-10-01)


### Features

* support multiple bitrates in rendition menu ([#1209](https://github.com/muxinc/media-chrome/issues/1209)) ([3c2ca97](https://github.com/muxinc/media-chrome/commit/3c2ca9755d337523c1501150e2f2bcc989a507c4))



## [4.13.1](https://github.com/muxinc/media-chrome/compare/v4.13.0...v4.13.1) (2025-09-03)


### Bug Fixes

* submenu DSD bug  ([#1190](https://github.com/muxinc/media-chrome/issues/1190)) ([fd8ebb8](https://github.com/muxinc/media-chrome/commit/fd8ebb8f359a1935077d30c77beafac214e24943)), closes [#1186](https://github.com/muxinc/media-chrome/issues/1186) [#1125](https://github.com/muxinc/media-chrome/issues/1125)



# [4.13.0](https://github.com/muxinc/media-chrome/compare/v4.12.0...v4.13.0) (2025-08-19)


### Bug Fixes

* Ensure touch taps on iOS are handled correctly as pointerType "touch" ([#1174](https://github.com/muxinc/media-chrome/issues/1174)) ([1182a82](https://github.com/muxinc/media-chrome/commit/1182a82b17b5701cedf7a78e17edf9f4fdc924ca))


### Features

* expose <div> container via part so host DOM styles can target it ([#1172](https://github.com/muxinc/media-chrome/issues/1172)) ([a772d07](https://github.com/muxinc/media-chrome/commit/a772d07b3891672396c6fcf3bb1afcd122412a6f)), closes [#1100](https://github.com/muxinc/media-chrome/issues/1100)



# [4.12.0](https://github.com/muxinc/media-chrome/compare/v4.11.1...v4.12.0) (2025-07-02)


### Bug Fixes

* move vercel edge to dev dep ([#1159](https://github.com/muxinc/media-chrome/issues/1159)) ([9b2d6f8](https://github.com/muxinc/media-chrome/commit/9b2d6f87466e978e92c2aff917e6dcaf13a8a69d)), closes [#1158](https://github.com/muxinc/media-chrome/issues/1158)


### Features

* dynamic label update on lang attribute change i18n ([#1152](https://github.com/muxinc/media-chrome/issues/1152)) ([1ea8237](https://github.com/muxinc/media-chrome/commit/1ea82373c1dd6ba2f5fd2b3dc6dd25d43752014d))



## [4.11.1](https://github.com/muxinc/media-chrome/compare/v4.11.0...v4.11.1) (2025-06-12)


### Bug Fixes

* decode special characters in chapter text ([#1150](https://github.com/muxinc/media-chrome/issues/1150)) ([5558480](https://github.com/muxinc/media-chrome/commit/555848039ea2625052084d992d5d5e6ace40279e)), closes [#1132](https://github.com/muxinc/media-chrome/issues/1132)



# [4.11.0](https://github.com/muxinc/media-chrome/compare/v4.10.0...v4.11.0) (2025-06-03)


### Features

* use getTemplateHTML (React SSR support) ([#1142](https://github.com/muxinc/media-chrome/issues/1142)) ([535ff62](https://github.com/muxinc/media-chrome/commit/535ff62ce724368a3b85a1c7976ba9502de72ab1)), closes [#1143](https://github.com/muxinc/media-chrome/issues/1143) [/github.com/muxinc/ce-la-react/blob/main/src/ce-la-react.ts#L305-L323](https://github.com//github.com/muxinc/ce-la-react/blob/main/src/ce-la-react.ts/issues/L305-L323)



# [4.10.0](https://github.com/muxinc/media-chrome/compare/v4.9.1...v4.10.0) (2025-05-14)


### Bug Fixes

* Add i18n to settings menu defaults ([#1130](https://github.com/muxinc/media-chrome/issues/1130)) ([fd67cf6](https://github.com/muxinc/media-chrome/commit/fd67cf6a4ae25a009b03a7825cf0fedd271d2226))
* Add support for language variants in i18n (e.g., en-AU fallback to en if doesn't exists) ([#1136](https://github.com/muxinc/media-chrome/issues/1136)) ([2708eab](https://github.com/muxinc/media-chrome/commit/2708eab48a2737b1d31694a947ebc07b13a44909))
* React rates array ([#1140](https://github.com/muxinc/media-chrome/issues/1140)) ([ffc38ea](https://github.com/muxinc/media-chrome/commit/ffc38eaaff51723f40f76ced80bedc91d9af1cd2)), closes [#1120](https://github.com/muxinc/media-chrome/issues/1120) [#1139](https://github.com/muxinc/media-chrome/issues/1139)


### Features

* Add Chinese (Simplified and Traditional) translations ([#1134](https://github.com/muxinc/media-chrome/issues/1134)) ([bdaf0bf](https://github.com/muxinc/media-chrome/commit/bdaf0bfa7d8164db3630479ce81ecdc0ca70d511))



## [4.9.1](https://github.com/muxinc/media-chrome/compare/v4.9.0...v4.9.1) (2025-05-01)


### Bug Fixes

* Check that language exists before splitting ([#1131](https://github.com/muxinc/media-chrome/issues/1131)) ([741562d](https://github.com/muxinc/media-chrome/commit/741562d6ec45935fb31822f67a72419e62a254aa))



# [4.9.0](https://github.com/muxinc/media-chrome/compare/v4.8.0...v4.9.0) (2025-03-28)


### Bug Fixes

* race condition w/ default subtitles (Vue) ([#1106](https://github.com/muxinc/media-chrome/issues/1106)) ([98f2dff](https://github.com/muxinc/media-chrome/commit/98f2dffaeda9610bce1845cf13bbad3224286fc3))
* simplify exports, resolve tests. fix lang prop type issue ([#1108](https://github.com/muxinc/media-chrome/issues/1108)) ([08b2c2c](https://github.com/muxinc/media-chrome/commit/08b2c2c3152fd354803c09463908b13a4fd2dcd7))
* timerange thumb and tooltip drift mobile ([#1098](https://github.com/muxinc/media-chrome/issues/1098)) ([fe3e214](https://github.com/muxinc/media-chrome/commit/fe3e2144d5f073ad9cdbc378a62e90816550a20a)), closes [#883](https://github.com/muxinc/media-chrome/issues/883)


### Features

* Add seektoliveoffset attribute ([#958](https://github.com/muxinc/media-chrome/issues/958)) ([0f4feac](https://github.com/muxinc/media-chrome/commit/0f4feac296c211b8b4db4d8eceedea7e0d117f6e))
* hide-cursor-controls-on-inactivity ([#1101](https://github.com/muxinc/media-chrome/issues/1101)) ([849b680](https://github.com/muxinc/media-chrome/commit/849b68054f71ab81204ca7c651ce11c80ab2ecfe)), closes [#756](https://github.com/muxinc/media-chrome/issues/756)
* set i18n through media-controller ([#1105](https://github.com/muxinc/media-chrome/issues/1105)) ([1425887](https://github.com/muxinc/media-chrome/commit/14258873885e2303b8643f7e05129060a030caaf))



# [4.8.0](https://github.com/muxinc/media-chrome/compare/v4.7.1...v4.8.0) (2025-03-12)


### Features

* persist muted enabled state ([#1088](https://github.com/muxinc/media-chrome/issues/1088)) ([94b3ea8](https://github.com/muxinc/media-chrome/commit/94b3ea8c341c019d13fd905d659016e0fda2b33a)), closes [#1072](https://github.com/muxinc/media-chrome/issues/1072)



## [4.7.1](https://github.com/muxinc/media-chrome/compare/v4.7.0...v4.7.1) (2025-03-04)


### Bug Fixes

* MediaTheme React type ([#1089](https://github.com/muxinc/media-chrome/issues/1089)) ([3a7c933](https://github.com/muxinc/media-chrome/commit/3a7c933407b020ec84d96277c3a4cb413f2d5f4a))



# [4.7.0](https://github.com/muxinc/media-chrome/compare/v4.6.1...v4.7.0) (2025-02-28)


### Bug Fixes

* 4.6.0+ no longer has typings for React ([#1085](https://github.com/muxinc/media-chrome/issues/1085)) ([0dfa1d6](https://github.com/muxinc/media-chrome/commit/0dfa1d6dcff7c722221f50bf5d211921d67c9bc2))


### Features

* show Auto(mediaHeight) in rendition menu ([#1075](https://github.com/muxinc/media-chrome/issues/1075)) ([005d305](https://github.com/muxinc/media-chrome/commit/005d305ecc19b9e7ed5be2a0230a41360ed66bb6)), closes [#1052](https://github.com/muxinc/media-chrome/issues/1052)



## [4.6.1](https://github.com/muxinc/media-chrome/compare/v4.6.0...v4.6.1) (2025-02-27)


### Bug Fixes

* dialog accessibility hidden, page load bug ([#1082](https://github.com/muxinc/media-chrome/issues/1082)) ([374eee3](https://github.com/muxinc/media-chrome/commit/374eee3755de98df1afd748c6a1521fa8bf69cdd))



# [4.6.0](https://github.com/muxinc/media-chrome/compare/v4.5.0...v4.6.0) (2025-02-25)


### Bug Fixes

* firefox pip activates when clicked through on settings menu ([#1074](https://github.com/muxinc/media-chrome/issues/1074)) ([778b503](https://github.com/muxinc/media-chrome/commit/778b5030717960099ef732b79593d7ab725a04f9))


### Features

* Refactor to use ce-la-react to add type definitions for JSX attributes ([#1068](https://github.com/muxinc/media-chrome/issues/1068)) ([d20dd95](https://github.com/muxinc/media-chrome/commit/d20dd957b53d0eecaf1176d15e23f829c26e941d))



# [4.5.0](https://github.com/muxinc/media-chrome/compare/v4.4.0...v4.5.0) (2025-02-13)


### Bug Fixes

* hide error dialog on playback recovery ([#1065](https://github.com/muxinc/media-chrome/issues/1065)) ([4d21bd7](https://github.com/muxinc/media-chrome/commit/4d21bd7170dc7739aa9489929d80a01d50afa60e))


### Features

* add range `thumb` slot ([#1013](https://github.com/muxinc/media-chrome/issues/1013)) ([beb0955](https://github.com/muxinc/media-chrome/commit/beb0955646ca003238b01ae20bc824b019de5c5c))



# [4.4.0](https://github.com/muxinc/media-chrome/compare/v4.3.1...v4.4.0) (2025-01-29)


### Bug Fixes

* move breakpointsComputed set to better place ([#1064](https://github.com/muxinc/media-chrome/issues/1064)) ([43c58e8](https://github.com/muxinc/media-chrome/commit/43c58e8bf6ab9ba313fea460c1238525d16b37c8))
* remove media container observers on disconnect ([#1061](https://github.com/muxinc/media-chrome/issues/1061)) ([a7b339a](https://github.com/muxinc/media-chrome/commit/a7b339a02e084026f722d387cac8994139c08ff3))
* set breakpoints on connect ([#1057](https://github.com/muxinc/media-chrome/issues/1057)) ([bfa4459](https://github.com/muxinc/media-chrome/commit/bfa44597ab967fdd70b5ee0f09b3183eb92a177f))


### Features

* CSS vars to customize <media-controller> hide transition ([#1051](https://github.com/muxinc/media-chrome/issues/1051)) ([e334971](https://github.com/muxinc/media-chrome/commit/e334971721692ca04582039dba34093033cb1402)), closes [#874](https://github.com/muxinc/media-chrome/issues/874)



## [4.3.1](https://github.com/muxinc/media-chrome/compare/v4.3.0...v4.3.1) (2025-01-23)


### Bug Fixes

* revert theme render flicker (breakpoints) ([#1055](https://github.com/muxinc/media-chrome/issues/1055)) ([1b8dad5](https://github.com/muxinc/media-chrome/commit/1b8dad5c5eefc739148fd0731c3594d55f02c998)), closes [#960](https://github.com/muxinc/media-chrome/issues/960)



# [4.3.0](https://github.com/muxinc/media-chrome/compare/v4.2.3...v4.3.0) (2024-12-05)


### Features

* add media-error-dialog ([#1024](https://github.com/muxinc/media-chrome/issues/1024)) ([3fc95a2](https://github.com/muxinc/media-chrome/commit/3fc95a2f7c19f50b6fc7c6d664ada2458dd48e3b))


### Reverts

* Revert "docs: use latest instead of symlink" (#1019) ([0c161f4](https://github.com/muxinc/media-chrome/commit/0c161f468eefd13e4c91af1ba295310b48a8ff1e)), closes [#1019](https://github.com/muxinc/media-chrome/issues/1019)



## [4.2.3](https://github.com/muxinc/media-chrome/compare/v4.2.2...v4.2.3) (2024-11-05)


### Bug Fixes

* tooltip overflow causing scrollbar ([#1018](https://github.com/muxinc/media-chrome/issues/1018)) ([181aec2](https://github.com/muxinc/media-chrome/commit/181aec22c7122c5a1bb3f4a653e652d868fe1f48)), closes [#1017](https://github.com/muxinc/media-chrome/issues/1017)



## [4.2.2](https://github.com/muxinc/media-chrome/compare/v4.2.1...v4.2.2) (2024-10-24)


### Bug Fixes

* iOS volume support bug ([#1012](https://github.com/muxinc/media-chrome/issues/1012)) ([5b57c93](https://github.com/muxinc/media-chrome/commit/5b57c930fad1e22836bc825ee9bacbe05b1def88)), closes [#1011](https://github.com/muxinc/media-chrome/issues/1011)



## [4.2.1](https://github.com/muxinc/media-chrome/compare/v4.2.0...v4.2.1) (2024-10-10)


### Bug Fixes

* sticky chapter on mouseout ([#1005](https://github.com/muxinc/media-chrome/issues/1005)) ([cf792bd](https://github.com/muxinc/media-chrome/commit/cf792bdd4c32c4da97646a0a3eb03676913960c5)), closes [#999](https://github.com/muxinc/media-chrome/issues/999)



# [4.2.0](https://github.com/muxinc/media-chrome/compare/v4.1.5...v4.2.0) (2024-10-08)


### Bug Fixes

* add button tooltip part for more styling ([#996](https://github.com/muxinc/media-chrome/issues/996)) ([92542f9](https://github.com/muxinc/media-chrome/commit/92542f961acde0ec5fffc966b5e12c6bebe8071b))
* make tooltip not focusable to fix a11y ([#1004](https://github.com/muxinc/media-chrome/issues/1004)) ([66bb595](https://github.com/muxinc/media-chrome/commit/66bb595d24c35b513fc1987c2fbfbe957bf32b2d))
* seeking when preload is none ([#997](https://github.com/muxinc/media-chrome/issues/997)) ([5000cc3](https://github.com/muxinc/media-chrome/commit/5000cc3f8c254afc02474033d11b15313512ec30)), closes [#910](https://github.com/muxinc/media-chrome/issues/910)
* Use overflow clip in tooltip button to prevent scrollbar ([#1002](https://github.com/muxinc/media-chrome/issues/1002)) ([d3a8bf1](https://github.com/muxinc/media-chrome/commit/d3a8bf11ba9f71b19d72a831b7098df01206cdcc)), closes [#994](https://github.com/muxinc/media-chrome/issues/994) [#1000](https://github.com/muxinc/media-chrome/issues/1000)


### Features

* add range CSS parts ([#990](https://github.com/muxinc/media-chrome/issues/990)) ([4c6298f](https://github.com/muxinc/media-chrome/commit/4c6298f65a318a14c2e01f10d6a6441d01edadf0)), closes [#921](https://github.com/muxinc/media-chrome/issues/921) [#983](https://github.com/muxinc/media-chrome/issues/983)



## [4.1.5](https://github.com/muxinc/media-chrome/compare/v4.1.4...v4.1.5) (2024-10-03)


### Bug Fixes

* chapters event w/ preload none ([#995](https://github.com/muxinc/media-chrome/issues/995)) ([906203e](https://github.com/muxinc/media-chrome/commit/906203e68207a9ced4013b3401712605001fe77c))



## [4.1.4](https://github.com/muxinc/media-chrome/compare/v4.1.3...v4.1.4) (2024-10-01)


### Bug Fixes

* restructure menu header for styling ([#989](https://github.com/muxinc/media-chrome/issues/989)) ([f99f8ed](https://github.com/muxinc/media-chrome/commit/f99f8edf2ab1440b4f8b4d014320e784c4e746d3)), closes [#987](https://github.com/muxinc/media-chrome/issues/987)
* suppressHydrationWarning bug ([#992](https://github.com/muxinc/media-chrome/issues/992)) ([2d392f2](https://github.com/muxinc/media-chrome/commit/2d392f24ea18bf2e9a6d873b2b2a933599c76692))
* tooltip causing page overflow ([#994](https://github.com/muxinc/media-chrome/issues/994)) ([135151f](https://github.com/muxinc/media-chrome/commit/135151f70eb940acf5f212f643d6799175889d86)), closes [#991](https://github.com/muxinc/media-chrome/issues/991)
* tooltip type error ([#988](https://github.com/muxinc/media-chrome/issues/988)) ([281c9cd](https://github.com/muxinc/media-chrome/commit/281c9cd27b616428f415d2b5f8f8810613ed8b9b)), closes [#986](https://github.com/muxinc/media-chrome/issues/986)



## [4.1.3](https://github.com/muxinc/media-chrome/compare/v4.1.2...v4.1.3) (2024-09-24)


### Bug Fixes

* Safari (webkit) style tag styles not applied ([#982](https://github.com/muxinc/media-chrome/issues/982)) ([980b1af](https://github.com/muxinc/media-chrome/commit/980b1af0ba23c968b74df1895b286e79dc3a3cd1))



## [4.1.2](https://github.com/muxinc/media-chrome/compare/v4.1.1...v4.1.2) (2024-09-24)


### Bug Fixes

* menu Safari bug and top overflow bug ([#981](https://github.com/muxinc/media-chrome/issues/981)) ([33c66db](https://github.com/muxinc/media-chrome/commit/33c66db5ffde314aac37daa4093e56740cf0e5cc)), closes [#980](https://github.com/muxinc/media-chrome/issues/980)



## [4.1.1](https://github.com/muxinc/media-chrome/compare/v4.1.0...v4.1.1) (2024-09-19)


### Bug Fixes

* CJS issue with default & named import ([#972](https://github.com/muxinc/media-chrome/issues/972)) ([5eea616](https://github.com/muxinc/media-chrome/commit/5eea616964749e35d006fa218fef595acff69919)), closes [#886](https://github.com/muxinc/media-chrome/issues/886)
* NaN valueAsNumber Safari error ([#967](https://github.com/muxinc/media-chrome/issues/967)) ([3906cca](https://github.com/muxinc/media-chrome/commit/3906ccaf53fad1a8c82eb456cb27ff77acba5c4e)), closes [#947](https://github.com/muxinc/media-chrome/issues/947)
* position menu absolute in control bar ([#966](https://github.com/muxinc/media-chrome/issues/966)) ([3dbd3ff](https://github.com/muxinc/media-chrome/commit/3dbd3ffdc53ca655571e9a1039a08686e5d5e57d))
* seek to live action ([#973](https://github.com/muxinc/media-chrome/issues/973)) ([40c546b](https://github.com/muxinc/media-chrome/commit/40c546b5c84e0f7ed7ea979e3fe67a8ee4ca2579))
* show current playing quality in settings ([#970](https://github.com/muxinc/media-chrome/issues/970)) ([92b6bd6](https://github.com/muxinc/media-chrome/commit/92b6bd6e93cfbcfcd06e24dc5507c37acd6b1491)), closes [#877](https://github.com/muxinc/media-chrome/issues/877)



# [4.1.0](https://github.com/muxinc/media-chrome/compare/v4.0.0...v4.1.0) (2024-08-16)


### Bug Fixes

* theme render flicker (breakpoints) ([#960](https://github.com/muxinc/media-chrome/issues/960)) ([63fa896](https://github.com/muxinc/media-chrome/commit/63fa896ce2f52c018f6feb6069f79c411c56d4f8))


### Features

* remove example themes ([#961](https://github.com/muxinc/media-chrome/issues/961)) ([5ba6489](https://github.com/muxinc/media-chrome/commit/5ba6489f6f2219f43d65e62cb03bbb98d1f832ce))



# [4.0.0](https://github.com/muxinc/media-chrome/compare/v3.2.5...v4.0.0) (2024-08-14)


### Bug Fixes

* .ts files in dist + CE analyzer bug ([#936](https://github.com/muxinc/media-chrome/issues/936)) ([c3d2441](https://github.com/muxinc/media-chrome/commit/c3d2441092c5f2f00e66df95a76785ecdf18431d))
* add menu, dist/menu, module wildcard exports ([#955](https://github.com/muxinc/media-chrome/issues/955)) ([ea406e1](https://github.com/muxinc/media-chrome/commit/ea406e1b200184e174af0120b11d063304ae2b2e))
* add small TS fixes + improvements ([#943](https://github.com/muxinc/media-chrome/issues/943)) ([bc80ab9](https://github.com/muxinc/media-chrome/commit/bc80ab9796a0fe77151cb3fbe8f30ece521c43c7))


### Features

* convert JS files to typescript ([#931](https://github.com/muxinc/media-chrome/issues/931)) ([101a4b1](https://github.com/muxinc/media-chrome/commit/101a4b186c4fdcfa74aef7407b256b1ddabd969f))



## [3.2.5](https://github.com/muxinc/media-chrome/compare/v3.2.4...v3.2.5) (2024-07-25)


### Bug Fixes

* refactor fullscreen-api and state mediator to make fewer assumpt… ([#946](https://github.com/muxinc/media-chrome/issues/946)) ([904e6cb](https://github.com/muxinc/media-chrome/commit/904e6cb8714b8977e1a21b656c7ed1dae1607e92))



## [3.2.4](https://github.com/muxinc/media-chrome/compare/v3.2.3...v3.2.4) (2024-07-11)


### Bug Fixes

* floating time display position ([#942](https://github.com/muxinc/media-chrome/issues/942)) ([fad3522](https://github.com/muxinc/media-chrome/commit/fad3522b024b7dd1b8a2a2413e8feb904c58d8d9))



## [3.2.3](https://github.com/muxinc/media-chrome/compare/v3.2.2...v3.2.3) (2024-05-24)


### Bug Fixes

* add media-chrome/react/media-theme ([#918](https://github.com/muxinc/media-chrome/issues/918)) ([b1b31da](https://github.com/muxinc/media-chrome/commit/b1b31da02fbdc10ca4fb893366515ce23350a641))



## [3.2.2](https://github.com/muxinc/media-chrome/compare/v3.2.1...v3.2.2) (2024-05-03)


### Bug Fixes

* avoid dist artifacts in manifest generation ([#889](https://github.com/muxinc/media-chrome/issues/889)) ([3dc97ed](https://github.com/muxinc/media-chrome/commit/3dc97ede6c39ebcf2afb53c789d603a863b00fb4))



## [3.2.1](https://github.com/muxinc/media-chrome/compare/v3.2.0...v3.2.1) (2024-04-12)


### Bug Fixes

* jsdelivr pkg name, version regex ([#873](https://github.com/muxinc/media-chrome/issues/873)) ([484f6c3](https://github.com/muxinc/media-chrome/commit/484f6c30785d7ee4d8e41514a6a857ff04f3e7eb))
* minimal example ([#869](https://github.com/muxinc/media-chrome/issues/869)) ([d32916c](https://github.com/muxinc/media-chrome/commit/d32916cea5ac9707b61880e2b55b15d4adfe6d7c))
* react media store ([#880](https://github.com/muxinc/media-chrome/issues/880)) ([16e43f2](https://github.com/muxinc/media-chrome/commit/16e43f2a8dd8ce877e54c9243563d095ef9889ca))



# [3.2.0](https://github.com/muxinc/media-chrome/compare/v3.1.1...v3.2.0) (2024-03-26)


### Bug Fixes

* await custom media defined ([#860](https://github.com/muxinc/media-chrome/issues/860)) ([0ca6e98](https://github.com/muxinc/media-chrome/commit/0ca6e984bd073db24168916ed7756f8239f437ac)), closes [#857](https://github.com/muxinc/media-chrome/issues/857)
* cancelWatchAvailability promise catch ([#862](https://github.com/muxinc/media-chrome/issues/862)) ([a80ed4b](https://github.com/muxinc/media-chrome/commit/a80ed4b9b9751eb0dfbccb10f1d2e7c2a5c533fc)), closes [#854](https://github.com/muxinc/media-chrome/issues/854)
* seek on custom media w/o readyState ([#861](https://github.com/muxinc/media-chrome/issues/861)) ([5a96ba1](https://github.com/muxinc/media-chrome/commit/5a96ba11aa3789d31a396970bccb3a04b48b8860)), closes [#858](https://github.com/muxinc/media-chrome/issues/858) [/github.com/muxinc/media-chrome/pull/835/files#diff-f47c60f82e0b188cc72db120e2829c4473753d20186183b4c2e1492169d61321L806-L810](https://github.com//github.com/muxinc/media-chrome/pull/835/files/issues/diff-f47c60f82e0b188cc72db120e2829c4473753d20186183b4c2e1492169d61321L806-L810)


### Features

* React MediaStore ([#851](https://github.com/muxinc/media-chrome/issues/851)) ([737cf45](https://github.com/muxinc/media-chrome/commit/737cf457ed83293e1a01152c4382a164c9541e53))



## [3.1.1](https://github.com/muxinc/media-chrome/compare/v3.1.0...v3.1.1) (2024-03-18)


### Bug Fixes

* account for some dynamic changes to media-time-range ([#859](https://github.com/muxinc/media-chrome/issues/859)) ([bea8fca](https://github.com/muxinc/media-chrome/commit/bea8fca521ce43914dfa1927dd896d5af00de0f6))



# [3.1.0](https://github.com/muxinc/media-chrome/compare/v3.0.2...v3.1.0) (2024-03-18)


### Bug Fixes

* defer to mediaDuration when finite for media-time-range time com… ([#855](https://github.com/muxinc/media-chrome/issues/855)) ([f9c59b7](https://github.com/muxinc/media-chrome/commit/f9c59b79dcadae879e49195cf0f21352a90031bf))
* monitor for extended 'seekablechange' event for more reliable mediaSeekable updates. ([#856](https://github.com/muxinc/media-chrome/issues/856)) ([0bb7c03](https://github.com/muxinc/media-chrome/commit/0bb7c03e43021d55130ab1dd7554da0cca272c3b))


### Features

* configurable keyboard seek offsets ([#852](https://github.com/muxinc/media-chrome/issues/852)) ([f991456](https://github.com/muxinc/media-chrome/commit/f991456e245e66fb7f515076453c701040f4b106))



## [3.0.2](https://github.com/muxinc/media-chrome/compare/v3.0.1...v3.0.2) (2024-03-11)


### Bug Fixes

* clean up media-time-display conditions for duration vs. seekableEnd usage… ([#850](https://github.com/muxinc/media-chrome/issues/850)) ([23643f0](https://github.com/muxinc/media-chrome/commit/23643f0f83a1d9ab6128e3ea961d38c92178749e))



## [3.0.1](https://github.com/muxinc/media-chrome/compare/v3.0.0...v3.0.1) (2024-03-07)


### Bug Fixes

* segments.length typerror ([#846](https://github.com/muxinc/media-chrome/issues/846)) ([e436f6a](https://github.com/muxinc/media-chrome/commit/e436f6a5a237f389c5932b8decef11d82794cf5b))



# [3.0.0](https://github.com/muxinc/media-chrome/compare/v2.2.5...v3.0.0) (2024-03-06)


### Bug Fixes

* buggy chapter segments rendering ([#825](https://github.com/muxinc/media-chrome/issues/825)) ([80c04fc](https://github.com/muxinc/media-chrome/commit/80c04fc91ba08c5423ba4bb0868c45006e82f540))
* cc icon vertical alignment ([#828](https://github.com/muxinc/media-chrome/issues/828)) ([3518818](https://github.com/muxinc/media-chrome/commit/3518818eeb1822bc3e8b953fc8b169a1d1a9b438))
* chapter preview fine tuning ([#840](https://github.com/muxinc/media-chrome/issues/840)) ([6d28ab8](https://github.com/muxinc/media-chrome/commit/6d28ab8be577f4a5a445d03cfb5eeebf143d9ab6))
* make more exact logic for preview cue identification. ([#837](https://github.com/muxinc/media-chrome/issues/837)) ([2ff878b](https://github.com/muxinc/media-chrome/commit/2ff878b27cc7f694b5dfed6067ddb64375a31c98))


### Features

* move menu components to stable ([#836](https://github.com/muxinc/media-chrome/issues/836)) ([b987f3d](https://github.com/muxinc/media-chrome/commit/b987f3dcb84bdd668cace563f33672641f98c95b))
* shifting time box elements with arrow ([#829](https://github.com/muxinc/media-chrome/issues/829)) ([3bc02dc](https://github.com/muxinc/media-chrome/commit/3bc02dc7ce4444cc48ca99c91d51cb1c4fd861aa))



## [2.2.5](https://github.com/muxinc/media-chrome/compare/v2.2.4...v2.2.5) (2024-02-15)


### Bug Fixes

* poster slot fade after play before playing ([#824](https://github.com/muxinc/media-chrome/issues/824)) ([39ba757](https://github.com/muxinc/media-chrome/commit/39ba757c681fff8d5c14e96d7489a4eb41c4e212)), closes [#823](https://github.com/muxinc/media-chrome/issues/823)
* safari InvalidStateError remote playback API error ([#821](https://github.com/muxinc/media-chrome/issues/821)) ([1d484d8](https://github.com/muxinc/media-chrome/commit/1d484d846dcf256838edf4ebf0f5130e98cad119)), closes [#820](https://github.com/muxinc/media-chrome/issues/820)



## [2.2.4](https://github.com/muxinc/media-chrome/compare/v2.2.3...v2.2.4) (2024-02-14)


### Bug Fixes

* **fullscreen:** handleMediaUpdated / rootNode race condition ([#817](https://github.com/muxinc/media-chrome/issues/817)) ([3ea80df](https://github.com/muxinc/media-chrome/commit/3ea80df70230be10dd1f3468d6f4ab87c1b31718))



## [2.2.3](https://github.com/muxinc/media-chrome/compare/v2.2.2...v2.2.3) (2024-02-12)


### Bug Fixes

* cached CSSStyleRule type error in React ([#816](https://github.com/muxinc/media-chrome/issues/816)) ([616e420](https://github.com/muxinc/media-chrome/commit/616e42089f83c988b08a443cb26a202e22b7ee5b))
* clicking settings menu items with children ([#815](https://github.com/muxinc/media-chrome/issues/815)) ([92d6d7e](https://github.com/muxinc/media-chrome/commit/92d6d7ebbca83ad9816155a2ed50e0afcdbc9161)), closes [#814](https://github.com/muxinc/media-chrome/issues/814)



## [2.2.2](https://github.com/muxinc/media-chrome/compare/v2.2.1...v2.2.2) (2024-02-10)


### Bug Fixes

* access sheet before connected to DOM ([#813](https://github.com/muxinc/media-chrome/issues/813)) ([8450868](https://github.com/muxinc/media-chrome/commit/8450868e48280d405b299934fd291c66b009b80e))



## [2.2.1](https://github.com/muxinc/media-chrome/compare/v2.2.0...v2.2.1) (2024-02-09)


### Bug Fixes

* missing sheet typeerror ([#812](https://github.com/muxinc/media-chrome/issues/812)) ([9f119fc](https://github.com/muxinc/media-chrome/commit/9f119fc4705c7276cb7ebf99e962215c9171e422))



# [2.2.0](https://github.com/muxinc/media-chrome/compare/v2.1.0...v2.2.0) (2024-02-09)


### Bug Fixes

* add menu button aria labels ([#800](https://github.com/muxinc/media-chrome/issues/800)) ([2b2843d](https://github.com/muxinc/media-chrome/commit/2b2843d3f1e8589bbf247ee357cbb49059e1b4ab))
* add way to hide menuitems w/ unfilled submenu ([#801](https://github.com/muxinc/media-chrome/issues/801)) ([cc066c5](https://github.com/muxinc/media-chrome/commit/cc066c56a44701597edf155a5bb952aeb68b6df8))
* mobile docs nav ([#804](https://github.com/muxinc/media-chrome/issues/804)) ([545d9b8](https://github.com/muxinc/media-chrome/commit/545d9b8d94caa024802f07f5c51acc02e846c4b0)), closes [#772](https://github.com/muxinc/media-chrome/issues/772)
* **pip-unsupported-apple-pwa:** Detect Apple+Safari+PWA for no PiP su… ([#781](https://github.com/muxinc/media-chrome/issues/781)) ([e17c11e](https://github.com/muxinc/media-chrome/commit/e17c11e6857079c8e481259b9a72aa6a25d599e0))
* range bug ([#811](https://github.com/muxinc/media-chrome/issues/811)) ([188794a](https://github.com/muxinc/media-chrome/commit/188794a3584bd02b6cb541ac9c01dfa68f9a2050))
* Safari disableRemotePlayback errors ([#810](https://github.com/muxinc/media-chrome/issues/810)) ([d665e8f](https://github.com/muxinc/media-chrome/commit/d665e8f83a085bbe218535b33a2f30a2531cd553))
* update animated controls ([#808](https://github.com/muxinc/media-chrome/issues/808)) ([bc7cea3](https://github.com/muxinc/media-chrome/commit/bc7cea35c170d6e0cb652026c058d50770d3e1c0)), closes [#792](https://github.com/muxinc/media-chrome/issues/792)


### Features

* add media-chrome-dialog element ([#795](https://github.com/muxinc/media-chrome/issues/795)) ([776a34d](https://github.com/muxinc/media-chrome/commit/776a34d3cd8d67ee580b41f3feaef813b0dab988))
* add range preview chapters ([#755](https://github.com/muxinc/media-chrome/issues/755)) ([a04fa23](https://github.com/muxinc/media-chrome/commit/a04fa237feefb9e57d0e12c470b33e1e1612c185))
* add settings-menu ([#788](https://github.com/muxinc/media-chrome/issues/788)) ([a944513](https://github.com/muxinc/media-chrome/commit/a944513575fc26d7363ae43f0d59d0541d23f7d7))



# [2.1.0](https://github.com/muxinc/media-chrome/compare/v2.0.1...v2.1.0) (2024-01-18)


### Bug Fixes

* default subs async complexities ([#789](https://github.com/muxinc/media-chrome/issues/789)) ([0270892](https://github.com/muxinc/media-chrome/commit/027089255686c9f562e461a501927797383f3cc5))


### Features

* add role menu elements ([#785](https://github.com/muxinc/media-chrome/issues/785)) ([c9a6980](https://github.com/muxinc/media-chrome/commit/c9a698033ea37ddb6b47961cd031babd5ca1f079))



## [2.0.1](https://github.com/muxinc/media-chrome/compare/v2.0.0...v2.0.1) (2023-12-11)


### Bug Fixes

* prevent unset callback if there is no media ([#782](https://github.com/muxinc/media-chrome/issues/782)) ([4198832](https://github.com/muxinc/media-chrome/commit/4198832a625d6145fa3fa5fbf9454c77e2ac0f7d))



# [2.0.0](https://github.com/muxinc/media-chrome/compare/v1.7.0...v2.0.0) (2023-12-06)


* feat!: use remote playback API (#743) ([83c1a0f](https://github.com/muxinc/media-chrome/commit/83c1a0f000bc8898971f030bcafa0d6df37cdc34)), closes [#743](https://github.com/muxinc/media-chrome/issues/743)


### BREAKING CHANGES

* uses castable-video v1

Requires https://github.com/muxinc/castable-video/pull/16

https://github.com/muxinc/media-chrome/discussions/654


# IMPORTANT
Mux player requires the new `<castable-video>` with this change!
https://github.com/muxinc/castable-video



# [1.7.0](https://github.com/muxinc/media-chrome/compare/v1.6.0...v1.7.0) (2023-12-06)


### Bug Fixes

* fullscreen attr if node is not isConnected ([#780](https://github.com/muxinc/media-chrome/issues/780)) ([7140c6f](https://github.com/muxinc/media-chrome/commit/7140c6f7c7b1261cd71cd1f46ff357ba745d9b3b)), closes [#761](https://github.com/muxinc/media-chrome/issues/761)


### Features

* **default duration:** add support for defaultduration when usable duration is unavailble ([#779](https://github.com/muxinc/media-chrome/issues/779)) ([b5a8af6](https://github.com/muxinc/media-chrome/commit/b5a8af68a4fd5cdd5fb39389b89d87639fdc5136))



# [1.6.0](https://github.com/muxinc/media-chrome/compare/v1.5.4...v1.6.0) (2023-12-04)


### Bug Fixes

* video element memory leak + optimizations ([#775](https://github.com/muxinc/media-chrome/issues/775)) ([e1d6377](https://github.com/muxinc/media-chrome/commit/e1d6377a368427f74f0cfb1a62d526910f67ae43)), closes [#750](https://github.com/muxinc/media-chrome/issues/750)


### Features

* Add user prefs for subtitles+cc lang, including local storage. ([#770](https://github.com/muxinc/media-chrome/issues/770)) ([ebb4f15](https://github.com/muxinc/media-chrome/commit/ebb4f15705a183f44e6aeafbecd5c4e9e6bac4ce))



## [1.5.4](https://github.com/muxinc/media-chrome/compare/v1.5.3...v1.5.4) (2023-11-29)


### Bug Fixes

* Make backdrop-filter work on Safari with vendor prefix ([#773](https://github.com/muxinc/media-chrome/issues/773)) ([893b826](https://github.com/muxinc/media-chrome/commit/893b826f74b0150f5ca3ccff4928382d8205bac6)), closes [#646](https://github.com/muxinc/media-chrome/issues/646)
* time range bug fixes ([#769](https://github.com/muxinc/media-chrome/issues/769)) ([9a6e0d7](https://github.com/muxinc/media-chrome/commit/9a6e0d76f6caa5635d3af0f247411ad6a8e99065))



## [1.5.3](https://github.com/muxinc/media-chrome/compare/v1.5.2...v1.5.3) (2023-11-15)


### Bug Fixes

* Android toggle controls on tapping ([#766](https://github.com/muxinc/media-chrome/issues/766)) ([74d890f](https://github.com/muxinc/media-chrome/commit/74d890f5a319e866b0a5948e5debda89b1231230))



## [1.5.2](https://github.com/muxinc/media-chrome/compare/v1.5.1...v1.5.2) (2023-11-03)


### Bug Fixes

* hide cursor on media when controls fade out ([#758](https://github.com/muxinc/media-chrome/issues/758)) ([bbc81d7](https://github.com/muxinc/media-chrome/commit/bbc81d756e6958d9aa1424b92de4eddb55d775e2)), closes [#756](https://github.com/muxinc/media-chrome/issues/756)



## [1.5.1](https://github.com/muxinc/media-chrome/compare/v1.5.0...v1.5.1) (2023-11-03)


### Bug Fixes

* calc padding CSS var issue ([#757](https://github.com/muxinc/media-chrome/issues/757)) ([2429f21](https://github.com/muxinc/media-chrome/commit/2429f2183107228d828f1ea2d4bb964f1e9747b3))



# [1.5.0](https://github.com/muxinc/media-chrome/compare/v1.4.5...v1.5.0) (2023-10-30)


### Features

* separate slider UI from input range + improve mobile ([#704](https://github.com/muxinc/media-chrome/issues/704)) ([b1a219e](https://github.com/muxinc/media-chrome/commit/b1a219e1dd87d7d2c4174e7105bc802a6464b7a7)), closes [#751](https://github.com/muxinc/media-chrome/issues/751) [#662](https://github.com/muxinc/media-chrome/issues/662)



## [1.4.5](https://github.com/muxinc/media-chrome/compare/v1.4.4...v1.4.5) (2023-10-27)


### Bug Fixes

* add timerange to mobile ([#752](https://github.com/muxinc/media-chrome/issues/752)) ([0151fcd](https://github.com/muxinc/media-chrome/commit/0151fcd7c6528d4ffa4a245a30d8bd851ba94171))
* selectmenu anchor right + add listbox row layout ([#753](https://github.com/muxinc/media-chrome/issues/753)) ([444f248](https://github.com/muxinc/media-chrome/commit/444f2486bf8f399c33bd329f24362c81822c36c0))



## [1.4.4](https://github.com/muxinc/media-chrome/compare/v1.4.3...v1.4.4) (2023-10-16)


### Bug Fixes

* Since attributeChangedCallback can be invoked before DOM connection, only attempt to resolve media controller id if isConnected. ([#742](https://github.com/muxinc/media-chrome/issues/742)) ([3bf7d18](https://github.com/muxinc/media-chrome/commit/3bf7d18eea5b62b202fdf32619186e7f1090cb9f)), closes [#741](https://github.com/muxinc/media-chrome/issues/741)



## [1.4.3](https://github.com/muxinc/media-chrome/compare/v1.4.2...v1.4.3) (2023-10-03)


### Bug Fixes

* improve selectmenu overflow ([#734](https://github.com/muxinc/media-chrome/issues/734)) ([08b580f](https://github.com/muxinc/media-chrome/commit/08b580fcdbf1d6183948539657bbe99fc139e55d))



## [1.4.2](https://github.com/muxinc/media-chrome/compare/v1.4.1...v1.4.2) (2023-09-05)


### Bug Fixes

* account for single child in react wrapper templating. ([#730](https://github.com/muxinc/media-chrome/issues/730)) ([7e267f7](https://github.com/muxinc/media-chrome/commit/7e267f7aa35b41cc822d2ace94532767b64ef227)), closes [#727](https://github.com/muxinc/media-chrome/issues/727)
* Themes not rendering if no breakpoint is active on load ([#731](https://github.com/muxinc/media-chrome/issues/731)) ([e719be9](https://github.com/muxinc/media-chrome/commit/e719be9dcd601fcb1061e55249610ced1d583f5a))



## [1.4.1](https://github.com/muxinc/media-chrome/compare/v1.4.0...v1.4.1) (2023-08-22)


### Bug Fixes

* buffered in time range ([#729](https://github.com/muxinc/media-chrome/issues/729)) ([eacccde](https://github.com/muxinc/media-chrome/commit/eacccde78f2cc9f231e08c266a0e006fb2e11567))
* mediaaudiotrackunavailable in theme ([#728](https://github.com/muxinc/media-chrome/issues/728)) ([0ecb4c9](https://github.com/muxinc/media-chrome/commit/0ecb4c975388ac58fa95ffbd012b7df3ddbb231a))



# [1.4.0](https://github.com/muxinc/media-chrome/compare/v1.3.1...v1.4.0) (2023-08-21)


### Features

* add audio track selectmenu ([#723](https://github.com/muxinc/media-chrome/issues/723)) ([91c9208](https://github.com/muxinc/media-chrome/commit/91c920858c2fd5848c93a9e08154238c920ebdb2))



## [1.3.1](https://github.com/muxinc/media-chrome/compare/v1.3.0...v1.3.1) (2023-08-18)


### Bug Fixes

* remove pointer events from hidden list boxes ([#725](https://github.com/muxinc/media-chrome/issues/725)) ([1447f19](https://github.com/muxinc/media-chrome/commit/1447f192205be3803dd5d6e282a226b7cae4f1aa))



# [1.3.0](https://github.com/muxinc/media-chrome/compare/v1.2.6...v1.3.0) (2023-08-18)


### Features

* add option-selected part for selected option elements ([#724](https://github.com/muxinc/media-chrome/issues/724)) ([2299cdd](https://github.com/muxinc/media-chrome/commit/2299cdd2feb75c48c1bdf083891319a847ad0b4c))



## [1.2.6](https://github.com/muxinc/media-chrome/compare/v1.2.5...v1.2.6) (2023-08-17)


### Bug Fixes

* media-chrome-option outline fix and new css vars ([#722](https://github.com/muxinc/media-chrome/issues/722)) ([bc95f55](https://github.com/muxinc/media-chrome/commit/bc95f554d1f998286a35e818e82d44ddbb1f3ff7))



## [1.2.5](https://github.com/muxinc/media-chrome/compare/v1.2.4...v1.2.5) (2023-08-16)


### Bug Fixes

* make poster slot work with fallback ([#721](https://github.com/muxinc/media-chrome/issues/721)) ([f38c3f4](https://github.com/muxinc/media-chrome/commit/f38c3f448c6cad7b5d88422311ff8bf4f21b31a6))



## [1.2.4](https://github.com/muxinc/media-chrome/compare/v1.2.3...v1.2.4) (2023-08-14)


### Bug Fixes

* monitor if breakpoints have been computed and only trigger theme… ([#719](https://github.com/muxinc/media-chrome/issues/719)) ([ddc0817](https://github.com/muxinc/media-chrome/commit/ddc081798422a6132bd06da5180499614ac9a3b8))



## [1.2.3](https://github.com/muxinc/media-chrome/compare/v1.2.2...v1.2.3) (2023-08-11)


### Bug Fixes

* add rendition unavailable / unsupported ([#715](https://github.com/muxinc/media-chrome/issues/715)) ([fd38722](https://github.com/muxinc/media-chrome/commit/fd387220522c6ea6401119d1530fc6c8e56fa2f1))



## [1.2.2](https://github.com/muxinc/media-chrome/compare/v1.2.1...v1.2.2) (2023-08-04)


### Bug Fixes

* Adding parts for media-poster-image underlying img for advanced … ([#712](https://github.com/muxinc/media-chrome/issues/712)) ([8a003bf](https://github.com/muxinc/media-chrome/commit/8a003bf1438eb9133c239b1fae59788dfc97c5dc))
* Move all breakpoint computation to resizeObserver. defer quickly… ([#711](https://github.com/muxinc/media-chrome/issues/711)) ([f60a499](https://github.com/muxinc/media-chrome/commit/f60a4990444cfccd199e9c9090cf7c3df6502671))



## [1.2.1](https://github.com/muxinc/media-chrome/compare/v1.2.0...v1.2.1) (2023-08-02)


### Bug Fixes

* selectmenu / listbox fixes ([#709](https://github.com/muxinc/media-chrome/issues/709)) ([66ed3b7](https://github.com/muxinc/media-chrome/commit/66ed3b7235014689339b70791ac05673291250d7))



# [1.2.0](https://github.com/muxinc/media-chrome/compare/v1.1.7...v1.2.0) (2023-07-28)


### Bug Fixes

* -:-- time codes on player load to 0:00 ([#706](https://github.com/muxinc/media-chrome/issues/706)) ([927dc41](https://github.com/muxinc/media-chrome/commit/927dc41e227f3c61452c43f9bae02f6a907c492d))
* select keyboard focus ([#705](https://github.com/muxinc/media-chrome/issues/705)) ([2eca046](https://github.com/muxinc/media-chrome/commit/2eca0461c9d557de1750d3ecc235901456bb6503))
* set breakpoints on connected  ([#707](https://github.com/muxinc/media-chrome/issues/707)) ([6f66e93](https://github.com/muxinc/media-chrome/commit/6f66e93f9f03ca574b72ada690a95474248ced28)), closes [#697](https://github.com/muxinc/media-chrome/issues/697)


### Features

* add checkmark icon to listboxes ([#694](https://github.com/muxinc/media-chrome/issues/694)) ([110d28a](https://github.com/muxinc/media-chrome/commit/110d28ae2049762f8725344268f22ba0af7bf36d))



## [1.1.7](https://github.com/muxinc/media-chrome/compare/v1.1.6...v1.1.7) (2023-07-25)


### Bug Fixes

* remove unneeded default types path ([#699](https://github.com/muxinc/media-chrome/issues/699)) ([cc1ebd9](https://github.com/muxinc/media-chrome/commit/cc1ebd9a67365b0aec150def71390c4d4ec96e96))



## [1.1.6](https://github.com/muxinc/media-chrome/compare/v1.1.5...v1.1.6) (2023-07-25)


### Bug Fixes

* `<media-live-button/>` setting attr in constructor ([#696](https://github.com/muxinc/media-chrome/issues/696)) ([c99eb1c](https://github.com/muxinc/media-chrome/commit/c99eb1ce91f3c78936fee8f2820e9f9aef2142a4))
* Attr setting error in seek buttons ([#692](https://github.com/muxinc/media-chrome/issues/692)) ([d944d66](https://github.com/muxinc/media-chrome/commit/d944d663f5a3f9a5b085f2159d5d4b37c650f72e)), closes [#691](https://github.com/muxinc/media-chrome/issues/691)



## [1.1.5](https://github.com/muxinc/media-chrome/compare/v1.1.4...v1.1.5) (2023-07-17)


### Bug Fixes

* media-chrome/dist/react import ([#687](https://github.com/muxinc/media-chrome/issues/687)) ([a5975c0](https://github.com/muxinc/media-chrome/commit/a5975c0165cd4f49d8f4d0d0c25959ef8779e42a)), closes [#680](https://github.com/muxinc/media-chrome/issues/680)
* Playback rate sorting for double digits ([#684](https://github.com/muxinc/media-chrome/issues/684)) ([2ebea97](https://github.com/muxinc/media-chrome/commit/2ebea974db52f5f00cc616012a7ede876ccc255c))
* Seek forward aria label said "back" ([#685](https://github.com/muxinc/media-chrome/issues/685)) ([f2c85f6](https://github.com/muxinc/media-chrome/commit/f2c85f6bb2c47e49b7e1503a47cac6e65f504d59)), closes [#678](https://github.com/muxinc/media-chrome/issues/678)
* use globalThis i/o window (declarative shadow DOM) ([#671](https://github.com/muxinc/media-chrome/issues/671)) ([f620c1e](https://github.com/muxinc/media-chrome/commit/f620c1ea37c6618d9c621a983baa088e8f9b6f0d))



## [1.1.4](https://github.com/muxinc/media-chrome/compare/v1.1.3...v1.1.4) (2023-07-07)


### Bug Fixes

* Use setTimeout at ~=1 frame (16ms) since queueMicrotask may stil… ([#682](https://github.com/muxinc/media-chrome/issues/682)) ([93ff3cb](https://github.com/muxinc/media-chrome/commit/93ff3cba432978eceb4259d5013673dda4c16c31))



## [1.1.3](https://github.com/muxinc/media-chrome/compare/v1.1.2...v1.1.3) (2023-06-29)


### Bug Fixes

* React createElement function signature ([#675](https://github.com/muxinc/media-chrome/issues/675)) ([b461fb7](https://github.com/muxinc/media-chrome/commit/b461fb7a36c5e083673c2bfaa50771ded4dfa4ad))
* Use queueMicrotask for async ResizeObserver cb. ([#677](https://github.com/muxinc/media-chrome/issues/677)) ([e9be608](https://github.com/muxinc/media-chrome/commit/e9be60824c6a0c279a42d0fd3105eff14b69704f))



## [1.1.2](https://github.com/muxinc/media-chrome/compare/v1.1.1...v1.1.2) (2023-06-26)


### Bug Fixes

* Make computation for breakpoints in ResizeObserver async. ([#674](https://github.com/muxinc/media-chrome/issues/674)) ([d311472](https://github.com/muxinc/media-chrome/commit/d311472623fac7fee5c027c2c85f22aa456e2e91))



## [1.1.1](https://github.com/muxinc/media-chrome/compare/v1.1.0...v1.1.1) (2023-06-23)


### Bug Fixes

* time range preview and value inconsistency ([#670](https://github.com/muxinc/media-chrome/issues/670)) ([4f58bf1](https://github.com/muxinc/media-chrome/commit/4f58bf1479ed8dc89fd49906cba87412ca34b02b))



# [1.1.0](https://github.com/muxinc/media-chrome/compare/v1.0.0...v1.1.0) (2023-06-12)


### Bug Fixes

* Handle visualization in media-time-range for cases where media has ended. ([#667](https://github.com/muxinc/media-chrome/issues/667)) ([924aa20](https://github.com/muxinc/media-chrome/commit/924aa20e3a84a815065f3d7f2768f80662f96fee))
* media state change events ([#666](https://github.com/muxinc/media-chrome/issues/666)) ([05999ae](https://github.com/muxinc/media-chrome/commit/05999ae60e0dfca323adebaeff6be0092ee8c39b))


### Features

* add `backdrop-filter` to range track & bg ([#658](https://github.com/muxinc/media-chrome/issues/658)) ([3590497](https://github.com/muxinc/media-chrome/commit/3590497e4174d97055b57b6455da6de1887b7d37))



# [1.0.0](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.5...v1.0.0) (2023-05-30)


### Features

* icon slots for single slot controls ([#645](https://github.com/muxinc/media-chrome/issues/645)) ([17869cb](https://github.com/muxinc/media-chrome/commit/17869cb1172ee646f1219b6a403361101a281de8))


### BREAKING CHANGES

* Icon slots have been renamed to "icon" for Airplay, Seek Forward, Seek Backward, and Loading Indicator controls.



# [1.0.0-rc.5](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.4...v1.0.0-rc.5) (2023-05-26)


### Bug Fixes

* media display override issue ([#648](https://github.com/muxinc/media-chrome/issues/648)) ([dfc6a13](https://github.com/muxinc/media-chrome/commit/dfc6a13e46c2beb9f54511581e5ad5c281e592c0))


### Features

* Icon slots for buttons with multiple slots ([#643](https://github.com/muxinc/media-chrome/issues/643)) ([53e7aad](https://github.com/muxinc/media-chrome/commit/53e7aade3e2eb99481529e75b5e12e9f3cc0d0fa))



# [1.0.0-rc.4](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2023-05-23)


### Bug Fixes

* fullscreen state getter w/o event ([#634](https://github.com/muxinc/media-chrome/issues/634)) ([2dba034](https://github.com/muxinc/media-chrome/commit/2dba03418341988b56ba7c433b81142e6d1d2141)), closes [#627](https://github.com/muxinc/media-chrome/issues/627)
* Make sure we monitor slotchange on slots for media state receive… ([#639](https://github.com/muxinc/media-chrome/issues/639)) ([6710381](https://github.com/muxinc/media-chrome/commit/671038123e629ddbac79f17d99a3c80728568eab))



# [1.0.0-rc.3](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2023-05-22)


### Bug Fixes

* iOS fullscreen state bug ([#633](https://github.com/muxinc/media-chrome/issues/633)) ([505e0d1](https://github.com/muxinc/media-chrome/commit/505e0d15bffbe2bc63691f163c0538b879cd43e8)), closes [#593](https://github.com/muxinc/media-chrome/issues/593)


### Features

* add icon slot to mute button ([#629](https://github.com/muxinc/media-chrome/issues/629)) ([41169a0](https://github.com/muxinc/media-chrome/commit/41169a065742379e28152b6a32a795e2db47dd4d))
* add mediaended attr to play button ([#630](https://github.com/muxinc/media-chrome/issues/630)) ([3141864](https://github.com/muxinc/media-chrome/commit/3141864deeb651fcbcbd2cc1bfe133e356efb1f6))



# [1.0.0-rc.2](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2023-05-16)


### Bug Fixes

* Missing parenthesis in control bar style ([#626](https://github.com/muxinc/media-chrome/issues/626)) ([76a1c8f](https://github.com/muxinc/media-chrome/commit/76a1c8fadc90ab11dae14f27f3cc61eb87e53cef))



# [1.0.0-rc.1](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2023-05-15)


### Bug Fixes

* Update official themes to use lowercase attrs consistently. ([#623](https://github.com/muxinc/media-chrome/issues/623)) ([5d62f93](https://github.com/muxinc/media-chrome/commit/5d62f93b2d78dcb1eba5fb7b1e83434d73e3ce11))



# [1.0.0-rc.0](https://github.com/muxinc/media-chrome/compare/v0.21.0...v1.0.0-rc.0) (2023-05-12)


### Bug Fixes

* add default unavailable CSS to themes ([#539](https://github.com/muxinc/media-chrome/issues/539)) ([f9c5a9e](https://github.com/muxinc/media-chrome/commit/f9c5a9e921cca14a4e8858fcbdd234de4286c64a))
* Better color contrast on breakpoint docs ([#614](https://github.com/muxinc/media-chrome/issues/614)) ([d869d73](https://github.com/muxinc/media-chrome/commit/d869d73a407fd5620fc2bf16f31665d0bd0f6553))
* buffered attr ([#544](https://github.com/muxinc/media-chrome/issues/544)) ([7efe18a](https://github.com/muxinc/media-chrome/commit/7efe18ac00fc84648e417d23ebcaf643b2c4fae3))
* casting ([#618](https://github.com/muxinc/media-chrome/issues/618)) ([106e3dd](https://github.com/muxinc/media-chrome/commit/106e3ddb1ab3c12619b09b2d240a2691745aeea3))
* Comparison of text track lists ([#600](https://github.com/muxinc/media-chrome/issues/600)) ([87daf00](https://github.com/muxinc/media-chrome/commit/87daf00d5c1fabf0c66cf97ef63beae328d8986c))
* css variables consistency updates ([#554](https://github.com/muxinc/media-chrome/issues/554)) ([f2876db](https://github.com/muxinc/media-chrome/commit/f2876db9b864256fa7419d5ab595ad026ef69161))
* dash in breakpoint attr ([#540](https://github.com/muxinc/media-chrome/issues/540)) ([23c2de9](https://github.com/muxinc/media-chrome/commit/23c2de9dbf8fb07c609af23ba06d3a11f76f390a))
* don't auto-size ranges in media-control-bar if they're all alone. ([#591](https://github.com/muxinc/media-chrome/issues/591)) ([276b96d](https://github.com/muxinc/media-chrome/commit/276b96de8fbf3ad1e4ea4384253e57f08395067a))
* forward button ([#605](https://github.com/muxinc/media-chrome/issues/605)) ([4c81eed](https://github.com/muxinc/media-chrome/commit/4c81eed5b1562a2af0008baeeffeff778186313c))
* Let media-control-bar size (height) range components like it doe… ([#582](https://github.com/muxinc/media-chrome/issues/582)) ([d1a65da](https://github.com/muxinc/media-chrome/commit/d1a65da3afdc94b6e19da68f3298d1e26b0b60e6))
* selectmenu mediacontroller and missed examples from first pass. ([#541](https://github.com/muxinc/media-chrome/issues/541)) ([2ab9032](https://github.com/muxinc/media-chrome/commit/2ab90323a1bd20f3456e95e1567b379e5e7373b4))
* show chrome on pointermove for custom video ([#604](https://github.com/muxinc/media-chrome/issues/604)) ([de8035b](https://github.com/muxinc/media-chrome/commit/de8035bc5cf44c83192d0d6ad0eaef1bfa406648)), closes [#451](https://github.com/muxinc/media-chrome/issues/451) [#298](https://github.com/muxinc/media-chrome/issues/298)
* show pointer for theme toggle icons ([#611](https://github.com/muxinc/media-chrome/issues/611)) ([71358ce](https://github.com/muxinc/media-chrome/commit/71358ceb2f2d1e3a0300d1bfe7628820e5e1764d))
* use default values in new prop getters for seek btns. Use props … ([#592](https://github.com/muxinc/media-chrome/issues/592)) ([c843a5e](https://github.com/muxinc/media-chrome/commit/c843a5e3ea7da70becb9b0516cb51c4c2b51bc30))


### Features

* add defaultsubtitles to media-controller ([#551](https://github.com/muxinc/media-chrome/issues/551)) ([fdbc8c7](https://github.com/muxinc/media-chrome/commit/fdbc8c7719b5e54086ae12954b6d59fbd1c33021))
* add novolumepref attribute to prefer writing to localStorage ([#575](https://github.com/muxinc/media-chrome/issues/575)) ([31bdb11](https://github.com/muxinc/media-chrome/commit/31bdb1188236e0411e15f284554604f03d2b1a4b))
* Add props and types to seek forwards and backwards elements ([#566](https://github.com/muxinc/media-chrome/issues/566)) ([0259c3a](https://github.com/muxinc/media-chrome/commit/0259c3abaa578444456e62f391d8e5a7a586d0e1))
* Adding custom event for breakingpoint changing ([#584](https://github.com/muxinc/media-chrome/issues/584)) ([1cf3579](https://github.com/muxinc/media-chrome/commit/1cf3579123ba4de59a5a70fed4d89637d7652a09))
* Airplay, Captions, and Cast button props ([#587](https://github.com/muxinc/media-chrome/issues/587)) ([14156f7](https://github.com/muxinc/media-chrome/commit/14156f77e9de73884cb23f9e748227a9f1659157))
* combine MEDIA_CAPTIONS_LIST into MEDIA_SUBTITLES_LIST ([#546](https://github.com/muxinc/media-chrome/issues/546)) ([03e62e6](https://github.com/muxinc/media-chrome/commit/03e62e616b2f7bef46b1331079421fa5f17736d1))
* Drop all deprecated or redundant components. Update tests, examples, docs, etc. based on changes. ([#560](https://github.com/muxinc/media-chrome/issues/560)) ([20fca8c](https://github.com/muxinc/media-chrome/commit/20fca8cf4253482d93608b1c6edc728aa6819375))
* Duration, Fullscreen, and Gesture props ([#595](https://github.com/muxinc/media-chrome/issues/595)) ([748c013](https://github.com/muxinc/media-chrome/commit/748c01315f5654eb21487418c9cf216f8d53eee3))
* fix casing in attributes and vars ([#606](https://github.com/muxinc/media-chrome/issues/606)) ([502fff5](https://github.com/muxinc/media-chrome/commit/502fff531df28da43451e166ba710c59d7f43a5b))
* Live Button and Mute button props ([#596](https://github.com/muxinc/media-chrome/issues/596)) ([d6b5ad6](https://github.com/muxinc/media-chrome/commit/d6b5ad6b7f61cc60d989f4ea591707dbc8433683))
* Media Time Range and Volume Range props ([#599](https://github.com/muxinc/media-chrome/issues/599)) ([61d6ddd](https://github.com/muxinc/media-chrome/commit/61d6dddf5dc140cb91007c80713b44aa39c3d352))
* Migrate all attributes to lowercase ('smushedcase'). ([#537](https://github.com/muxinc/media-chrome/issues/537)) ([fe9eadc](https://github.com/muxinc/media-chrome/commit/fe9eadc98af47752cc7b362379cd3fc4f24e5a14))
* move loading-indicator visibility to be done in CSS only ([#586](https://github.com/muxinc/media-chrome/issues/586)) ([0d989b3](https://github.com/muxinc/media-chrome/commit/0d989b34e46f36af3fb2fe017b026932eec13f95))
* Pip button, Play button, and Playback Rates props ([#597](https://github.com/muxinc/media-chrome/issues/597)) ([3d96b16](https://github.com/muxinc/media-chrome/commit/3d96b16deeb90b9961582b811025ce00401b67e9))
* Poster Image, Preview Thumbnail, and Time Display props ([#598](https://github.com/muxinc/media-chrome/issues/598)) ([7126ddf](https://github.com/muxinc/media-chrome/commit/7126ddffcda160a2c7186d1447be1493caed0bd2))


### BREAKING CHANGES

* removed keys() from AttributeTokenList
* remove `isloading` attribute from media-loading-indicator.
* Change `--media-live-indicator-color` to `--media-live-button-indicator-color`, `--media-time-buffered-color` to `--media-time-range-buffered-color`, `--media-background-position` to `--media-poster-image-background-position`, and `--media-background-size` to `--media-poster-image-background-size`.
* remove defaultshowing attribute from
media-captions-button and media-captions-selectmenu.
* remove MEDIA_CAPTIONS_LIST, MEDIA_CAPTIONS_SHOWING, no-subtitles-fallback, MEDIA_SHOW_CAPTIONS_REQUEST, MEDIA_DISABLE_CAPTIONS_REQUEST, and MEDIA_CAPTIONS_LIST & MEDIA_CAPTIONS_SHOWING change events.



# [0.21.0](https://github.com/muxinc/media-chrome/compare/v0.20.4...v0.21.0) (2023-04-17)


### Bug Fixes

* Automatically serialize arrays as arr.join(' ') for react components ([#527](https://github.com/muxinc/media-chrome/issues/527)) ([c24025c](https://github.com/muxinc/media-chrome/commit/c24025c75c5f2d957b7827d06b9d30a41686c360))
* custom element manifest imports from dist/ ([#521](https://github.com/muxinc/media-chrome/issues/521)) ([32b8149](https://github.com/muxinc/media-chrome/commit/32b8149da9252d699df5ca82a8edd4b29f5638f6))
* font numeric uniform width ([#526](https://github.com/muxinc/media-chrome/issues/526)) ([f31d5a3](https://github.com/muxinc/media-chrome/commit/f31d5a3b7bf28ae92b4b833747ad22d235e9dac5))
* inactive live button ([#535](https://github.com/muxinc/media-chrome/issues/535)) ([8d841ae](https://github.com/muxinc/media-chrome/commit/8d841ae53eeecb8eeb31772f75c8c9ddf061ceb6))
* make DSD (declarative shadow dom) compatible ([#524](https://github.com/muxinc/media-chrome/issues/524)) ([e6105f4](https://github.com/muxinc/media-chrome/commit/e6105f456173225a4f299b2ae6fb4dbf3a4871cf))
* relative src path ([6e45bab](https://github.com/muxinc/media-chrome/commit/6e45bab3e7847a3eed567f57fb093347e44e2b42))


### Features

* introduce a playback rates selectmenu ([#513](https://github.com/muxinc/media-chrome/issues/513)) ([502f83f](https://github.com/muxinc/media-chrome/commit/502f83fa1a9dfc6eabfbe08535fa81097416dbd4))
* remove deprecated, move experimental files ([#525](https://github.com/muxinc/media-chrome/issues/525)) ([13218c0](https://github.com/muxinc/media-chrome/commit/13218c0281a20759c9a352e575249e2a42e911a2))



## [0.20.4](https://github.com/muxinc/media-chrome/compare/v0.20.3...v0.20.4) (2023-04-04)


### Bug Fixes

* media-theme element lazy doc append ([#519](https://github.com/muxinc/media-chrome/issues/519)) ([7efe0e2](https://github.com/muxinc/media-chrome/commit/7efe0e2e3d52a57722d0f3a61fde016d9f40bbdc))



## [0.20.3](https://github.com/muxinc/media-chrome/compare/v0.20.2...v0.20.3) (2023-03-31)


### Bug Fixes

* over firing user-inactive event, attr name ([#515](https://github.com/muxinc/media-chrome/issues/515)) ([26a05f6](https://github.com/muxinc/media-chrome/commit/26a05f6ac4accc47241e17f8c58d1d9269e77722))
* toggle selectmenu via keyboard, hide on click outside of selectmenu ([#514](https://github.com/muxinc/media-chrome/issues/514)) ([df9a50d](https://github.com/muxinc/media-chrome/commit/df9a50d62133d02d53ad749a02e4b801f210d2ef))



## [0.20.2](https://github.com/muxinc/media-chrome/compare/v0.20.1...v0.20.2) (2023-03-30)


### Bug Fixes

* slot for text display, customizable content ([#511](https://github.com/muxinc/media-chrome/issues/511)) ([bf1fc7e](https://github.com/muxinc/media-chrome/commit/bf1fc7ee75f1b638cfa1ceff9c5efa21852ae97f))
* toggle time display on click from remaining / not remaining ([#510](https://github.com/muxinc/media-chrome/issues/510)) ([826131c](https://github.com/muxinc/media-chrome/commit/826131c402b46a70fe33eb7cc967e5b27f5a64ab))



## [0.20.1](https://github.com/muxinc/media-chrome/compare/v0.20.0...v0.20.1) (2023-03-28)


### Bug Fixes

* add support for negations ([#509](https://github.com/muxinc/media-chrome/issues/509)) ([dc1e574](https://github.com/muxinc/media-chrome/commit/dc1e5749e43e9b8fa2220e1c01efe49b8558251b))



# [0.20.0](https://github.com/muxinc/media-chrome/compare/v0.19.1...v0.20.0) (2023-03-27)


### Bug Fixes

* add non-default buttons to Minimal theme ([#507](https://github.com/muxinc/media-chrome/issues/507)) ([bcb218e](https://github.com/muxinc/media-chrome/commit/bcb218efb2e1897d6431bfc0819dd7402a906445))
* add poster slot, media loading indicator to Microvideo ([#505](https://github.com/muxinc/media-chrome/issues/505)) ([6ea6079](https://github.com/muxinc/media-chrome/commit/6ea607921bf682269bd963001f35fa5ccca6506e))
* add style tweaks to Minimal, Microvideo ([#508](https://github.com/muxinc/media-chrome/issues/508)) ([cad6841](https://github.com/muxinc/media-chrome/commit/cad68415b8e8755b5c357984d5baa9385fd3d2d3))


### Features

* Minimal theme ([#492](https://github.com/muxinc/media-chrome/issues/492)) ([cfc84f6](https://github.com/muxinc/media-chrome/commit/cfc84f68057b2140ae942aa447358893f6541836))



## [0.19.1](https://github.com/muxinc/media-chrome/compare/v0.19.0...v0.19.1) (2023-03-20)


### Bug Fixes

* rename Micro to Microvideo ([#504](https://github.com/muxinc/media-chrome/issues/504)) ([ea96595](https://github.com/muxinc/media-chrome/commit/ea9659529e283945e725f2baec4d7ed6bcf75395))



# [0.19.0](https://github.com/muxinc/media-chrome/compare/v0.18.8...v0.19.0) (2023-03-20)


### Bug Fixes

* add disabled styles for Micro theme ([#500](https://github.com/muxinc/media-chrome/issues/500)) ([94ccd2b](https://github.com/muxinc/media-chrome/commit/94ccd2ba6c44e6ee279f4dc5d8527456c5c0ac75))
* add display CSS vars ([#497](https://github.com/muxinc/media-chrome/issues/497)) ([89353e5](https://github.com/muxinc/media-chrome/commit/89353e52c50916de740704dfb7d428727155aca5))
* theme inline-block, improve responsive theme ([#496](https://github.com/muxinc/media-chrome/issues/496)) ([56b549c](https://github.com/muxinc/media-chrome/commit/56b549c0a12cfbccc63555c92eae818ceef1481b))


### Features

* support fetching theme HTML files ([#491](https://github.com/muxinc/media-chrome/issues/491)) ([1457651](https://github.com/muxinc/media-chrome/commit/14576515b5798430c26a58f3046b6efbcd85c2fb))



## [0.18.8](https://github.com/muxinc/media-chrome/compare/v0.18.7...v0.18.8) (2023-03-08)


### Bug Fixes

* preventClick on the button given to selectmenu unconditionally ([#495](https://github.com/muxinc/media-chrome/issues/495)) ([05ed8fb](https://github.com/muxinc/media-chrome/commit/05ed8fb4b3c917807f9e25b87ace5128188d58c7))



## [0.18.7](https://github.com/muxinc/media-chrome/compare/v0.18.6...v0.18.7) (2023-03-08)


### Bug Fixes

* improve inferred media-ui-extension values ([#494](https://github.com/muxinc/media-chrome/issues/494)) ([9028129](https://github.com/muxinc/media-chrome/commit/90281290051c00acc95013ed82c712c77f4229e9))



## [0.18.6](https://github.com/muxinc/media-chrome/compare/v0.18.5...v0.18.6) (2023-03-07)


### Bug Fixes

* add default much used styles to theme ([#490](https://github.com/muxinc/media-chrome/issues/490)) ([bd778fa](https://github.com/muxinc/media-chrome/commit/bd778fac5852f6073de7d3d9da7fd04918e9cb9e))
* **experimental:** media-chrome-selectmenu and media-captions-selectmenu ([#471](https://github.com/muxinc/media-chrome/issues/471)) ([6d6ddc3](https://github.com/muxinc/media-chrome/commit/6d6ddc3ffeff1775751ed9a5ef9b6c13b89754d0))
* nullish coalesce operator, improve process ([#484](https://github.com/muxinc/media-chrome/issues/484)) ([84c3c12](https://github.com/muxinc/media-chrome/commit/84c3c12d446f62a5b275fee24ada8bb6633ca631))



## [0.18.5](https://github.com/muxinc/media-chrome/compare/v0.18.4...v0.18.5) (2023-02-27)


### Bug Fixes

* add --media-range-track-color for track ([862898b](https://github.com/muxinc/media-chrome/commit/862898bdf5516618d1135963df6ca4a8bbfdee7f))
* catch play promise internally ([#479](https://github.com/muxinc/media-chrome/issues/479)) ([c77cd43](https://github.com/muxinc/media-chrome/commit/c77cd431763062520bdfb8db7217f18083ea560d))
* decoupled controller in media-theme ([#459](https://github.com/muxinc/media-chrome/issues/459)) ([3852292](https://github.com/muxinc/media-chrome/commit/385229288fc48f129079641df7423cc156bd4fe9))
* rename live edge override attribute to liveedgeoffset. Code cleanup per PR feedback. ([0edad38](https://github.com/muxinc/media-chrome/commit/0edad38449b816b27d0b960890cc5098df72cc38))
* Use default-stream-type when slotted media streamType is unknown. ([#480](https://github.com/muxinc/media-chrome/issues/480)) ([284443d](https://github.com/muxinc/media-chrome/commit/284443d12c4040365da83d0bf95b52e8c5436331))


### Features

* add Micro theme ([#469](https://github.com/muxinc/media-chrome/issues/469)) ([4181c36](https://github.com/muxinc/media-chrome/commit/4181c36b6a0ed31a26e88e073a99b8d6f54608bd))
* **live-edge-window:** Add basic support for m-ui-e liveEdgeStart proposal. ([1214369](https://github.com/muxinc/media-chrome/commit/12143695f32a6dce894ef2f1f9054e676c2ad01b))
* **media-live-button:** Implement paused behaviors and presentation for component. ([20838e1](https://github.com/muxinc/media-chrome/commit/20838e104d30b56377d3cb97ebf81254a6146099))
* **stream-type:** Add support for m-ui-e streamType proposal. ([50f4a2f](https://github.com/muxinc/media-chrome/commit/50f4a2fbfaf600ca556c997f0140789a27cc3e6a))
* **target-live-window:** Add basic support for m-ui-e targetLiveWindow proposal. ([c450348](https://github.com/muxinc/media-chrome/commit/c450348fe4cd53138c1e255990a03fb4020dd51a))



## [0.18.4](https://github.com/muxinc/media-chrome/compare/v0.18.3...v0.18.4) (2023-02-16)


### Bug Fixes

* create theme template on construction ([#477](https://github.com/muxinc/media-chrome/issues/477)) ([fe1ca19](https://github.com/muxinc/media-chrome/commit/fe1ca19ea29b0a2f1c3a197f609635d36e04c1b9))



## [0.18.3](https://github.com/muxinc/media-chrome/compare/v0.18.2...v0.18.3) (2023-02-16)


### Bug Fixes

* add lazy template prop to theme el ([#474](https://github.com/muxinc/media-chrome/issues/474)) ([9e904ef](https://github.com/muxinc/media-chrome/commit/9e904ef93ac5179047f87264bd4a58d999b32e22))



## [0.18.2](https://github.com/muxinc/media-chrome/compare/v0.18.1...v0.18.2) (2023-02-06)


### Bug Fixes

* **experimental:** media-captions-menu-button relative file locations ([#466](https://github.com/muxinc/media-chrome/issues/466)) ([53c17b1](https://github.com/muxinc/media-chrome/commit/53c17b198a7ec55389d9295253a8673e8bd4ec0a))
* **experimental:** move media-captions-menu-button to experimental folder ([#464](https://github.com/muxinc/media-chrome/issues/464)) ([3ddf3a9](https://github.com/muxinc/media-chrome/commit/3ddf3a904ea6a0fb250253b6c035323e280713fc))



## [0.18.1](https://github.com/muxinc/media-chrome/compare/v0.18.0...v0.18.1) (2023-01-31)


### Bug Fixes

* render on all attr changes, also removal ([#461](https://github.com/muxinc/media-chrome/issues/461)) ([f36b8ce](https://github.com/muxinc/media-chrome/commit/f36b8ce45b72fc226c87cce45235eef408b84461))



# [0.18.0](https://github.com/muxinc/media-chrome/compare/v0.17.1...v0.18.0) (2023-01-30)


### Bug Fixes

* add template caches for partial templates ([bf075c7](https://github.com/muxinc/media-chrome/commit/bf075c77934a1aeb3d216c1c6009880fb28f1a6b))
* add template instance caching in if directive ([2896118](https://github.com/muxinc/media-chrome/commit/289611899aeb07c460a6c7261cf128f62fad7ffd))
* keyDown in listbox should preventDefault, add f,c,k,m to keysUsed of captions-menu-button ([#449](https://github.com/muxinc/media-chrome/issues/449)) ([a6dcbb7](https://github.com/muxinc/media-chrome/commit/a6dcbb71709eba40a066b18018ff38e9ed63fdd0))
* overwrite priority template vars ([0e1be99](https://github.com/muxinc/media-chrome/commit/0e1be996d22e7377652689e696f1cfba3f9cbbee))
* remove `audio` template var ([ee596c4](https://github.com/muxinc/media-chrome/commit/ee596c4b034ea86c22a177189c42161a8fe5cc1d))
* remove old MediaTheme element ([#457](https://github.com/muxinc/media-chrome/issues/457)) ([57277b7](https://github.com/muxinc/media-chrome/commit/57277b769148b0d2ef1af16034ad58afc609debd))
* removing non existing token ([22bc6f5](https://github.com/muxinc/media-chrome/commit/22bc6f5eeb9109a1ab360b104a8a50a2722bbb54))


### Features

* experimental captions menu button fixes ([#442](https://github.com/muxinc/media-chrome/issues/442)) ([bb924c1](https://github.com/muxinc/media-chrome/commit/bb924c1550fc24f4bd060d0f3275637d7187052a))
* **experimental:** expose listbox in menu-button as a part ([#460](https://github.com/muxinc/media-chrome/issues/460)) ([d4bd8da](https://github.com/muxinc/media-chrome/commit/d4bd8da6ab7634ad3626f25d3deb7def0fff4165))



## [0.17.1](https://github.com/muxinc/media-chrome/compare/v0.17.0...v0.17.1) (2023-01-18)


### Bug Fixes

* add `audio` as template param ([8ca0ff6](https://github.com/muxinc/media-chrome/commit/8ca0ff64841d0a146b645df532880c3028be2f7d))
* add `block` attr, joined directive/expression ([fd4ac00](https://github.com/muxinc/media-chrome/commit/fd4ac0028bff38dc7ecc9d6b7c7c77f66937d417))
* add breakpoints config attribute ([2410329](https://github.com/muxinc/media-chrome/commit/2410329dfd9705afd64ac4d06faa03747215efb4))
* add containerSize to template ([008d8d5](https://github.com/muxinc/media-chrome/commit/008d8d5499f1708e95ff8d35cb86519081e1c1f1))
* add easier very large size names ([35bf0c7](https://github.com/muxinc/media-chrome/commit/35bf0c7a6e492386ce04a65b57bf030eaef2a320))
* add greater than, less than operators ([67b389e](https://github.com/muxinc/media-chrome/commit/67b389eaed575e5a20e2f0fb113af9c691297ea7))
* add stream-type to the Media Chrome theme ([4673f3c](https://github.com/muxinc/media-chrome/commit/4673f3ceab7338a1531911f8c8bc6189a6cc44e7))
* adds a 0:00 default time, fixes [#88](https://github.com/muxinc/media-chrome/issues/88) ([#430](https://github.com/muxinc/media-chrome/issues/430)) ([7d49afa](https://github.com/muxinc/media-chrome/commit/7d49afa166b95a148b1591f43819c544c65d9a44))
* allow slotting icons for the captions menu button and captions listbox indicator ([e62ee71](https://github.com/muxinc/media-chrome/commit/e62ee71085d6aa73d689c6cdb0ae257bd20166db))
* blurhash dimensions ([#432](https://github.com/muxinc/media-chrome/issues/432)) ([c88fb04](https://github.com/muxinc/media-chrome/commit/c88fb049bbb170ec81633e5114229c9aee03d752))
* **captions-listbox:** properly handle removing tracks ([9e8dff4](https://github.com/muxinc/media-chrome/commit/9e8dff40b65eb83b44c55846456006d9af84951b))
* **captions-menu-button:** keep menu within the player bounds ([72c7273](https://github.com/muxinc/media-chrome/commit/72c7273f518c3ca027bee6191b3592abee0afb77))
* change to inclusive breakpoints ([d0802b3](https://github.com/muxinc/media-chrome/commit/d0802b3c84274ea6d149f2953db651121a393d76))
* limit checking media-controller attrs ([b06dc9f](https://github.com/muxinc/media-chrome/commit/b06dc9f0bb5c45ae72a7085301406e6eab69589e))
* **listbox:** add hover styles ([d91c88c](https://github.com/muxinc/media-chrome/commit/d91c88c9c260d6360f4ecadd75209528e808ec29))
* **listbox:** improve contrast ratios of listbox colors ([0fd50fd](https://github.com/muxinc/media-chrome/commit/0fd50fd56a8988f688e1b7405624e1c85caca1f5))
* **listbox:** switch to display inline-flex ([2f1d0b8](https://github.com/muxinc/media-chrome/commit/2f1d0b87be63506258a3a9a87e64f5463f08a0b5))
* listitem should get pointer cursor ([8e9301c](https://github.com/muxinc/media-chrome/commit/8e9301cd81ffc996c4e82f5769296e235b0ba163))
* Media Live Button style changes during live window ([#440](https://github.com/muxinc/media-chrome/issues/440)) ([e709e7f](https://github.com/muxinc/media-chrome/commit/e709e7f57fd791295031cc0cc5ecc2935b685038))
* **minimal-slotted-media:** Do not assume media.seekable will be defined on the slotted media. ([65895e9](https://github.com/muxinc/media-chrome/commit/65895e94f46457ebeae71d5b5410ca1d2ea5f855))
* preliminary `media-target-live-window` attr ([c4b2286](https://github.com/muxinc/media-chrome/commit/c4b228632dab7aeb1ef4634a93c5f2641baa5ac9))
* properly select Off item if captions turned off elsewhere ([8a0b139](https://github.com/muxinc/media-chrome/commit/8a0b139419000acea4df9ebeaea1ca9773997f76))
* remove media-container-size from MediaUIAttr ([4027a8d](https://github.com/muxinc/media-chrome/commit/4027a8d105137fbdaecc8bbbdaa3e43fb7b06e83))
* remove unused containerSize ([caa6eeb](https://github.com/muxinc/media-chrome/commit/caa6eeb3cb4381ad75280e6a4820bf6c6f4841b7))
* render undefined param ([69a92fe](https://github.com/muxinc/media-chrome/commit/69a92fe8542fcea23ded95bbd8d697a2dc81156c))
* set font-family on listbox ([80ae206](https://github.com/muxinc/media-chrome/commit/80ae20690ca5b368f60a32871edef1314dba90cd))
* slotted poster is not hidden ([#431](https://github.com/muxinc/media-chrome/issues/431)) ([4a3720e](https://github.com/muxinc/media-chrome/commit/4a3720efec9e3d90afffc2da3162fc0640dce117))
* use `breakpoint-x` and `breakpoints` attrs ([176db3c](https://github.com/muxinc/media-chrome/commit/176db3cde1516dade394c91c4bc98575ab9f32d4))
* use shorthand if/foreach/partial attrs ([6dc3145](https://github.com/muxinc/media-chrome/commit/6dc3145c0f4b20216fd36a6d561c341815a7c98d))
* use textContent.toLowerCase() in listbox for more lenient search ([7d225dd](https://github.com/muxinc/media-chrome/commit/7d225ddc0440d19df06bb8701086a904fe2b27bf))


### Features

* add an Off item to captions-listbox ([f73d784](https://github.com/muxinc/media-chrome/commit/f73d7848de2c75c4e515a7b5ac9a77380f4ab9dd))
* add breakpoint params ([c17bb17](https://github.com/muxinc/media-chrome/commit/c17bb1790d9a440edebd8fa2bcabd8f51bf5d52f))
* add default styles to listbox and listitem ([9eace4a](https://github.com/muxinc/media-chrome/commit/9eace4a10b3dfd4ac73730992205def13255ce92))
* container-size attr w/ premeditated naming ([cfc43d6](https://github.com/muxinc/media-chrome/commit/cfc43d630ba51d4ba444bbabd0019bd8a15a830d))
* media-captions-menu-button ([178b655](https://github.com/muxinc/media-chrome/commit/178b65514be95e22d92be31253e304b2b8845ee4))



# [0.17.0](https://github.com/muxinc/media-chrome/compare/v0.16.3...v0.17.0) (2023-01-06)


### Bug Fixes

* **configurable-fullscreen-element:** Ignore misleading typescript error. ([71ad4e3](https://github.com/muxinc/media-chrome/commit/71ad4e3854715d6555aaa4750b9ff428f7399394))
* remove unused property ([#413](https://github.com/muxinc/media-chrome/issues/413)) ([2beac41](https://github.com/muxinc/media-chrome/commit/2beac41071147bf191626275fb095d6e96305469))
* remove web component class globals ([5c7acfb](https://github.com/muxinc/media-chrome/commit/5c7acfbdd0998f6b18e8dc2c01006abfa8ce7b58)), closes [#252](https://github.com/muxinc/media-chrome/issues/252)
* use npx if needed for docs build ([a28b60a](https://github.com/muxinc/media-chrome/commit/a28b60a98761a64c53ac8dea7a40de06276eef05))


### Features

* **configurable-full-screen:** Add an example taking advantage of configurable fullscreen target. ([8c2e3d5](https://github.com/muxinc/media-chrome/commit/8c2e3d51ed5fcf7971f3c40d40bd2a57ef8ebb03))
* **configurable-fullscreen-element:** Allow Media Controller to target a fullscreenElement other than itself. ([817408e](https://github.com/muxinc/media-chrome/commit/817408e3cee538f9c0bad6721aaec21904392a1b))
* **configurable-fullscreen-element:** Handle shadow DOM + fullscreen-element id cases better ([d0cb339](https://github.com/muxinc/media-chrome/commit/d0cb3397c71fb24d685370394f68e0bc000b4a6c))
* **configurable-fullscreen-element:** Keep parity between attribute and prop for fullscreen element, per PR feedback/discussion. ([fb4f38b](https://github.com/muxinc/media-chrome/commit/fb4f38b3f6ff1573bd93f6a572ba03d9279b16ce))



## [0.16.3](https://github.com/muxinc/media-chrome/compare/v0.16.2...v0.16.3) (2023-01-03)


### Bug Fixes

* **example:** captions listbox example should point at the correct vtt files ([5be0fc3](https://github.com/muxinc/media-chrome/commit/5be0fc3c2ccb76fda12c27e910766ab1c28392cc))
* listbox should aria-selected the default selection ([9052072](https://github.com/muxinc/media-chrome/commit/9052072d1c31f55ad2b8fe097bd32ce1cab55c71))
* **listbox:** do a null check for default selected element ([c4d4f6d](https://github.com/muxinc/media-chrome/commit/c4d4f6d39465f521a830d8155a71442d7c4ce8cf))
* no need for rounding anymore, step=any ([011940c](https://github.com/muxinc/media-chrome/commit/011940c61c2bde67160b7750cca65251e7ead598)), closes [#394](https://github.com/muxinc/media-chrome/issues/394)


### Features

* listbox should support slotting a slot el ([563a453](https://github.com/muxinc/media-chrome/commit/563a453c8072dac503bb3f7718b76b8f8afa54f1))
* media-chrome-menu-button ([0b4d625](https://github.com/muxinc/media-chrome/commit/0b4d6259eaef3ff4c2720cdeba29c8a052105023))


### Reverts

* Revert "Winamp theme checks (#403)" ([9605f02](https://github.com/muxinc/media-chrome/commit/9605f02184efd79b62a9f317dddb1be824f0f916)), closes [#403](https://github.com/muxinc/media-chrome/issues/403)
* Revert "example: add Winamp theme (#401)" ([7836b25](https://github.com/muxinc/media-chrome/commit/7836b252fd2b30ab7e6a8166b89ecc7f283ec25d)), closes [#401](https://github.com/muxinc/media-chrome/issues/401)



## [0.16.2](https://github.com/muxinc/media-chrome/compare/v0.16.1...v0.16.2) (2022-12-13)


### Bug Fixes

* add listbox role on listbox element itself ([92e702f](https://github.com/muxinc/media-chrome/commit/92e702f56235d60af9898543eccafd7db3f19c06))
* lint errors and add to CI/CD ([c571239](https://github.com/muxinc/media-chrome/commit/c571239d9ec8a52324269a24017c12e13e48dabc))
* listbox may not have a nextOption ([50d92a3](https://github.com/muxinc/media-chrome/commit/50d92a3f713ddc62da80f988e250b6af5a4576c9))
* MEDIA_CONTROLLER moved to MediaStateReceiverAttributes ([9eb52c3](https://github.com/muxinc/media-chrome/commit/9eb52c3f70407cd51da7887e9e5f9a48a0f804d6))
* remove Demuxed theme 2022 from MC bundle ([33d697c](https://github.com/muxinc/media-chrome/commit/33d697cdde818193dcb40a37fc0f31e010a7ffed))
* typescript errors ([983ed78](https://github.com/muxinc/media-chrome/commit/983ed78b7ffc411382b8411f110d9da1046cc2d6))
* use new MediaThemeElement for Demuxed theme ([4a9327b](https://github.com/muxinc/media-chrome/commit/4a9327bbaf9c54f80d5bdc25dfefbd4fd95f469c))


### Features

* add a selectedOptions getter to listbox ([3629c87](https://github.com/muxinc/media-chrome/commit/3629c87e19aa284fddf036354ad9e701847fc6f3))
* add change event to listbox ([4ddb26e](https://github.com/muxinc/media-chrome/commit/4ddb26e6f35255f4c1bf912c985a89d08d68b417))
* add value prop/attr to listitem ([542ae92](https://github.com/muxinc/media-chrome/commit/542ae92de2cf13ef7bb76b2e2b8c8625dfe759bd))
* Captions/Subtitles List ([d12f6fb](https://github.com/muxinc/media-chrome/commit/d12f6fb7d226b4a47a5d29703b6e7a2c3fd9cc2c))



## [0.16.1](https://github.com/muxinc/media-chrome/compare/v0.16.0...v0.16.1) (2022-12-06)


### Bug Fixes

* add a way to package media themes as web comp ([#375](https://github.com/muxinc/media-chrome/issues/375)) ([6857ee6](https://github.com/muxinc/media-chrome/commit/6857ee6f2b1604321b82a19688bbcafa840cf5cb))
* improve CPU usage while playback ([#364](https://github.com/muxinc/media-chrome/issues/364)) ([fae329f](https://github.com/muxinc/media-chrome/commit/fae329f8290b0216584a4e0f3c7fdb114835c560))
* inner template bug ([#381](https://github.com/muxinc/media-chrome/issues/381)) ([e20953a](https://github.com/muxinc/media-chrome/commit/e20953a4d8cdbaca5e04dcc6fbd6d6a0b5f6dbff))
* utils clean up w/ added tests ([#373](https://github.com/muxinc/media-chrome/issues/373)) ([a7db995](https://github.com/muxinc/media-chrome/commit/a7db995b2c720bb401ac877fc95c6c323f889f62))


### Features

* Add HTML based Theme w/ minimal template language ([#362](https://github.com/muxinc/media-chrome/issues/362)) ([a4a4e2c](https://github.com/muxinc/media-chrome/commit/a4a4e2c20782926c0eaaaf16788f35e3af833b69))
* add simple responsive theme ([684ddef](https://github.com/muxinc/media-chrome/commit/684ddefb3aaec463c2041e0e6bb2650538896dc7))
* expose types ([#330](https://github.com/muxinc/media-chrome/issues/330)) ([5ae159f](https://github.com/muxinc/media-chrome/commit/5ae159f30e4c814cb910b64b12df30dd47254655))
* listbox and listitem components ([#365](https://github.com/muxinc/media-chrome/issues/365)) ([15d0934](https://github.com/muxinc/media-chrome/commit/15d0934fcd112de39b2d830eb78f7cfc0518c686))
* use Construcable CSSStyleSheets when available ([eb32514](https://github.com/muxinc/media-chrome/commit/eb32514f99d477d3bfc2260da65a8c0f101d38ed))


### Reverts

* undo changes to media-theme.js ([c565bc9](https://github.com/muxinc/media-chrome/commit/c565bc9b3a476542ddf49fe1df0a8209e4e43935))



# [0.16.0](https://github.com/muxinc/media-chrome/compare/v0.15.1...v0.16.0) (2022-10-28)


### Bug Fixes

* box percentage positioning & time range border glitch ([#345](https://github.com/muxinc/media-chrome/issues/345)) ([57f1023](https://github.com/muxinc/media-chrome/commit/57f1023fa2e7d3b20b76b07b1ae45218e99360d7))



## [0.15.1](https://github.com/muxinc/media-chrome/compare/v0.15.0...v0.15.1) (2022-10-25)


### Bug Fixes

* use composedPath for checking target in schedule inactive event handler ([#355](https://github.com/muxinc/media-chrome/issues/355)) ([c44711d](https://github.com/muxinc/media-chrome/commit/c44711d131dec5ad6981c838a17f9738f74a00d9))



# [0.15.0](https://github.com/muxinc/media-chrome/compare/v0.14.1...v0.15.0) (2022-10-25)


### Bug Fixes

* clicking in play/fullscreen buttons should schedule inactive ([#338](https://github.com/muxinc/media-chrome/issues/338)) ([0b640d0](https://github.com/muxinc/media-chrome/commit/0b640d03a665a113017a3bf8f050c787e2829434)), closes [#188](https://github.com/muxinc/media-chrome/issues/188)
* preview bounds in shadow dom ([#342](https://github.com/muxinc/media-chrome/issues/342)) ([e0b5fa9](https://github.com/muxinc/media-chrome/commit/e0b5fa98378a297042cc957acbc47e67f8acb582))


### Features

* remove esm-module ([#352](https://github.com/muxinc/media-chrome/issues/352)) ([921eda8](https://github.com/muxinc/media-chrome/commit/921eda86043b2fdd76e8bb2974b815103f05bf99))



## [0.14.1](https://github.com/muxinc/media-chrome/compare/v0.14.0...v0.14.1) (2022-10-14)


### Bug Fixes

* call disable on disconnectedCallback ([35f1242](https://github.com/muxinc/media-chrome/commit/35f1242f7affc4e3534e656a82ce6d143200f879))
* don't set attributes in a constructor ([433560e](https://github.com/muxinc/media-chrome/commit/433560e2327f6a136b38cbf8cc64bba9451097c8)), closes [#335](https://github.com/muxinc/media-chrome/issues/335)



# [0.14.0](https://github.com/muxinc/media-chrome/compare/v0.12.0...v0.14.0) (2022-10-10)


### Bug Fixes

* a couple of fixes ([#331](https://github.com/muxinc/media-chrome/issues/331)) ([f4df42f](https://github.com/muxinc/media-chrome/commit/f4df42fb66ff33f40cc1937905f5933bec75aa38))
* properly check iphones for fullscreen unavailability ([#332](https://github.com/muxinc/media-chrome/issues/332)) ([c32c74e](https://github.com/muxinc/media-chrome/commit/c32c74ebf73219919bd96a15796ea008884cd600))
* properly unset poster image sources when they're removed ([#328](https://github.com/muxinc/media-chrome/issues/328)) ([87daae5](https://github.com/muxinc/media-chrome/commit/87daae56b9816818918b7d980e41b780caefbe8c))


### Features

* add poster object fit and position css vars ([#327](https://github.com/muxinc/media-chrome/issues/327)) ([a02bf20](https://github.com/muxinc/media-chrome/commit/a02bf20070a9462d0e085bec90f8c97a295ba4df))



# [0.12.0](https://github.com/muxinc/media-chrome/compare/v0.11.0...v0.12.0) (2022-09-27)


### Bug Fixes

* Safari still uses webkitFullscreenEnabled ([#316](https://github.com/muxinc/media-chrome/issues/316)) ([3850429](https://github.com/muxinc/media-chrome/commit/3850429b2c04327290acb7cbb103c76b8303f502))


### Features

* remove minify/srcmap esm/cjs, add esm-module ([#318](https://github.com/muxinc/media-chrome/issues/318)) ([5ea0d24](https://github.com/muxinc/media-chrome/commit/5ea0d24bc18de58587b8f90137f72cfde585879f))
* support being able to disable buttons, range, and time-display ([#320](https://github.com/muxinc/media-chrome/issues/320)) ([d4129c2](https://github.com/muxinc/media-chrome/commit/d4129c2ee6ef79fafff440e0ba7b3bf9dff55a07))



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



## [0.10.2](https://github.com/muxinc/media-chrome/compare/v0.10.0...v0.10.2) (2022-09-09)


### Bug Fixes

* prevent hotkeys from scrolling page ([#296](https://github.com/muxinc/media-chrome/issues/296)) ([34b9882](https://github.com/muxinc/media-chrome/commit/34b9882f9b5c18fbc659383871e4ea9357be6e1a)), closes [#295](https://github.com/muxinc/media-chrome/issues/295)



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



## [0.8.1](https://github.com/muxinc/media-chrome/compare/v0.6.8...v0.8.1) (2022-07-18)


### Bug Fixes

* audio examples, spotify example ([#265](https://github.com/muxinc/media-chrome/issues/265)) ([128d5c7](https://github.com/muxinc/media-chrome/commit/128d5c780d3238b314ba10b906a9c3890180a8a7))
* box bounds element type error ([6b61552](https://github.com/muxinc/media-chrome/commit/6b615523bce9d3807432563952d90c2dde0e6324))
* cast availability ([#251](https://github.com/muxinc/media-chrome/issues/251)) ([97d20f7](https://github.com/muxinc/media-chrome/commit/97d20f77dc2ef6b648371dd36fa3920dce77f1a1))
* casting state on new cast-button ([fd51440](https://github.com/muxinc/media-chrome/commit/fd514400bf14e3bd3ea895d4ca4c51acd5f9147d))
* chrome-button focus ring consistency ([9d83108](https://github.com/muxinc/media-chrome/commit/9d83108204bc2246ad3648fb8bd6b6c9ffd7c52d))
* focus ring on chrome-range input element ([a1899e9](https://github.com/muxinc/media-chrome/commit/a1899e9c402c9449c3aaee6a67ca1e770dfbb1de))
* have improved styling with host-context and chrome-range ([335b875](https://github.com/muxinc/media-chrome/commit/335b875c845b2a8ce72486c11598dd7f0f663735))
* hide gesture-layer when in audio mode ([77f7005](https://github.com/muxinc/media-chrome/commit/77f70054f3e8d08a194b7e2c64ccd8cbbc792c66))
* mediaControllerId var bug ([b5faf44](https://github.com/muxinc/media-chrome/commit/b5faf44e3446fcd34416c7b522a6b8d15db21e20))
* reset playbackRate UI after loadstart ([#249](https://github.com/muxinc/media-chrome/issues/249)) ([59f4ed4](https://github.com/muxinc/media-chrome/commit/59f4ed40dd04f7711b856a01e0fe5fa43474f1ae))
* style override from Tailwind CSS ([7590ffb](https://github.com/muxinc/media-chrome/commit/7590ffb1980172d047e6e34999230c035dbc6a2c)), closes [#262](https://github.com/muxinc/media-chrome/issues/262)
* text-display should have consistent focus ring to chrome-button ([f1bad34](https://github.com/muxinc/media-chrome/commit/f1bad345b9fd782f0449f97f48d708c234357447))
* timerange progress jumpy w/out playback rate ([2b2d360](https://github.com/muxinc/media-chrome/commit/2b2d360cd9b6f9d08068c00869c95ea1b2ff68de))


### Features

* improve time range behavior ([#255](https://github.com/muxinc/media-chrome/issues/255)) ([2aa7223](https://github.com/muxinc/media-chrome/commit/2aa7223977a1f8106807d26852b0108efd9aaa4e))



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



## [1.1.1](https://github.com/muxinc/media-chrome/compare/v1.1.0...v1.1.1) (2023-06-23)


### Bug Fixes

* time range preview and value inconsistency ([#670](https://github.com/muxinc/media-chrome/issues/670)) ([4f58bf1](https://github.com/muxinc/media-chrome/commit/4f58bf1479ed8dc89fd49906cba87412ca34b02b))



# [1.1.0](https://github.com/muxinc/media-chrome/compare/v1.0.0...v1.1.0) (2023-06-12)


### Bug Fixes

* Handle visualization in media-time-range for cases where media has ended. ([#667](https://github.com/muxinc/media-chrome/issues/667)) ([924aa20](https://github.com/muxinc/media-chrome/commit/924aa20e3a84a815065f3d7f2768f80662f96fee))
* media state change events ([#666](https://github.com/muxinc/media-chrome/issues/666)) ([05999ae](https://github.com/muxinc/media-chrome/commit/05999ae60e0dfca323adebaeff6be0092ee8c39b))


### Features

* add `backdrop-filter` to range track & bg ([#658](https://github.com/muxinc/media-chrome/issues/658)) ([3590497](https://github.com/muxinc/media-chrome/commit/3590497e4174d97055b57b6455da6de1887b7d37))



# [1.0.0](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.5...v1.0.0) (2023-05-30)


### Features

* icon slots for single slot controls ([#645](https://github.com/muxinc/media-chrome/issues/645)) ([17869cb](https://github.com/muxinc/media-chrome/commit/17869cb1172ee646f1219b6a403361101a281de8))


### BREAKING CHANGES

* Icon slots have been renamed to "icon" for Airplay, Seek Forward, Seek Backward, and Loading Indicator controls.



# [1.0.0-rc.5](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.4...v1.0.0-rc.5) (2023-05-26)


### Bug Fixes

* media display override issue ([#648](https://github.com/muxinc/media-chrome/issues/648)) ([dfc6a13](https://github.com/muxinc/media-chrome/commit/dfc6a13e46c2beb9f54511581e5ad5c281e592c0))


### Features

* Icon slots for buttons with multiple slots ([#643](https://github.com/muxinc/media-chrome/issues/643)) ([53e7aad](https://github.com/muxinc/media-chrome/commit/53e7aade3e2eb99481529e75b5e12e9f3cc0d0fa))



# [1.0.0-rc.4](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2023-05-23)


### Bug Fixes

* fullscreen state getter w/o event ([#634](https://github.com/muxinc/media-chrome/issues/634)) ([2dba034](https://github.com/muxinc/media-chrome/commit/2dba03418341988b56ba7c433b81142e6d1d2141)), closes [#627](https://github.com/muxinc/media-chrome/issues/627)
* Make sure we monitor slotchange on slots for media state receive… ([#639](https://github.com/muxinc/media-chrome/issues/639)) ([6710381](https://github.com/muxinc/media-chrome/commit/671038123e629ddbac79f17d99a3c80728568eab))



# [1.0.0-rc.3](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2023-05-22)


### Bug Fixes

* iOS fullscreen state bug ([#633](https://github.com/muxinc/media-chrome/issues/633)) ([505e0d1](https://github.com/muxinc/media-chrome/commit/505e0d15bffbe2bc63691f163c0538b879cd43e8)), closes [#593](https://github.com/muxinc/media-chrome/issues/593)


### Features

* add icon slot to mute button ([#629](https://github.com/muxinc/media-chrome/issues/629)) ([41169a0](https://github.com/muxinc/media-chrome/commit/41169a065742379e28152b6a32a795e2db47dd4d))
* add mediaended attr to play button ([#630](https://github.com/muxinc/media-chrome/issues/630)) ([3141864](https://github.com/muxinc/media-chrome/commit/3141864deeb651fcbcbd2cc1bfe133e356efb1f6))



# [1.0.0-rc.2](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2023-05-16)


### Bug Fixes

* Missing parenthesis in control bar style ([#626](https://github.com/muxinc/media-chrome/issues/626)) ([76a1c8f](https://github.com/muxinc/media-chrome/commit/76a1c8fadc90ab11dae14f27f3cc61eb87e53cef))



# [1.0.0-rc.1](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2023-05-15)


### Bug Fixes

* Update official themes to use lowercase attrs consistently. ([#623](https://github.com/muxinc/media-chrome/issues/623)) ([5d62f93](https://github.com/muxinc/media-chrome/commit/5d62f93b2d78dcb1eba5fb7b1e83434d73e3ce11))



# [1.0.0-rc.0](https://github.com/muxinc/media-chrome/compare/v0.21.0...v1.0.0-rc.0) (2023-05-12)


### Bug Fixes

* add default unavailable CSS to themes ([#539](https://github.com/muxinc/media-chrome/issues/539)) ([f9c5a9e](https://github.com/muxinc/media-chrome/commit/f9c5a9e921cca14a4e8858fcbdd234de4286c64a))
* Better color contrast on breakpoint docs ([#614](https://github.com/muxinc/media-chrome/issues/614)) ([d869d73](https://github.com/muxinc/media-chrome/commit/d869d73a407fd5620fc2bf16f31665d0bd0f6553))
* buffered attr ([#544](https://github.com/muxinc/media-chrome/issues/544)) ([7efe18a](https://github.com/muxinc/media-chrome/commit/7efe18ac00fc84648e417d23ebcaf643b2c4fae3))
* casting ([#618](https://github.com/muxinc/media-chrome/issues/618)) ([106e3dd](https://github.com/muxinc/media-chrome/commit/106e3ddb1ab3c12619b09b2d240a2691745aeea3))
* Comparison of text track lists ([#600](https://github.com/muxinc/media-chrome/issues/600)) ([87daf00](https://github.com/muxinc/media-chrome/commit/87daf00d5c1fabf0c66cf97ef63beae328d8986c))
* css variables consistency updates ([#554](https://github.com/muxinc/media-chrome/issues/554)) ([f2876db](https://github.com/muxinc/media-chrome/commit/f2876db9b864256fa7419d5ab595ad026ef69161))
* dash in breakpoint attr ([#540](https://github.com/muxinc/media-chrome/issues/540)) ([23c2de9](https://github.com/muxinc/media-chrome/commit/23c2de9dbf8fb07c609af23ba06d3a11f76f390a))
* don't auto-size ranges in media-control-bar if they're all alone. ([#591](https://github.com/muxinc/media-chrome/issues/591)) ([276b96d](https://github.com/muxinc/media-chrome/commit/276b96de8fbf3ad1e4ea4384253e57f08395067a))
* forward button ([#605](https://github.com/muxinc/media-chrome/issues/605)) ([4c81eed](https://github.com/muxinc/media-chrome/commit/4c81eed5b1562a2af0008baeeffeff778186313c))
* Let media-control-bar size (height) range components like it doe… ([#582](https://github.com/muxinc/media-chrome/issues/582)) ([d1a65da](https://github.com/muxinc/media-chrome/commit/d1a65da3afdc94b6e19da68f3298d1e26b0b60e6))
* selectmenu mediacontroller and missed examples from first pass. ([#541](https://github.com/muxinc/media-chrome/issues/541)) ([2ab9032](https://github.com/muxinc/media-chrome/commit/2ab90323a1bd20f3456e95e1567b379e5e7373b4))
* show chrome on pointermove for custom video ([#604](https://github.com/muxinc/media-chrome/issues/604)) ([de8035b](https://github.com/muxinc/media-chrome/commit/de8035bc5cf44c83192d0d6ad0eaef1bfa406648)), closes [#451](https://github.com/muxinc/media-chrome/issues/451) [#298](https://github.com/muxinc/media-chrome/issues/298)
* show pointer for theme toggle icons ([#611](https://github.com/muxinc/media-chrome/issues/611)) ([71358ce](https://github.com/muxinc/media-chrome/commit/71358ceb2f2d1e3a0300d1bfe7628820e5e1764d))
* use default values in new prop getters for seek btns. Use props … ([#592](https://github.com/muxinc/media-chrome/issues/592)) ([c843a5e](https://github.com/muxinc/media-chrome/commit/c843a5e3ea7da70becb9b0516cb51c4c2b51bc30))


### Features

* add defaultsubtitles to media-controller ([#551](https://github.com/muxinc/media-chrome/issues/551)) ([fdbc8c7](https://github.com/muxinc/media-chrome/commit/fdbc8c7719b5e54086ae12954b6d59fbd1c33021))
* add novolumepref attribute to prefer writing to localStorage ([#575](https://github.com/muxinc/media-chrome/issues/575)) ([31bdb11](https://github.com/muxinc/media-chrome/commit/31bdb1188236e0411e15f284554604f03d2b1a4b))
* Add props and types to seek forwards and backwards elements ([#566](https://github.com/muxinc/media-chrome/issues/566)) ([0259c3a](https://github.com/muxinc/media-chrome/commit/0259c3abaa578444456e62f391d8e5a7a586d0e1))
* Adding custom event for breakingpoint changing ([#584](https://github.com/muxinc/media-chrome/issues/584)) ([1cf3579](https://github.com/muxinc/media-chrome/commit/1cf3579123ba4de59a5a70fed4d89637d7652a09))
* Airplay, Captions, and Cast button props ([#587](https://github.com/muxinc/media-chrome/issues/587)) ([14156f7](https://github.com/muxinc/media-chrome/commit/14156f77e9de73884cb23f9e748227a9f1659157))
* combine MEDIA_CAPTIONS_LIST into MEDIA_SUBTITLES_LIST ([#546](https://github.com/muxinc/media-chrome/issues/546)) ([03e62e6](https://github.com/muxinc/media-chrome/commit/03e62e616b2f7bef46b1331079421fa5f17736d1))
* Drop all deprecated or redundant components. Update tests, examples, docs, etc. based on changes. ([#560](https://github.com/muxinc/media-chrome/issues/560)) ([20fca8c](https://github.com/muxinc/media-chrome/commit/20fca8cf4253482d93608b1c6edc728aa6819375))
* Duration, Fullscreen, and Gesture props ([#595](https://github.com/muxinc/media-chrome/issues/595)) ([748c013](https://github.com/muxinc/media-chrome/commit/748c01315f5654eb21487418c9cf216f8d53eee3))
* fix casing in attributes and vars ([#606](https://github.com/muxinc/media-chrome/issues/606)) ([502fff5](https://github.com/muxinc/media-chrome/commit/502fff531df28da43451e166ba710c59d7f43a5b))
* Live Button and Mute button props ([#596](https://github.com/muxinc/media-chrome/issues/596)) ([d6b5ad6](https://github.com/muxinc/media-chrome/commit/d6b5ad6b7f61cc60d989f4ea591707dbc8433683))
* Media Time Range and Volume Range props ([#599](https://github.com/muxinc/media-chrome/issues/599)) ([61d6ddd](https://github.com/muxinc/media-chrome/commit/61d6dddf5dc140cb91007c80713b44aa39c3d352))
* Migrate all attributes to lowercase ('smushedcase'). ([#537](https://github.com/muxinc/media-chrome/issues/537)) ([fe9eadc](https://github.com/muxinc/media-chrome/commit/fe9eadc98af47752cc7b362379cd3fc4f24e5a14))
* move loading-indicator visibility to be done in CSS only ([#586](https://github.com/muxinc/media-chrome/issues/586)) ([0d989b3](https://github.com/muxinc/media-chrome/commit/0d989b34e46f36af3fb2fe017b026932eec13f95))
* Pip button, Play button, and Playback Rates props ([#597](https://github.com/muxinc/media-chrome/issues/597)) ([3d96b16](https://github.com/muxinc/media-chrome/commit/3d96b16deeb90b9961582b811025ce00401b67e9))
* Poster Image, Preview Thumbnail, and Time Display props ([#598](https://github.com/muxinc/media-chrome/issues/598)) ([7126ddf](https://github.com/muxinc/media-chrome/commit/7126ddffcda160a2c7186d1447be1493caed0bd2))


### BREAKING CHANGES

* removed keys() from AttributeTokenList
* remove `isloading` attribute from media-loading-indicator.
* Change `--media-live-indicator-color` to `--media-live-button-indicator-color`, `--media-time-buffered-color` to `--media-time-range-buffered-color`, `--media-background-position` to `--media-poster-image-background-position`, and `--media-background-size` to `--media-poster-image-background-size`.
* remove defaultshowing attribute from
media-captions-button and media-captions-selectmenu.
* remove MEDIA_CAPTIONS_LIST, MEDIA_CAPTIONS_SHOWING, no-subtitles-fallback, MEDIA_SHOW_CAPTIONS_REQUEST, MEDIA_DISABLE_CAPTIONS_REQUEST, and MEDIA_CAPTIONS_LIST & MEDIA_CAPTIONS_SHOWING change events.



# [0.21.0](https://github.com/muxinc/media-chrome/compare/v0.20.4...v0.21.0) (2023-04-17)


### Bug Fixes

* Automatically serialize arrays as arr.join(' ') for react components ([#527](https://github.com/muxinc/media-chrome/issues/527)) ([c24025c](https://github.com/muxinc/media-chrome/commit/c24025c75c5f2d957b7827d06b9d30a41686c360))
* custom element manifest imports from dist/ ([#521](https://github.com/muxinc/media-chrome/issues/521)) ([32b8149](https://github.com/muxinc/media-chrome/commit/32b8149da9252d699df5ca82a8edd4b29f5638f6))
* font numeric uniform width ([#526](https://github.com/muxinc/media-chrome/issues/526)) ([f31d5a3](https://github.com/muxinc/media-chrome/commit/f31d5a3b7bf28ae92b4b833747ad22d235e9dac5))
* inactive live button ([#535](https://github.com/muxinc/media-chrome/issues/535)) ([8d841ae](https://github.com/muxinc/media-chrome/commit/8d841ae53eeecb8eeb31772f75c8c9ddf061ceb6))
* make DSD (declarative shadow dom) compatible ([#524](https://github.com/muxinc/media-chrome/issues/524)) ([e6105f4](https://github.com/muxinc/media-chrome/commit/e6105f456173225a4f299b2ae6fb4dbf3a4871cf))
* relative src path ([6e45bab](https://github.com/muxinc/media-chrome/commit/6e45bab3e7847a3eed567f57fb093347e44e2b42))


### Features

* introduce a playback rates selectmenu ([#513](https://github.com/muxinc/media-chrome/issues/513)) ([502f83f](https://github.com/muxinc/media-chrome/commit/502f83fa1a9dfc6eabfbe08535fa81097416dbd4))
* remove deprecated, move experimental files ([#525](https://github.com/muxinc/media-chrome/issues/525)) ([13218c0](https://github.com/muxinc/media-chrome/commit/13218c0281a20759c9a352e575249e2a42e911a2))



## [0.20.4](https://github.com/muxinc/media-chrome/compare/v0.20.3...v0.20.4) (2023-04-04)


### Bug Fixes

* media-theme element lazy doc append ([#519](https://github.com/muxinc/media-chrome/issues/519)) ([7efe0e2](https://github.com/muxinc/media-chrome/commit/7efe0e2e3d52a57722d0f3a61fde016d9f40bbdc))



## [0.20.3](https://github.com/muxinc/media-chrome/compare/v0.20.2...v0.20.3) (2023-03-31)


### Bug Fixes

* over firing user-inactive event, attr name ([#515](https://github.com/muxinc/media-chrome/issues/515)) ([26a05f6](https://github.com/muxinc/media-chrome/commit/26a05f6ac4accc47241e17f8c58d1d9269e77722))
* toggle selectmenu via keyboard, hide on click outside of selectmenu ([#514](https://github.com/muxinc/media-chrome/issues/514)) ([df9a50d](https://github.com/muxinc/media-chrome/commit/df9a50d62133d02d53ad749a02e4b801f210d2ef))



## [0.20.2](https://github.com/muxinc/media-chrome/compare/v0.20.1...v0.20.2) (2023-03-30)


### Bug Fixes

* slot for text display, customizable content ([#511](https://github.com/muxinc/media-chrome/issues/511)) ([bf1fc7e](https://github.com/muxinc/media-chrome/commit/bf1fc7ee75f1b638cfa1ceff9c5efa21852ae97f))
* toggle time display on click from remaining / not remaining ([#510](https://github.com/muxinc/media-chrome/issues/510)) ([826131c](https://github.com/muxinc/media-chrome/commit/826131c402b46a70fe33eb7cc967e5b27f5a64ab))



## [0.20.1](https://github.com/muxinc/media-chrome/compare/v0.20.0...v0.20.1) (2023-03-28)


### Bug Fixes

* add support for negations ([#509](https://github.com/muxinc/media-chrome/issues/509)) ([dc1e574](https://github.com/muxinc/media-chrome/commit/dc1e5749e43e9b8fa2220e1c01efe49b8558251b))



# [0.20.0](https://github.com/muxinc/media-chrome/compare/v0.19.1...v0.20.0) (2023-03-27)


### Bug Fixes

* add non-default buttons to Minimal theme ([#507](https://github.com/muxinc/media-chrome/issues/507)) ([bcb218e](https://github.com/muxinc/media-chrome/commit/bcb218efb2e1897d6431bfc0819dd7402a906445))
* add poster slot, media loading indicator to Microvideo ([#505](https://github.com/muxinc/media-chrome/issues/505)) ([6ea6079](https://github.com/muxinc/media-chrome/commit/6ea607921bf682269bd963001f35fa5ccca6506e))
* add style tweaks to Minimal, Microvideo ([#508](https://github.com/muxinc/media-chrome/issues/508)) ([cad6841](https://github.com/muxinc/media-chrome/commit/cad68415b8e8755b5c357984d5baa9385fd3d2d3))


### Features

* Minimal theme ([#492](https://github.com/muxinc/media-chrome/issues/492)) ([cfc84f6](https://github.com/muxinc/media-chrome/commit/cfc84f68057b2140ae942aa447358893f6541836))



## [0.19.1](https://github.com/muxinc/media-chrome/compare/v0.19.0...v0.19.1) (2023-03-20)


### Bug Fixes

* rename Micro to Microvideo ([#504](https://github.com/muxinc/media-chrome/issues/504)) ([ea96595](https://github.com/muxinc/media-chrome/commit/ea9659529e283945e725f2baec4d7ed6bcf75395))



# [0.19.0](https://github.com/muxinc/media-chrome/compare/v0.18.8...v0.19.0) (2023-03-20)


### Bug Fixes

* add disabled styles for Micro theme ([#500](https://github.com/muxinc/media-chrome/issues/500)) ([94ccd2b](https://github.com/muxinc/media-chrome/commit/94ccd2ba6c44e6ee279f4dc5d8527456c5c0ac75))
* add display CSS vars ([#497](https://github.com/muxinc/media-chrome/issues/497)) ([89353e5](https://github.com/muxinc/media-chrome/commit/89353e52c50916de740704dfb7d428727155aca5))
* theme inline-block, improve responsive theme ([#496](https://github.com/muxinc/media-chrome/issues/496)) ([56b549c](https://github.com/muxinc/media-chrome/commit/56b549c0a12cfbccc63555c92eae818ceef1481b))


### Features

* support fetching theme HTML files ([#491](https://github.com/muxinc/media-chrome/issues/491)) ([1457651](https://github.com/muxinc/media-chrome/commit/14576515b5798430c26a58f3046b6efbcd85c2fb))



## [0.18.8](https://github.com/muxinc/media-chrome/compare/v0.18.7...v0.18.8) (2023-03-08)


### Bug Fixes

* preventClick on the button given to selectmenu unconditionally ([#495](https://github.com/muxinc/media-chrome/issues/495)) ([05ed8fb](https://github.com/muxinc/media-chrome/commit/05ed8fb4b3c917807f9e25b87ace5128188d58c7))



## [0.18.7](https://github.com/muxinc/media-chrome/compare/v0.18.6...v0.18.7) (2023-03-08)


### Bug Fixes

* improve inferred media-ui-extension values ([#494](https://github.com/muxinc/media-chrome/issues/494)) ([9028129](https://github.com/muxinc/media-chrome/commit/90281290051c00acc95013ed82c712c77f4229e9))



## [0.18.6](https://github.com/muxinc/media-chrome/compare/v0.18.5...v0.18.6) (2023-03-07)


### Bug Fixes

* add default much used styles to theme ([#490](https://github.com/muxinc/media-chrome/issues/490)) ([bd778fa](https://github.com/muxinc/media-chrome/commit/bd778fac5852f6073de7d3d9da7fd04918e9cb9e))
* **experimental:** media-chrome-selectmenu and media-captions-selectmenu ([#471](https://github.com/muxinc/media-chrome/issues/471)) ([6d6ddc3](https://github.com/muxinc/media-chrome/commit/6d6ddc3ffeff1775751ed9a5ef9b6c13b89754d0))
* nullish coalesce operator, improve process ([#484](https://github.com/muxinc/media-chrome/issues/484)) ([84c3c12](https://github.com/muxinc/media-chrome/commit/84c3c12d446f62a5b275fee24ada8bb6633ca631))



## [0.18.5](https://github.com/muxinc/media-chrome/compare/v0.18.4...v0.18.5) (2023-02-27)


### Bug Fixes

* add --media-range-track-color for track ([862898b](https://github.com/muxinc/media-chrome/commit/862898bdf5516618d1135963df6ca4a8bbfdee7f))
* catch play promise internally ([#479](https://github.com/muxinc/media-chrome/issues/479)) ([c77cd43](https://github.com/muxinc/media-chrome/commit/c77cd431763062520bdfb8db7217f18083ea560d))
* decoupled controller in media-theme ([#459](https://github.com/muxinc/media-chrome/issues/459)) ([3852292](https://github.com/muxinc/media-chrome/commit/385229288fc48f129079641df7423cc156bd4fe9))
* rename live edge override attribute to liveedgeoffset. Code cleanup per PR feedback. ([0edad38](https://github.com/muxinc/media-chrome/commit/0edad38449b816b27d0b960890cc5098df72cc38))
* Use default-stream-type when slotted media streamType is unknown. ([#480](https://github.com/muxinc/media-chrome/issues/480)) ([284443d](https://github.com/muxinc/media-chrome/commit/284443d12c4040365da83d0bf95b52e8c5436331))


### Features

* add Micro theme ([#469](https://github.com/muxinc/media-chrome/issues/469)) ([4181c36](https://github.com/muxinc/media-chrome/commit/4181c36b6a0ed31a26e88e073a99b8d6f54608bd))
* **live-edge-window:** Add basic support for m-ui-e liveEdgeStart proposal. ([1214369](https://github.com/muxinc/media-chrome/commit/12143695f32a6dce894ef2f1f9054e676c2ad01b))
* **media-live-button:** Implement paused behaviors and presentation for component. ([20838e1](https://github.com/muxinc/media-chrome/commit/20838e104d30b56377d3cb97ebf81254a6146099))
* **stream-type:** Add support for m-ui-e streamType proposal. ([50f4a2f](https://github.com/muxinc/media-chrome/commit/50f4a2fbfaf600ca556c997f0140789a27cc3e6a))
* **target-live-window:** Add basic support for m-ui-e targetLiveWindow proposal. ([c450348](https://github.com/muxinc/media-chrome/commit/c450348fe4cd53138c1e255990a03fb4020dd51a))



## [0.18.4](https://github.com/muxinc/media-chrome/compare/v0.18.3...v0.18.4) (2023-02-16)


### Bug Fixes

* create theme template on construction ([#477](https://github.com/muxinc/media-chrome/issues/477)) ([fe1ca19](https://github.com/muxinc/media-chrome/commit/fe1ca19ea29b0a2f1c3a197f609635d36e04c1b9))



## [0.18.3](https://github.com/muxinc/media-chrome/compare/v0.18.2...v0.18.3) (2023-02-16)


### Bug Fixes

* add lazy template prop to theme el ([#474](https://github.com/muxinc/media-chrome/issues/474)) ([9e904ef](https://github.com/muxinc/media-chrome/commit/9e904ef93ac5179047f87264bd4a58d999b32e22))



## [0.18.2](https://github.com/muxinc/media-chrome/compare/v0.18.1...v0.18.2) (2023-02-06)


### Bug Fixes

* **experimental:** media-captions-menu-button relative file locations ([#466](https://github.com/muxinc/media-chrome/issues/466)) ([53c17b1](https://github.com/muxinc/media-chrome/commit/53c17b198a7ec55389d9295253a8673e8bd4ec0a))
* **experimental:** move media-captions-menu-button to experimental folder ([#464](https://github.com/muxinc/media-chrome/issues/464)) ([3ddf3a9](https://github.com/muxinc/media-chrome/commit/3ddf3a904ea6a0fb250253b6c035323e280713fc))



## [0.18.1](https://github.com/muxinc/media-chrome/compare/v0.18.0...v0.18.1) (2023-01-31)


### Bug Fixes

* render on all attr changes, also removal ([#461](https://github.com/muxinc/media-chrome/issues/461)) ([f36b8ce](https://github.com/muxinc/media-chrome/commit/f36b8ce45b72fc226c87cce45235eef408b84461))



# [0.18.0](https://github.com/muxinc/media-chrome/compare/v0.17.1...v0.18.0) (2023-01-30)


### Bug Fixes

* add template caches for partial templates ([bf075c7](https://github.com/muxinc/media-chrome/commit/bf075c77934a1aeb3d216c1c6009880fb28f1a6b))
* add template instance caching in if directive ([2896118](https://github.com/muxinc/media-chrome/commit/289611899aeb07c460a6c7261cf128f62fad7ffd))
* keyDown in listbox should preventDefault, add f,c,k,m to keysUsed of captions-menu-button ([#449](https://github.com/muxinc/media-chrome/issues/449)) ([a6dcbb7](https://github.com/muxinc/media-chrome/commit/a6dcbb71709eba40a066b18018ff38e9ed63fdd0))
* overwrite priority template vars ([0e1be99](https://github.com/muxinc/media-chrome/commit/0e1be996d22e7377652689e696f1cfba3f9cbbee))
* remove `audio` template var ([ee596c4](https://github.com/muxinc/media-chrome/commit/ee596c4b034ea86c22a177189c42161a8fe5cc1d))
* remove old MediaTheme element ([#457](https://github.com/muxinc/media-chrome/issues/457)) ([57277b7](https://github.com/muxinc/media-chrome/commit/57277b769148b0d2ef1af16034ad58afc609debd))
* removing non existing token ([22bc6f5](https://github.com/muxinc/media-chrome/commit/22bc6f5eeb9109a1ab360b104a8a50a2722bbb54))


### Features

* experimental captions menu button fixes ([#442](https://github.com/muxinc/media-chrome/issues/442)) ([bb924c1](https://github.com/muxinc/media-chrome/commit/bb924c1550fc24f4bd060d0f3275637d7187052a))
* **experimental:** expose listbox in menu-button as a part ([#460](https://github.com/muxinc/media-chrome/issues/460)) ([d4bd8da](https://github.com/muxinc/media-chrome/commit/d4bd8da6ab7634ad3626f25d3deb7def0fff4165))



## [0.17.1](https://github.com/muxinc/media-chrome/compare/v0.17.0...v0.17.1) (2023-01-18)


### Bug Fixes

* add `audio` as template param ([8ca0ff6](https://github.com/muxinc/media-chrome/commit/8ca0ff64841d0a146b645df532880c3028be2f7d))
* add `block` attr, joined directive/expression ([fd4ac00](https://github.com/muxinc/media-chrome/commit/fd4ac0028bff38dc7ecc9d6b7c7c77f66937d417))
* add breakpoints config attribute ([2410329](https://github.com/muxinc/media-chrome/commit/2410329dfd9705afd64ac4d06faa03747215efb4))
* add containerSize to template ([008d8d5](https://github.com/muxinc/media-chrome/commit/008d8d5499f1708e95ff8d35cb86519081e1c1f1))
* add easier very large size names ([35bf0c7](https://github.com/muxinc/media-chrome/commit/35bf0c7a6e492386ce04a65b57bf030eaef2a320))
* add greater than, less than operators ([67b389e](https://github.com/muxinc/media-chrome/commit/67b389eaed575e5a20e2f0fb113af9c691297ea7))
* add stream-type to the Media Chrome theme ([4673f3c](https://github.com/muxinc/media-chrome/commit/4673f3ceab7338a1531911f8c8bc6189a6cc44e7))
* adds a 0:00 default time, fixes [#88](https://github.com/muxinc/media-chrome/issues/88) ([#430](https://github.com/muxinc/media-chrome/issues/430)) ([7d49afa](https://github.com/muxinc/media-chrome/commit/7d49afa166b95a148b1591f43819c544c65d9a44))
* allow slotting icons for the captions menu button and captions listbox indicator ([e62ee71](https://github.com/muxinc/media-chrome/commit/e62ee71085d6aa73d689c6cdb0ae257bd20166db))
* blurhash dimensions ([#432](https://github.com/muxinc/media-chrome/issues/432)) ([c88fb04](https://github.com/muxinc/media-chrome/commit/c88fb049bbb170ec81633e5114229c9aee03d752))
* **captions-listbox:** properly handle removing tracks ([9e8dff4](https://github.com/muxinc/media-chrome/commit/9e8dff40b65eb83b44c55846456006d9af84951b))
* **captions-menu-button:** keep menu within the player bounds ([72c7273](https://github.com/muxinc/media-chrome/commit/72c7273f518c3ca027bee6191b3592abee0afb77))
* change to inclusive breakpoints ([d0802b3](https://github.com/muxinc/media-chrome/commit/d0802b3c84274ea6d149f2953db651121a393d76))
* limit checking media-controller attrs ([b06dc9f](https://github.com/muxinc/media-chrome/commit/b06dc9f0bb5c45ae72a7085301406e6eab69589e))
* **listbox:** add hover styles ([d91c88c](https://github.com/muxinc/media-chrome/commit/d91c88c9c260d6360f4ecadd75209528e808ec29))
* **listbox:** improve contrast ratios of listbox colors ([0fd50fd](https://github.com/muxinc/media-chrome/commit/0fd50fd56a8988f688e1b7405624e1c85caca1f5))
* **listbox:** switch to display inline-flex ([2f1d0b8](https://github.com/muxinc/media-chrome/commit/2f1d0b87be63506258a3a9a87e64f5463f08a0b5))
* listitem should get pointer cursor ([8e9301c](https://github.com/muxinc/media-chrome/commit/8e9301cd81ffc996c4e82f5769296e235b0ba163))
* Media Live Button style changes during live window ([#440](https://github.com/muxinc/media-chrome/issues/440)) ([e709e7f](https://github.com/muxinc/media-chrome/commit/e709e7f57fd791295031cc0cc5ecc2935b685038))
* **minimal-slotted-media:** Do not assume media.seekable will be defined on the slotted media. ([65895e9](https://github.com/muxinc/media-chrome/commit/65895e94f46457ebeae71d5b5410ca1d2ea5f855))
* preliminary `media-target-live-window` attr ([c4b2286](https://github.com/muxinc/media-chrome/commit/c4b228632dab7aeb1ef4634a93c5f2641baa5ac9))
* properly select Off item if captions turned off elsewhere ([8a0b139](https://github.com/muxinc/media-chrome/commit/8a0b139419000acea4df9ebeaea1ca9773997f76))
* remove media-container-size from MediaUIAttr ([4027a8d](https://github.com/muxinc/media-chrome/commit/4027a8d105137fbdaecc8bbbdaa3e43fb7b06e83))
* remove unused containerSize ([caa6eeb](https://github.com/muxinc/media-chrome/commit/caa6eeb3cb4381ad75280e6a4820bf6c6f4841b7))
* render undefined param ([69a92fe](https://github.com/muxinc/media-chrome/commit/69a92fe8542fcea23ded95bbd8d697a2dc81156c))
* set font-family on listbox ([80ae206](https://github.com/muxinc/media-chrome/commit/80ae20690ca5b368f60a32871edef1314dba90cd))
* slotted poster is not hidden ([#431](https://github.com/muxinc/media-chrome/issues/431)) ([4a3720e](https://github.com/muxinc/media-chrome/commit/4a3720efec9e3d90afffc2da3162fc0640dce117))
* use `breakpoint-x` and `breakpoints` attrs ([176db3c](https://github.com/muxinc/media-chrome/commit/176db3cde1516dade394c91c4bc98575ab9f32d4))
* use shorthand if/foreach/partial attrs ([6dc3145](https://github.com/muxinc/media-chrome/commit/6dc3145c0f4b20216fd36a6d561c341815a7c98d))
* use textContent.toLowerCase() in listbox for more lenient search ([7d225dd](https://github.com/muxinc/media-chrome/commit/7d225ddc0440d19df06bb8701086a904fe2b27bf))


### Features

* add an Off item to captions-listbox ([f73d784](https://github.com/muxinc/media-chrome/commit/f73d7848de2c75c4e515a7b5ac9a77380f4ab9dd))
* add breakpoint params ([c17bb17](https://github.com/muxinc/media-chrome/commit/c17bb1790d9a440edebd8fa2bcabd8f51bf5d52f))
* add default styles to listbox and listitem ([9eace4a](https://github.com/muxinc/media-chrome/commit/9eace4a10b3dfd4ac73730992205def13255ce92))
* container-size attr w/ premeditated naming ([cfc43d6](https://github.com/muxinc/media-chrome/commit/cfc43d630ba51d4ba444bbabd0019bd8a15a830d))
* media-captions-menu-button ([178b655](https://github.com/muxinc/media-chrome/commit/178b65514be95e22d92be31253e304b2b8845ee4))



# [0.17.0](https://github.com/muxinc/media-chrome/compare/v0.16.3...v0.17.0) (2023-01-06)


### Bug Fixes

* **configurable-fullscreen-element:** Ignore misleading typescript error. ([71ad4e3](https://github.com/muxinc/media-chrome/commit/71ad4e3854715d6555aaa4750b9ff428f7399394))
* remove unused property ([#413](https://github.com/muxinc/media-chrome/issues/413)) ([2beac41](https://github.com/muxinc/media-chrome/commit/2beac41071147bf191626275fb095d6e96305469))
* remove web component class globals ([5c7acfb](https://github.com/muxinc/media-chrome/commit/5c7acfbdd0998f6b18e8dc2c01006abfa8ce7b58)), closes [#252](https://github.com/muxinc/media-chrome/issues/252)
* use npx if needed for docs build ([a28b60a](https://github.com/muxinc/media-chrome/commit/a28b60a98761a64c53ac8dea7a40de06276eef05))


### Features

* **configurable-full-screen:** Add an example taking advantage of configurable fullscreen target. ([8c2e3d5](https://github.com/muxinc/media-chrome/commit/8c2e3d51ed5fcf7971f3c40d40bd2a57ef8ebb03))
* **configurable-fullscreen-element:** Allow Media Controller to target a fullscreenElement other than itself. ([817408e](https://github.com/muxinc/media-chrome/commit/817408e3cee538f9c0bad6721aaec21904392a1b))
* **configurable-fullscreen-element:** Handle shadow DOM + fullscreen-element id cases better ([d0cb339](https://github.com/muxinc/media-chrome/commit/d0cb3397c71fb24d685370394f68e0bc000b4a6c))
* **configurable-fullscreen-element:** Keep parity between attribute and prop for fullscreen element, per PR feedback/discussion. ([fb4f38b](https://github.com/muxinc/media-chrome/commit/fb4f38b3f6ff1573bd93f6a572ba03d9279b16ce))



## [0.16.3](https://github.com/muxinc/media-chrome/compare/v0.16.2...v0.16.3) (2023-01-03)


### Bug Fixes

* **example:** captions listbox example should point at the correct vtt files ([5be0fc3](https://github.com/muxinc/media-chrome/commit/5be0fc3c2ccb76fda12c27e910766ab1c28392cc))
* listbox should aria-selected the default selection ([9052072](https://github.com/muxinc/media-chrome/commit/9052072d1c31f55ad2b8fe097bd32ce1cab55c71))
* **listbox:** do a null check for default selected element ([c4d4f6d](https://github.com/muxinc/media-chrome/commit/c4d4f6d39465f521a830d8155a71442d7c4ce8cf))
* no need for rounding anymore, step=any ([011940c](https://github.com/muxinc/media-chrome/commit/011940c61c2bde67160b7750cca65251e7ead598)), closes [#394](https://github.com/muxinc/media-chrome/issues/394)


### Features

* listbox should support slotting a slot el ([563a453](https://github.com/muxinc/media-chrome/commit/563a453c8072dac503bb3f7718b76b8f8afa54f1))
* media-chrome-menu-button ([0b4d625](https://github.com/muxinc/media-chrome/commit/0b4d6259eaef3ff4c2720cdeba29c8a052105023))


### Reverts

* Revert "Winamp theme checks (#403)" ([9605f02](https://github.com/muxinc/media-chrome/commit/9605f02184efd79b62a9f317dddb1be824f0f916)), closes [#403](https://github.com/muxinc/media-chrome/issues/403)
* Revert "example: add Winamp theme (#401)" ([7836b25](https://github.com/muxinc/media-chrome/commit/7836b252fd2b30ab7e6a8166b89ecc7f283ec25d)), closes [#401](https://github.com/muxinc/media-chrome/issues/401)



## [0.16.2](https://github.com/muxinc/media-chrome/compare/v0.16.1...v0.16.2) (2022-12-13)


### Bug Fixes

* add listbox role on listbox element itself ([92e702f](https://github.com/muxinc/media-chrome/commit/92e702f56235d60af9898543eccafd7db3f19c06))
* lint errors and add to CI/CD ([c571239](https://github.com/muxinc/media-chrome/commit/c571239d9ec8a52324269a24017c12e13e48dabc))
* listbox may not have a nextOption ([50d92a3](https://github.com/muxinc/media-chrome/commit/50d92a3f713ddc62da80f988e250b6af5a4576c9))
* MEDIA_CONTROLLER moved to MediaStateReceiverAttributes ([9eb52c3](https://github.com/muxinc/media-chrome/commit/9eb52c3f70407cd51da7887e9e5f9a48a0f804d6))
* remove Demuxed theme 2022 from MC bundle ([33d697c](https://github.com/muxinc/media-chrome/commit/33d697cdde818193dcb40a37fc0f31e010a7ffed))
* typescript errors ([983ed78](https://github.com/muxinc/media-chrome/commit/983ed78b7ffc411382b8411f110d9da1046cc2d6))
* use new MediaThemeElement for Demuxed theme ([4a9327b](https://github.com/muxinc/media-chrome/commit/4a9327bbaf9c54f80d5bdc25dfefbd4fd95f469c))


### Features

* add a selectedOptions getter to listbox ([3629c87](https://github.com/muxinc/media-chrome/commit/3629c87e19aa284fddf036354ad9e701847fc6f3))
* add change event to listbox ([4ddb26e](https://github.com/muxinc/media-chrome/commit/4ddb26e6f35255f4c1bf912c985a89d08d68b417))
* add value prop/attr to listitem ([542ae92](https://github.com/muxinc/media-chrome/commit/542ae92de2cf13ef7bb76b2e2b8c8625dfe759bd))
* Captions/Subtitles List ([d12f6fb](https://github.com/muxinc/media-chrome/commit/d12f6fb7d226b4a47a5d29703b6e7a2c3fd9cc2c))



## [0.16.1](https://github.com/muxinc/media-chrome/compare/v0.16.0...v0.16.1) (2022-12-06)


### Bug Fixes

* add a way to package media themes as web comp ([#375](https://github.com/muxinc/media-chrome/issues/375)) ([6857ee6](https://github.com/muxinc/media-chrome/commit/6857ee6f2b1604321b82a19688bbcafa840cf5cb))
* improve CPU usage while playback ([#364](https://github.com/muxinc/media-chrome/issues/364)) ([fae329f](https://github.com/muxinc/media-chrome/commit/fae329f8290b0216584a4e0f3c7fdb114835c560))
* inner template bug ([#381](https://github.com/muxinc/media-chrome/issues/381)) ([e20953a](https://github.com/muxinc/media-chrome/commit/e20953a4d8cdbaca5e04dcc6fbd6d6a0b5f6dbff))
* utils clean up w/ added tests ([#373](https://github.com/muxinc/media-chrome/issues/373)) ([a7db995](https://github.com/muxinc/media-chrome/commit/a7db995b2c720bb401ac877fc95c6c323f889f62))


### Features

* Add HTML based Theme w/ minimal template language ([#362](https://github.com/muxinc/media-chrome/issues/362)) ([a4a4e2c](https://github.com/muxinc/media-chrome/commit/a4a4e2c20782926c0eaaaf16788f35e3af833b69))
* add simple responsive theme ([684ddef](https://github.com/muxinc/media-chrome/commit/684ddefb3aaec463c2041e0e6bb2650538896dc7))
* expose types ([#330](https://github.com/muxinc/media-chrome/issues/330)) ([5ae159f](https://github.com/muxinc/media-chrome/commit/5ae159f30e4c814cb910b64b12df30dd47254655))
* listbox and listitem components ([#365](https://github.com/muxinc/media-chrome/issues/365)) ([15d0934](https://github.com/muxinc/media-chrome/commit/15d0934fcd112de39b2d830eb78f7cfc0518c686))
* use Construcable CSSStyleSheets when available ([eb32514](https://github.com/muxinc/media-chrome/commit/eb32514f99d477d3bfc2260da65a8c0f101d38ed))


### Reverts

* undo changes to media-theme.js ([c565bc9](https://github.com/muxinc/media-chrome/commit/c565bc9b3a476542ddf49fe1df0a8209e4e43935))



# [0.16.0](https://github.com/muxinc/media-chrome/compare/v0.15.1...v0.16.0) (2022-10-28)


### Bug Fixes

* box percentage positioning & time range border glitch ([#345](https://github.com/muxinc/media-chrome/issues/345)) ([57f1023](https://github.com/muxinc/media-chrome/commit/57f1023fa2e7d3b20b76b07b1ae45218e99360d7))



## [0.15.1](https://github.com/muxinc/media-chrome/compare/v0.15.0...v0.15.1) (2022-10-25)


### Bug Fixes

* use composedPath for checking target in schedule inactive event handler ([#355](https://github.com/muxinc/media-chrome/issues/355)) ([c44711d](https://github.com/muxinc/media-chrome/commit/c44711d131dec5ad6981c838a17f9738f74a00d9))



# [0.15.0](https://github.com/muxinc/media-chrome/compare/v0.14.1...v0.15.0) (2022-10-25)


### Bug Fixes

* clicking in play/fullscreen buttons should schedule inactive ([#338](https://github.com/muxinc/media-chrome/issues/338)) ([0b640d0](https://github.com/muxinc/media-chrome/commit/0b640d03a665a113017a3bf8f050c787e2829434)), closes [#188](https://github.com/muxinc/media-chrome/issues/188)
* preview bounds in shadow dom ([#342](https://github.com/muxinc/media-chrome/issues/342)) ([e0b5fa9](https://github.com/muxinc/media-chrome/commit/e0b5fa98378a297042cc957acbc47e67f8acb582))


### Features

* remove esm-module ([#352](https://github.com/muxinc/media-chrome/issues/352)) ([921eda8](https://github.com/muxinc/media-chrome/commit/921eda86043b2fdd76e8bb2974b815103f05bf99))



## [0.14.1](https://github.com/muxinc/media-chrome/compare/v0.14.0...v0.14.1) (2022-10-14)


### Bug Fixes

* call disable on disconnectedCallback ([35f1242](https://github.com/muxinc/media-chrome/commit/35f1242f7affc4e3534e656a82ce6d143200f879))
* don't set attributes in a constructor ([433560e](https://github.com/muxinc/media-chrome/commit/433560e2327f6a136b38cbf8cc64bba9451097c8)), closes [#335](https://github.com/muxinc/media-chrome/issues/335)



# [0.14.0](https://github.com/muxinc/media-chrome/compare/v0.12.0...v0.14.0) (2022-10-10)


### Bug Fixes

* a couple of fixes ([#331](https://github.com/muxinc/media-chrome/issues/331)) ([f4df42f](https://github.com/muxinc/media-chrome/commit/f4df42fb66ff33f40cc1937905f5933bec75aa38))
* properly check iphones for fullscreen unavailability ([#332](https://github.com/muxinc/media-chrome/issues/332)) ([c32c74e](https://github.com/muxinc/media-chrome/commit/c32c74ebf73219919bd96a15796ea008884cd600))
* properly unset poster image sources when they're removed ([#328](https://github.com/muxinc/media-chrome/issues/328)) ([87daae5](https://github.com/muxinc/media-chrome/commit/87daae56b9816818918b7d980e41b780caefbe8c))


### Features

* add poster object fit and position css vars ([#327](https://github.com/muxinc/media-chrome/issues/327)) ([a02bf20](https://github.com/muxinc/media-chrome/commit/a02bf20070a9462d0e085bec90f8c97a295ba4df))



# [0.12.0](https://github.com/muxinc/media-chrome/compare/v0.11.0...v0.12.0) (2022-09-27)


### Bug Fixes

* Safari still uses webkitFullscreenEnabled ([#316](https://github.com/muxinc/media-chrome/issues/316)) ([3850429](https://github.com/muxinc/media-chrome/commit/3850429b2c04327290acb7cbb103c76b8303f502))


### Features

* remove minify/srcmap esm/cjs, add esm-module ([#318](https://github.com/muxinc/media-chrome/issues/318)) ([5ea0d24](https://github.com/muxinc/media-chrome/commit/5ea0d24bc18de58587b8f90137f72cfde585879f))
* support being able to disable buttons, range, and time-display ([#320](https://github.com/muxinc/media-chrome/issues/320)) ([d4129c2](https://github.com/muxinc/media-chrome/commit/d4129c2ee6ef79fafff440e0ba7b3bf9dff55a07))



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



## [0.10.2](https://github.com/muxinc/media-chrome/compare/v0.10.0...v0.10.2) (2022-09-09)


### Bug Fixes

* prevent hotkeys from scrolling page ([#296](https://github.com/muxinc/media-chrome/issues/296)) ([34b9882](https://github.com/muxinc/media-chrome/commit/34b9882f9b5c18fbc659383871e4ea9357be6e1a)), closes [#295](https://github.com/muxinc/media-chrome/issues/295)



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



## [0.8.1](https://github.com/muxinc/media-chrome/compare/v0.6.8...v0.8.1) (2022-07-18)


### Bug Fixes

* audio examples, spotify example ([#265](https://github.com/muxinc/media-chrome/issues/265)) ([128d5c7](https://github.com/muxinc/media-chrome/commit/128d5c780d3238b314ba10b906a9c3890180a8a7))
* box bounds element type error ([6b61552](https://github.com/muxinc/media-chrome/commit/6b615523bce9d3807432563952d90c2dde0e6324))
* cast availability ([#251](https://github.com/muxinc/media-chrome/issues/251)) ([97d20f7](https://github.com/muxinc/media-chrome/commit/97d20f77dc2ef6b648371dd36fa3920dce77f1a1))
* casting state on new cast-button ([fd51440](https://github.com/muxinc/media-chrome/commit/fd514400bf14e3bd3ea895d4ca4c51acd5f9147d))
* chrome-button focus ring consistency ([9d83108](https://github.com/muxinc/media-chrome/commit/9d83108204bc2246ad3648fb8bd6b6c9ffd7c52d))
* focus ring on chrome-range input element ([a1899e9](https://github.com/muxinc/media-chrome/commit/a1899e9c402c9449c3aaee6a67ca1e770dfbb1de))
* have improved styling with host-context and chrome-range ([335b875](https://github.com/muxinc/media-chrome/commit/335b875c845b2a8ce72486c11598dd7f0f663735))
* hide gesture-layer when in audio mode ([77f7005](https://github.com/muxinc/media-chrome/commit/77f70054f3e8d08a194b7e2c64ccd8cbbc792c66))
* mediaControllerId var bug ([b5faf44](https://github.com/muxinc/media-chrome/commit/b5faf44e3446fcd34416c7b522a6b8d15db21e20))
* reset playbackRate UI after loadstart ([#249](https://github.com/muxinc/media-chrome/issues/249)) ([59f4ed4](https://github.com/muxinc/media-chrome/commit/59f4ed40dd04f7711b856a01e0fe5fa43474f1ae))
* style override from Tailwind CSS ([7590ffb](https://github.com/muxinc/media-chrome/commit/7590ffb1980172d047e6e34999230c035dbc6a2c)), closes [#262](https://github.com/muxinc/media-chrome/issues/262)
* text-display should have consistent focus ring to chrome-button ([f1bad34](https://github.com/muxinc/media-chrome/commit/f1bad345b9fd782f0449f97f48d708c234357447))
* timerange progress jumpy w/out playback rate ([2b2d360](https://github.com/muxinc/media-chrome/commit/2b2d360cd9b6f9d08068c00869c95ea1b2ff68de))


### Features

* improve time range behavior ([#255](https://github.com/muxinc/media-chrome/issues/255)) ([2aa7223](https://github.com/muxinc/media-chrome/commit/2aa7223977a1f8106807d26852b0108efd9aaa4e))



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



# [1.1.0](https://github.com/muxinc/media-chrome/compare/v1.0.0...v1.1.0) (2023-06-12)


### Bug Fixes

* Handle visualization in media-time-range for cases where media has ended. ([#667](https://github.com/muxinc/media-chrome/issues/667)) ([924aa20](https://github.com/muxinc/media-chrome/commit/924aa20e3a84a815065f3d7f2768f80662f96fee))
* media state change events ([#666](https://github.com/muxinc/media-chrome/issues/666)) ([05999ae](https://github.com/muxinc/media-chrome/commit/05999ae60e0dfca323adebaeff6be0092ee8c39b))


### Features

* add `backdrop-filter` to range track & bg ([#658](https://github.com/muxinc/media-chrome/issues/658)) ([3590497](https://github.com/muxinc/media-chrome/commit/3590497e4174d97055b57b6455da6de1887b7d37))



# [1.0.0](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.5...v1.0.0) (2023-05-30)


### Features

* icon slots for single slot controls ([#645](https://github.com/muxinc/media-chrome/issues/645)) ([17869cb](https://github.com/muxinc/media-chrome/commit/17869cb1172ee646f1219b6a403361101a281de8))


### BREAKING CHANGES

* Icon slots have been renamed to "icon" for Airplay, Seek Forward, Seek Backward, and Loading Indicator controls.



# [1.0.0-rc.5](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.4...v1.0.0-rc.5) (2023-05-26)


### Bug Fixes

* media display override issue ([#648](https://github.com/muxinc/media-chrome/issues/648)) ([dfc6a13](https://github.com/muxinc/media-chrome/commit/dfc6a13e46c2beb9f54511581e5ad5c281e592c0))


### Features

* Icon slots for buttons with multiple slots ([#643](https://github.com/muxinc/media-chrome/issues/643)) ([53e7aad](https://github.com/muxinc/media-chrome/commit/53e7aade3e2eb99481529e75b5e12e9f3cc0d0fa))



# [1.0.0-rc.4](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2023-05-23)


### Bug Fixes

* fullscreen state getter w/o event ([#634](https://github.com/muxinc/media-chrome/issues/634)) ([2dba034](https://github.com/muxinc/media-chrome/commit/2dba03418341988b56ba7c433b81142e6d1d2141)), closes [#627](https://github.com/muxinc/media-chrome/issues/627)
* Make sure we monitor slotchange on slots for media state receive… ([#639](https://github.com/muxinc/media-chrome/issues/639)) ([6710381](https://github.com/muxinc/media-chrome/commit/671038123e629ddbac79f17d99a3c80728568eab))



# [1.0.0-rc.3](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2023-05-22)


### Bug Fixes

* iOS fullscreen state bug ([#633](https://github.com/muxinc/media-chrome/issues/633)) ([505e0d1](https://github.com/muxinc/media-chrome/commit/505e0d15bffbe2bc63691f163c0538b879cd43e8)), closes [#593](https://github.com/muxinc/media-chrome/issues/593)


### Features

* add icon slot to mute button ([#629](https://github.com/muxinc/media-chrome/issues/629)) ([41169a0](https://github.com/muxinc/media-chrome/commit/41169a065742379e28152b6a32a795e2db47dd4d))
* add mediaended attr to play button ([#630](https://github.com/muxinc/media-chrome/issues/630)) ([3141864](https://github.com/muxinc/media-chrome/commit/3141864deeb651fcbcbd2cc1bfe133e356efb1f6))



# [1.0.0-rc.2](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2023-05-16)


### Bug Fixes

* Missing parenthesis in control bar style ([#626](https://github.com/muxinc/media-chrome/issues/626)) ([76a1c8f](https://github.com/muxinc/media-chrome/commit/76a1c8fadc90ab11dae14f27f3cc61eb87e53cef))



# [1.0.0-rc.1](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2023-05-15)


### Bug Fixes

* Update official themes to use lowercase attrs consistently. ([#623](https://github.com/muxinc/media-chrome/issues/623)) ([5d62f93](https://github.com/muxinc/media-chrome/commit/5d62f93b2d78dcb1eba5fb7b1e83434d73e3ce11))



# [1.0.0-rc.0](https://github.com/muxinc/media-chrome/compare/v0.21.0...v1.0.0-rc.0) (2023-05-12)


### Bug Fixes

* add default unavailable CSS to themes ([#539](https://github.com/muxinc/media-chrome/issues/539)) ([f9c5a9e](https://github.com/muxinc/media-chrome/commit/f9c5a9e921cca14a4e8858fcbdd234de4286c64a))
* Better color contrast on breakpoint docs ([#614](https://github.com/muxinc/media-chrome/issues/614)) ([d869d73](https://github.com/muxinc/media-chrome/commit/d869d73a407fd5620fc2bf16f31665d0bd0f6553))
* buffered attr ([#544](https://github.com/muxinc/media-chrome/issues/544)) ([7efe18a](https://github.com/muxinc/media-chrome/commit/7efe18ac00fc84648e417d23ebcaf643b2c4fae3))
* casting ([#618](https://github.com/muxinc/media-chrome/issues/618)) ([106e3dd](https://github.com/muxinc/media-chrome/commit/106e3ddb1ab3c12619b09b2d240a2691745aeea3))
* Comparison of text track lists ([#600](https://github.com/muxinc/media-chrome/issues/600)) ([87daf00](https://github.com/muxinc/media-chrome/commit/87daf00d5c1fabf0c66cf97ef63beae328d8986c))
* css variables consistency updates ([#554](https://github.com/muxinc/media-chrome/issues/554)) ([f2876db](https://github.com/muxinc/media-chrome/commit/f2876db9b864256fa7419d5ab595ad026ef69161))
* dash in breakpoint attr ([#540](https://github.com/muxinc/media-chrome/issues/540)) ([23c2de9](https://github.com/muxinc/media-chrome/commit/23c2de9dbf8fb07c609af23ba06d3a11f76f390a))
* don't auto-size ranges in media-control-bar if they're all alone. ([#591](https://github.com/muxinc/media-chrome/issues/591)) ([276b96d](https://github.com/muxinc/media-chrome/commit/276b96de8fbf3ad1e4ea4384253e57f08395067a))
* forward button ([#605](https://github.com/muxinc/media-chrome/issues/605)) ([4c81eed](https://github.com/muxinc/media-chrome/commit/4c81eed5b1562a2af0008baeeffeff778186313c))
* Let media-control-bar size (height) range components like it doe… ([#582](https://github.com/muxinc/media-chrome/issues/582)) ([d1a65da](https://github.com/muxinc/media-chrome/commit/d1a65da3afdc94b6e19da68f3298d1e26b0b60e6))
* selectmenu mediacontroller and missed examples from first pass. ([#541](https://github.com/muxinc/media-chrome/issues/541)) ([2ab9032](https://github.com/muxinc/media-chrome/commit/2ab90323a1bd20f3456e95e1567b379e5e7373b4))
* show chrome on pointermove for custom video ([#604](https://github.com/muxinc/media-chrome/issues/604)) ([de8035b](https://github.com/muxinc/media-chrome/commit/de8035bc5cf44c83192d0d6ad0eaef1bfa406648)), closes [#451](https://github.com/muxinc/media-chrome/issues/451) [#298](https://github.com/muxinc/media-chrome/issues/298)
* show pointer for theme toggle icons ([#611](https://github.com/muxinc/media-chrome/issues/611)) ([71358ce](https://github.com/muxinc/media-chrome/commit/71358ceb2f2d1e3a0300d1bfe7628820e5e1764d))
* use default values in new prop getters for seek btns. Use props … ([#592](https://github.com/muxinc/media-chrome/issues/592)) ([c843a5e](https://github.com/muxinc/media-chrome/commit/c843a5e3ea7da70becb9b0516cb51c4c2b51bc30))


### Features

* add defaultsubtitles to media-controller ([#551](https://github.com/muxinc/media-chrome/issues/551)) ([fdbc8c7](https://github.com/muxinc/media-chrome/commit/fdbc8c7719b5e54086ae12954b6d59fbd1c33021))
* add novolumepref attribute to prefer writing to localStorage ([#575](https://github.com/muxinc/media-chrome/issues/575)) ([31bdb11](https://github.com/muxinc/media-chrome/commit/31bdb1188236e0411e15f284554604f03d2b1a4b))
* Add props and types to seek forwards and backwards elements ([#566](https://github.com/muxinc/media-chrome/issues/566)) ([0259c3a](https://github.com/muxinc/media-chrome/commit/0259c3abaa578444456e62f391d8e5a7a586d0e1))
* Adding custom event for breakingpoint changing ([#584](https://github.com/muxinc/media-chrome/issues/584)) ([1cf3579](https://github.com/muxinc/media-chrome/commit/1cf3579123ba4de59a5a70fed4d89637d7652a09))
* Airplay, Captions, and Cast button props ([#587](https://github.com/muxinc/media-chrome/issues/587)) ([14156f7](https://github.com/muxinc/media-chrome/commit/14156f77e9de73884cb23f9e748227a9f1659157))
* combine MEDIA_CAPTIONS_LIST into MEDIA_SUBTITLES_LIST ([#546](https://github.com/muxinc/media-chrome/issues/546)) ([03e62e6](https://github.com/muxinc/media-chrome/commit/03e62e616b2f7bef46b1331079421fa5f17736d1))
* Drop all deprecated or redundant components. Update tests, examples, docs, etc. based on changes. ([#560](https://github.com/muxinc/media-chrome/issues/560)) ([20fca8c](https://github.com/muxinc/media-chrome/commit/20fca8cf4253482d93608b1c6edc728aa6819375))
* Duration, Fullscreen, and Gesture props ([#595](https://github.com/muxinc/media-chrome/issues/595)) ([748c013](https://github.com/muxinc/media-chrome/commit/748c01315f5654eb21487418c9cf216f8d53eee3))
* fix casing in attributes and vars ([#606](https://github.com/muxinc/media-chrome/issues/606)) ([502fff5](https://github.com/muxinc/media-chrome/commit/502fff531df28da43451e166ba710c59d7f43a5b))
* Live Button and Mute button props ([#596](https://github.com/muxinc/media-chrome/issues/596)) ([d6b5ad6](https://github.com/muxinc/media-chrome/commit/d6b5ad6b7f61cc60d989f4ea591707dbc8433683))
* Media Time Range and Volume Range props ([#599](https://github.com/muxinc/media-chrome/issues/599)) ([61d6ddd](https://github.com/muxinc/media-chrome/commit/61d6dddf5dc140cb91007c80713b44aa39c3d352))
* Migrate all attributes to lowercase ('smushedcase'). ([#537](https://github.com/muxinc/media-chrome/issues/537)) ([fe9eadc](https://github.com/muxinc/media-chrome/commit/fe9eadc98af47752cc7b362379cd3fc4f24e5a14))
* move loading-indicator visibility to be done in CSS only ([#586](https://github.com/muxinc/media-chrome/issues/586)) ([0d989b3](https://github.com/muxinc/media-chrome/commit/0d989b34e46f36af3fb2fe017b026932eec13f95))
* Pip button, Play button, and Playback Rates props ([#597](https://github.com/muxinc/media-chrome/issues/597)) ([3d96b16](https://github.com/muxinc/media-chrome/commit/3d96b16deeb90b9961582b811025ce00401b67e9))
* Poster Image, Preview Thumbnail, and Time Display props ([#598](https://github.com/muxinc/media-chrome/issues/598)) ([7126ddf](https://github.com/muxinc/media-chrome/commit/7126ddffcda160a2c7186d1447be1493caed0bd2))


### BREAKING CHANGES

* removed keys() from AttributeTokenList
* remove `isloading` attribute from media-loading-indicator.
* Change `--media-live-indicator-color` to `--media-live-button-indicator-color`, `--media-time-buffered-color` to `--media-time-range-buffered-color`, `--media-background-position` to `--media-poster-image-background-position`, and `--media-background-size` to `--media-poster-image-background-size`.
* remove defaultshowing attribute from
media-captions-button and media-captions-selectmenu.
* remove MEDIA_CAPTIONS_LIST, MEDIA_CAPTIONS_SHOWING, no-subtitles-fallback, MEDIA_SHOW_CAPTIONS_REQUEST, MEDIA_DISABLE_CAPTIONS_REQUEST, and MEDIA_CAPTIONS_LIST & MEDIA_CAPTIONS_SHOWING change events.



# [0.21.0](https://github.com/muxinc/media-chrome/compare/v0.20.4...v0.21.0) (2023-04-17)


### Bug Fixes

* Automatically serialize arrays as arr.join(' ') for react components ([#527](https://github.com/muxinc/media-chrome/issues/527)) ([c24025c](https://github.com/muxinc/media-chrome/commit/c24025c75c5f2d957b7827d06b9d30a41686c360))
* custom element manifest imports from dist/ ([#521](https://github.com/muxinc/media-chrome/issues/521)) ([32b8149](https://github.com/muxinc/media-chrome/commit/32b8149da9252d699df5ca82a8edd4b29f5638f6))
* font numeric uniform width ([#526](https://github.com/muxinc/media-chrome/issues/526)) ([f31d5a3](https://github.com/muxinc/media-chrome/commit/f31d5a3b7bf28ae92b4b833747ad22d235e9dac5))
* inactive live button ([#535](https://github.com/muxinc/media-chrome/issues/535)) ([8d841ae](https://github.com/muxinc/media-chrome/commit/8d841ae53eeecb8eeb31772f75c8c9ddf061ceb6))
* make DSD (declarative shadow dom) compatible ([#524](https://github.com/muxinc/media-chrome/issues/524)) ([e6105f4](https://github.com/muxinc/media-chrome/commit/e6105f456173225a4f299b2ae6fb4dbf3a4871cf))
* relative src path ([6e45bab](https://github.com/muxinc/media-chrome/commit/6e45bab3e7847a3eed567f57fb093347e44e2b42))


### Features

* introduce a playback rates selectmenu ([#513](https://github.com/muxinc/media-chrome/issues/513)) ([502f83f](https://github.com/muxinc/media-chrome/commit/502f83fa1a9dfc6eabfbe08535fa81097416dbd4))
* remove deprecated, move experimental files ([#525](https://github.com/muxinc/media-chrome/issues/525)) ([13218c0](https://github.com/muxinc/media-chrome/commit/13218c0281a20759c9a352e575249e2a42e911a2))



## [0.20.4](https://github.com/muxinc/media-chrome/compare/v0.20.3...v0.20.4) (2023-04-04)


### Bug Fixes

* media-theme element lazy doc append ([#519](https://github.com/muxinc/media-chrome/issues/519)) ([7efe0e2](https://github.com/muxinc/media-chrome/commit/7efe0e2e3d52a57722d0f3a61fde016d9f40bbdc))



## [0.20.3](https://github.com/muxinc/media-chrome/compare/v0.20.2...v0.20.3) (2023-03-31)


### Bug Fixes

* over firing user-inactive event, attr name ([#515](https://github.com/muxinc/media-chrome/issues/515)) ([26a05f6](https://github.com/muxinc/media-chrome/commit/26a05f6ac4accc47241e17f8c58d1d9269e77722))
* toggle selectmenu via keyboard, hide on click outside of selectmenu ([#514](https://github.com/muxinc/media-chrome/issues/514)) ([df9a50d](https://github.com/muxinc/media-chrome/commit/df9a50d62133d02d53ad749a02e4b801f210d2ef))



## [0.20.2](https://github.com/muxinc/media-chrome/compare/v0.20.1...v0.20.2) (2023-03-30)


### Bug Fixes

* slot for text display, customizable content ([#511](https://github.com/muxinc/media-chrome/issues/511)) ([bf1fc7e](https://github.com/muxinc/media-chrome/commit/bf1fc7ee75f1b638cfa1ceff9c5efa21852ae97f))
* toggle time display on click from remaining / not remaining ([#510](https://github.com/muxinc/media-chrome/issues/510)) ([826131c](https://github.com/muxinc/media-chrome/commit/826131c402b46a70fe33eb7cc967e5b27f5a64ab))



## [0.20.1](https://github.com/muxinc/media-chrome/compare/v0.20.0...v0.20.1) (2023-03-28)


### Bug Fixes

* add support for negations ([#509](https://github.com/muxinc/media-chrome/issues/509)) ([dc1e574](https://github.com/muxinc/media-chrome/commit/dc1e5749e43e9b8fa2220e1c01efe49b8558251b))



# [0.20.0](https://github.com/muxinc/media-chrome/compare/v0.19.1...v0.20.0) (2023-03-27)


### Bug Fixes

* add non-default buttons to Minimal theme ([#507](https://github.com/muxinc/media-chrome/issues/507)) ([bcb218e](https://github.com/muxinc/media-chrome/commit/bcb218efb2e1897d6431bfc0819dd7402a906445))
* add poster slot, media loading indicator to Microvideo ([#505](https://github.com/muxinc/media-chrome/issues/505)) ([6ea6079](https://github.com/muxinc/media-chrome/commit/6ea607921bf682269bd963001f35fa5ccca6506e))
* add style tweaks to Minimal, Microvideo ([#508](https://github.com/muxinc/media-chrome/issues/508)) ([cad6841](https://github.com/muxinc/media-chrome/commit/cad68415b8e8755b5c357984d5baa9385fd3d2d3))


### Features

* Minimal theme ([#492](https://github.com/muxinc/media-chrome/issues/492)) ([cfc84f6](https://github.com/muxinc/media-chrome/commit/cfc84f68057b2140ae942aa447358893f6541836))



## [0.19.1](https://github.com/muxinc/media-chrome/compare/v0.19.0...v0.19.1) (2023-03-20)


### Bug Fixes

* rename Micro to Microvideo ([#504](https://github.com/muxinc/media-chrome/issues/504)) ([ea96595](https://github.com/muxinc/media-chrome/commit/ea9659529e283945e725f2baec4d7ed6bcf75395))



# [0.19.0](https://github.com/muxinc/media-chrome/compare/v0.18.8...v0.19.0) (2023-03-20)


### Bug Fixes

* add disabled styles for Micro theme ([#500](https://github.com/muxinc/media-chrome/issues/500)) ([94ccd2b](https://github.com/muxinc/media-chrome/commit/94ccd2ba6c44e6ee279f4dc5d8527456c5c0ac75))
* add display CSS vars ([#497](https://github.com/muxinc/media-chrome/issues/497)) ([89353e5](https://github.com/muxinc/media-chrome/commit/89353e52c50916de740704dfb7d428727155aca5))
* theme inline-block, improve responsive theme ([#496](https://github.com/muxinc/media-chrome/issues/496)) ([56b549c](https://github.com/muxinc/media-chrome/commit/56b549c0a12cfbccc63555c92eae818ceef1481b))


### Features

* support fetching theme HTML files ([#491](https://github.com/muxinc/media-chrome/issues/491)) ([1457651](https://github.com/muxinc/media-chrome/commit/14576515b5798430c26a58f3046b6efbcd85c2fb))



## [0.18.8](https://github.com/muxinc/media-chrome/compare/v0.18.7...v0.18.8) (2023-03-08)


### Bug Fixes

* preventClick on the button given to selectmenu unconditionally ([#495](https://github.com/muxinc/media-chrome/issues/495)) ([05ed8fb](https://github.com/muxinc/media-chrome/commit/05ed8fb4b3c917807f9e25b87ace5128188d58c7))



## [0.18.7](https://github.com/muxinc/media-chrome/compare/v0.18.6...v0.18.7) (2023-03-08)


### Bug Fixes

* improve inferred media-ui-extension values ([#494](https://github.com/muxinc/media-chrome/issues/494)) ([9028129](https://github.com/muxinc/media-chrome/commit/90281290051c00acc95013ed82c712c77f4229e9))



## [0.18.6](https://github.com/muxinc/media-chrome/compare/v0.18.5...v0.18.6) (2023-03-07)


### Bug Fixes

* add default much used styles to theme ([#490](https://github.com/muxinc/media-chrome/issues/490)) ([bd778fa](https://github.com/muxinc/media-chrome/commit/bd778fac5852f6073de7d3d9da7fd04918e9cb9e))
* **experimental:** media-chrome-selectmenu and media-captions-selectmenu ([#471](https://github.com/muxinc/media-chrome/issues/471)) ([6d6ddc3](https://github.com/muxinc/media-chrome/commit/6d6ddc3ffeff1775751ed9a5ef9b6c13b89754d0))
* nullish coalesce operator, improve process ([#484](https://github.com/muxinc/media-chrome/issues/484)) ([84c3c12](https://github.com/muxinc/media-chrome/commit/84c3c12d446f62a5b275fee24ada8bb6633ca631))



## [0.18.5](https://github.com/muxinc/media-chrome/compare/v0.18.4...v0.18.5) (2023-02-27)


### Bug Fixes

* add --media-range-track-color for track ([862898b](https://github.com/muxinc/media-chrome/commit/862898bdf5516618d1135963df6ca4a8bbfdee7f))
* catch play promise internally ([#479](https://github.com/muxinc/media-chrome/issues/479)) ([c77cd43](https://github.com/muxinc/media-chrome/commit/c77cd431763062520bdfb8db7217f18083ea560d))
* decoupled controller in media-theme ([#459](https://github.com/muxinc/media-chrome/issues/459)) ([3852292](https://github.com/muxinc/media-chrome/commit/385229288fc48f129079641df7423cc156bd4fe9))
* rename live edge override attribute to liveedgeoffset. Code cleanup per PR feedback. ([0edad38](https://github.com/muxinc/media-chrome/commit/0edad38449b816b27d0b960890cc5098df72cc38))
* Use default-stream-type when slotted media streamType is unknown. ([#480](https://github.com/muxinc/media-chrome/issues/480)) ([284443d](https://github.com/muxinc/media-chrome/commit/284443d12c4040365da83d0bf95b52e8c5436331))


### Features

* add Micro theme ([#469](https://github.com/muxinc/media-chrome/issues/469)) ([4181c36](https://github.com/muxinc/media-chrome/commit/4181c36b6a0ed31a26e88e073a99b8d6f54608bd))
* **live-edge-window:** Add basic support for m-ui-e liveEdgeStart proposal. ([1214369](https://github.com/muxinc/media-chrome/commit/12143695f32a6dce894ef2f1f9054e676c2ad01b))
* **media-live-button:** Implement paused behaviors and presentation for component. ([20838e1](https://github.com/muxinc/media-chrome/commit/20838e104d30b56377d3cb97ebf81254a6146099))
* **stream-type:** Add support for m-ui-e streamType proposal. ([50f4a2f](https://github.com/muxinc/media-chrome/commit/50f4a2fbfaf600ca556c997f0140789a27cc3e6a))
* **target-live-window:** Add basic support for m-ui-e targetLiveWindow proposal. ([c450348](https://github.com/muxinc/media-chrome/commit/c450348fe4cd53138c1e255990a03fb4020dd51a))



## [0.18.4](https://github.com/muxinc/media-chrome/compare/v0.18.3...v0.18.4) (2023-02-16)


### Bug Fixes

* create theme template on construction ([#477](https://github.com/muxinc/media-chrome/issues/477)) ([fe1ca19](https://github.com/muxinc/media-chrome/commit/fe1ca19ea29b0a2f1c3a197f609635d36e04c1b9))



## [0.18.3](https://github.com/muxinc/media-chrome/compare/v0.18.2...v0.18.3) (2023-02-16)


### Bug Fixes

* add lazy template prop to theme el ([#474](https://github.com/muxinc/media-chrome/issues/474)) ([9e904ef](https://github.com/muxinc/media-chrome/commit/9e904ef93ac5179047f87264bd4a58d999b32e22))



## [0.18.2](https://github.com/muxinc/media-chrome/compare/v0.18.1...v0.18.2) (2023-02-06)


### Bug Fixes

* **experimental:** media-captions-menu-button relative file locations ([#466](https://github.com/muxinc/media-chrome/issues/466)) ([53c17b1](https://github.com/muxinc/media-chrome/commit/53c17b198a7ec55389d9295253a8673e8bd4ec0a))
* **experimental:** move media-captions-menu-button to experimental folder ([#464](https://github.com/muxinc/media-chrome/issues/464)) ([3ddf3a9](https://github.com/muxinc/media-chrome/commit/3ddf3a904ea6a0fb250253b6c035323e280713fc))



## [0.18.1](https://github.com/muxinc/media-chrome/compare/v0.18.0...v0.18.1) (2023-01-31)


### Bug Fixes

* render on all attr changes, also removal ([#461](https://github.com/muxinc/media-chrome/issues/461)) ([f36b8ce](https://github.com/muxinc/media-chrome/commit/f36b8ce45b72fc226c87cce45235eef408b84461))



# [0.18.0](https://github.com/muxinc/media-chrome/compare/v0.17.1...v0.18.0) (2023-01-30)


### Bug Fixes

* add template caches for partial templates ([bf075c7](https://github.com/muxinc/media-chrome/commit/bf075c77934a1aeb3d216c1c6009880fb28f1a6b))
* add template instance caching in if directive ([2896118](https://github.com/muxinc/media-chrome/commit/289611899aeb07c460a6c7261cf128f62fad7ffd))
* keyDown in listbox should preventDefault, add f,c,k,m to keysUsed of captions-menu-button ([#449](https://github.com/muxinc/media-chrome/issues/449)) ([a6dcbb7](https://github.com/muxinc/media-chrome/commit/a6dcbb71709eba40a066b18018ff38e9ed63fdd0))
* overwrite priority template vars ([0e1be99](https://github.com/muxinc/media-chrome/commit/0e1be996d22e7377652689e696f1cfba3f9cbbee))
* remove `audio` template var ([ee596c4](https://github.com/muxinc/media-chrome/commit/ee596c4b034ea86c22a177189c42161a8fe5cc1d))
* remove old MediaTheme element ([#457](https://github.com/muxinc/media-chrome/issues/457)) ([57277b7](https://github.com/muxinc/media-chrome/commit/57277b769148b0d2ef1af16034ad58afc609debd))
* removing non existing token ([22bc6f5](https://github.com/muxinc/media-chrome/commit/22bc6f5eeb9109a1ab360b104a8a50a2722bbb54))


### Features

* experimental captions menu button fixes ([#442](https://github.com/muxinc/media-chrome/issues/442)) ([bb924c1](https://github.com/muxinc/media-chrome/commit/bb924c1550fc24f4bd060d0f3275637d7187052a))
* **experimental:** expose listbox in menu-button as a part ([#460](https://github.com/muxinc/media-chrome/issues/460)) ([d4bd8da](https://github.com/muxinc/media-chrome/commit/d4bd8da6ab7634ad3626f25d3deb7def0fff4165))



## [0.17.1](https://github.com/muxinc/media-chrome/compare/v0.17.0...v0.17.1) (2023-01-18)


### Bug Fixes

* add `audio` as template param ([8ca0ff6](https://github.com/muxinc/media-chrome/commit/8ca0ff64841d0a146b645df532880c3028be2f7d))
* add `block` attr, joined directive/expression ([fd4ac00](https://github.com/muxinc/media-chrome/commit/fd4ac0028bff38dc7ecc9d6b7c7c77f66937d417))
* add breakpoints config attribute ([2410329](https://github.com/muxinc/media-chrome/commit/2410329dfd9705afd64ac4d06faa03747215efb4))
* add containerSize to template ([008d8d5](https://github.com/muxinc/media-chrome/commit/008d8d5499f1708e95ff8d35cb86519081e1c1f1))
* add easier very large size names ([35bf0c7](https://github.com/muxinc/media-chrome/commit/35bf0c7a6e492386ce04a65b57bf030eaef2a320))
* add greater than, less than operators ([67b389e](https://github.com/muxinc/media-chrome/commit/67b389eaed575e5a20e2f0fb113af9c691297ea7))
* add stream-type to the Media Chrome theme ([4673f3c](https://github.com/muxinc/media-chrome/commit/4673f3ceab7338a1531911f8c8bc6189a6cc44e7))
* adds a 0:00 default time, fixes [#88](https://github.com/muxinc/media-chrome/issues/88) ([#430](https://github.com/muxinc/media-chrome/issues/430)) ([7d49afa](https://github.com/muxinc/media-chrome/commit/7d49afa166b95a148b1591f43819c544c65d9a44))
* allow slotting icons for the captions menu button and captions listbox indicator ([e62ee71](https://github.com/muxinc/media-chrome/commit/e62ee71085d6aa73d689c6cdb0ae257bd20166db))
* blurhash dimensions ([#432](https://github.com/muxinc/media-chrome/issues/432)) ([c88fb04](https://github.com/muxinc/media-chrome/commit/c88fb049bbb170ec81633e5114229c9aee03d752))
* **captions-listbox:** properly handle removing tracks ([9e8dff4](https://github.com/muxinc/media-chrome/commit/9e8dff40b65eb83b44c55846456006d9af84951b))
* **captions-menu-button:** keep menu within the player bounds ([72c7273](https://github.com/muxinc/media-chrome/commit/72c7273f518c3ca027bee6191b3592abee0afb77))
* change to inclusive breakpoints ([d0802b3](https://github.com/muxinc/media-chrome/commit/d0802b3c84274ea6d149f2953db651121a393d76))
* limit checking media-controller attrs ([b06dc9f](https://github.com/muxinc/media-chrome/commit/b06dc9f0bb5c45ae72a7085301406e6eab69589e))
* **listbox:** add hover styles ([d91c88c](https://github.com/muxinc/media-chrome/commit/d91c88c9c260d6360f4ecadd75209528e808ec29))
* **listbox:** improve contrast ratios of listbox colors ([0fd50fd](https://github.com/muxinc/media-chrome/commit/0fd50fd56a8988f688e1b7405624e1c85caca1f5))
* **listbox:** switch to display inline-flex ([2f1d0b8](https://github.com/muxinc/media-chrome/commit/2f1d0b87be63506258a3a9a87e64f5463f08a0b5))
* listitem should get pointer cursor ([8e9301c](https://github.com/muxinc/media-chrome/commit/8e9301cd81ffc996c4e82f5769296e235b0ba163))
* Media Live Button style changes during live window ([#440](https://github.com/muxinc/media-chrome/issues/440)) ([e709e7f](https://github.com/muxinc/media-chrome/commit/e709e7f57fd791295031cc0cc5ecc2935b685038))
* **minimal-slotted-media:** Do not assume media.seekable will be defined on the slotted media. ([65895e9](https://github.com/muxinc/media-chrome/commit/65895e94f46457ebeae71d5b5410ca1d2ea5f855))
* preliminary `media-target-live-window` attr ([c4b2286](https://github.com/muxinc/media-chrome/commit/c4b228632dab7aeb1ef4634a93c5f2641baa5ac9))
* properly select Off item if captions turned off elsewhere ([8a0b139](https://github.com/muxinc/media-chrome/commit/8a0b139419000acea4df9ebeaea1ca9773997f76))
* remove media-container-size from MediaUIAttr ([4027a8d](https://github.com/muxinc/media-chrome/commit/4027a8d105137fbdaecc8bbbdaa3e43fb7b06e83))
* remove unused containerSize ([caa6eeb](https://github.com/muxinc/media-chrome/commit/caa6eeb3cb4381ad75280e6a4820bf6c6f4841b7))
* render undefined param ([69a92fe](https://github.com/muxinc/media-chrome/commit/69a92fe8542fcea23ded95bbd8d697a2dc81156c))
* set font-family on listbox ([80ae206](https://github.com/muxinc/media-chrome/commit/80ae20690ca5b368f60a32871edef1314dba90cd))
* slotted poster is not hidden ([#431](https://github.com/muxinc/media-chrome/issues/431)) ([4a3720e](https://github.com/muxinc/media-chrome/commit/4a3720efec9e3d90afffc2da3162fc0640dce117))
* use `breakpoint-x` and `breakpoints` attrs ([176db3c](https://github.com/muxinc/media-chrome/commit/176db3cde1516dade394c91c4bc98575ab9f32d4))
* use shorthand if/foreach/partial attrs ([6dc3145](https://github.com/muxinc/media-chrome/commit/6dc3145c0f4b20216fd36a6d561c341815a7c98d))
* use textContent.toLowerCase() in listbox for more lenient search ([7d225dd](https://github.com/muxinc/media-chrome/commit/7d225ddc0440d19df06bb8701086a904fe2b27bf))


### Features

* add an Off item to captions-listbox ([f73d784](https://github.com/muxinc/media-chrome/commit/f73d7848de2c75c4e515a7b5ac9a77380f4ab9dd))
* add breakpoint params ([c17bb17](https://github.com/muxinc/media-chrome/commit/c17bb1790d9a440edebd8fa2bcabd8f51bf5d52f))
* add default styles to listbox and listitem ([9eace4a](https://github.com/muxinc/media-chrome/commit/9eace4a10b3dfd4ac73730992205def13255ce92))
* container-size attr w/ premeditated naming ([cfc43d6](https://github.com/muxinc/media-chrome/commit/cfc43d630ba51d4ba444bbabd0019bd8a15a830d))
* media-captions-menu-button ([178b655](https://github.com/muxinc/media-chrome/commit/178b65514be95e22d92be31253e304b2b8845ee4))



# [0.17.0](https://github.com/muxinc/media-chrome/compare/v0.16.3...v0.17.0) (2023-01-06)


### Bug Fixes

* **configurable-fullscreen-element:** Ignore misleading typescript error. ([71ad4e3](https://github.com/muxinc/media-chrome/commit/71ad4e3854715d6555aaa4750b9ff428f7399394))
* remove unused property ([#413](https://github.com/muxinc/media-chrome/issues/413)) ([2beac41](https://github.com/muxinc/media-chrome/commit/2beac41071147bf191626275fb095d6e96305469))
* remove web component class globals ([5c7acfb](https://github.com/muxinc/media-chrome/commit/5c7acfbdd0998f6b18e8dc2c01006abfa8ce7b58)), closes [#252](https://github.com/muxinc/media-chrome/issues/252)
* use npx if needed for docs build ([a28b60a](https://github.com/muxinc/media-chrome/commit/a28b60a98761a64c53ac8dea7a40de06276eef05))


### Features

* **configurable-full-screen:** Add an example taking advantage of configurable fullscreen target. ([8c2e3d5](https://github.com/muxinc/media-chrome/commit/8c2e3d51ed5fcf7971f3c40d40bd2a57ef8ebb03))
* **configurable-fullscreen-element:** Allow Media Controller to target a fullscreenElement other than itself. ([817408e](https://github.com/muxinc/media-chrome/commit/817408e3cee538f9c0bad6721aaec21904392a1b))
* **configurable-fullscreen-element:** Handle shadow DOM + fullscreen-element id cases better ([d0cb339](https://github.com/muxinc/media-chrome/commit/d0cb3397c71fb24d685370394f68e0bc000b4a6c))
* **configurable-fullscreen-element:** Keep parity between attribute and prop for fullscreen element, per PR feedback/discussion. ([fb4f38b](https://github.com/muxinc/media-chrome/commit/fb4f38b3f6ff1573bd93f6a572ba03d9279b16ce))



## [0.16.3](https://github.com/muxinc/media-chrome/compare/v0.16.2...v0.16.3) (2023-01-03)


### Bug Fixes

* **example:** captions listbox example should point at the correct vtt files ([5be0fc3](https://github.com/muxinc/media-chrome/commit/5be0fc3c2ccb76fda12c27e910766ab1c28392cc))
* listbox should aria-selected the default selection ([9052072](https://github.com/muxinc/media-chrome/commit/9052072d1c31f55ad2b8fe097bd32ce1cab55c71))
* **listbox:** do a null check for default selected element ([c4d4f6d](https://github.com/muxinc/media-chrome/commit/c4d4f6d39465f521a830d8155a71442d7c4ce8cf))
* no need for rounding anymore, step=any ([011940c](https://github.com/muxinc/media-chrome/commit/011940c61c2bde67160b7750cca65251e7ead598)), closes [#394](https://github.com/muxinc/media-chrome/issues/394)


### Features

* listbox should support slotting a slot el ([563a453](https://github.com/muxinc/media-chrome/commit/563a453c8072dac503bb3f7718b76b8f8afa54f1))
* media-chrome-menu-button ([0b4d625](https://github.com/muxinc/media-chrome/commit/0b4d6259eaef3ff4c2720cdeba29c8a052105023))


### Reverts

* Revert "Winamp theme checks (#403)" ([9605f02](https://github.com/muxinc/media-chrome/commit/9605f02184efd79b62a9f317dddb1be824f0f916)), closes [#403](https://github.com/muxinc/media-chrome/issues/403)
* Revert "example: add Winamp theme (#401)" ([7836b25](https://github.com/muxinc/media-chrome/commit/7836b252fd2b30ab7e6a8166b89ecc7f283ec25d)), closes [#401](https://github.com/muxinc/media-chrome/issues/401)



## [0.16.2](https://github.com/muxinc/media-chrome/compare/v0.16.1...v0.16.2) (2022-12-13)


### Bug Fixes

* add listbox role on listbox element itself ([92e702f](https://github.com/muxinc/media-chrome/commit/92e702f56235d60af9898543eccafd7db3f19c06))
* lint errors and add to CI/CD ([c571239](https://github.com/muxinc/media-chrome/commit/c571239d9ec8a52324269a24017c12e13e48dabc))
* listbox may not have a nextOption ([50d92a3](https://github.com/muxinc/media-chrome/commit/50d92a3f713ddc62da80f988e250b6af5a4576c9))
* MEDIA_CONTROLLER moved to MediaStateReceiverAttributes ([9eb52c3](https://github.com/muxinc/media-chrome/commit/9eb52c3f70407cd51da7887e9e5f9a48a0f804d6))
* remove Demuxed theme 2022 from MC bundle ([33d697c](https://github.com/muxinc/media-chrome/commit/33d697cdde818193dcb40a37fc0f31e010a7ffed))
* typescript errors ([983ed78](https://github.com/muxinc/media-chrome/commit/983ed78b7ffc411382b8411f110d9da1046cc2d6))
* use new MediaThemeElement for Demuxed theme ([4a9327b](https://github.com/muxinc/media-chrome/commit/4a9327bbaf9c54f80d5bdc25dfefbd4fd95f469c))


### Features

* add a selectedOptions getter to listbox ([3629c87](https://github.com/muxinc/media-chrome/commit/3629c87e19aa284fddf036354ad9e701847fc6f3))
* add change event to listbox ([4ddb26e](https://github.com/muxinc/media-chrome/commit/4ddb26e6f35255f4c1bf912c985a89d08d68b417))
* add value prop/attr to listitem ([542ae92](https://github.com/muxinc/media-chrome/commit/542ae92de2cf13ef7bb76b2e2b8c8625dfe759bd))
* Captions/Subtitles List ([d12f6fb](https://github.com/muxinc/media-chrome/commit/d12f6fb7d226b4a47a5d29703b6e7a2c3fd9cc2c))



## [0.16.1](https://github.com/muxinc/media-chrome/compare/v0.16.0...v0.16.1) (2022-12-06)


### Bug Fixes

* add a way to package media themes as web comp ([#375](https://github.com/muxinc/media-chrome/issues/375)) ([6857ee6](https://github.com/muxinc/media-chrome/commit/6857ee6f2b1604321b82a19688bbcafa840cf5cb))
* improve CPU usage while playback ([#364](https://github.com/muxinc/media-chrome/issues/364)) ([fae329f](https://github.com/muxinc/media-chrome/commit/fae329f8290b0216584a4e0f3c7fdb114835c560))
* inner template bug ([#381](https://github.com/muxinc/media-chrome/issues/381)) ([e20953a](https://github.com/muxinc/media-chrome/commit/e20953a4d8cdbaca5e04dcc6fbd6d6a0b5f6dbff))
* utils clean up w/ added tests ([#373](https://github.com/muxinc/media-chrome/issues/373)) ([a7db995](https://github.com/muxinc/media-chrome/commit/a7db995b2c720bb401ac877fc95c6c323f889f62))


### Features

* Add HTML based Theme w/ minimal template language ([#362](https://github.com/muxinc/media-chrome/issues/362)) ([a4a4e2c](https://github.com/muxinc/media-chrome/commit/a4a4e2c20782926c0eaaaf16788f35e3af833b69))
* add simple responsive theme ([684ddef](https://github.com/muxinc/media-chrome/commit/684ddefb3aaec463c2041e0e6bb2650538896dc7))
* expose types ([#330](https://github.com/muxinc/media-chrome/issues/330)) ([5ae159f](https://github.com/muxinc/media-chrome/commit/5ae159f30e4c814cb910b64b12df30dd47254655))
* listbox and listitem components ([#365](https://github.com/muxinc/media-chrome/issues/365)) ([15d0934](https://github.com/muxinc/media-chrome/commit/15d0934fcd112de39b2d830eb78f7cfc0518c686))
* use Construcable CSSStyleSheets when available ([eb32514](https://github.com/muxinc/media-chrome/commit/eb32514f99d477d3bfc2260da65a8c0f101d38ed))


### Reverts

* undo changes to media-theme.js ([c565bc9](https://github.com/muxinc/media-chrome/commit/c565bc9b3a476542ddf49fe1df0a8209e4e43935))



# [0.16.0](https://github.com/muxinc/media-chrome/compare/v0.15.1...v0.16.0) (2022-10-28)


### Bug Fixes

* box percentage positioning & time range border glitch ([#345](https://github.com/muxinc/media-chrome/issues/345)) ([57f1023](https://github.com/muxinc/media-chrome/commit/57f1023fa2e7d3b20b76b07b1ae45218e99360d7))



## [0.15.1](https://github.com/muxinc/media-chrome/compare/v0.15.0...v0.15.1) (2022-10-25)


### Bug Fixes

* use composedPath for checking target in schedule inactive event handler ([#355](https://github.com/muxinc/media-chrome/issues/355)) ([c44711d](https://github.com/muxinc/media-chrome/commit/c44711d131dec5ad6981c838a17f9738f74a00d9))



# [0.15.0](https://github.com/muxinc/media-chrome/compare/v0.14.1...v0.15.0) (2022-10-25)


### Bug Fixes

* clicking in play/fullscreen buttons should schedule inactive ([#338](https://github.com/muxinc/media-chrome/issues/338)) ([0b640d0](https://github.com/muxinc/media-chrome/commit/0b640d03a665a113017a3bf8f050c787e2829434)), closes [#188](https://github.com/muxinc/media-chrome/issues/188)
* preview bounds in shadow dom ([#342](https://github.com/muxinc/media-chrome/issues/342)) ([e0b5fa9](https://github.com/muxinc/media-chrome/commit/e0b5fa98378a297042cc957acbc47e67f8acb582))


### Features

* remove esm-module ([#352](https://github.com/muxinc/media-chrome/issues/352)) ([921eda8](https://github.com/muxinc/media-chrome/commit/921eda86043b2fdd76e8bb2974b815103f05bf99))



## [0.14.1](https://github.com/muxinc/media-chrome/compare/v0.14.0...v0.14.1) (2022-10-14)


### Bug Fixes

* call disable on disconnectedCallback ([35f1242](https://github.com/muxinc/media-chrome/commit/35f1242f7affc4e3534e656a82ce6d143200f879))
* don't set attributes in a constructor ([433560e](https://github.com/muxinc/media-chrome/commit/433560e2327f6a136b38cbf8cc64bba9451097c8)), closes [#335](https://github.com/muxinc/media-chrome/issues/335)



# [0.14.0](https://github.com/muxinc/media-chrome/compare/v0.12.0...v0.14.0) (2022-10-10)


### Bug Fixes

* a couple of fixes ([#331](https://github.com/muxinc/media-chrome/issues/331)) ([f4df42f](https://github.com/muxinc/media-chrome/commit/f4df42fb66ff33f40cc1937905f5933bec75aa38))
* properly check iphones for fullscreen unavailability ([#332](https://github.com/muxinc/media-chrome/issues/332)) ([c32c74e](https://github.com/muxinc/media-chrome/commit/c32c74ebf73219919bd96a15796ea008884cd600))
* properly unset poster image sources when they're removed ([#328](https://github.com/muxinc/media-chrome/issues/328)) ([87daae5](https://github.com/muxinc/media-chrome/commit/87daae56b9816818918b7d980e41b780caefbe8c))


### Features

* add poster object fit and position css vars ([#327](https://github.com/muxinc/media-chrome/issues/327)) ([a02bf20](https://github.com/muxinc/media-chrome/commit/a02bf20070a9462d0e085bec90f8c97a295ba4df))



# [0.12.0](https://github.com/muxinc/media-chrome/compare/v0.11.0...v0.12.0) (2022-09-27)


### Bug Fixes

* Safari still uses webkitFullscreenEnabled ([#316](https://github.com/muxinc/media-chrome/issues/316)) ([3850429](https://github.com/muxinc/media-chrome/commit/3850429b2c04327290acb7cbb103c76b8303f502))


### Features

* remove minify/srcmap esm/cjs, add esm-module ([#318](https://github.com/muxinc/media-chrome/issues/318)) ([5ea0d24](https://github.com/muxinc/media-chrome/commit/5ea0d24bc18de58587b8f90137f72cfde585879f))
* support being able to disable buttons, range, and time-display ([#320](https://github.com/muxinc/media-chrome/issues/320)) ([d4129c2](https://github.com/muxinc/media-chrome/commit/d4129c2ee6ef79fafff440e0ba7b3bf9dff55a07))



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



## [0.10.2](https://github.com/muxinc/media-chrome/compare/v0.10.0...v0.10.2) (2022-09-09)


### Bug Fixes

* prevent hotkeys from scrolling page ([#296](https://github.com/muxinc/media-chrome/issues/296)) ([34b9882](https://github.com/muxinc/media-chrome/commit/34b9882f9b5c18fbc659383871e4ea9357be6e1a)), closes [#295](https://github.com/muxinc/media-chrome/issues/295)



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



## [0.8.1](https://github.com/muxinc/media-chrome/compare/v0.6.8...v0.8.1) (2022-07-18)


### Bug Fixes

* audio examples, spotify example ([#265](https://github.com/muxinc/media-chrome/issues/265)) ([128d5c7](https://github.com/muxinc/media-chrome/commit/128d5c780d3238b314ba10b906a9c3890180a8a7))
* box bounds element type error ([6b61552](https://github.com/muxinc/media-chrome/commit/6b615523bce9d3807432563952d90c2dde0e6324))
* cast availability ([#251](https://github.com/muxinc/media-chrome/issues/251)) ([97d20f7](https://github.com/muxinc/media-chrome/commit/97d20f77dc2ef6b648371dd36fa3920dce77f1a1))
* casting state on new cast-button ([fd51440](https://github.com/muxinc/media-chrome/commit/fd514400bf14e3bd3ea895d4ca4c51acd5f9147d))
* chrome-button focus ring consistency ([9d83108](https://github.com/muxinc/media-chrome/commit/9d83108204bc2246ad3648fb8bd6b6c9ffd7c52d))
* focus ring on chrome-range input element ([a1899e9](https://github.com/muxinc/media-chrome/commit/a1899e9c402c9449c3aaee6a67ca1e770dfbb1de))
* have improved styling with host-context and chrome-range ([335b875](https://github.com/muxinc/media-chrome/commit/335b875c845b2a8ce72486c11598dd7f0f663735))
* hide gesture-layer when in audio mode ([77f7005](https://github.com/muxinc/media-chrome/commit/77f70054f3e8d08a194b7e2c64ccd8cbbc792c66))
* mediaControllerId var bug ([b5faf44](https://github.com/muxinc/media-chrome/commit/b5faf44e3446fcd34416c7b522a6b8d15db21e20))
* reset playbackRate UI after loadstart ([#249](https://github.com/muxinc/media-chrome/issues/249)) ([59f4ed4](https://github.com/muxinc/media-chrome/commit/59f4ed40dd04f7711b856a01e0fe5fa43474f1ae))
* style override from Tailwind CSS ([7590ffb](https://github.com/muxinc/media-chrome/commit/7590ffb1980172d047e6e34999230c035dbc6a2c)), closes [#262](https://github.com/muxinc/media-chrome/issues/262)
* text-display should have consistent focus ring to chrome-button ([f1bad34](https://github.com/muxinc/media-chrome/commit/f1bad345b9fd782f0449f97f48d708c234357447))
* timerange progress jumpy w/out playback rate ([2b2d360](https://github.com/muxinc/media-chrome/commit/2b2d360cd9b6f9d08068c00869c95ea1b2ff68de))


### Features

* improve time range behavior ([#255](https://github.com/muxinc/media-chrome/issues/255)) ([2aa7223](https://github.com/muxinc/media-chrome/commit/2aa7223977a1f8106807d26852b0108efd9aaa4e))



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



# [1.0.0](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.5...v1.0.0) (2023-05-30)


### Features

* icon slots for single slot controls ([#645](https://github.com/muxinc/media-chrome/issues/645)) ([17869cb](https://github.com/muxinc/media-chrome/commit/17869cb1172ee646f1219b6a403361101a281de8))


### BREAKING CHANGES

* Icon slots have been renamed to "icon" for Airplay, Seek Forward, Seek Backward, and Loading Indicator controls.



# [1.0.0-rc.5](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.4...v1.0.0-rc.5) (2023-05-26)


### Bug Fixes

* media display override issue ([#648](https://github.com/muxinc/media-chrome/issues/648)) ([dfc6a13](https://github.com/muxinc/media-chrome/commit/dfc6a13e46c2beb9f54511581e5ad5c281e592c0))


### Features

* Icon slots for buttons with multiple slots ([#643](https://github.com/muxinc/media-chrome/issues/643)) ([53e7aad](https://github.com/muxinc/media-chrome/commit/53e7aade3e2eb99481529e75b5e12e9f3cc0d0fa))



# [1.0.0-rc.4](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2023-05-23)


### Bug Fixes

* fullscreen state getter w/o event ([#634](https://github.com/muxinc/media-chrome/issues/634)) ([2dba034](https://github.com/muxinc/media-chrome/commit/2dba03418341988b56ba7c433b81142e6d1d2141)), closes [#627](https://github.com/muxinc/media-chrome/issues/627)
* Make sure we monitor slotchange on slots for media state receive… ([#639](https://github.com/muxinc/media-chrome/issues/639)) ([6710381](https://github.com/muxinc/media-chrome/commit/671038123e629ddbac79f17d99a3c80728568eab))



# [1.0.0-rc.3](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2023-05-22)


### Bug Fixes

* iOS fullscreen state bug ([#633](https://github.com/muxinc/media-chrome/issues/633)) ([505e0d1](https://github.com/muxinc/media-chrome/commit/505e0d15bffbe2bc63691f163c0538b879cd43e8)), closes [#593](https://github.com/muxinc/media-chrome/issues/593)


### Features

* add icon slot to mute button ([#629](https://github.com/muxinc/media-chrome/issues/629)) ([41169a0](https://github.com/muxinc/media-chrome/commit/41169a065742379e28152b6a32a795e2db47dd4d))
* add mediaended attr to play button ([#630](https://github.com/muxinc/media-chrome/issues/630)) ([3141864](https://github.com/muxinc/media-chrome/commit/3141864deeb651fcbcbd2cc1bfe133e356efb1f6))



# [1.0.0-rc.2](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2023-05-16)


### Bug Fixes

* Missing parenthesis in control bar style ([#626](https://github.com/muxinc/media-chrome/issues/626)) ([76a1c8f](https://github.com/muxinc/media-chrome/commit/76a1c8fadc90ab11dae14f27f3cc61eb87e53cef))



# [1.0.0-rc.1](https://github.com/muxinc/media-chrome/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2023-05-15)


### Bug Fixes

* Update official themes to use lowercase attrs consistently. ([#623](https://github.com/muxinc/media-chrome/issues/623)) ([5d62f93](https://github.com/muxinc/media-chrome/commit/5d62f93b2d78dcb1eba5fb7b1e83434d73e3ce11))



# [1.0.0-rc.0](https://github.com/muxinc/media-chrome/compare/v0.21.0...v1.0.0-rc.0) (2023-05-12)


### Bug Fixes

* add default unavailable CSS to themes ([#539](https://github.com/muxinc/media-chrome/issues/539)) ([f9c5a9e](https://github.com/muxinc/media-chrome/commit/f9c5a9e921cca14a4e8858fcbdd234de4286c64a))
* Better color contrast on breakpoint docs ([#614](https://github.com/muxinc/media-chrome/issues/614)) ([d869d73](https://github.com/muxinc/media-chrome/commit/d869d73a407fd5620fc2bf16f31665d0bd0f6553))
* buffered attr ([#544](https://github.com/muxinc/media-chrome/issues/544)) ([7efe18a](https://github.com/muxinc/media-chrome/commit/7efe18ac00fc84648e417d23ebcaf643b2c4fae3))
* casting ([#618](https://github.com/muxinc/media-chrome/issues/618)) ([106e3dd](https://github.com/muxinc/media-chrome/commit/106e3ddb1ab3c12619b09b2d240a2691745aeea3))
* Comparison of text track lists ([#600](https://github.com/muxinc/media-chrome/issues/600)) ([87daf00](https://github.com/muxinc/media-chrome/commit/87daf00d5c1fabf0c66cf97ef63beae328d8986c))
* css variables consistency updates ([#554](https://github.com/muxinc/media-chrome/issues/554)) ([f2876db](https://github.com/muxinc/media-chrome/commit/f2876db9b864256fa7419d5ab595ad026ef69161))
* dash in breakpoint attr ([#540](https://github.com/muxinc/media-chrome/issues/540)) ([23c2de9](https://github.com/muxinc/media-chrome/commit/23c2de9dbf8fb07c609af23ba06d3a11f76f390a))
* don't auto-size ranges in media-control-bar if they're all alone. ([#591](https://github.com/muxinc/media-chrome/issues/591)) ([276b96d](https://github.com/muxinc/media-chrome/commit/276b96de8fbf3ad1e4ea4384253e57f08395067a))
* forward button ([#605](https://github.com/muxinc/media-chrome/issues/605)) ([4c81eed](https://github.com/muxinc/media-chrome/commit/4c81eed5b1562a2af0008baeeffeff778186313c))
* Let media-control-bar size (height) range components like it doe… ([#582](https://github.com/muxinc/media-chrome/issues/582)) ([d1a65da](https://github.com/muxinc/media-chrome/commit/d1a65da3afdc94b6e19da68f3298d1e26b0b60e6))
* selectmenu mediacontroller and missed examples from first pass. ([#541](https://github.com/muxinc/media-chrome/issues/541)) ([2ab9032](https://github.com/muxinc/media-chrome/commit/2ab90323a1bd20f3456e95e1567b379e5e7373b4))
* show chrome on pointermove for custom video ([#604](https://github.com/muxinc/media-chrome/issues/604)) ([de8035b](https://github.com/muxinc/media-chrome/commit/de8035bc5cf44c83192d0d6ad0eaef1bfa406648)), closes [#451](https://github.com/muxinc/media-chrome/issues/451) [#298](https://github.com/muxinc/media-chrome/issues/298)
* show pointer for theme toggle icons ([#611](https://github.com/muxinc/media-chrome/issues/611)) ([71358ce](https://github.com/muxinc/media-chrome/commit/71358ceb2f2d1e3a0300d1bfe7628820e5e1764d))
* use default values in new prop getters for seek btns. Use props … ([#592](https://github.com/muxinc/media-chrome/issues/592)) ([c843a5e](https://github.com/muxinc/media-chrome/commit/c843a5e3ea7da70becb9b0516cb51c4c2b51bc30))


### Features

* add defaultsubtitles to media-controller ([#551](https://github.com/muxinc/media-chrome/issues/551)) ([fdbc8c7](https://github.com/muxinc/media-chrome/commit/fdbc8c7719b5e54086ae12954b6d59fbd1c33021))
* add novolumepref attribute to prefer writing to localStorage ([#575](https://github.com/muxinc/media-chrome/issues/575)) ([31bdb11](https://github.com/muxinc/media-chrome/commit/31bdb1188236e0411e15f284554604f03d2b1a4b))
* Add props and types to seek forwards and backwards elements ([#566](https://github.com/muxinc/media-chrome/issues/566)) ([0259c3a](https://github.com/muxinc/media-chrome/commit/0259c3abaa578444456e62f391d8e5a7a586d0e1))
* Adding custom event for breakingpoint changing ([#584](https://github.com/muxinc/media-chrome/issues/584)) ([1cf3579](https://github.com/muxinc/media-chrome/commit/1cf3579123ba4de59a5a70fed4d89637d7652a09))
* Airplay, Captions, and Cast button props ([#587](https://github.com/muxinc/media-chrome/issues/587)) ([14156f7](https://github.com/muxinc/media-chrome/commit/14156f77e9de73884cb23f9e748227a9f1659157))
* combine MEDIA_CAPTIONS_LIST into MEDIA_SUBTITLES_LIST ([#546](https://github.com/muxinc/media-chrome/issues/546)) ([03e62e6](https://github.com/muxinc/media-chrome/commit/03e62e616b2f7bef46b1331079421fa5f17736d1))
* Drop all deprecated or redundant components. Update tests, examples, docs, etc. based on changes. ([#560](https://github.com/muxinc/media-chrome/issues/560)) ([20fca8c](https://github.com/muxinc/media-chrome/commit/20fca8cf4253482d93608b1c6edc728aa6819375))
* Duration, Fullscreen, and Gesture props ([#595](https://github.com/muxinc/media-chrome/issues/595)) ([748c013](https://github.com/muxinc/media-chrome/commit/748c01315f5654eb21487418c9cf216f8d53eee3))
* fix casing in attributes and vars ([#606](https://github.com/muxinc/media-chrome/issues/606)) ([502fff5](https://github.com/muxinc/media-chrome/commit/502fff531df28da43451e166ba710c59d7f43a5b))
* Live Button and Mute button props ([#596](https://github.com/muxinc/media-chrome/issues/596)) ([d6b5ad6](https://github.com/muxinc/media-chrome/commit/d6b5ad6b7f61cc60d989f4ea591707dbc8433683))
* Media Time Range and Volume Range props ([#599](https://github.com/muxinc/media-chrome/issues/599)) ([61d6ddd](https://github.com/muxinc/media-chrome/commit/61d6dddf5dc140cb91007c80713b44aa39c3d352))
* Migrate all attributes to lowercase ('smushedcase'). ([#537](https://github.com/muxinc/media-chrome/issues/537)) ([fe9eadc](https://github.com/muxinc/media-chrome/commit/fe9eadc98af47752cc7b362379cd3fc4f24e5a14))
* move loading-indicator visibility to be done in CSS only ([#586](https://github.com/muxinc/media-chrome/issues/586)) ([0d989b3](https://github.com/muxinc/media-chrome/commit/0d989b34e46f36af3fb2fe017b026932eec13f95))
* Pip button, Play button, and Playback Rates props ([#597](https://github.com/muxinc/media-chrome/issues/597)) ([3d96b16](https://github.com/muxinc/media-chrome/commit/3d96b16deeb90b9961582b811025ce00401b67e9))
* Poster Image, Preview Thumbnail, and Time Display props ([#598](https://github.com/muxinc/media-chrome/issues/598)) ([7126ddf](https://github.com/muxinc/media-chrome/commit/7126ddffcda160a2c7186d1447be1493caed0bd2))


### BREAKING CHANGES

* removed keys() from AttributeTokenList
* remove `isloading` attribute from media-loading-indicator.
* Change `--media-live-indicator-color` to `--media-live-button-indicator-color`, `--media-time-buffered-color` to `--media-time-range-buffered-color`, `--media-background-position` to `--media-poster-image-background-position`, and `--media-background-size` to `--media-poster-image-background-size`.
* remove defaultshowing attribute from
media-captions-button and media-captions-selectmenu.
* remove MEDIA_CAPTIONS_LIST, MEDIA_CAPTIONS_SHOWING, no-subtitles-fallback, MEDIA_SHOW_CAPTIONS_REQUEST, MEDIA_DISABLE_CAPTIONS_REQUEST, and MEDIA_CAPTIONS_LIST & MEDIA_CAPTIONS_SHOWING change events.



# [0.21.0](https://github.com/muxinc/media-chrome/compare/v0.20.4...v0.21.0) (2023-04-17)


### Bug Fixes

* Automatically serialize arrays as arr.join(' ') for react components ([#527](https://github.com/muxinc/media-chrome/issues/527)) ([c24025c](https://github.com/muxinc/media-chrome/commit/c24025c75c5f2d957b7827d06b9d30a41686c360))
* custom element manifest imports from dist/ ([#521](https://github.com/muxinc/media-chrome/issues/521)) ([32b8149](https://github.com/muxinc/media-chrome/commit/32b8149da9252d699df5ca82a8edd4b29f5638f6))
* font numeric uniform width ([#526](https://github.com/muxinc/media-chrome/issues/526)) ([f31d5a3](https://github.com/muxinc/media-chrome/commit/f31d5a3b7bf28ae92b4b833747ad22d235e9dac5))
* inactive live button ([#535](https://github.com/muxinc/media-chrome/issues/535)) ([8d841ae](https://github.com/muxinc/media-chrome/commit/8d841ae53eeecb8eeb31772f75c8c9ddf061ceb6))
* make DSD (declarative shadow dom) compatible ([#524](https://github.com/muxinc/media-chrome/issues/524)) ([e6105f4](https://github.com/muxinc/media-chrome/commit/e6105f456173225a4f299b2ae6fb4dbf3a4871cf))
* relative src path ([6e45bab](https://github.com/muxinc/media-chrome/commit/6e45bab3e7847a3eed567f57fb093347e44e2b42))


### Features

* introduce a playback rates selectmenu ([#513](https://github.com/muxinc/media-chrome/issues/513)) ([502f83f](https://github.com/muxinc/media-chrome/commit/502f83fa1a9dfc6eabfbe08535fa81097416dbd4))
* remove deprecated, move experimental files ([#525](https://github.com/muxinc/media-chrome/issues/525)) ([13218c0](https://github.com/muxinc/media-chrome/commit/13218c0281a20759c9a352e575249e2a42e911a2))



## [0.20.4](https://github.com/muxinc/media-chrome/compare/v0.20.3...v0.20.4) (2023-04-04)


### Bug Fixes

* media-theme element lazy doc append ([#519](https://github.com/muxinc/media-chrome/issues/519)) ([7efe0e2](https://github.com/muxinc/media-chrome/commit/7efe0e2e3d52a57722d0f3a61fde016d9f40bbdc))



## [0.20.3](https://github.com/muxinc/media-chrome/compare/v0.20.2...v0.20.3) (2023-03-31)


### Bug Fixes

* over firing user-inactive event, attr name ([#515](https://github.com/muxinc/media-chrome/issues/515)) ([26a05f6](https://github.com/muxinc/media-chrome/commit/26a05f6ac4accc47241e17f8c58d1d9269e77722))
* toggle selectmenu via keyboard, hide on click outside of selectmenu ([#514](https://github.com/muxinc/media-chrome/issues/514)) ([df9a50d](https://github.com/muxinc/media-chrome/commit/df9a50d62133d02d53ad749a02e4b801f210d2ef))



## [0.20.2](https://github.com/muxinc/media-chrome/compare/v0.20.1...v0.20.2) (2023-03-30)


### Bug Fixes

* slot for text display, customizable content ([#511](https://github.com/muxinc/media-chrome/issues/511)) ([bf1fc7e](https://github.com/muxinc/media-chrome/commit/bf1fc7ee75f1b638cfa1ceff9c5efa21852ae97f))
* toggle time display on click from remaining / not remaining ([#510](https://github.com/muxinc/media-chrome/issues/510)) ([826131c](https://github.com/muxinc/media-chrome/commit/826131c402b46a70fe33eb7cc967e5b27f5a64ab))



## [0.20.1](https://github.com/muxinc/media-chrome/compare/v0.20.0...v0.20.1) (2023-03-28)


### Bug Fixes

* add support for negations ([#509](https://github.com/muxinc/media-chrome/issues/509)) ([dc1e574](https://github.com/muxinc/media-chrome/commit/dc1e5749e43e9b8fa2220e1c01efe49b8558251b))



# [0.20.0](https://github.com/muxinc/media-chrome/compare/v0.19.1...v0.20.0) (2023-03-27)


### Bug Fixes

* add non-default buttons to Minimal theme ([#507](https://github.com/muxinc/media-chrome/issues/507)) ([bcb218e](https://github.com/muxinc/media-chrome/commit/bcb218efb2e1897d6431bfc0819dd7402a906445))
* add poster slot, media loading indicator to Microvideo ([#505](https://github.com/muxinc/media-chrome/issues/505)) ([6ea6079](https://github.com/muxinc/media-chrome/commit/6ea607921bf682269bd963001f35fa5ccca6506e))
* add style tweaks to Minimal, Microvideo ([#508](https://github.com/muxinc/media-chrome/issues/508)) ([cad6841](https://github.com/muxinc/media-chrome/commit/cad68415b8e8755b5c357984d5baa9385fd3d2d3))


### Features

* Minimal theme ([#492](https://github.com/muxinc/media-chrome/issues/492)) ([cfc84f6](https://github.com/muxinc/media-chrome/commit/cfc84f68057b2140ae942aa447358893f6541836))



## [0.19.1](https://github.com/muxinc/media-chrome/compare/v0.19.0...v0.19.1) (2023-03-20)


### Bug Fixes

* rename Micro to Microvideo ([#504](https://github.com/muxinc/media-chrome/issues/504)) ([ea96595](https://github.com/muxinc/media-chrome/commit/ea9659529e283945e725f2baec4d7ed6bcf75395))



# [0.19.0](https://github.com/muxinc/media-chrome/compare/v0.18.8...v0.19.0) (2023-03-20)


### Bug Fixes

* add disabled styles for Micro theme ([#500](https://github.com/muxinc/media-chrome/issues/500)) ([94ccd2b](https://github.com/muxinc/media-chrome/commit/94ccd2ba6c44e6ee279f4dc5d8527456c5c0ac75))
* add display CSS vars ([#497](https://github.com/muxinc/media-chrome/issues/497)) ([89353e5](https://github.com/muxinc/media-chrome/commit/89353e52c50916de740704dfb7d428727155aca5))
* theme inline-block, improve responsive theme ([#496](https://github.com/muxinc/media-chrome/issues/496)) ([56b549c](https://github.com/muxinc/media-chrome/commit/56b549c0a12cfbccc63555c92eae818ceef1481b))


### Features

* support fetching theme HTML files ([#491](https://github.com/muxinc/media-chrome/issues/491)) ([1457651](https://github.com/muxinc/media-chrome/commit/14576515b5798430c26a58f3046b6efbcd85c2fb))



## [0.18.8](https://github.com/muxinc/media-chrome/compare/v0.18.7...v0.18.8) (2023-03-08)


### Bug Fixes

* preventClick on the button given to selectmenu unconditionally ([#495](https://github.com/muxinc/media-chrome/issues/495)) ([05ed8fb](https://github.com/muxinc/media-chrome/commit/05ed8fb4b3c917807f9e25b87ace5128188d58c7))



## [0.18.7](https://github.com/muxinc/media-chrome/compare/v0.18.6...v0.18.7) (2023-03-08)


### Bug Fixes

* improve inferred media-ui-extension values ([#494](https://github.com/muxinc/media-chrome/issues/494)) ([9028129](https://github.com/muxinc/media-chrome/commit/90281290051c00acc95013ed82c712c77f4229e9))



## [0.18.6](https://github.com/muxinc/media-chrome/compare/v0.18.5...v0.18.6) (2023-03-07)


### Bug Fixes

* add default much used styles to theme ([#490](https://github.com/muxinc/media-chrome/issues/490)) ([bd778fa](https://github.com/muxinc/media-chrome/commit/bd778fac5852f6073de7d3d9da7fd04918e9cb9e))
* **experimental:** media-chrome-selectmenu and media-captions-selectmenu ([#471](https://github.com/muxinc/media-chrome/issues/471)) ([6d6ddc3](https://github.com/muxinc/media-chrome/commit/6d6ddc3ffeff1775751ed9a5ef9b6c13b89754d0))
* nullish coalesce operator, improve process ([#484](https://github.com/muxinc/media-chrome/issues/484)) ([84c3c12](https://github.com/muxinc/media-chrome/commit/84c3c12d446f62a5b275fee24ada8bb6633ca631))



## [0.18.5](https://github.com/muxinc/media-chrome/compare/v0.18.4...v0.18.5) (2023-02-27)


### Bug Fixes

* add --media-range-track-color for track ([862898b](https://github.com/muxinc/media-chrome/commit/862898bdf5516618d1135963df6ca4a8bbfdee7f))
* catch play promise internally ([#479](https://github.com/muxinc/media-chrome/issues/479)) ([c77cd43](https://github.com/muxinc/media-chrome/commit/c77cd431763062520bdfb8db7217f18083ea560d))
* decoupled controller in media-theme ([#459](https://github.com/muxinc/media-chrome/issues/459)) ([3852292](https://github.com/muxinc/media-chrome/commit/385229288fc48f129079641df7423cc156bd4fe9))
* rename live edge override attribute to liveedgeoffset. Code cleanup per PR feedback. ([0edad38](https://github.com/muxinc/media-chrome/commit/0edad38449b816b27d0b960890cc5098df72cc38))
* Use default-stream-type when slotted media streamType is unknown. ([#480](https://github.com/muxinc/media-chrome/issues/480)) ([284443d](https://github.com/muxinc/media-chrome/commit/284443d12c4040365da83d0bf95b52e8c5436331))


### Features

* add Micro theme ([#469](https://github.com/muxinc/media-chrome/issues/469)) ([4181c36](https://github.com/muxinc/media-chrome/commit/4181c36b6a0ed31a26e88e073a99b8d6f54608bd))
* **live-edge-window:** Add basic support for m-ui-e liveEdgeStart proposal. ([1214369](https://github.com/muxinc/media-chrome/commit/12143695f32a6dce894ef2f1f9054e676c2ad01b))
* **media-live-button:** Implement paused behaviors and presentation for component. ([20838e1](https://github.com/muxinc/media-chrome/commit/20838e104d30b56377d3cb97ebf81254a6146099))
* **stream-type:** Add support for m-ui-e streamType proposal. ([50f4a2f](https://github.com/muxinc/media-chrome/commit/50f4a2fbfaf600ca556c997f0140789a27cc3e6a))
* **target-live-window:** Add basic support for m-ui-e targetLiveWindow proposal. ([c450348](https://github.com/muxinc/media-chrome/commit/c450348fe4cd53138c1e255990a03fb4020dd51a))



## [0.18.4](https://github.com/muxinc/media-chrome/compare/v0.18.3...v0.18.4) (2023-02-16)


### Bug Fixes

* create theme template on construction ([#477](https://github.com/muxinc/media-chrome/issues/477)) ([fe1ca19](https://github.com/muxinc/media-chrome/commit/fe1ca19ea29b0a2f1c3a197f609635d36e04c1b9))



## [0.18.3](https://github.com/muxinc/media-chrome/compare/v0.18.2...v0.18.3) (2023-02-16)


### Bug Fixes

* add lazy template prop to theme el ([#474](https://github.com/muxinc/media-chrome/issues/474)) ([9e904ef](https://github.com/muxinc/media-chrome/commit/9e904ef93ac5179047f87264bd4a58d999b32e22))



## [0.18.2](https://github.com/muxinc/media-chrome/compare/v0.18.1...v0.18.2) (2023-02-06)


### Bug Fixes

* **experimental:** media-captions-menu-button relative file locations ([#466](https://github.com/muxinc/media-chrome/issues/466)) ([53c17b1](https://github.com/muxinc/media-chrome/commit/53c17b198a7ec55389d9295253a8673e8bd4ec0a))
* **experimental:** move media-captions-menu-button to experimental folder ([#464](https://github.com/muxinc/media-chrome/issues/464)) ([3ddf3a9](https://github.com/muxinc/media-chrome/commit/3ddf3a904ea6a0fb250253b6c035323e280713fc))



## [0.18.1](https://github.com/muxinc/media-chrome/compare/v0.18.0...v0.18.1) (2023-01-31)


### Bug Fixes

* render on all attr changes, also removal ([#461](https://github.com/muxinc/media-chrome/issues/461)) ([f36b8ce](https://github.com/muxinc/media-chrome/commit/f36b8ce45b72fc226c87cce45235eef408b84461))



# [0.18.0](https://github.com/muxinc/media-chrome/compare/v0.17.1...v0.18.0) (2023-01-30)


### Bug Fixes

* add template caches for partial templates ([bf075c7](https://github.com/muxinc/media-chrome/commit/bf075c77934a1aeb3d216c1c6009880fb28f1a6b))
* add template instance caching in if directive ([2896118](https://github.com/muxinc/media-chrome/commit/289611899aeb07c460a6c7261cf128f62fad7ffd))
* keyDown in listbox should preventDefault, add f,c,k,m to keysUsed of captions-menu-button ([#449](https://github.com/muxinc/media-chrome/issues/449)) ([a6dcbb7](https://github.com/muxinc/media-chrome/commit/a6dcbb71709eba40a066b18018ff38e9ed63fdd0))
* overwrite priority template vars ([0e1be99](https://github.com/muxinc/media-chrome/commit/0e1be996d22e7377652689e696f1cfba3f9cbbee))
* remove `audio` template var ([ee596c4](https://github.com/muxinc/media-chrome/commit/ee596c4b034ea86c22a177189c42161a8fe5cc1d))
* remove old MediaTheme element ([#457](https://github.com/muxinc/media-chrome/issues/457)) ([57277b7](https://github.com/muxinc/media-chrome/commit/57277b769148b0d2ef1af16034ad58afc609debd))
* removing non existing token ([22bc6f5](https://github.com/muxinc/media-chrome/commit/22bc6f5eeb9109a1ab360b104a8a50a2722bbb54))


### Features

* experimental captions menu button fixes ([#442](https://github.com/muxinc/media-chrome/issues/442)) ([bb924c1](https://github.com/muxinc/media-chrome/commit/bb924c1550fc24f4bd060d0f3275637d7187052a))
* **experimental:** expose listbox in menu-button as a part ([#460](https://github.com/muxinc/media-chrome/issues/460)) ([d4bd8da](https://github.com/muxinc/media-chrome/commit/d4bd8da6ab7634ad3626f25d3deb7def0fff4165))



## [0.17.1](https://github.com/muxinc/media-chrome/compare/v0.17.0...v0.17.1) (2023-01-18)


### Bug Fixes

* add `audio` as template param ([8ca0ff6](https://github.com/muxinc/media-chrome/commit/8ca0ff64841d0a146b645df532880c3028be2f7d))
* add `block` attr, joined directive/expression ([fd4ac00](https://github.com/muxinc/media-chrome/commit/fd4ac0028bff38dc7ecc9d6b7c7c77f66937d417))
* add breakpoints config attribute ([2410329](https://github.com/muxinc/media-chrome/commit/2410329dfd9705afd64ac4d06faa03747215efb4))
* add containerSize to template ([008d8d5](https://github.com/muxinc/media-chrome/commit/008d8d5499f1708e95ff8d35cb86519081e1c1f1))
* add easier very large size names ([35bf0c7](https://github.com/muxinc/media-chrome/commit/35bf0c7a6e492386ce04a65b57bf030eaef2a320))
* add greater than, less than operators ([67b389e](https://github.com/muxinc/media-chrome/commit/67b389eaed575e5a20e2f0fb113af9c691297ea7))
* add stream-type to the Media Chrome theme ([4673f3c](https://github.com/muxinc/media-chrome/commit/4673f3ceab7338a1531911f8c8bc6189a6cc44e7))
* adds a 0:00 default time, fixes [#88](https://github.com/muxinc/media-chrome/issues/88) ([#430](https://github.com/muxinc/media-chrome/issues/430)) ([7d49afa](https://github.com/muxinc/media-chrome/commit/7d49afa166b95a148b1591f43819c544c65d9a44))
* allow slotting icons for the captions menu button and captions listbox indicator ([e62ee71](https://github.com/muxinc/media-chrome/commit/e62ee71085d6aa73d689c6cdb0ae257bd20166db))
* blurhash dimensions ([#432](https://github.com/muxinc/media-chrome/issues/432)) ([c88fb04](https://github.com/muxinc/media-chrome/commit/c88fb049bbb170ec81633e5114229c9aee03d752))
* **captions-listbox:** properly handle removing tracks ([9e8dff4](https://github.com/muxinc/media-chrome/commit/9e8dff40b65eb83b44c55846456006d9af84951b))
* **captions-menu-button:** keep menu within the player bounds ([72c7273](https://github.com/muxinc/media-chrome/commit/72c7273f518c3ca027bee6191b3592abee0afb77))
* change to inclusive breakpoints ([d0802b3](https://github.com/muxinc/media-chrome/commit/d0802b3c84274ea6d149f2953db651121a393d76))
* limit checking media-controller attrs ([b06dc9f](https://github.com/muxinc/media-chrome/commit/b06dc9f0bb5c45ae72a7085301406e6eab69589e))
* **listbox:** add hover styles ([d91c88c](https://github.com/muxinc/media-chrome/commit/d91c88c9c260d6360f4ecadd75209528e808ec29))
* **listbox:** improve contrast ratios of listbox colors ([0fd50fd](https://github.com/muxinc/media-chrome/commit/0fd50fd56a8988f688e1b7405624e1c85caca1f5))
* **listbox:** switch to display inline-flex ([2f1d0b8](https://github.com/muxinc/media-chrome/commit/2f1d0b87be63506258a3a9a87e64f5463f08a0b5))
* listitem should get pointer cursor ([8e9301c](https://github.com/muxinc/media-chrome/commit/8e9301cd81ffc996c4e82f5769296e235b0ba163))
* Media Live Button style changes during live window ([#440](https://github.com/muxinc/media-chrome/issues/440)) ([e709e7f](https://github.com/muxinc/media-chrome/commit/e709e7f57fd791295031cc0cc5ecc2935b685038))
* **minimal-slotted-media:** Do not assume media.seekable will be defined on the slotted media. ([65895e9](https://github.com/muxinc/media-chrome/commit/65895e94f46457ebeae71d5b5410ca1d2ea5f855))
* preliminary `media-target-live-window` attr ([c4b2286](https://github.com/muxinc/media-chrome/commit/c4b228632dab7aeb1ef4634a93c5f2641baa5ac9))
* properly select Off item if captions turned off elsewhere ([8a0b139](https://github.com/muxinc/media-chrome/commit/8a0b139419000acea4df9ebeaea1ca9773997f76))
* remove media-container-size from MediaUIAttr ([4027a8d](https://github.com/muxinc/media-chrome/commit/4027a8d105137fbdaecc8bbbdaa3e43fb7b06e83))
* remove unused containerSize ([caa6eeb](https://github.com/muxinc/media-chrome/commit/caa6eeb3cb4381ad75280e6a4820bf6c6f4841b7))
* render undefined param ([69a92fe](https://github.com/muxinc/media-chrome/commit/69a92fe8542fcea23ded95bbd8d697a2dc81156c))
* set font-family on listbox ([80ae206](https://github.com/muxinc/media-chrome/commit/80ae20690ca5b368f60a32871edef1314dba90cd))
* slotted poster is not hidden ([#431](https://github.com/muxinc/media-chrome/issues/431)) ([4a3720e](https://github.com/muxinc/media-chrome/commit/4a3720efec9e3d90afffc2da3162fc0640dce117))
* use `breakpoint-x` and `breakpoints` attrs ([176db3c](https://github.com/muxinc/media-chrome/commit/176db3cde1516dade394c91c4bc98575ab9f32d4))
* use shorthand if/foreach/partial attrs ([6dc3145](https://github.com/muxinc/media-chrome/commit/6dc3145c0f4b20216fd36a6d561c341815a7c98d))
* use textContent.toLowerCase() in listbox for more lenient search ([7d225dd](https://github.com/muxinc/media-chrome/commit/7d225ddc0440d19df06bb8701086a904fe2b27bf))


### Features

* add an Off item to captions-listbox ([f73d784](https://github.com/muxinc/media-chrome/commit/f73d7848de2c75c4e515a7b5ac9a77380f4ab9dd))
* add breakpoint params ([c17bb17](https://github.com/muxinc/media-chrome/commit/c17bb1790d9a440edebd8fa2bcabd8f51bf5d52f))
* add default styles to listbox and listitem ([9eace4a](https://github.com/muxinc/media-chrome/commit/9eace4a10b3dfd4ac73730992205def13255ce92))
* container-size attr w/ premeditated naming ([cfc43d6](https://github.com/muxinc/media-chrome/commit/cfc43d630ba51d4ba444bbabd0019bd8a15a830d))
* media-captions-menu-button ([178b655](https://github.com/muxinc/media-chrome/commit/178b65514be95e22d92be31253e304b2b8845ee4))



# [0.17.0](https://github.com/muxinc/media-chrome/compare/v0.16.3...v0.17.0) (2023-01-06)


### Bug Fixes

* **configurable-fullscreen-element:** Ignore misleading typescript error. ([71ad4e3](https://github.com/muxinc/media-chrome/commit/71ad4e3854715d6555aaa4750b9ff428f7399394))
* remove unused property ([#413](https://github.com/muxinc/media-chrome/issues/413)) ([2beac41](https://github.com/muxinc/media-chrome/commit/2beac41071147bf191626275fb095d6e96305469))
* remove web component class globals ([5c7acfb](https://github.com/muxinc/media-chrome/commit/5c7acfbdd0998f6b18e8dc2c01006abfa8ce7b58)), closes [#252](https://github.com/muxinc/media-chrome/issues/252)
* use npx if needed for docs build ([a28b60a](https://github.com/muxinc/media-chrome/commit/a28b60a98761a64c53ac8dea7a40de06276eef05))


### Features

* **configurable-full-screen:** Add an example taking advantage of configurable fullscreen target. ([8c2e3d5](https://github.com/muxinc/media-chrome/commit/8c2e3d51ed5fcf7971f3c40d40bd2a57ef8ebb03))
* **configurable-fullscreen-element:** Allow Media Controller to target a fullscreenElement other than itself. ([817408e](https://github.com/muxinc/media-chrome/commit/817408e3cee538f9c0bad6721aaec21904392a1b))
* **configurable-fullscreen-element:** Handle shadow DOM + fullscreen-element id cases better ([d0cb339](https://github.com/muxinc/media-chrome/commit/d0cb3397c71fb24d685370394f68e0bc000b4a6c))
* **configurable-fullscreen-element:** Keep parity between attribute and prop for fullscreen element, per PR feedback/discussion. ([fb4f38b](https://github.com/muxinc/media-chrome/commit/fb4f38b3f6ff1573bd93f6a572ba03d9279b16ce))



## [0.16.3](https://github.com/muxinc/media-chrome/compare/v0.16.2...v0.16.3) (2023-01-03)


### Bug Fixes

* **example:** captions listbox example should point at the correct vtt files ([5be0fc3](https://github.com/muxinc/media-chrome/commit/5be0fc3c2ccb76fda12c27e910766ab1c28392cc))
* listbox should aria-selected the default selection ([9052072](https://github.com/muxinc/media-chrome/commit/9052072d1c31f55ad2b8fe097bd32ce1cab55c71))
* **listbox:** do a null check for default selected element ([c4d4f6d](https://github.com/muxinc/media-chrome/commit/c4d4f6d39465f521a830d8155a71442d7c4ce8cf))
* no need for rounding anymore, step=any ([011940c](https://github.com/muxinc/media-chrome/commit/011940c61c2bde67160b7750cca65251e7ead598)), closes [#394](https://github.com/muxinc/media-chrome/issues/394)


### Features

* listbox should support slotting a slot el ([563a453](https://github.com/muxinc/media-chrome/commit/563a453c8072dac503bb3f7718b76b8f8afa54f1))
* media-chrome-menu-button ([0b4d625](https://github.com/muxinc/media-chrome/commit/0b4d6259eaef3ff4c2720cdeba29c8a052105023))


### Reverts

* Revert "Winamp theme checks (#403)" ([9605f02](https://github.com/muxinc/media-chrome/commit/9605f02184efd79b62a9f317dddb1be824f0f916)), closes [#403](https://github.com/muxinc/media-chrome/issues/403)
* Revert "example: add Winamp theme (#401)" ([7836b25](https://github.com/muxinc/media-chrome/commit/7836b252fd2b30ab7e6a8166b89ecc7f283ec25d)), closes [#401](https://github.com/muxinc/media-chrome/issues/401)



## [0.16.2](https://github.com/muxinc/media-chrome/compare/v0.16.1...v0.16.2) (2022-12-13)


### Bug Fixes

* add listbox role on listbox element itself ([92e702f](https://github.com/muxinc/media-chrome/commit/92e702f56235d60af9898543eccafd7db3f19c06))
* lint errors and add to CI/CD ([c571239](https://github.com/muxinc/media-chrome/commit/c571239d9ec8a52324269a24017c12e13e48dabc))
* listbox may not have a nextOption ([50d92a3](https://github.com/muxinc/media-chrome/commit/50d92a3f713ddc62da80f988e250b6af5a4576c9))
* MEDIA_CONTROLLER moved to MediaStateReceiverAttributes ([9eb52c3](https://github.com/muxinc/media-chrome/commit/9eb52c3f70407cd51da7887e9e5f9a48a0f804d6))
* remove Demuxed theme 2022 from MC bundle ([33d697c](https://github.com/muxinc/media-chrome/commit/33d697cdde818193dcb40a37fc0f31e010a7ffed))
* typescript errors ([983ed78](https://github.com/muxinc/media-chrome/commit/983ed78b7ffc411382b8411f110d9da1046cc2d6))
* use new MediaThemeElement for Demuxed theme ([4a9327b](https://github.com/muxinc/media-chrome/commit/4a9327bbaf9c54f80d5bdc25dfefbd4fd95f469c))


### Features

* add a selectedOptions getter to listbox ([3629c87](https://github.com/muxinc/media-chrome/commit/3629c87e19aa284fddf036354ad9e701847fc6f3))
* add change event to listbox ([4ddb26e](https://github.com/muxinc/media-chrome/commit/4ddb26e6f35255f4c1bf912c985a89d08d68b417))
* add value prop/attr to listitem ([542ae92](https://github.com/muxinc/media-chrome/commit/542ae92de2cf13ef7bb76b2e2b8c8625dfe759bd))
* Captions/Subtitles List ([d12f6fb](https://github.com/muxinc/media-chrome/commit/d12f6fb7d226b4a47a5d29703b6e7a2c3fd9cc2c))



## [0.16.1](https://github.com/muxinc/media-chrome/compare/v0.16.0...v0.16.1) (2022-12-06)


### Bug Fixes

* add a way to package media themes as web comp ([#375](https://github.com/muxinc/media-chrome/issues/375)) ([6857ee6](https://github.com/muxinc/media-chrome/commit/6857ee6f2b1604321b82a19688bbcafa840cf5cb))
* improve CPU usage while playback ([#364](https://github.com/muxinc/media-chrome/issues/364)) ([fae329f](https://github.com/muxinc/media-chrome/commit/fae329f8290b0216584a4e0f3c7fdb114835c560))
* inner template bug ([#381](https://github.com/muxinc/media-chrome/issues/381)) ([e20953a](https://github.com/muxinc/media-chrome/commit/e20953a4d8cdbaca5e04dcc6fbd6d6a0b5f6dbff))
* utils clean up w/ added tests ([#373](https://github.com/muxinc/media-chrome/issues/373)) ([a7db995](https://github.com/muxinc/media-chrome/commit/a7db995b2c720bb401ac877fc95c6c323f889f62))


### Features

* Add HTML based Theme w/ minimal template language ([#362](https://github.com/muxinc/media-chrome/issues/362)) ([a4a4e2c](https://github.com/muxinc/media-chrome/commit/a4a4e2c20782926c0eaaaf16788f35e3af833b69))
* add simple responsive theme ([684ddef](https://github.com/muxinc/media-chrome/commit/684ddefb3aaec463c2041e0e6bb2650538896dc7))
* expose types ([#330](https://github.com/muxinc/media-chrome/issues/330)) ([5ae159f](https://github.com/muxinc/media-chrome/commit/5ae159f30e4c814cb910b64b12df30dd47254655))
* listbox and listitem components ([#365](https://github.com/muxinc/media-chrome/issues/365)) ([15d0934](https://github.com/muxinc/media-chrome/commit/15d0934fcd112de39b2d830eb78f7cfc0518c686))
* use Construcable CSSStyleSheets when available ([eb32514](https://github.com/muxinc/media-chrome/commit/eb32514f99d477d3bfc2260da65a8c0f101d38ed))


### Reverts

* undo changes to media-theme.js ([c565bc9](https://github.com/muxinc/media-chrome/commit/c565bc9b3a476542ddf49fe1df0a8209e4e43935))



# [0.16.0](https://github.com/muxinc/media-chrome/compare/v0.15.1...v0.16.0) (2022-10-28)


### Features

* box percentage positioning & time range border glitch ([#345](https://github.com/muxinc/media-chrome/issues/345)) ([57f1023](https://github.com/muxinc/media-chrome/commit/57f1023fa2e7d3b20b76b07b1ae45218e99360d7))



## [0.15.1](https://github.com/muxinc/media-chrome/compare/v0.15.0...v0.15.1) (2022-10-25)


### Bug Fixes

* use composedPath for checking target in schedule inactive event handler ([#355](https://github.com/muxinc/media-chrome/issues/355)) ([c44711d](https://github.com/muxinc/media-chrome/commit/c44711d131dec5ad6981c838a17f9738f74a00d9))



# [0.15.0](https://github.com/muxinc/media-chrome/compare/v0.14.1...v0.15.0) (2022-10-25)


### Bug Fixes

* clicking in play/fullscreen buttons should schedule inactive ([#338](https://github.com/muxinc/media-chrome/issues/338)) ([0b640d0](https://github.com/muxinc/media-chrome/commit/0b640d03a665a113017a3bf8f050c787e2829434)), closes [#188](https://github.com/muxinc/media-chrome/issues/188)
* preview bounds in shadow dom ([#342](https://github.com/muxinc/media-chrome/issues/342)) ([e0b5fa9](https://github.com/muxinc/media-chrome/commit/e0b5fa98378a297042cc957acbc47e67f8acb582))


### Features

* remove esm-module ([#352](https://github.com/muxinc/media-chrome/issues/352)) ([921eda8](https://github.com/muxinc/media-chrome/commit/921eda86043b2fdd76e8bb2974b815103f05bf99))



## [0.14.1](https://github.com/muxinc/media-chrome/compare/v0.14.0...v0.14.1) (2022-10-14)


### Bug Fixes

* call disable on disconnectedCallback ([35f1242](https://github.com/muxinc/media-chrome/commit/35f1242f7affc4e3534e656a82ce6d143200f879))
* don't set attributes in a constructor ([433560e](https://github.com/muxinc/media-chrome/commit/433560e2327f6a136b38cbf8cc64bba9451097c8)), closes [#335](https://github.com/muxinc/media-chrome/issues/335)



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



