import { IconButton, Tooltip } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

/**
 * In the future, we may add these
 */
const VolumeLevel = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  OFF: 'off',
} as const;

/**
 * A simple lookup table/map object to correlate the current volume level with
 * the corresponding button icon we'd like to display
 */
const VolumeIconComponentMap = {
  [VolumeLevel.HIGH]: VolumeUpIcon,
  [VolumeLevel.MEDIUM]: VolumeDownIcon,
  [VolumeLevel.LOW]: VolumeDownIcon,
  [VolumeLevel.OFF]: VolumeOffIcon,
  DEFAULT: VolumeOffIcon,
};

/**
 * A mute button with some basic volume level indication
 */
const MuteButton = () => {
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * mediaVolumeLevel is an example of some "convenience media state" that the MediaStore provides to describe the "level"
   * of volume (high, medium, low, or off) based on both the media's volume and muted state.
   */
  const mediaVolumeLevel = useMediaSelector((state) => state.mediaVolumeLevel);
  /**
   * Treat the volume level "off" as muted state for our state change requests.
   */
  const mediaPseudoMuted = mediaVolumeLevel === VolumeLevel.OFF;
  /**
   * And also for changing the text for both the tooltip and our aria-label (for a11y)
   */
  const label = mediaPseudoMuted ? 'Unmute' : 'Mute';
  /**
   * Pick which icon we should show based on the current mediaVolumeLevel
   */
  const IconComponent = VolumeIconComponentMap[mediaVolumeLevel ?? 'DEFAULT'];
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the mute button, we want to either make a MEDIA_UNMUTE_REQUEST (if we're currently "pseudo muted")
         * or a MEDIA_MUTE_REQUEST (if we're not).
         */
        onClick={() => {
          const type = mediaPseudoMuted
            ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
            : MediaActionTypes.MEDIA_MUTE_REQUEST;
          dispatch({ type });
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default MuteButton;
