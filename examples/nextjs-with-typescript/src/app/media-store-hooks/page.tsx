import { ReactPlayer } from "@/app/media-store-hooks/ReactPlayer";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ReactPlayer src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4" />
    </main>
  );
}
