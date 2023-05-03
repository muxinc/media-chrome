import React, { createContext, useContext } from 'react';
// NOTE: This is an official package published by the React team and part of their monorepo: https://github.com/facebook/react/tree/main/packages/use-sync-external-store
// We may be able to migrate to https://react.dev/reference/react/useSyncExternalStore instead if preferred
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector.js';
import MediaController from 'media-chrome/dist/controller.js';

// The context is the thing that allows for a shared... context that propagates outside of the (V)DOM/Component tree.
// Contexts have values. Our value will be the the media ui store (aka the "guts" of Media Controller state mgmt)
export const ReactMediaChromeContext = createContext(null);

// The Provider is a (non-visual) React Element that... provides a context for any descendant in the Component tree that may
// want to use it. As such, it must be an ancestor in the Component Tree for anything that wants to "consume" the context.
const mediaController = new MediaController();

export function Provider({ children }) {
  // In a real version of this, we may want to make the store overridable and rely on some memoization "under the hood"
  return React.createElement(
    ReactMediaChromeContext.Provider,
    { value: mediaController },
    children
  );
}

// These are hooks, which are the norm for working in "modern React". You can see them in action
// in the PlayButton component and the Video component

// This is a hook to get access to the media ui store's dispatch method, which allows the component to make
// media state change requests. All it does is grab the context (with the "inherited" value provided from
// the ancestor Provider) and return the dispatch. Simple.
export const useMediaUIDispatch = () => {
  const mediaController = useContext(ReactMediaChromeContext);
  return (options) => {
    mediaController.dispatchEvent(new CustomEvent(options.type, { detail: options.detail }));
  };
};

const refEquality = (a, b) => a === b;

function subscribe(callback) {
  mediaController.addEventListener('mediastate', callback);
  return () => {
    mediaController.removeEventListener('mediastate', callback);
  };
}

// This is a hook to get access to the media state. It accepts a function that let's you grab
// only the bit of state you care about to avoid unnecessary re-renders in react. It also
// allows you to pass in a more complex equality check (since you can transform the state
// or might only care about a subset of state changes, say only caring about second precision for time updates).
// This is a familiar convention in react (+ hooks) state mgmt world. It also grabs the context
// (again, with the "inherited" value provided from the ancestor Provider) and both subscribes to
// the state and pushes out updates whenever there are actual changes to the state from the
// selector.
export const useMediaUISelector = (selector, equalityFn = refEquality) => {
  const mediaController = useContext(ReactMediaChromeContext);
  const selectedState = useSyncExternalStoreWithSelector(
    subscribe,
    mediaController.getState,
    mediaController.getState,
    selector,
    equalityFn
  );

  return selectedState;
};
