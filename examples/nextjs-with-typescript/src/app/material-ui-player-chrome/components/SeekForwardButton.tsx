import { IconButton } from '@mui/material';
import Forward30Icon from '@mui/icons-material/Forward30';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const SeekForwardButton = () => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  return (
    <IconButton
      aria-label="seek forward"
      color="primary"
      onClick={() => {
        const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
        const detail = (mediaCurrentTime ?? 0) + 30;
        dispatch({ type, detail });
      }}
    >
      <Forward30Icon />
    </IconButton>
  );
};

export default SeekForwardButton;
