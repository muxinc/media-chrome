/**
 *
 * MediaStore is a way to model media state (and changes to it) in a framework- and DOM-agnostic way. Like the difference between Redux
 * (the core state manager) and the Redux react wrapper, MediaStore provides the primitive for aggregating media state together in one place.
 *
 * It receives events as media state change requests (like `mediaplayrequest`) and keeps an internal representation of the complete media
 * state after they change, as opposed to querying the media state sources directly every time it needs to check what state something is in.
 *
 * It doesn't "know" how to update or query the StateOwners itself (like the media element). Rather, it relies on the StateMediator as an interface
 * for getting and setting state and relies on the RequestMap as an interface for translating state change requests to state updates (typically also
 * deferring to the StateMediator for setting state on the relevant StateOwners).
 *
 * Additionally, MediaStore state is not optimistically stored when a state change request is dispatched to it. It instead defers to the StateMediator,
 * waiting for events from the StateOwners before checking if the state actually changed and only then committing it to its internal representation of MediaState.
 *
 * @module media-store
 */

import {
  stateMediator as defaultStateMediator,
  prepareStateOwners,
  StateMediator,
  EventOrAction,
} from './state-mediator.js';
import { areValuesEq } from './util.js';
import { requestMap as defaultRequestMap, RequestMap } from './request-map.js';

/**
 * MediaState is a full representation of all media-related state modeled by the MediaStore and its StateMediator.
 * Instead of checking the StateOwners' state directly or on the fly, MediaStore keeps a "snapshot" of the latest
 * state, which will be provided to any MediaStore subscribers whenever the state changes, and is arbitrarily retrievable
 * from the MediaStore using `getState()`.
 */
export type MediaState = Readonly<{
  [K in keyof StateMediator]: ReturnType<StateMediator[K]['get']>;
}> & {
  mediaPreviewTime: number;
  mediaPreviewImage: string;
  mediaPreviewCoords: [string, string, string, string];
};

/**
 * MediaStore is the primary abstraction for managing and monitoring media state and other state relevant to the media UI
 * (for example, fullscreen behavior or the availability of media-related functionality for a particular browser or runtime, such as volume control or Airplay). This includes:
 * - Keeping track of any state changes (examples: Is the media muted? Is the currently playing media live or on demand? What audio tracks are available for the current media?)
 * - Sharing the latest state with any MediaStore subscribers whenever it changes
 * - Receiving and responding to requests to change the media or related state (examples: I would like the media to be unmuted. I want to start casting now. I want to switch from English subtitles to Japanese.)
 * - Wiring up and managing the relationships between media state, media state change requests, and the stateful entities that “own” the majority of this state (examples: the current media element being used, the current root node, the current fullscreen element)
 * - Respecting and monitoring changes in certain optional behaviors that impact state or state change requests (examples: I want subtitles/closed captions to be on by default whenever media with them are loaded. I want to disable keeping track of the user’s preferred volume level.)
 *
 * @example &lt;caption>Basic Usage.&lt;/caption>
 * const mediaStore = createStore({
 *   media: myVideoElement,
 *   fullscreenElement: myMediaUIContainerElement,
 *   // documentElement: advancedRootNodeCase // Will default to `document`
 *   options: {
 *     defaultSubtitles: true // enable subtitles/captions by default
 *   },
 * });
 *
 * // NOTE: In a more realistic example, `myToggleMutedButton` and `mySeekForwardButton` would likely keep track of/"own" its current state. See, e.g. the `<mute-button>` Media Chrome Web Component.
 * const unsubscribe = mediaStore.subscribe(state => {
 *   myToggleMutedButton.textContent = state.muted ? 'Unmute' : 'Mute';
 * });
 *
 * myToggleMutedButton.addEventListener('click', () => {
 *   const type = mediaStore.getState().muted ? 'mediaunmuterequest' : 'mediamuterequest'
 *   mediaStore.dispatch({ type });
 * });
 *
 * mySeekForwardButton.addEventListener('click', () => {
 *   mediaStore.dispatch({
 *     type: 'mediaseekrequest',
 *     // NOTE: For all of our state change requests that require additional information, we rely on the `detail` property so we can conform to `CustomEvent`, making interop easier.
 *     detail: mediaStore.getState().mediaCurrentTime + 15,
 *   });
 * });
 *
 * // If your code has cases where it swaps out the media element being used
 * mediaStore.dispatch({
 *   type: 'mediaelementchangerequest',
 *   detail: myAudioElement,
 * });
 *
 * // ... Eventual teardown, when relevant. This is especially relevant for potential garbage collection/memory management considerations.
 * unsubscribe();
 *
 */
