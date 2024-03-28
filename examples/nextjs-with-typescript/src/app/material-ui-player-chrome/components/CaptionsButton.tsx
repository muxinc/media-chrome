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
  const dispatch = useMediaDispatch();
  const mediaSubtitlesList =
    useMediaSelector((state) => state.mediaSubtitlesList) ?? [];
  const mediaSubtitlesShowing = useMediaSelector(
    (state) => state.mediaSubtitlesShowing
  );
  const showingSubtitles = !!mediaSubtitlesShowing?.length;
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
        onClick={() => {
          const type = showingSubtitles
            ? MediaActionTypes.MEDIA_DISABLE_SUBTITLES_REQUEST
            : MediaActionTypes.MEDIA_SHOW_SUBTITLES_REQUEST;
          const detail = showingSubtitles
            ? mediaSubtitlesShowing
            : [mediaSubtitlesList[0]];
          dispatch({ type, detail });
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default CaptionsButton;
