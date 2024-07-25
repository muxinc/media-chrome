import { WebkitPresentationModes } from '../constants.js';
import { containsComposedNode } from './element-utils.js';
import { document } from './server-safe-globals.js';

// NOTE: (re)defining these types, but more narrowly for API expectations. These should probably be centralized + derived
// once migrated to TypeScript types (CJP)

/**
 * @typedef {Partial<HTMLVideoElement> & {
 *  webkitDisplayingFullscreen?: boolean;
 *  webkitPresentationMode?: 'fullscreen'|'picture-in-picture';
 *  webkitEnterFullscreen?: () => any;
 * }} MediaStateOwner
 */

/**
 * @typedef {Partial<Document|ShadowRoot>} RootNodeStateOwner
 */

/**
 * @typedef {Partial<HTMLElement>} FullScreenElementStateOwner
 */

/**
 * @typedef {object} StateOwners
 * @property {MediaStateOwner} [media]
 * @property {RootNodeStateOwner} [documentElement]
 * @property {FullScreenElementStateOwner} [fullscreenElement]
 */

/** @type {(stateOwners: StateOwners) => Promise<undefined> | undefined} */
export const enterFullscreen = (stateOwners) => {
  const { media, fullscreenElement } = stateOwners;

  // NOTE: Since the fullscreenElement can change and may be a web component,
  // we should not define this at the module level. As an optimization,
  // we could only define/update this somehow based on state owner changes. (CJP)
  const enterFullscreenKey =
    fullscreenElement && 'requestFullscreen' in fullscreenElement
      ? 'requestFullscreen'
      : fullscreenElement && 'webkitRequestFullScreen' in fullscreenElement
      ? 'webkitRequestFullScreen'
      : undefined;

  // Entering fullscreen cases (browser-specific)
  if (enterFullscreenKey) {
    // NOTE: Since the "official" enter fullscreen method yields a Promise that rejects
    // if already in fullscreen, this accounts for those cases.
    const maybePromise = fullscreenElement[enterFullscreenKey]?.();
    if (maybePromise instanceof Promise) {
      return maybePromise.catch(() => {});
    }
  } else if (media?.webkitEnterFullscreen) {
    // Media element fullscreen using iOS API
    media.webkitEnterFullscreen();
  } else if (media?.requestFullscreen) {
    // So media els don't have to implement multiple APIs.
    media.requestFullscreen();
  }
};

const exitFullscreenKey =
  'exitFullscreen' in document
    ? 'exitFullscreen'
    : 'webkitExitFullscreen' in document
    ? 'webkitExitFullscreen'
    : 'webkitCancelFullScreen' in document
    ? 'webkitCancelFullScreen'
    : undefined;

/** @type {(stateOwners: StateOwners) => Promise<undefined> | undefined} */
export const exitFullscreen = (stateOwners) => {
  const { documentElement } = stateOwners;

  // Exiting fullscreen case (generic)
  if (exitFullscreenKey) {
    const maybePromise = documentElement?.[exitFullscreenKey]?.();
    // NOTE: Since the "official" exit fullscreen method yields a Promise that rejects
    // if not in fullscreen, this accounts for those cases.
    if (maybePromise instanceof Promise) {
      return maybePromise.catch(() => {});
    }
  }
};

const fullscreenElementKey =
  'fullscreenElement' in document
    ? 'fullscreenElement'
    : 'webkitFullscreenElement' in document
    ? 'webkitFullscreenElement'
    : undefined;

/** @type {(stateOwners: StateOwners) => FullScreenElementStateOwner | null | undefined} */
export const getFullscreenElement = (stateOwners) => {
  const { documentElement, media } = stateOwners;
  const docFullscreenElement = documentElement?.[fullscreenElementKey];
  if (
    !docFullscreenElement &&
    'webkitDisplayingFullscreen' in media &&
    'webkitPresentationMode' in media &&
    media.webkitDisplayingFullscreen &&
    media.webkitPresentationMode === WebkitPresentationModes.FULLSCREEN
  ) {
    return media;
  }
  return docFullscreenElement;
};

/** @type {(stateOwners: StateOwners) => boolean} */
export const isFullscreen = (stateOwners) => {
  const { media, documentElement, fullscreenElement = media } = stateOwners;

  // Need a documentElement and a media StateOwner to be in fullscreen, so we're not fullscreen
  if (!media || !documentElement) return false;

  const currentFullscreenElement = getFullscreenElement(stateOwners);

  // If there is no current fullscreenElement, we're definitely not in fullscreen.
  if (!currentFullscreenElement) return false;

  // If documentElement.fullscreenElement is the media or fullscreenElement StateOwner, we're definitely in fullscreen
  if (
    currentFullscreenElement === fullscreenElement ||
    currentFullscreenElement === media
  ) {
    return true;
  }

  // In this case (most modern browsers, sans e.g. iOS), the fullscreenElement may be
  // a web component that is "visible" from the documentElement, but should
  // have its own fullscreenElement on its shadowRoot for whatever
  // is "visible" at that level. Since the (also named) fullscreenElement StateOwner
  // may be nested inside an indeterminite number of web components, traverse each layer
  // until we either find the fullscreen StateOwner or complete the recursive check.
  if (currentFullscreenElement.localName.includes('-')) {
    let currentRoot = currentFullscreenElement.shadowRoot;

    // NOTE: This is for (non-iOS) Safari < 16.4, which did not support ShadowRoot::fullscreenElement.
    // We can remove this if/when we decide those versions are old enough/not used enough to handle
    // (e.g. at the time of writing, < 16.4 ~= 1% of global market, per caniuse https://caniuse.com/mdn-api_shadowroot_fullscreenelement) (CJP)

    // We can simply check if the fullscreenElement key (typically 'fullscreenElement') is defined on the shadowRoot to determine whether or not
    // it is supported.
    if (!(fullscreenElementKey in currentRoot)) {
      // For these cases, if documentElement.fullscreenElement (aka document.fullscreenElement) contains our fullscreenElement StateOwner,
      // we'll assume that means we're in fullscreen. That should be valid for all current actual and planned supported
      // web component use cases.
      return containsComposedNode(
        currentFullscreenElement,
        /** @TODO clean up type assumptions (e.g. Node) (CJP) */
        // @ts-ignore
        fullscreenElement
      );
    }

    while (currentRoot?.[fullscreenElementKey]) {
      if (currentRoot[fullscreenElementKey] === fullscreenElement) return true;
      currentRoot = currentRoot[fullscreenElementKey]?.shadowRoot;
    }
  }

  return false;
};

const fullscreenEnabledKey =
  'fullscreenEnabled' in document
    ? 'fullscreenEnabled'
    : 'webkitFullscreenEnabled' in document
    ? 'webkitFullscreenEnabled'
    : undefined;

/** @type {(stateOwners: StateOwners) => boolean} */
export const isFullscreenEnabled = (stateOwners) => {
  const { documentElement, media } = stateOwners;
  return (
    !!documentElement?.[fullscreenEnabledKey] ||
    (media && 'webkitSupportsFullscreen' in media)
  );
};
