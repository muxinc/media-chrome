import { IconButton } from '@mui/material';
import Replay30Icon from '@mui/icons-material/Replay30';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const SeekBackwardButton = () => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  return (
    <IconButton
      aria-label="seek backward"
      color="primary"
      onClick={() => {
        const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
        const detail = (mediaCurrentTime ?? 0) - 30;
        dispatch({ type, detail });
      }}
    >
      <Replay30Icon />
    </IconButton>
  );
};

export default SeekBackwardButton;
