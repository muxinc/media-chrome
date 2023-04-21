import React, { createContext, useContext, useEffect, useMemo } from 'react';
// NOTE: This is an official package published by the React team and part of their monorepo: https://github.com/facebook/react/tree/main/packages/use-sync-external-store
// We may be able to migrate to https://react.dev/reference/react/useSyncExternalStore instead if preferred
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector.js';
import createMediaStore from 'media-chrome/dist/mediaStore.js';

// The context is the thing that allows for a shared... context that propagates outside of the (V)DOM/Component tree.
// Contexts have values. Our value will be the the media ui store (aka the "guts" of Media Controller state mgmt)
export const MediaContext = /** @type {React.Context<import('media-chrome/dist/mediaStore.js').MediaStore> }*/ (createContext(null));

// The Provider is a (non-visual) React Element that... provides a context for any descendant in the Component tree that may
// want to use it. As such, it must be an ancestor in the Component Tree for anything that wants to "consume" the context.
/**
 *
 * @param {{
 *   children?: React.ReactNode;
 *   mediaStore?: import('media-chrome/dist/mediaStore.js').MediaStore
 * }} props
 * @returns
 */
export const Provider = ({ children, mediaStore }) => {
  const value = useMemo(() => mediaUIStore ?? createMediaStore({}), [mediaStore]);
  useEffect(() => {
    return () => {
      value?.dispatch({ type: 'mediaelementchangerequest', detail: undefined });
      value?.dispatch({ type: 'fullscreenelementchangerequest', detail: undefined });
      value?.dispatch({ type: 'rootnodechangerequest', detail: undefined });
    };
  }, []);
  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

export const useMediaStore = () => {
  const store = useContext(MediaContext);
  return store;
}

// These are hooks, which are the norm for working in "modern React". You can see them in action
// in the PlayButton component and the Video component

// This is a hook to get access to the media ui store's dispatch method, which allows the component to make
// media state change requests. All it does is grab the context (with the "inherited" value provided from
// the ancestor Provider) and return the dispatch. Simple.
export const useMediaDispatch = () => {
  const store = useContext(MediaContext);
  return store.dispatch;
};

const refEquality = (a, b) => a === b;

// This is a hook to get access to the media state. It accepts a function that let's you grab
// only the bit of state you care about to avoid unnecessary re-renders in react. It also
// allows you to pass in a more complex equality check (since you can transform the state
// or might only care about a subset of state changes, say only caring about second precision for time updates).
// This is a familiar convention in react (+ hooks) state mgmt world. It also grabs the context
// (again, with the "inherited" value provided from the ancestor Provider) and both subscribes to
// the state and pushes out updates whenever there are actual changes to the state from the
// selector.
/**
 *
 * @param {(state: Partial<import('media-chrome/dist/mediaStore.js').MediaState) => any} selector
 * @param {(a: any, b: any) => boolean} equalityFn
 * @returns
 */
export const useMediaSelector = (selector, equalityFn = refEquality) => {
  const store = useContext(MediaContext);
  const selectedState = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getState,
    selector,
    equalityFn
  );

  return selectedState;
};


// We could make something like this official.
// Also, "Name Are Hard TM"
export const useMediaRefCallback = () => {
  const dispatch = useMediaDispatch();
  useEffect(() => {
    return () => {
      dispatch({ type: 'mediaelementchangerequest', detail: undefined });
    }
  }, []);
  return (/** @type {import('media-chrome/dist/mediaStore.js').MediaStateOwner | null | undefined} */ mediaEl) => {
    dispatch({ type: 'mediaelementchangerequest', detail: mediaEl });
  };
};

// We could make something like this official.
// Also, "Name Are Hard TM"
export const useFullscreenRefCallback = () => {
  const dispatch = useMediaDispatch();
  useEffect(() => {
    return () => {
      dispatch({ type: 'fullscreenelementchangerequest', detail: undefined });
    }
  }, []);
  return (/** @type {import('media-chrome/dist/mediaStore.js').FullScreenElementStateOwner | null | undefined} */ fullscreenEl) => {
    dispatch({ type: 'fullscreenelementchangerequest', detail: fullscreenEl });
  };
};
