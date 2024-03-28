import Player from '@/app/material-ui-player-chrome/components/Player';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
