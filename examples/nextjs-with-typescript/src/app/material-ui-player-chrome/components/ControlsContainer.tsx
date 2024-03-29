import { Box, Stack } from '@mui/material';
import { useMediaSelector } from 'media-chrome/react/media-store';
import CurrentTimeDisplay from './CurrentTimeDisplay';
import Seekbar from './Seekbar';
import DurationDisplay from './DurationDisplay';
import PlayButton from './PlayButton';
import SeekBackwardButton from './SeekBackwardButton';
import SeekForwardButton from './SeekForwardButton';
import MuteButton from './MuteButton';
import VolumeSlider from './VolumeSlider';
import CaptionsButton from './CaptionsButton';
import PlaybackRateMenuButton from './PlaybackRateMenuButton';
import PipButton from './PipButton';
import FullscreenButton from './FullscreenButton';

/**
 * @description A mostly simple UI of control/display components integrated into the <MediaProvider/>'s MediaStore.
 * @returns A react component that contains all of the primary control/display components for the player UI.
 */
const ControlsContainer = () => {
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * For this use case, we're using it as one of the conditions to determine whether or not to show the controls.
   * NOTE: in this case, we're doing some mildly fancier logic to make sure (for things like SSR/async) that mediaPaused
   * has been set to a boolean before treating the media as unpaused. In the future, we may account for more of these
   * kinds of cases automatically to reduce complexity/cognitive load for folks using the MediaStore and/or react hooks.
   */
  const mediaPaused = useMediaSelector(
    (state) => typeof state.mediaPaused !== 'boolean' || state.mediaPaused
  );
  return (
    <Stack
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        // Only show the controls UI when:
        // 1. the media is paused
        opacity: mediaPaused ? 1 : 0,
        // 2. we're hovering over the player UI *or*
        '&:hover': {
          opacity: 1,
        },
        // 3. The player UI has focus
        '&:focus-within': {
          opacity: 1,
        },
        // You may already have noted that this won't be sufficient for, e.g. touch-based devices like mobile phones
        // To do this, you'd want to also show/hide based on taps to the UI, likely with some kind of delay to autohide.
      }}
    >
      {/* A vertical spacer */}
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center">
        <CurrentTimeDisplay />
        <Seekbar />
        <DurationDisplay />
      </Stack>
      <Stack direction="row" alignItems="center">
        <PlayButton />
        <SeekBackwardButton />
        <SeekForwardButton />
        <MuteButton />
        <VolumeSlider />
        {/* A horizontal spacer */}
        <Box sx={{ flexGrow: 1 }} />
        <CaptionsButton />
        <PlaybackRateMenuButton />
        <PipButton />
        <FullscreenButton />
      </Stack>
    </Stack>
  );
};

export default ControlsContainer;
