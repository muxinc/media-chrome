import { Slider, Tooltip } from '@mui/material';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const label = 'Volume';

/**
 * A simple volume slider control
 */
const VolumeSlider = ({
  orientation = 'horizontal',
}: {
  orientation?: 'horizontal' | 'vertical';
}) => {
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * NOTE: in this case, we're doing some mildly fancier logic to make sure (for things like SSR/async) that mediaVolume
   * has is a numeric value, since we're using it as our <Slider/> value, below. In the future, we may account for more of these
   * kinds of cases automatically to reduce complexity/cognitive load for folks using the MediaStore and/or react hooks.
   */
  const mediaVolume = useMediaSelector((state) => state.mediaVolume ?? 0.5);
  /**
   * We're also grabbing the mediaMuted state, so we can treat that as equivalent to a volume of "0" in the UI.
   */
  const mediaMuted = useMediaSelector((state) => state.mediaMuted);
  /**
   * In this case, we're translating the volume level (from 0-1) to 0-100 because MUI Slider's don't play as nicely with the small values.
   */
  const value = mediaMuted ? 0 : mediaVolume * 100;
  return (
    <Tooltip title={label} placement="top">
      <Slider
        aria-label={label}
        min={0}
        max={100}
        value={value}
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone interacts with the volume slider (thus causing a change event), we want to make a MEDIA_VOLUME_REQUEST
         * to the <MediaProvider/>'s MediaStore to seek to the time that corresponds with the changed component value.
         * This is an example of a state change request that requires a "detail" (in this case, a numeric "volume")
         * for it to make sense, since making a request to change the volume in the media begs the question: *What* volume?
         * We're also convert the value back to the appropriate units (See above for why we're changing it in the first place).
         */
        onChange={(_event, value) => {
          const type = MediaActionTypes.MEDIA_VOLUME_REQUEST;
          const detail = (value as number) / 100;
          dispatch({ type, detail });
        }}
        orientation={orientation}
        size="small"
        sx={{
          mx: 2,
          width: 100,
        }}
      />
    </Tooltip>
  );
};

export default VolumeSlider;
