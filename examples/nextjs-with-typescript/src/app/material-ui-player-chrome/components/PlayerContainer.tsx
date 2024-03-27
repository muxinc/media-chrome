import { Box } from '@mui/material';
import { useMediaFullscreenRef } from 'media-chrome/react/media-store';
import type { ReactNode } from 'react';

const PlayerContainer = ({ children }: { children: ReactNode }) => {
  const fullscreenRefCallback = useMediaFullscreenRef();
  return (
    <Box
      id="fullscreen"
      ref={fullscreenRefCallback}
      sx={{
        position: 'relative',
        backgroundColor: 'black',
      }}
    >
      {children}
    </Box>
  );
};

export default PlayerContainer;
