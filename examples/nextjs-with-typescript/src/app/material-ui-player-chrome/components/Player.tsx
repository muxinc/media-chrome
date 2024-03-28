'use client';
import { MediaProvider, useMediaRef } from 'media-chrome/react/media-store';
import { ThemeProvider } from '@mui/material';
import PlayerContainer from './PlayerContainer';
import theme from './theme';
import LoadingBackdrop from './LoadingBackdrop';
import ControlsContainer from './ControlsContainer';

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
      {/* <track
        label="thumbnails"
        default
        kind="metadata"
        src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"
      /> */}
      <track
        label="English"
        kind="captions"
        srcLang="en"
        src="./vtt/en-cc.vtt"
      />
    </video>
  );
};

const Player = ({ src }: { src?: string }) => {
  return (
    <MediaProvider>
      <ThemeProvider theme={theme}>
        <PlayerContainer>
          <Video src={src} />
          <LoadingBackdrop />
          <ControlsContainer />
        </PlayerContainer>
      </ThemeProvider>
    </MediaProvider>
  );
};

export default Player;
