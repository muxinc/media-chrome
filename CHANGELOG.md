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



