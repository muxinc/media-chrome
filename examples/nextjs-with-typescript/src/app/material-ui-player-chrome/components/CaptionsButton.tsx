import { IconButton, Tooltip } from '@mui/material';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import ClosedCaptionDisabledIcon from '@mui/icons-material/ClosedCaptionDisabled';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const label = 'Subtitles/closed captions';
const CaptionsButton = () => {
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * NOTE: in this case, we're doing some mildly fancier logic to only check if we have any currently showing subtitles.
   * Although in practice/typical use cases, there will often only ever be one set of subtitles showing, there are valid
   * cases where a player may want to show more than one set of subtitles at once (and Media Chrome's MediaStore supports
   * these cases). Because of this, mediaSubtitlesShowing is actually an array of the currently showing subititles (/captions).
   * Since we only care about if any are showing (or none are showing), we can handle that in the selector itself, so we'll only
   * get an updated value/rerender when the *resultant* boolean value changes.
   */
  const showingSubtitles = useMediaSelector(
    (state) => !!state.mediaSubtitlesShowing?.length
  );

  /**
   * Here we're picking which MUI icon to show based on whether or not we're paused
   */
  const IconComponent = showingSubtitles
    ? ClosedCaptionIcon
    : ClosedCaptionDisabledIcon;
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        color="primary"
        role="switch"
        aria-checked={showingSubtitles}
        aria-label={label}
        // disabled={!mediaSubtitlesList?.length}
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the captions button, we want make a MEDIA_TOGGLE_SUBTITLES_REQUEST, a convenient way to
         * toggle between having (any) subtitles on (showing) or off (disabled).
         */
        onClick={() => {
          const type = MediaActionTypes.MEDIA_TOGGLE_SUBTITLES_REQUEST;
          dispatch({ type });
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default CaptionsButton;
