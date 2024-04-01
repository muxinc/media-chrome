'use client';
import { MediaProvider } from 'media-chrome/react/media-store';
import { ThemeProvider } from '@mui/material';
import PlayerContainer from './PlayerContainer';
import theme from './theme';
import LoadingBackdrop from './LoadingBackdrop';
import ControlsContainer from './ControlsContainer';
import Video from './Video';
import { DetailedHTMLProps, VideoHTMLAttributes } from 'react';

/**
 * @description This is the fully-packaged "media player" with UI that uses Material UI for all of its "chrome"/UI components.
 * @param props - The <Player/> props here are identical to a <video/> component's props (and the TypeScript types are also identical)
 * @returns A player react component instance
 */
const Player = (
  props: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
) => {
  return (
    /**
     * <MediaProvider/> is a {@link https://react.dev/learn/passing-data-deeply-with-context#step-3-provide-the-context|React Context.Provider} for
     * getting media state and requesting changes to media state. For examples of this, you can check out the various components used "under the hood".
     * It's worth noting that, unlike many other Context <Provider/> use cases in React where you tend to push them up to the top of your application root,
     * for most folks most of the time, you'll want to keep your <MediaProvider/> close to the player itself, since it models media state for a particular
     * player UI. For example, with the implementation of <Player/> here, you can have several players on the page at the same time, and each would "own"
     * their own <MediaProvider/> to manage the media state + UI for *that player instance*.
     *
     */
    <MediaProvider>
      {/**
       * This is a Material UI theme provider, which allows for general styling of all ("theme aware") MUI components. For some cases,
       * folks might want their theme provider (MUI or otherwise) to be "external" to their player (say, closer to the root of a page or app)
       * so they can easily keep their player styling consistent with their larger application theme details.
       */}
      <ThemeProvider theme={theme}>
        {/**
         * <PlayerContainer/> provides a root component for things like layout and a target for when in fullscreen, which also gets wired up to
         * the <MediaProvider/>'s MediaStore.
         */}
        <PlayerContainer>
          {/**
           * <Video/> is a thin wrapper around your actual media component (e.g. a <video/>) that also wires it up to the <MediaProvider/>'s MediaStore.
           */}
          <Video {...props} />
          {/**
           * <LoadingBackdrop/> is a backdrop/overlay over the UI that shows a loading indicator while media is loading.
           */}
          <LoadingBackdrop />
          {/**
           * <ControlsContainer/> is another UI layer above the video that contains all of the other controls/display components.
           */}
          <ControlsContainer />
        </PlayerContainer>
      </ThemeProvider>
    </MediaProvider>
  );
};

export default Player;
