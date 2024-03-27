'use client';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const PlayButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector((state) => state.mediaPaused);
  const IconComponent = typeof mediaPaused !== 'boolean' || mediaPaused ? PlayArrowIcon : PauseIcon;
  return (
    <IconButton
      aria-label={mediaPaused ? 'play' : 'pause'}
      color="primary"
      onClick={() => {
        const type = mediaPaused
          ? MediaActionTypes.MEDIA_PLAY_REQUEST
          : MediaActionTypes.MEDIA_PAUSE_REQUEST;
        dispatch({ type });
      }}
    >
      <IconComponent />
    </IconButton>
  );
};

export default PlayButton;
