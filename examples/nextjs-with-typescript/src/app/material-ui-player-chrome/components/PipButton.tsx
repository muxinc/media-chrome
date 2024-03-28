import { IconButton, Tooltip } from '@mui/material';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const PipButton = () => {
  const dispatch = useMediaDispatch();
  const mediaIsPip = useMediaSelector((state) => state.mediaIsPip);
  const label = mediaIsPip ? 'Exit picture in picture' : 'Picture in picture';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        onClick={() => {
          const type = mediaIsPip
            ? MediaActionTypes.MEDIA_EXIT_PIP_REQUEST
            : MediaActionTypes.MEDIA_ENTER_PIP_REQUEST;
          dispatch({ type });
        }}
      >
        <PictureInPictureIcon />
      </IconButton>
    </Tooltip>
  );
};

export default PipButton;
