import { IconButton, Tooltip } from '@mui/material';
import Replay30Icon from '@mui/icons-material/Replay30';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const label = 'Seek backward';

const SeekBackwardButton = () => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        onClick={() => {
          const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
          const detail = (mediaCurrentTime ?? 0) - 30;
          dispatch({ type, detail });
        }}
      >
        <Replay30Icon />
      </IconButton>
    </Tooltip>
  );
};

export default SeekBackwardButton;
