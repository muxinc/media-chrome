import { createContext, useContext, useEffect, useMemo } from 'react';
import type { Context, ReactNode } from 'react';
// NOTE: This is an official package published by the React team and part of their monorepo: https://github.com/facebook/react/tree/main/packages/use-sync-external-store
// We may be able to migrate to https://react.dev/reference/react/useSyncExternalStore instead if preferred
// @ts-ignore
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector.js';
// import { useSyncExternalStore } from 'react';
import createMediaStore from 'media-chrome/dist/media-store/media-store.js';
import type {
  FullScreenElementStateOwner,
  MediaState,
  MediaStateOwner,
  MediaStore,
} from 'media-chrome/dist/media-store/media-store.js';

// The context is the thing that allows for a shared... context that propagates outside of the (V)DOM/Component tree.
// Contexts have values. Our value will be the the media ui store (aka the "guts" of Media Controller state mgmt)
export const MediaContext: Context<MediaStore | null> =
  createContext<MediaStore | null>(null);

// The Provider is a (non-visual) React Element that... provides a context for any descendant in the Component tree that may
// want to use it. As such, it must be an ancestor in the Component Tree for anything that wants to "consume" the context.
export const Provider = ({
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
    value?.dispatch({ type: 'documentelementchangerequest', detail: globalThis.document });
    return () => {
      value?.dispatch({ type: 'documentelementchangerequest', detail: undefined });
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

// These are hooks, which are the norm for working in "modern React". You can see them in action
// in the PlayButton component and the Video component

// This is a hook to get access to the media ui store's dispatch method, which allows the component to make
// media state change requests. All it does is grab the context (with the "inherited" value provided from
// the ancestor Provider) and return the dispatch. Simple.
export const useMediaDispatch = () => {
  const store = useContext(MediaContext);
  const dispatch = store?.dispatch ?? console.log.bind(null, 'fake dispatch!');
  return ((value) => {
    return dispatch(value);
  }) as MediaStore['dispatch'];
};

const refEquality = (a: any, b: any) => a === b;

// This is a hook to get access to the media state. It accepts a function that let's you grab
// only the bit of state you care about to avoid unnecessary re-renders in react. It also
// allows you to pass in a more complex equality check (since you can transform the state
// or might only care about a subset of state changes, say only caring about second precision for time updates).
// This is a familiar convention in react (+ hooks) state mgmt world. It also grabs the context
// (again, with the "inherited" value provided from the ancestor Provider) and both subscribes to
// the state and pushes out updates whenever there are actual changes to the state from the
// selector.
export const useMediaSelector = <S = any,>(
  selector: (state: Partial<MediaState>) => S,
  equalityFn = refEquality
) => {
  const store = useContext(MediaContext);
  const selectedState = useSyncExternalStoreWithSelector(
    store?.subscribe,
    store?.getState,
    store?.getState,
    selector,
    equalityFn
  ) as S;

  return selectedState;
};

// We could make something like this official.
// Also, "Name Are Hard TM"
export const useMediaRefCallback = () => {
  const dispatch = useMediaDispatch();
  return (mediaEl: MediaStateOwner | null | undefined) => {
    // NOTE: This should get invoked with `null` when using as a `ref` callback whenever
    // the corresponding react media element instance (e.g. a `<video>`) is being removed.
    dispatch({ type: 'mediaelementchangerequest', detail: mediaEl });
  };
};

// We could make something like this official.
// Also, "Name Are Hard TM"
export const useFullscreenRefCallback = () => {
  const dispatch = useMediaDispatch();
  return (fullscreenEl: FullScreenElementStateOwner | null | undefined) => {
    // NOTE: This should get invoked with `null` when using as a `ref` callback whenever
    // the corresponding react element instance (e.g. a `<div>`) is being removed.
    dispatch({ type: 'fullscreenelementchangerequest', detail: fullscreenEl });
  };
};
