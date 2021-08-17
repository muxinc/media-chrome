/** @TODO Add type defs to mux-embed directly */
declare module "mux-embed" {
  import Hls from "hls.js";
  /** @TODO Add better type def for options */
  type RequiredMetadata = {
    env_key: string;
  };

  type HighPriorityMetadata = {
    video_id: string;
    video_title: string;
    viewer_user_id: string;
  };

  type OptionalMetadata = {
    experiment_name: string;
    page_type: string;
    player_init_time: number;
    player_name: string;
    player_version: string;
    sub_property_id: string;
    video_cdn: string;
    video_content_type: string;
    video_duration: number;
    video_encoding_variant: string;
    video_language_code: string;
    video_producer: string;
    video_series: string;
    video_stream_type: string;
    video_variant_name: string;
    video_variant_id: string;
    view_session_id: string;
  };

  type OverridableMetadata = {
    browser: string;
    browser_version: string;
    cdn: string;
    operating_system: string;
    operating_system_version: string;
    page_url: string;
    player_autoplay: boolean;
    player_height: number;
    player_instance_id: string;
    player_language: string;
    player_poster: string;
    player_preload: boolean;
    player_remote_played: boolean;
    player_software_name: string;
    player_software_version: string;
    player_source_height: number;
    player_source_width: number;
    player_width: number;
    source_type: string;
    used_fullscreen: boolean;
    viewer_connection_type: string;
    viewer_device_category: string;
    viewer_device_manufacturer: string;
    viewer_device_name: string;
  };

  type Metadata = RequiredMetadata &
    Partial<HighPriorityMetadata> &
    Partial<OptionalMetadata> &
    Partial<OverridableMetadata>;

  export type Options<M extends Metadata = Metadata> = {
    debug?: boolean;
    hlsjs?: Hls;
    Hls?: typeof Hls;
    data: M;
  };

  /** @TODO Add well defined event types (CJP) */
  type EventTypesMap = {
    hb: Partial<Metadata>;
  };

  export function monitor(id: string | HTMLMediaElement, options: Options): void;

  export function emit<K extends keyof EventTypesMap>(type: K, payload: EventTypesMap[K]): void;

  export function destroy(): void;
}
