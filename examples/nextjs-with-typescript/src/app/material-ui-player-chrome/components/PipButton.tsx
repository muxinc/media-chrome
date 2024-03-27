import { IconButton } from '@mui/material';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const PipButton = () => {
  const dispatch = useMediaDispatch();
  const mediaIsPip = useMediaSelector((state) => state.mediaIsPip);
  return (
    <IconButton
      aria-label={
        mediaIsPip ? 'exit picture in picture' : 'enter picture in picture'
      }
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
  );
};

export default PipButton;
