'use client';
import { MediaProvider } from 'media-chrome/react/media-store';
import { ThemeProvider } from '@mui/material';
import PlayerContainer from './PlayerContainer';
import theme from './theme';
import LoadingBackdrop from './LoadingBackdrop';
import ControlsContainer from './ControlsContainer';
import Video from './Video';
import { DetailedHTMLProps, VideoHTMLAttributes } from 'react';

const Player = (
  props: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
) => {
  return (
    <MediaProvider>
      <ThemeProvider theme={theme}>
        <PlayerContainer>
          <Video {...props} />
          <LoadingBackdrop />
          <ControlsContainer />
        </PlayerContainer>
      </ThemeProvider>
    </MediaProvider>
  );
};

export default Player;
