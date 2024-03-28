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

const ControlsContainer = () => {
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
        // NOTE: This is not as reliable/"fancy" as the <media-controller> impl, but it gives an idea (CJP)
        opacity: mediaPaused ? 1 : 0,
        '&:hover': {
          opacity: 1,
        },
        '&:focus-within': {
          opacity: 1,
        },
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
