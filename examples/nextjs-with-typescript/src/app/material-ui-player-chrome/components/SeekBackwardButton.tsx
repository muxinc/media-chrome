import { IconButton, Tooltip } from '@mui/material';
import Replay30Icon from '@mui/icons-material/Replay30';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const label = 'Seek backward';

/**
 * A simple seek backward button
 */
const SeekBackwardButton = () => {
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * This is an example where we're using some media state (in this case mediaCurrentTime), *not* for display purposes,
   * but instead for sufficient context when making state change requests.
   */
  const mediaCurrentTime = useMediaSelector(
    (state) => state.mediaCurrentTime ?? 0
  );
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the seek backward button, we want to make a MEDIA_SEEK_REQUEST
         * to the <MediaProvider/>'s MediaStore to seek back 30 seconds before the mediaCurrentTime
         */
        onClick={() => {
          const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
          const detail = mediaCurrentTime - 30;
          dispatch({ type, detail });
        }}
      >
        <Replay30Icon />
      </IconButton>
    </Tooltip>
  );
};

export default SeekBackwardButton;
