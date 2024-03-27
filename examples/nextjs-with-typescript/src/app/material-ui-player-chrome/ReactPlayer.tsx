'use client';
import { MediaProvider, useMediaRef } from 'media-chrome/react/media-store';
import PlayButton from './components/PlayButton';
import MuteButton from './components/MuteButton';
import SeekBackwardButton from './components/SeekBackwardButton';
import SeekForwardButton from './components/SeekForwardButton';
import CaptionsButton from './components/CaptionsButton';
import PipButton from './components/PipButton';
import FullscreenButton from './components/FullscreenButton';
import VolumeSlider from './components/VolumeSlider';
import Seekbar from './components/Seekbar';
import {
  Box,
  Stack,
  ThemeProvider,
} from '@mui/material';
import PlaybackRateMenuButton from './components/PlaybackRateMenuButton';
import PlayerContainer from './components/PlayerContainer';
import theme from './components/theme';
import CurrentTimeDisplay from './components/CurrentTimeDisplay';
import DurationDisplay from './components/DurationDisplay';
import LoadingBackdrop from './components/LoadingBackdrop';

const Video = ({ src }: { src?: string }) => {
  const mediaRefCallback = useMediaRef();
  return (
    <video
      ref={mediaRefCallback}
      slot="media"
      src={src}
      // preload="auto"
      preload="metadata"
      muted
      crossOrigin=""
      playsInline
      // controls
    >
      <track
        label="thumbnails"
        default
        kind="metadata"
        src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"
      />
      <track
        label="English"
        kind="captions"
        srcLang="en"
        src="./vtt/en-cc.vtt"
      />
    </video>
  );
};

export const ReactPlayer = ({ src }: { src?: string }) => {
  return (
    <MediaProvider>
      <ThemeProvider theme={theme}>
        <PlayerContainer>
          <Video src={src} />
          <LoadingBackdrop />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
            }}
          >
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
              {/* A spacer */}
              <Box sx={{ flexGrow: 1 }} />
              <CaptionsButton />
              <PlaybackRateMenuButton />
              <PipButton />
              <FullscreenButton />
            </Stack>
          </Box>
        </PlayerContainer>
      </ThemeProvider>
    </MediaProvider>
  );
};
