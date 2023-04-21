// import { useDebugValue } from 'react';
import { useContext } from 'react';
import { ReactMediaChromeContext } from '../components/Context.js';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector.js';

const refEquality = (a, b) => a === b;

export function createMediaUISelectorHook(context = ReactMediaChromeContext) {
  return function useSelector(selector, equalityFn = refEquality) {
    if (process.env.NODE_ENV !== 'production') {
      if (!selector) {
        throw new Error(`You must pass a selector to useSelector`);
      }
      if (typeof selector !== 'function') {
        throw new Error(
          `You must pass a function as a selector to useSelector`
        );
      }
      if (typeof equalityFn !== 'function') {
        throw new Error(
          `You must pass a function as an equality function to useSelector`
        );
      }
    }

    const store = useContext(context);;

    const selectedState = useSyncExternalStoreWithSelector(
      store.subscribe,
      store.getState,
      store.getState,
      selector,
      equalityFn
    );

    return selectedState;
  };
}
export const useMediaUISelector = createMediaUISelectorHook();
