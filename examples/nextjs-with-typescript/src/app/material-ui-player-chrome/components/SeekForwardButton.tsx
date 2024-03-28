import { IconButton, Tooltip } from '@mui/material';
import Forward30Icon from '@mui/icons-material/Forward30';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const label = 'Seek backward';

const SeekForwardButton = () => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        onClick={() => {
          const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
          const detail = (mediaCurrentTime ?? 0) + 30;
          dispatch({ type, detail });
        }}
      >
        <Forward30Icon />
      </IconButton>
    </Tooltip>
  );
};

export default SeekForwardButton;
