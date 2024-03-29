import { Slider } from '@mui/material';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

/**
 * A component for seeking through the video and seeing its playback progress
 */
const Seekbar = () => {
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * This is a simple use case of grabbing a single bit of state (in this case mediaCurrentTime) and a pattern that
   * you'd likely use a lot.
   */
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  /**
   * For this comopnent, we're also grabbing the media's "seekable" start and end state. This is generally equivalent to [0, "mediaDuration"],
   * except it also accounts for things like live/DVR media playback where the start and end can change over time. We can use
   * these values to set the most up to date min/max of where we can seek to in the seek bar component.
   */
  const [min, max] = useMediaSelector((state) => state.mediaSeekable) ?? [];
  return (
    <Slider
      aria-label="seekbar"
      value={mediaCurrentTime ?? 0}
      min={min}
      max={max}
      /**
       * This is an example of using dispatch() to make a state change request. In this case, whenever
       * someone interacts with the seek bar (thus causing a change event), we want to make a MEDIA_SEEK_REQUEST
       * to the <MediaProvider/>'s MediaStore to seek to the time that corresponds with the changed component value.
       * This is an example of a state change request that requires a "detail" (in this case, a numeric "time" in seconds)
       * for it to make sense, since making a request to seek in the media begs the question: Seek to *where*?
       */
      onChange={(_event, value) => {
        const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
        const detail = value;
        dispatch({ type, detail });
      }}
      size="small"
      sx={{
        mx: 2,
      }}
    />
  );
};

export default Seekbar;
