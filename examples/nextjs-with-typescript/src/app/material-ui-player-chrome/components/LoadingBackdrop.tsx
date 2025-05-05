import { Backdrop, CircularProgress } from '@mui/material';
import { useMediaSelector } from '../../../../../../dist/react/media-store';
import { useEffect, useState } from 'react';

const LOADING_DELAY = 500;

/**
 * @description This is a backdrop/overlay to show the loading indicator while media is loading (but only when not paused, and with a delay).
 * @param { loadingDelay } - The loadingDelay prop provides some "mild fanciness" for delaying showing the loading indicator
 * @returns A react component for showing a backdrop/overlay with a loading indicator when the media is loading
 */
const LoadingBackdrop = ({ loadingDelay = LOADING_DELAY }) => {
  /** @TODO Figure out why LoadingBackdrop state is initially undefined after nextjs + react major version upgrade (CJP) */
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * NOTE: in this case, we're actually combining two bits of media state (mediaLoading and mediaPaused), since,
   * in our implementation, we only want to indicate that media is loading when media is loading *and* the media is not paused,
   * so we'll only get an updated value/rerender when the *resultant* boolean value changes.
   */
  const mediaLoading = useMediaSelector(
    (state) => state?.mediaLoading && !state?.mediaPaused
  );

  // Example implementation of a delay in showing loading indicator when loading media starts (but quickly hiding it when it's done)
  const [mediaLoadingWithDelay, setMediaLoadingWithDelay] = useState(false);
  const [loadingDelayTimeoutId, setLoadingDelayTimeoutId] = useState<number>();
  useEffect(() => {
    if (loadingDelayTimeoutId) {
      clearTimeout(loadingDelayTimeoutId);
      setLoadingDelayTimeoutId(undefined);
    }
    if (!mediaLoading) {
      setMediaLoadingWithDelay(false);
      return;
    }
    const timeoutId = setTimeout(setMediaLoadingWithDelay, loadingDelay, true);
    // setTimeout is picking up node.js version of timeout, hence ts-ignore :(
    // @ts-ignore
    setLoadingDelayTimeoutId(timeoutId);
    return () => {
      clearTimeout(loadingDelayTimeoutId);
      setLoadingDelayTimeoutId(undefined);
    };
  }, [mediaLoading, loadingDelay, loadingDelayTimeoutId]);

  return (
    <Backdrop
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={!!mediaLoadingWithDelay}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingBackdrop;
