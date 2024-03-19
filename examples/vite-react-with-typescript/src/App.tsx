import {
  ReactNode,
  /* Uncomment this to log out the latest mediaState as it changes */
  // useEffect,
  useState,
} from 'react';
import './App.css';
import {
  MediaProvider,
  useMediaDispatch,
  useMediaFullscreenRef,
  useMediaRef,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const PlayButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector((state) => state.mediaPaused);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaPaused
          ? MediaActionTypes.MEDIA_PLAY_REQUEST
          : MediaActionTypes.MEDIA_PAUSE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPaused ? 'Play' : 'Pause'}
    </button>
  );
};

const PlaybackRateButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPlaybackRate = useMediaSelector(
    (state) => state.mediaPlaybackRate
  );
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST;
        const detail = mediaPlaybackRate === 1 ? 2 : 1;
        dispatch({ type, detail });
      }}
    >
      {mediaPlaybackRate}x
    </button>
  );
};

const MuteButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPseudoMuted = useMediaSelector(
    (state) => state.mediaVolumeLevel === 'off'
  );
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaPseudoMuted
          ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
          : MediaActionTypes.MEDIA_MUTE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPseudoMuted ? 'Unmute' : 'Mute'}
    </button>
  );
};

const CaptionsToggleButton = () => {
  const dispatch = useMediaDispatch();
  const mediaSubtitlesList =
    useMediaSelector((state) => state.mediaSubtitlesList) ?? [];
  const mediaSubtitlesShowing = useMediaSelector(
    (state) => state.mediaSubtitlesShowing
  );
  const showingSubtitles = !!mediaSubtitlesShowing?.length;
  return (
    <button
      style={{ cursor: 'pointer' }}
      disabled={!mediaSubtitlesList?.length}
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
      {showingSubtitles ? 'Disable Captions' : 'Enable Captions'}
    </button>
  );
};

const PipButton = () => {
  const dispatch = useMediaDispatch();
  const mediaIsPip = useMediaSelector((state) => state.mediaIsPip);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaIsPip
          ? MediaActionTypes.MEDIA_EXIT_PIP_REQUEST
          : MediaActionTypes.MEDIA_ENTER_PIP_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsPip ? 'Enter Pip' : 'Exit Pip'}
    </button>
  );
};

const FullscreenButton = () => {
  const dispatch = useMediaDispatch();
  const mediaIsFullscreen = useMediaSelector(
    (state) => state.mediaIsFullscreen
  );
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaIsFullscreen
          ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
          : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsFullscreen ? 'Enter Fullscreen' : 'Exit Fullscreen'}
    </button>
  );
};

const TimeRange = () => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  const mediaDuration = useMediaSelector((state) => state.mediaDuration);
  return (
    <input
      style={{ flexGrow: 1 }}
      type="range"
      min={0}
      max={Number.isNaN(mediaDuration) ? 0 : mediaDuration}
      value={mediaCurrentTime ?? 0}
      step={0.1}
      onChange={(event) => {
        const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
        const detail = +event.target.value;
        dispatch({ type, detail });
      }}
    />
  );
};

const VolumeRange = () => {
  const dispatch = useMediaDispatch();
  const mediaVolume = useMediaSelector((state) => state.mediaVolume);
  return (
    <input
      type="range"
      min={0}
      max={1}
      value={mediaVolume ?? 0.5}
      step={0.1}
      onChange={(event) => {
        const type = MediaActionTypes.MEDIA_VOLUME_REQUEST;
        const detail = +event.target.value;
        dispatch({ type, detail });
      }}
    />
  );
};

const Video = ({ src }: { src?: string }) => {
  const mediaRefCallback = useMediaRef();
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

const Container = ({ children }: { children: ReactNode }) => {
  const fullscreenRefCallback = useMediaFullscreenRef();
  return (
    <div
      id="fullscreen"
      style={{ width: '100vw', display: 'flex', flexDirection: 'column' }}
      ref={fullscreenRefCallback}
    >
      {children}
    </div>
  );
};

/* Uncomment this to log out the latest mediaState as it changes */
// const Logger = () => {
//   const mediaState = useMediaSelector((state) => state);
//   useEffect(() => {
//     console.log('mediaState?', mediaState);
//   }, [mediaState]);
//   return <></>;
// };

const ReactPlayer = ({ src }: { src?: string }) => {
  const [attachVideo, setAttachVideo] = useState(true);
  return (
    <MediaProvider>
      <div>
        <label htmlFor="toggleAttachVideo">Attach Video?</label>
        <input
          id="toggleAttachVideo"
          type="checkbox"
          checked={attachVideo}
          onChange={() => setAttachVideo(!attachVideo)}
        />
      </div>
      {/* Uncomment this to log out the latest mediaState as it changes */}
      {/* <Logger /> */}
      <Container>
        {attachVideo ? <Video src={src} /> : null}
        <div style={{ display: 'flex', background: 'black' }}>
          <TimeRange />
        </div>
        <div style={{ display: 'flex', background: 'black' }}>
          <PlayButton />
          <MuteButton />
          <VolumeRange />
          <div style={{ flexGrow: 1 }} />
          <CaptionsToggleButton />
          <PlaybackRateButton />
          <PipButton />
          <FullscreenButton />
        </div>
      </Container>
    </MediaProvider>
  );
};

function App() {
  return (
    <>
      <ReactPlayer src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4" />
    </>
  );
}

export default App;
