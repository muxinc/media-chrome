
declare module "media-chrome" {
}

export type ARIARole =
  | "region"
  | "switch"
  | "button"
  | "progressbar"
  | "slider";

export type A11YDescriptionSimple = {
  role: ARIARole;
  "aria-label": string;
};

// export type A11YDescriptionSimple = {
//   role: "switch" | "button" | "region";
//   "aria-label": string;
// };

export type A11YDescriptionValued = {
  role: "progressbar" | "slider";
  "aria-valuetext": string;
};

export type A11YDescription = A11YDescriptionValued | A11YDescriptionSimple;

export type MediaChromeListItem = {
  name: string;
  description: string;
  component: GenericForwardRef;
  a11y?: A11YDescription;
};

type MetaData = {
  env_key?: string;
  video_title?: string;
}

type PlayerId = string | HTMLMediaElement;

export function monitor(id: PlayerId, options?: Options): void;

declare module 'mux-embed' {
  export type { Metadata }

  export { monitor }
}
