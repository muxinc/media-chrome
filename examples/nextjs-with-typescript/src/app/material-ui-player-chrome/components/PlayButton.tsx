'use client';
import { IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

/**
 * A simple play/pause button
 */
const PlayButton = () => {
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * NOTE: in this case, we're doing some mildly fancier logic to make sure (for things like SSR/async) that mediaPaused
   * has been set to a boolean before treating the media as unpaused. In the future, we may account for more of these
   * kinds of cases automatically to reduce complexity/cognitive load for folks using the MediaStore and/or react hooks.
   */
  const mediaPaused = useMediaSelector(
    (state) => typeof state.mediaPaused !== 'boolean' || state.mediaPaused
  );

  /**
   * Here we're picking which MUI icon to show based on whether or not we're paused
   */
  const IconComponent = mediaPaused ? PlayArrowIcon : PauseIcon;
  /**
   * And also changing the text for both the tooltip and our aria-label (for a11y)
   */
  const label = mediaPaused ? 'Play' : 'Pause';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the play button, we want to either make a MEDIA_PLAY_REQUEST (if we're currently paused)
         * or a MEDIA_PAUSE_REQUEST (if we're currently not paused).
         */
        onClick={() => {
          const type = mediaPaused
            ? MediaActionTypes.MEDIA_PLAY_REQUEST
            : MediaActionTypes.MEDIA_PAUSE_REQUEST;
          dispatch({ type });
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default PlayButton;
