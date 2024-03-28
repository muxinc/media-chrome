'use client';
import { IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const PlayButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector(
    (state) => typeof state.mediaPaused !== 'boolean' || state.mediaPaused
  );
  const IconComponent = mediaPaused ? PlayArrowIcon : PauseIcon;
  const label = mediaPaused ? 'Play' : 'Pause';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
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
    </Tooltip>
  );
};

export default PlayButton;
