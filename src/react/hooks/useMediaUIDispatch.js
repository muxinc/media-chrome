import { useContext } from 'react';
import { ReactMediaChromeContext } from '../components/Context.js';

export function createMediaUIDispatchHook(context = ReactMediaChromeContext) {
  return function useDispatch() {
    const store = useContext(context);
    return store.dispatch;
  };
}
export const useMediaUIDispatch = createMediaUIDispatchHook();
