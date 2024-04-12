import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const SeekForwardGestureRegion = ({ sx }: Pick<BoxProps, 'sx'>) => {
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
    <Box
      sx={sx}
      onDoubleClick={() => {
        const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
        const detail = mediaCurrentTime + 30;
        dispatch({ type, detail });
      }}
    />
  );
};

export default SeekForwardGestureRegion;
