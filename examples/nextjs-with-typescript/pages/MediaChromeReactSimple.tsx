import type { NextPage } from 'next';
import Head from 'next/head';
import 'media-chrome';
import styles from '../styles/Home.module.css';
import {
  Provider as MediaChromeProvider,
  useMediaDispatch as useDispatch,
  useFullscreenRefCallback,
  useMediaRefCallback,
  useMediaStore,
  useMediaSelector as useSelector,
} from '../components/media-chrome-react/stateMgmt';
import 'media-chrome/dist/themes/microvideo.js';
import { useEffect } from 'react';
import { MediaUIEvents } from '../../../dist/constants';

const PlayButton = () => {
  const dispatch = useDispatch();
  const mediaPaused = useSelector((state) => state.mediaPaused);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaPaused ? 'mediaplayrequest' : 'mediapauserequest';
        dispatch({ type });
      }}
    >
      {mediaPaused ? 'Play' : 'Pause'} React Only!
    </button>
  );
};

const PlaybackRateButton = () => {
  const dispatch = useDispatch();
  const mediaPlaybackRate = useSelector((state) => state.mediaPlaybackRate);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST;
        const detail = mediaPlaybackRate === 1 ? 2 : 1;
        console.log('toggle', type, detail);
        dispatch({ type, detail });
      }}
    >
      {mediaPlaybackRate}x
    </button>
  );
};

const MuteButton = () => {
  const dispatch = useDispatch();
  const mediaPseudoMuted = useSelector(
    (state) => state.mediaVolumeLevel === 'off'
  );
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaPseudoMuted
          ? MediaUIEvents.MEDIA_UNMUTE_REQUEST
          : MediaUIEvents.MEDIA_MUTE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPseudoMuted ? 'Unmute' : 'Mute'} React Only!
    </button>
  );
};

const CaptionsToggleButton = () => {
  const dispatch = useDispatch();
  const mediaSubtitlesList = useSelector((state) => state.mediaSubtitlesList);
  const mediaSubtitlesShowing = useSelector(
    (state) => state.mediaSubtitlesShowing
  );
  const showingSubtitles = !!mediaSubtitlesShowing?.length;
  return (
    <button
      style={{ cursor: 'pointer' }}
      disabled={!mediaSubtitlesList?.length}
      onClick={() => {
        const type = showingSubtitles
          ? MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST
          : MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST;
        const detail = showingSubtitles
          ? mediaSubtitlesShowing
          : [mediaSubtitlesList[0]];
        dispatch({ type, detail });
      }}
    >
      {showingSubtitles ? 'Disable Captions' : 'Enable Captions'} React Only!
    </button>
  );
};

const PipButton = () => {
  const dispatch = useDispatch();
  const mediaIsPip = useSelector((state) => state.mediaIsPip);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaIsPip
          ? MediaUIEvents.MEDIA_EXIT_PIP_REQUEST
          : MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsPip ? 'Enter Pip' : 'Exit Pip'} React Only!
    </button>
  );
};

const FullscreenButton = () => {
  const dispatch = useDispatch();
  const mediaIsFullscreen = useSelector((state) => state.mediaIsFullscreen);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaIsFullscreen
          ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
          : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsFullscreen ? 'Enter Fullscreen' : 'Exit Fullscreen'} React Only!
    </button>
  );
};

const TimeRange = () => {
  const dispatch = useDispatch();
  const mediaCurrentTime = useSelector((state) => state.mediaCurrentTime);
  const mediaDuration = useSelector((state) => state.mediaDuration);
  return (
    <div>
      <span>Time Range</span>
      <input
        type="range"
        min={0}
        max={Number.isNaN(mediaDuration) ? 0 : mediaDuration}
        value={mediaCurrentTime}
        step={0.1}
        onChange={(event) => {
          const type = MediaUIEvents.MEDIA_SEEK_REQUEST;
          const detail = +event.target.value;
          dispatch({ type, detail });
        }}
      />
    </div>
  );
};

const VolumeRange = () => {
  const dispatch = useDispatch();
  const mediaVolume = useSelector((state) => state.mediaVolume);
  return (
    <div>
      <span>Volume Range</span>
      <input
        type="range"
        min={0}
        max={1}
        value={mediaVolume}
        step={0.1}
        onChange={(event) => {
          const type = MediaUIEvents.MEDIA_VOLUME_REQUEST;
          const detail = +event.target.value;
          dispatch({ type, detail });
        }}
      />
    </div>
  );
};

