import type { Context, ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import {
  AvailabilityStates,
  MediaUIEvents,
  MediaUIProps,
  StreamTypes,
  VolumeLevels,
} from '../constants.js';
import {
  createMediaStore,
  type MediaState,
  type MediaStore,
} from '../media-store/media-store.js';
import type {
  FullScreenElementStateOwner,
  MediaStateOwner,
} from '../media-store/state-mediator.js';
import { useSyncExternalStoreWithSelector } from './useSyncExternalStoreWithSelector.js';
export * as timeUtils from '../utils/time.js';

/**
 * @description A lookup object for all well-defined action types that can be dispatched
 * to the `MediaStore`. As each action type name suggests, these all take the form of
 * "state change requests," where e.g. a component will `dispatch()` a request to change
 * some bit of media state, typically due to some user interaction.
 *
 * @example
 * import { useDispatch, MediaActionTypes } from 'media-chrome/react/media-store';
 *
 * const MyComponent = () => {
 *   const dispatch = useDispatch();
 *   return (
 *     <button
 *       onClick={() => dispatch({
 *         type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
 *         detail: 2.0
 *       })}
 *     >
 *       Faster!
 *     </button>
 *   );
 * };
 *
 * @see {@link useMediaDispatch}
 */

export { MediaState };

export { AvailabilityStates, StreamTypes, VolumeLevels };

const {
  REGISTER_MEDIA_STATE_RECEIVER, // eslint-disable-line
  UNREGISTER_MEDIA_STATE_RECEIVER, // eslint-disable-line
  // NOTE: These generic state change requests are not currently supported (CJP)
  MEDIA_SHOW_TEXT_TRACKS_REQUEST, // eslint-disable-line
  MEDIA_HIDE_TEXT_TRACKS_REQUEST, // eslint-disable-line
  ...StateChangeRequests
} = MediaUIEvents;

export const MediaActionTypes = {
  ...StateChangeRequests,
  MEDIA_ELEMENT_CHANGE_REQUEST: 'mediaelementchangerequest',
  FULLSCREEN_ELEMENT_CHANGE_REQUEST: 'fullscreenelementchangerequest',
} as const;

export const MediaStateNames = { ...MediaUIProps } as const;

const identity = (x?: any) => x;

/**
 * @description The {@link https://react.dev/learn/passing-data-deeply-with-context#context-an-alternative-to-passing-props|React Context}
 * used "under the hood" for media ui state updates, state change requests, and the hooks and providers that integrate with this context.
 * It is unlikely that you will/should be using `MediaContext` directly.
 *
 * @see {@link MediaProvider}
 * @see {@link useMediaDispatch}
 * @see {@link useMediaSelector}
 */
export const MediaContext: Context<MediaStore | null> =
  createContext<MediaStore | null>(null);

/**
 * @description A {@link https://react.dev/reference/react/createContext#provider|React Context.Provider} for having access
 * to media state and state updates. While many other react libraries that rely on `<Provider/>` and its corresponding context/hooks
 * are expected to have the context close to the top of the
 * {@link https://react.dev/learn/understanding-your-ui-as-a-tree#the-render-tree|React render tree}, `<MediaProvider/>` should
 * typically be declared closer to the component (e.g. `<MyFancyVideoPlayer/>`) level, as it manages the media state for a particular
 * playback experience (visual and otherwise), typically tightly tied to e.g. an `<audio/>` or `<video/>` component (or similar).
 * This state is tied together and managed by using {@link https://react.dev/learn/manipulating-the-dom-with-refs|DOM element Refs} to
 * e.g. the corresponding `<video/>` element, which is made easy by our specialized hooks such as {@link useMediaRef}.
 *
 * @example
 * import {
 *   MediaProvider,
 *   useMediaFullscreenRef,
 *   useMediaRef
 * } from 'media-chrome/react/media-store';
 * import MyFancyPlayButton from './MyFancyPlayButton';
 *
 * const MyFancyVideoPlayerContainer = ({ src }: { src: string }) => {
 *   const mediaFullscreenRef = useMediaFullscreenRef();
 *   const mediaRef = useMediaRef();
 *   return (
 *     <div ref={mediaFullscreenRef}>
 *       <video ref={mediaRef} src={src}/>
 *       <div><MyFancyPlayButton/><div>
 *     </div>
 *   );
 * };
 *
 * const MyFancyVideoPlayer = ({ src }) => {
 *   return (
 *     <MediaProvider><MyFancyVideoPlayerContainer src={src}/></MediaProvider>
 *   );
 * };
 *
 * export default MyFancyVideoPlayer;
 *
 * @see {@link useMediaRef}
 * @see {@link useMediaFullscreenRef}
 * @see {@link useMediaDispatch}
 * @see {@link useMediaSelector}
 */
export const MediaProvider = ({
  children,
  mediaStore,
}: {
  children: ReactNode;
  mediaStore?: MediaStore;
}) => {
  const value = useMemo(
    () =>
      mediaStore ?? createMediaStore({ documentElement: globalThis.document }),
    [mediaStore]
  );
  useEffect(() => {
    value?.dispatch({
      type: 'documentelementchangerequest',
      detail: globalThis.document,
    });
    return () => {
      value?.dispatch({
        type: 'documentelementchangerequest',
        detail: undefined,
      });
    };
  }, []);
  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

export const useMediaStore = () => {
  const store = useContext(MediaContext);
  return store;
};

/**
 * @description This is a hook to get access to the `MediaStore`'s `dispatch()` method, which allows
 * a component to make media state change requests. All player/application level state changes
 * should use `dispatch()` to change media state (e.g. playing/pausing, enabling/disabling/selecting subtitles,
 * changing playback rate, seeking, etc.). All well-defined state change request action types are defined in
 * `MediaActionTypes`.
 *
 * @example
 * import { useDispatch, MediaActionTypes } from 'media-chrome/react/media-store';
 *
 * // Assumes this is a descendant of `<MediaProvider/>`.
 * const MyComponent = () => {
 *   const dispatch = useDispatch();
 *   return (
 *     <button
 *       onClick={() => dispatch({
 *         type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
 *         detail: 2.0
 *       })}
 *     >
 *       Faster!
 *     </button>
 *   );
 * };
 *
 * @see {@link MediaActionTypes}
 */
export const useMediaDispatch = () => {
  const store = useContext(MediaContext);
  const dispatch = store?.dispatch ?? identity;
  return ((value) => {
    return dispatch(value);
  }) as MediaStore['dispatch'];
};

/**
 * @description This is the primary way to associate a media component with the `MediaStore` provided
 * by {@link MediaProvider|`<MediaProvider/>`}. To associate the media component, use `useMediaRef` just
 * like you would {@link https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref|useRef}.
 * Unlike `useRef`, however, "under the hood" `useMediaRef` is actually a
 * {@link https://react.dev/reference/react-dom/components/common#ref-callback|ref callback} function.
 *
 * @example
 * import type { VideoHTMLAttributes } from 'react';
 * import { useMediaRef } from 'media-chrome/react/media-store';
 *
 * // Assumes this is a descendant of `<MediaProvider/>`.
 * const VideoWrapper = (props: VideoHTMLAttributes<HTMLVideoElement>) => {
 *   const mediaRef = useMediaRef();
 *   return <video ref={mediaRef} {...props}/>;
 * };
 *
 * @see {@link MediaProvider}
 */
export const useMediaRef = () => {
  const dispatch = useMediaDispatch();
  return (mediaEl: MediaStateOwner | null | undefined) => {
    // NOTE: This should get invoked with `null` when using as a `ref` callback whenever
    // the corresponding react media element instance (e.g. a `<video>`) is being removed.
    dispatch({
      type: MediaActionTypes.MEDIA_ELEMENT_CHANGE_REQUEST,
      detail: mediaEl,
    });
  };
};

/**
 * @description This is the primary way to associate a component with the `MediaStore` provided
 * by {@link MediaProvider|`<MediaProvider/>`} to be used as the target for entering fullscreen.
 * To associate the media component, use `useMediaFullscreenRef` just
 * like you would {@link https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref|useRef}.
 * Unlike `useRef`, however, "under the hood" `useMediaFullscreenRef` is actually a
 * {@link https://react.dev/reference/react-dom/components/common#ref-callback|ref callback} function.
 *
 * @example
 * import { useMediaFullscreenRef } from 'media-chrome/react/media-store';
 * import PlayerUI from './PlayerUI';
 *
 * // Assumes this is a descendant of `<MediaProvider/>`.
 * const PlayerContainer = () => {
 *   const fullscreenRef = useMediaFullscreenRef();
 *   return <div ref={fullscreenRef}><PlayerUI/></div>;
 * };
 *
 * @see {@link MediaProvider}
 */
export const useMediaFullscreenRef = () => {
  const dispatch = useMediaDispatch();
  return (fullscreenEl: FullScreenElementStateOwner | null | undefined) => {
    // NOTE: This should get invoked with `null` when using as a `ref` callback whenever
    // the corresponding react element instance (e.g. a `<div>`) is being removed.
    dispatch({
      type: MediaActionTypes.FULLSCREEN_ELEMENT_CHANGE_REQUEST,
      detail: fullscreenEl,
    });
  };
};

const refEquality = (a: any, b: any) => a === b;

/**
 * @description This is the primary way to get access to the media state. It accepts a function that let's you grab
 * only the bit of state you care about to avoid unnecessary re-renders in react. It also allows you to pass in a more
 * complex equality check (since you can transform the state or might only care about a subset of state changes, say only
 * caring about second precision for time updates). Modeled after a simplified version of
 * {@link https://redux.js.org/usage/deriving-data-selectors#encapsulating-state-shape-with-selectors|React Redux selectors}.
 * @param selector - a function that gets invoked with the latest state and returns whatever computed state you want to use
 * @param [equalityFn] - (optional) a function for checking if the previous computed state is "equal to" the next. Used to
 * avoid unnecessary re-renders. Checks strict identity (===) by default.
 * @returns the latest computed state
 *
 * @example
 * import { useMediaSelector } from 'media-chrome/react/media-store';
 *
 * // Assumes this is a descendant of `<MediaProvider/>`.
 * const LoadingIndicator = () => {
 *   const showLoading = useMediaSelector(state => state.mediaLoading && !state.mediaPaused);
 *   return showLoading && <div>Watch it, I'm loading, here! (...or don't, bc I'm loading, here!)</div>;
 * };
 *
 * @see {@link MediaProvider}
 */
export const useMediaSelector = <S = any,>(
  selector: (state: Partial<MediaState>) => S,
  equalityFn = refEquality
) => {
  const store = useContext(MediaContext) as MediaStore;
  const selectedState = useSyncExternalStoreWithSelector(
    store?.subscribe ?? identity,
    store?.getState ?? identity,
    store?.getState ?? identity,
    selector,
    equalityFn
  ) as S;

  return selectedState;
};
