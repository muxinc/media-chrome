/*
 * Picked off from here:
 *   https://github.com/muxinc/elements/blob/main/types/mux-embed.d.ts
 *   https://github.com/muxinc/elements/blob/main/types/mux.d.ts
 *
 * When mux-embed gets types built-in we can delete this file
 */
type MetaData = {
  env_key?: string;
  video_title?: string;
  player_init_time?: number;
};

type PlayerId = string | HTMLMediaElement;

type Options = {
  debug?: boolean;
  data?: MetaData;
};

function monitor(id: PlayerId, options?: Options): void;

declare module 'mux-embed' {
  export { monitor };
}