const Video = ({ src }: { src?: string }) => {
  const mediaRefCallback = useMediaRefCallback();
  return (
    <video
      ref={mediaRefCallback}
      slot="media"
      src={src}
      preload="auto"
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

const MediaPlayButton = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const mediaPaused = useSelector((state) => state.mediaPaused);
  return (
    // @ts-ignore
    <media-play-button
      mediapaused={mediaPaused ? '' : undefined}
      // NOTE: The real version would actually forward on the mediaplayrequest/mediapauserequest events
      onClick={() => {
        const type = mediaPaused ? 'mediaplayrequest' : 'mediapauserequest';
        dispatch({ type });
      }}
      // @ts-ignore
    ></media-play-button>
  );
};

// @ts-ignore
const Container = ({ children }) => {
  const fullscreenRefCallback = useFullscreenRefCallback();
  const store = useMediaStore();
  return (
    // @ts-ignore
    <media-controller
      nodefaultstore
      style={{ maxWidth: '50vw' }}
      // @ts-ignore
      ref={(el) => {
        fullscreenRefCallback(el);
        el.mediaStore = store;
      }}
    >
      {children}
      {/* @ts-ignore */}
    </media-controller>
  );
};

const Logger = () => {
  const mediaState = useSelector((state) => state);
  useEffect(() => {
    console.log('mediaState?', mediaState);
  }, [mediaState]);
  return <></>;
};

const ReactPlayer = ({ src }: { src?: string }) => {
  return (
    // @ts-ignore
    <MediaChromeProvider>
      <Logger />
      <Container>
        <Video src={src} />
        {/* @ts-ignore */}
        <media-control-bar>
          {/* <PlayButton /> */}
          {/* <MediaPlayButton /> */}
          {/* @ts-ignore */}
          <media-play-button></media-play-button>
          <PlaybackRateButton />
          <MuteButton />
          <CaptionsToggleButton />
          <PipButton />
          <FullscreenButton />
          <TimeRange />
          <VolumeRange />
          {/* @ts-ignore */}
        </media-control-bar>
      </Container>
    </MediaChromeProvider>
  );
};

// @ts-ignore
const ThemeContainer = ({ children }) => {
  const fullscreenRefCallback = useFullscreenRefCallback();
  const store = useMediaStore();
  return (
    // @ts-ignore
    <media-theme-microvideo
      nodefaultstore
      style={{ maxWidth: '50vw' }}
      // @ts-ignore
      ref={(el) => {
        // NOTE: This is only here because of race condition issues of Web Components + Next.JS HMR in dev (CJP)
        if (!el?.mediaController) {
          console.warn(
            'Looks like you did a HMR which caused an issue with Web Component registration timing. Reload the page for proper functioning!'
          );
          return;
        }
        el.mediaController.mediaStore = store;
        fullscreenRefCallback(el);
        // @ts-ignore
      }}
    >
      {children}
      {/* @ts-ignore */}
    </media-theme-microvideo>
  );
};

const ReactThemePlayer = ({ src }: { src?: string }) => {
  return (
    // @ts-ignore
    <MediaChromeProvider>
      <div>
        <ThemeContainer>
          <Video src={src} />
        </ThemeContainer>
        <div>
          <PlayButton />
          <PipButton />
          <FullscreenButton />
        </div>
      </div>
    </MediaChromeProvider>
  );
};

// const Home: NextPage = () => {
//   return (
//     // @ts-ignore
//     <MediaChromeProvider>
//       <Logger />
//       <div className={styles.container}>
//         <Head>
//           <title>Media Chrome React+Next.JS</title>
//           <meta name="description" content="Generated by create next app" />
//           <link rel="icon" href="/favicon.ico" />
//         </Head>

//         <main className={styles.main}>
//           <h1 className={styles.title}>
//             Welcome to{' '}
//             <a href="https://www.media-chrome.org" target="_blank">
//               Media Chrome (React Only!)!
//             </a>
//           </h1>
//           <Container>
//             <Video />
//             <PlayButton />
//             <PlaybackRateButton />
//             <MuteButton />
//             <CaptionsToggleButton />
//             <PipButton />
//             <FullscreenButton />
//             <TimeRange />
//             <VolumeRange />
//             {/* <MediaPlayButton /> */}
//           </Container>
//         </main>

//         <footer className={styles.footer}></footer>
//       </div>
//     </MediaChromeProvider>
//   );
// };

const Home: NextPage = () => {
  return (
    // @ts-ignore
    <div className={styles.container}>
      <Head>
        <title>Media Chrome React+Next.JS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{' '}
          <a href="https://www.media-chrome.org" target="_blank">
            Media Chrome (React Only!)!
          </a>
        </h1>
        <div>
          {/* <ReactPlayer src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4" />
          <ReactPlayer src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4" /> */}
          <ReactThemePlayer src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4" />
        </div>
        {/* ll-live playback-id: v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM */}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};
export default Home;
