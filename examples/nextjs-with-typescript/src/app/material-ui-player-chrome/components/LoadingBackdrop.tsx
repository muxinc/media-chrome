import { Backdrop, CircularProgress } from '@mui/material';
import { useMediaSelector } from '../../../../../../dist/react/media-store';
import { useEffect, useState } from 'react';

const LOADING_DELAY = 500;

const LoadingBackdrop = ({ loadingDelay = LOADING_DELAY }) => {
  // Here we're saying we only want to visually indicate loading if we're unpaused
  const mediaLoading = useMediaSelector(
    (state) => state.mediaLoading && !state.mediaPaused
  );

  // Example implementation of a delay in showing loading indicator
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
  }, [mediaLoading, loadingDelay]);

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