export type MediaStore = {
  /**
   * A method that expects an "Action" or "Event".Primarily used to make state change requests.
   */
  dispatch(eventOrAction: EventOrAction<any>): void;

  /**
   *  A method to get the current state of the MediaStore
   */
  getState(): Partial<MediaState>;

  /**
   * A method to "subscribe" to the MediaStore. A subscriber is just a callback function that is invoked with the current state whenever the MediaStore's state changes. The method returns an "unsubscribe" function, which should be used to tell the MediaStore to remove the corresponding subscriber.
   */
  subscribe(handler: (state: Partial<MediaState>) => void): () => void;
};

type MediaStoreConfig = {
  media?: any;
  fullscreenElement?: any;
  documentElement?: any;
  stateMediator?: StateMediator;
  requestMap?: RequestMap;
  options?: any;
  monitorStateOwnersOnlyWithSubscriptions?: boolean;
};
/**
 * A factory for creating a `MediaStore` instance.
 * @param mediaStoreConfig - Configuration object for the `MediaStore`.
 */
export const createMediaStore = ({
  media,
  fullscreenElement,
  documentElement,
  stateMediator = defaultStateMediator,
  requestMap = defaultRequestMap,
  options = {},
  monitorStateOwnersOnlyWithSubscriptions = true,
}: MediaStoreConfig): MediaStore => {
  const callbacks = [];

  // We may eventually want to expose the state owners as part of the state
  // or as a specialized getter API for advanced use cases
  /** @type {StateOwners} */
  const stateOwners: any = {
    // Spreading options here since folks should not rely on holding onto references
    // for any app-level logic wrt options.
    options: { ...options },
  };

  /** @TODO How to model initial state for values not (currently) provided via the facade? (CJP) */
  let state: Partial<MediaState> = Object.freeze({
    mediaPreviewTime: undefined,
    mediaPreviewImage: undefined,
    mediaPreviewCoords: undefined,
    mediaPreviewChapter: undefined,
  });

  const updateState = (nextStateDelta: any) => {
    // This function is generically invoked, even if there are
    // no direct state updates. In those cases, simply bail early. (CJP)
    if (nextStateDelta == undefined) return;
    if (areValuesEq(nextStateDelta, state)) {
      return;
    }

    // Update the state since it changed.
    // Using an "immutable" approach here so
    // callbacks can easily do comparisons between prev/next state.
    // Freezing isn't necessary, though it's a light touch enforcement
    // of immutability (in case folks try to directly modify state)
    state = Object.freeze({
      ...state,
      ...nextStateDelta,
    });

    // Given anything that cares the updated state
    callbacks.forEach((cb) => cb(state));
  };

  const updateStateFromFacade = () => {
    const nextState = Object.entries(stateMediator).reduce(
      (nextState, [stateName, { get }]) => {
        // (re)initialize state based on current derived state of facade
        // NOTE: Since we don't know what stateOwners are tied to deriving a particular state,
        // we should update this if *any*  state owner changed. (CJP)
        nextState[stateName] = get(stateOwners);
        return nextState;
      },
      {}
    );

    // since a bunch of state likely changed, update with the latest computed values
    updateState(nextState);
  };

  // Dictionary for event handler storage and cleanup
  const stateUpdateHandlers = {};

  // This function will handle all wiring up of event handlers/monitoring of state
  // and will re-compute the general next state whenever any "state owner" is set or updated,
  // which includes the media element, but also the documentElement and the fullscreenElement
  // This is roughly equivalent to what used to be in `mediaSetCallback`/`mediaUnsetCallback` (CJP)
  let nextStateOwners = undefined;
  const updateStateOwners = async (
    nextStateOwnersDelta: any,
    nextSubscriberCount?: number
  ) => {
    const pendingUpdate = !!nextStateOwners;
    nextStateOwners = {
      ...stateOwners,
      ...(nextStateOwners ?? {}),
      ...nextStateOwnersDelta,
    };

    if (pendingUpdate) return;

    await prepareStateOwners(...Object.values(nextStateOwnersDelta));

    // Define all of the disparate stateOwner monitoring teardown/setup once, up front.

    // To avoid memory leaks, MediaStores can be configured to only monitor if
    // there's at least one subscriber (callback). If they're configured this way,
    // that means they should teardown pre-existing monitoring (e.g. event handlers)
    // whenever the subscribers "head count" goes from > 0 to 0.
    const shouldTeardownFromSubscriberCount =
      callbacks.length > 0 &&
      nextSubscriberCount === 0 &&
      monitorStateOwnersOnlyWithSubscriptions;

    // These define whether a particular `stateOwner` (or "sub-owner", e.g. media.textTracks)
    // has changed since the last time this function was invoked. Relevant for both
    // teardown and setup logic.
    const mediaChanged = stateOwners.media !== nextStateOwners.media;
    const textTracksChanged =
      stateOwners.media?.textTracks !== nextStateOwners.media?.textTracks;
    const videoRenditionsChanged =
      stateOwners.media?.videoRenditions !==
      nextStateOwners.media?.videoRenditions;
    const audioTracksChanged =
      stateOwners.media?.audioTracks !== nextStateOwners.media?.audioTracks;
    const remoteChanged =
      stateOwners.media?.remote !== nextStateOwners.media?.remote;
    const rootNodeChanged =
      stateOwners.documentElement !== nextStateOwners.documentElement;

    // For any particular `stateOwner` (or "sub-owner"), we should teardown if and only if:
    // * the `stateOwner` existed -AND-
    // * it either changed -OR-
    // * we are configured to stop monitoring due to the subscriber "head count".
    const teardownMedia =
      !!stateOwners.media &&
      (mediaChanged || shouldTeardownFromSubscriberCount);

    const teardownTextTracks =
      !!stateOwners.media?.textTracks &&
      (textTracksChanged || shouldTeardownFromSubscriberCount);

    const teardownVideoRenditions =
      !!stateOwners.media?.videoRenditions &&
      (videoRenditionsChanged || shouldTeardownFromSubscriberCount);

    const teardownAudioTracks =
      !!stateOwners.media?.audioTracks &&
      (audioTracksChanged || shouldTeardownFromSubscriberCount);

    const teardownRemote =
      !!stateOwners.media?.remote &&
      (remoteChanged || shouldTeardownFromSubscriberCount);

    const teardownRootNode =
      !!stateOwners.documentElement &&
      (rootNodeChanged || shouldTeardownFromSubscriberCount);

    // This is simply a convenience definition saying we should be tearing down *something*
    // used for short circuiting conditions.
    const teardownSomething =
      teardownMedia ||
      teardownTextTracks ||
      teardownVideoRenditions ||
      teardownAudioTracks ||
      teardownRemote ||
      teardownRootNode;

    // To avoid memory leaks, MediaStores can be configured to only monitor if
    // there's at least one subscriber (callback). If they're configured this way,
    // that means they should teardown pre-existing monitoring (e.g. event handlers)
    // whenever the subscribers "head count" goes from > 0 to 0.
    const shouldSetupFromSubscriberCount =
      callbacks.length === 0 &&
      nextSubscriberCount === 1 &&
      monitorStateOwnersOnlyWithSubscriptions;

    // For any particular `stateOwner` (or "sub-owner"), we should setup if and only if:
    // * the new `stateOwner` exists (or is not being replaced) -AND-
    // * it changed -OR-
    // * we are configured to start monitoring due to the subscriber "head count".
    const setupMedia =
      !!nextStateOwners.media &&
      (mediaChanged || shouldSetupFromSubscriberCount);

    const setupTextTracks =
      !!nextStateOwners.media?.textTracks &&
      (textTracksChanged || shouldSetupFromSubscriberCount);

    const setupVideoRenditions =
      !!nextStateOwners.media?.videoRenditions &&
      (videoRenditionsChanged || shouldSetupFromSubscriberCount);

    const setupAudioTracks =
      !!nextStateOwners.media?.audioTracks &&
      (audioTracksChanged || shouldSetupFromSubscriberCount);

    const setupRemote =
      !!nextStateOwners.media?.remote &&
      (remoteChanged || shouldSetupFromSubscriberCount);

    const setupRootNode =
      !!nextStateOwners.documentElement &&
      (rootNodeChanged || shouldSetupFromSubscriberCount);

    // This is simply a convenience definition saying we should be setting up *something*
    // used for short circuiting conditions.
    const setupSomething =
      setupMedia ||
      setupTextTracks ||
      setupVideoRenditions ||
      setupAudioTracks ||
      setupRemote ||
      setupRootNode;

    const somethingToDo = teardownSomething || setupSomething;

    // If there's nothing to do (teardown- or setup-wise), we're done here.
    if (!somethingToDo) {
      // Except make sure we actually update the stateOwners, if changed
      Object.entries(nextStateOwners).forEach(
        ([stateOwnerName, stateOwner]) => {
          stateOwners[stateOwnerName] = stateOwner;
        }
      );
      updateStateFromFacade();
      nextStateOwners = undefined;
      return;
    }

    Object.entries(stateMediator).forEach(
      ([
        stateName,
        {
          get,
          mediaEvents = [],
          textTracksEvents = [],
          videoRenditionsEvents = [],
          audioTracksEvents = [],
          remoteEvents = [],
          rootEvents = [],
          stateOwnersUpdateHandlers = [],
        },
      ]) => {
        // NOTE: This should probably be pulled out into a one-time initialization (CJP)
        if (!stateUpdateHandlers[stateName]) {
          stateUpdateHandlers[stateName] = {};
        }

        const handler = (event) => {
          const nextValue = get(stateOwners, event);
          updateState({ [stateName]: nextValue });
        };

        let prevHandler;
        // Media Changed, update handlers here
        prevHandler = stateUpdateHandlers[stateName].mediaEvents;
        mediaEvents.forEach((eventType) => {
          if (prevHandler && teardownMedia) {
            stateOwners.media.removeEventListener(eventType, prevHandler);
            stateUpdateHandlers[stateName].mediaEvents = undefined;
          }
          if (setupMedia) {
            nextStateOwners.media.addEventListener(eventType, handler);
            stateUpdateHandlers[stateName].mediaEvents = handler;
          }
        });
        prevHandler = stateUpdateHandlers[stateName].textTracksEvents;
        textTracksEvents.forEach((eventType) => {
          if (prevHandler && teardownTextTracks) {
            stateOwners.media.textTracks?.removeEventListener(
              eventType,
              prevHandler
            );
            stateUpdateHandlers[stateName].textTracksEvents = undefined;
          }
          if (setupTextTracks) {
            nextStateOwners.media.textTracks?.addEventListener(
              eventType,
              handler
            );
            stateUpdateHandlers[stateName].textTracksEvents = handler;
          }
        });
        prevHandler = stateUpdateHandlers[stateName].videoRenditionsEvents;
        videoRenditionsEvents.forEach((eventType) => {
          if (prevHandler && teardownVideoRenditions) {
            stateOwners.media.videoRenditions?.removeEventListener(
              eventType,
              prevHandler
            );
            stateUpdateHandlers[stateName].videoRenditionsEvents = undefined;
          }
          if (setupVideoRenditions) {
            nextStateOwners.media.videoRenditions?.addEventListener(
              eventType,
              handler
            );
            stateUpdateHandlers[stateName].videoRenditionsEvents = handler;
          }
        });
        prevHandler = stateUpdateHandlers[stateName].audioTracksEvents;
        audioTracksEvents.forEach((eventType) => {
          if (prevHandler && teardownAudioTracks) {
            stateOwners.media.audioTracks?.removeEventListener(
              eventType,
              prevHandler
            );
            stateUpdateHandlers[stateName].audioTracksEvents = undefined;
          }
          if (setupAudioTracks) {
            nextStateOwners.media.audioTracks?.addEventListener(
              eventType,
              handler
            );
            stateUpdateHandlers[stateName].audioTracksEvents = handler;
          }
        });
        prevHandler = stateUpdateHandlers[stateName].remoteEvents;
        remoteEvents.forEach((eventType) => {
          if (prevHandler && teardownRemote) {
            stateOwners.media.remote?.removeEventListener(
              eventType,
              prevHandler
            );
            stateUpdateHandlers[stateName].remoteEvents = undefined;
          }
          if (setupRemote) {
            nextStateOwners.media.remote?.addEventListener(eventType, handler);
            stateUpdateHandlers[stateName].remoteEvents = handler;
          }
        });

        prevHandler = stateUpdateHandlers[stateName].rootEvents;
        rootEvents.forEach((eventType) => {
          if (prevHandler && teardownRootNode) {
            stateOwners.documentElement.removeEventListener(
              eventType,
              prevHandler
            );
            stateUpdateHandlers[stateName].rootEvents = undefined;
          }
          if (setupRootNode) {
            nextStateOwners.documentElement.addEventListener(
              eventType,
              handler
            );
            stateUpdateHandlers[stateName].rootEvents = handler;
          }
        });

        // NOTE: Since custom update handlers may depend on *any* state owner
        // we should apply them whenever any state owner changes (CJP)
        const prevHandlerTeardowns =
          stateUpdateHandlers[stateName].stateOwnersUpdateHandlers;

        if (prevHandlerTeardowns && teardownSomething) {
          const teardowns = Array.isArray(prevHandlerTeardowns)
            ? prevHandlerTeardowns
            : [prevHandlerTeardowns];
          teardowns.forEach((teardown) => {
            if (typeof teardown === 'function') {
              teardown();
            }
          });
        }

        if (setupSomething) {
          const newTeardowns = stateOwnersUpdateHandlers
            .map((fn) => fn(handler, nextStateOwners))
            .filter((teardown) => typeof teardown === 'function');

          stateUpdateHandlers[stateName].stateOwnersUpdateHandlers =
            newTeardowns.length === 1 ? newTeardowns[0] : newTeardowns;
        } else if (teardownSomething) {
          stateUpdateHandlers[stateName].stateOwnersUpdateHandlers = undefined;
        }
      }
    );

    Object.entries(nextStateOwners).forEach(([stateOwnerName, stateOwner]) => {
      stateOwners[stateOwnerName] = stateOwner;
    });
    updateStateFromFacade();
    nextStateOwners = undefined;
  };

  updateStateOwners({ media, fullscreenElement, documentElement, options });

  return {
    // note that none of these cases directly interact with the media element, root node, full screen element, etc.
    // note these "actions" could just be the events if we wanted, especially if we normalize on "detail" for
    // any payload-relevant values
    // This is roughly equivalent to our used to be in our state requests dictionary object, though much of the
    // "heavy lifting" is now moved into the facade `set()`
    dispatch(action) {
      const { type, detail } = action;

      // For any state change request "actions"/"events" of media (and related) state,
      // these are handled by the `RequestMap`, which defines a function for a given change request type
      // that is responsible for what should happen as a result
      // If a fatal error occurred, we should not process any more state change requests,
      // but we should process updates to state owners or options/defaults, handled below,
      // which is why we don't simply early bail here.
      if (requestMap[type] && state.mediaErrorCode == null) {
        // Most state change requests do not directly update the media state. Instead
        // they will typically interact in some way or another with one or more of the `StateOwner`s (like the media element).
        // For some of our media UI state, however, it does directly update state. In those cases,
        // the function can optionally return an object with the properties and values of the media state changes.
        // See: RequestMap[MediaUIEvents.MEDIA_PREVIEW_REQUEST] for an example of this.
        updateState(requestMap[type](stateMediator, stateOwners, action));
        return;
      }

      // These are other state change requests so we can dynamically update things like the media element, fullscreenElement,
      // or options-style properties in a single architecture.

      // We can get change requests for the stateOwners themselves
      if (type === 'mediaelementchangerequest') {
        updateStateOwners({ media: detail });
      } else if (type === 'fullscreenelementchangerequest') {
        updateStateOwners({ fullscreenElement: detail });
      } else if (type === 'documentelementchangerequest') {
        updateStateOwners({ documentElement: detail });
      }
      // and we can update our default/options values
      else if (type === 'optionschangerequest') {
        // Doing a simple impl for now
        Object.entries(detail ?? {}).forEach(([optionName, optionValue]) => {
          // NOTE: updating options will *NOT* prompt any state updates.
          // However, since we directly mutate options, this allows state owners to be
          // "live" and automatically updated for any other event or similar monitoring.
          // For a concrete example, see, e.g., the `mediaSubtitlesShowing.stateOwnersUpdateHandlers`
          // responsible for managing/monitoring `defaultSubtitles` in the `defaultStateMediator`. (CJP)
          stateOwners.options[optionName] = optionValue;
        });
        updateStateFromFacade();
      }
    },
    getState() {
      // return the current state, whatever it is
      return state;
    },
    subscribe(callback) {
      // Since state owner monitoring can change based on subscription "head count",
      // make sure we invoke `updateStateOwners()` whenever someone subscribes.
      // NOTE: Must do this before updating `callbacks` to compare next vs. previous callback count.
      updateStateOwners({}, callbacks.length + 1);
      callbacks.push(callback);

      // give the callback the current state immediately so it can get whatever the state is currently.
      callback(state);
      return () => {
        const idx = callbacks.indexOf(callback);
        if (idx >= 0) {
          // Since state owner monitoring can change based on subscription "head count",
          // make sure we invoke `updateStateOwners()` whenever someone unsubscribes.
          // NOTE: Must do this before updating `callbacks` to compare next vs. previous callback count.
          updateStateOwners({}, callbacks.length - 1);
          callbacks.splice(idx, 1);
        }
      };
    },
  };
};

export default createMediaStore;
