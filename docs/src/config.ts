export const SITE = {
  title: 'Media Chrome Docs',
  description: 'Documentation for Media Chrome, a set of fully customizable media player controls using web components.',
  defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
  image: {
    src: 'https://www.media-chrome.org/favicon/favicon-48x48.png',
    alt: 'html tag on a green background',
  },
  twitter: 'MuxHQ',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: 'ltr' | 'rtl';
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = {
  English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/muxinc/media-chrome/tree/main/docs`;

export const COMMUNITY_INVITE_URL = `https://github.com/muxinc/media-chrome/discussions`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'media-chrome',
  appId: 'NJ7A3MEPOW',
  apiKey: '6407505886c20678488d1379bff30b8f',
};

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    Basics: [
      { text: 'Get started', link: 'en/get-started' },
      { text: 'Styling', link: 'en/styling' },
    ],
    Guides: [
      { text: 'React usage', link: 'en/react' },
      { text: 'Prevent layout shift', link: 'en/prevent-layout-shift' },
      { text: 'Position controls', link: 'en/position-controls' },
      { text: 'Responsive controls', link: 'en/responsive-controls' },
      { text: 'Keyboard shortcuts', link: 'en/keyboard-shortcuts' },
      { text: 'Audio player', link: 'en/audio-player' },
    ],
    'Media Elements': [
      { text: 'Cloudflare Video', link: 'en/media-elements/cloudflare-video' },
      { text: 'DASH Video', link: 'en/media-elements/dash-video' },
      { text: 'HLS Video', link: 'en/media-elements/hls-video' },
      { text: 'JW Player Video', link: 'en/media-elements/jwplayer-video' },
      { text: 'Mux Video', link: 'en/media-elements/mux-video' },
      // { text: 'Shaka Video', link: 'en/media-elements/shaka-video' }, // remove until fixed
      { text: 'Spotify Audio', link: 'en/media-elements/spotify-audio' },
      { text: 'Video.js Video', link: 'en/media-elements/videojs-video' },
      { text: 'Vimeo Video', link: 'en/media-elements/vimeo-video' },
      { text: 'Wistia Video', link: 'en/media-elements/wistia-video' },
      { text: 'YouTube Video', link: 'en/media-elements/youtube-video' },
    ],
    Components: [
      { text: 'Airplay button', link: 'en/components/media-airplay-button' },
      { text: 'Captions button', link: 'en/components/media-captions-button' },
      { text: 'Cast button', link: 'en/components/media-cast-button' },
      { text: 'Control bar', link: 'en/components/media-control-bar' },
      { text: 'Duration display', link: 'en/components/media-duration-display' },
      { text: 'Fullscreen button', link: 'en/components/media-fullscreen-button' },
      { text: 'Live indicator / button', link: 'en/components/media-live-button' },
      { text: 'Loading indicator', link: 'en/components/media-loading-indicator' },
      { text: 'Media controller', link: 'en/components/media-controller' },
      { text: 'Mute button', link: 'en/components/media-mute-button' },
      { text: 'PiP button', link: 'en/components/media-pip-button' },
      { text: 'Play button', link: 'en/components/media-play-button' },
      { text: 'Playback rate button', link: 'en/components/media-playback-rate-button' },
      { text: 'Poster image', link: 'en/components/media-poster-image' },
      { text: 'Preview thumbnail', link: 'en/components/media-preview-thumbnail' },
      { text: 'Seek backward button', link: 'en/components/media-seek-backward-button' },
      { text: 'Seek forward button', link: 'en/components/media-seek-forward-button' },
      { text: 'Time display', link: 'en/components/media-time-display' },
      { text: 'Time range', link: 'en/components/media-time-range' },
      { text: 'Volume range', link: 'en/components/media-volume-range' },
    ],
    Themes: [
      { text: 'Introduction to themes', link: 'en/themes' },
      { text: 'Handling variables', link: 'en/themes/handling-variables' },
      { text: 'Responsive themes', link: 'en/themes/responsive-themes' },
      { text: 'Custom slots', link: 'en/themes/custom-slots' },
      { text: 'Share themes', link: 'en/themes/share' },

    ],
    Advanced: [
      { text: 'Stream Type', link: 'en/stream-type' },
      { text: 'Design Principles', link: 'en/design-principles' },
      { text: 'Architecture', link: 'en/architecture' },
    ],
    "Resources": [
      { text: 'Styling Reference', link: 'en/reference/styling' },
      { text: 'Migrating to 1.0', link: 'en/migration/from-0.x-to-1.0' },
      { text: 'Showcase', link: 'en/showcase' },
    ],
  },
};
