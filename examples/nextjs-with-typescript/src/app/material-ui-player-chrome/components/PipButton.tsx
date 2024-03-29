import { IconButton, Tooltip } from '@mui/material';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

/**
 * A simple button to enter/exit picture in picture mode
 */
const PipButton = () => {
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * This is a simple use case of grabbing a single bit of state (in this case mediaIsPip) and a pattern that
   * you'd likely use a lot.
   */
  const mediaIsPip = useMediaSelector((state) => state.mediaIsPip);
  /**
   * We'll also change the text for both the tooltip and our aria-label (for a11y) based on mediaIsPiP
   */
  const label = mediaIsPip ? 'Exit picture in picture' : 'Picture in picture';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the pip button, we want to either make a MEDIA_EXIT_PIP_REQUEST (if we're currently in pip mode)
         * or a MEDIA_ENTER_PIP_REQUEST (if we're not).
         */
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
