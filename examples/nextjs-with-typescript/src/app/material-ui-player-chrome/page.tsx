import Player from '@/app/material-ui-player-chrome/components/Player';

/**
 * @description This page demonstrates building a completely react-only Media Player UI using Media Chrome's react-specific
 * MediaStore integration (hooks, context providers, etc.). While this example uses Material UI components, you can of course
 * use any component library you'd like (or DIY using vanilla React).
 */
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/**
       * This is a react component that wraps up
       * 1. the video component
       * 2. the UI components/controls/containers and
       * 3. the MediaStore react state management that allows for easily reacting to media state changes and making media state change requests
       * To get a better sense of this, take a peek under the hood at the components, starting with <Player/>!
      */}
      <Player src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4">
        <track
          label="English"
          kind="captions"
          srcLang="en"
          src="./vtt/en-cc.vtt"
        />
      </Player>
    </main>
  );
}
