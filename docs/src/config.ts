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
  appId: 'KSP5FHVYEU',
  // This is a search-only API key, which is safe to include in the client-side JS.
  // https://docsearch.algolia.com/docs/docsearch-program/#can-i-share-the-apikey-in-my-repo
  apiKey: '91b5b9d7a305dad0a66b1140a3256aa2',
};

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    Basics: [
      { text: 'Get started', link: 'docs/en/get-started' },
      { text: 'Styling', link: 'docs/en/styling' },
    ],
    Guides: [
      { text: 'Media controller', link: 'docs/en/components/media-controller' },
      { text: 'Media element', link: 'docs/en/media-element' },
      { text: 'Prevent layout shift', link: 'docs/en/prevent-layout-shift' },
      { text: 'Position controls', link: 'docs/en/position-controls' },
      { text: 'Responsive controls', link: 'docs/en/responsive-controls' },
      { text: 'Keyboard shortcuts', link: 'docs/en/keyboard-shortcuts' },
      { text: 'Audio player', link: 'docs/en/audio-player' },
    ],
    'Media Elements': [
      { text: 'Cloudflare Video', link: 'docs/en/media-elements/cloudflare-video' },
      { text: 'DASH Video', link: 'docs/en/media-elements/dash-video' },
      { text: 'HLS Video', link: 'docs/en/media-elements/hls-video' },
      { text: 'JW Player Video', link: 'docs/en/media-elements/jwplayer-video' },
      { text: 'Mux Video', link: 'docs/en/media-elements/mux-video' },
      { text: 'Shaka Video', link: 'docs/en/media-elements/shaka-video' },
      { text: 'Spotify Audio', link: 'docs/en/media-elements/spotify-audio' },
      { text: 'Video.js Video', link: 'docs/en/media-elements/videojs-video' },
      { text: 'Vimeo Video', link: 'docs/en/media-elements/vimeo-video' },
      { text: 'Wistia Video', link: 'docs/en/media-elements/wistia-video' },
      { text: 'YouTube Video', link: 'docs/en/media-elements/youtube-video' },
    ],
    Components: [
      { text: 'Airplay button', link: 'docs/en/components/media-airplay-button' },
      { text: 'Audio track menu', link: 'docs/en/components/media-audio-track-menu' },
      { text: 'Captions button', link: 'docs/en/components/media-captions-button' },
      { text: 'Captions menu', link: 'docs/en/components/media-captions-menu' },
      { text: 'Cast button', link: 'docs/en/components/media-cast-button' },
      { text: 'Control bar', link: 'docs/en/components/media-control-bar' },
      { text: 'Duration display', link: 'docs/en/components/media-duration-display' },
      { text: 'Fullscreen button', link: 'docs/en/components/media-fullscreen-button' },
      { text: 'Live indicator / button', link: 'docs/en/components/media-live-button' },
      { text: 'Loading indicator', link: 'docs/en/components/media-loading-indicator' },
      { text: 'Media controller', link: 'docs/en/components/media-controller' },
      { text: 'Mute button', link: 'docs/en/components/media-mute-button' },
      { text: 'PiP button', link: 'docs/en/components/media-pip-button' },
      { text: 'Play button', link: 'docs/en/components/media-play-button' },
      { text: 'Playback rate button', link: 'docs/en/components/media-playback-rate-button' },
      { text: 'Playback rate menu', link: 'docs/en/components/media-playback-rate-menu' },
      { text: 'Poster image', link: 'docs/en/components/media-poster-image' },
      { text: 'Preview thumbnail', link: 'docs/en/components/media-preview-thumbnail' },
      { text: 'Rendition menu', link: 'docs/en/components/media-rendition-menu' },
      { text: 'Seek backward button', link: 'docs/en/components/media-seek-backward-button' },
      { text: 'Seek forward button', link: 'docs/en/components/media-seek-forward-button' },
      { text: 'Settings menu', link: 'docs/en/components/media-settings-menu' },
      { text: 'Time display', link: 'docs/en/components/media-time-display' },
      { text: 'Time range', link: 'docs/en/components/media-time-range' },
      { text: 'Volume range', link: 'docs/en/components/media-volume-range' },
    ],
    Themes: [
      { text: 'Introduction to themes', link: 'docs/en/themes' },
      { text: 'Handling variables', link: 'docs/en/themes/handling-variables' },
      { text: 'Responsive themes', link: 'docs/en/themes/responsive-themes' },
      { text: 'Custom slots', link: 'docs/en/themes/custom-slots' },
      { text: 'Share themes', link: 'docs/en/themes/share' },

    ],
    Advanced: [
      { text: 'Stream Type', link: 'docs/en/stream-type' },
      { text: 'Design Principles', link: 'docs/en/design-principles' },
      { text: 'Architecture', link: 'docs/en/architecture' },
    ],
    React: [
      { text: 'Get started', link: 'docs/en/react/get-started' },
      { text: 'MediaStore hooks', link: 'docs/en/react/hooks' },
    ],
    Internationalization: [
      { text: 'Adding Language Support', link: 'docs/en/internationalization/adding-language-support' },
    ],
    Resources: [
      { text: 'Styling Reference', link: 'docs/en/reference/styling' },
      { text: 'Migrating to 1.0', link: 'docs/en/migration/from-0.x-to-1.0' },
      { text: 'Migrating to 2.0', link: 'docs/en/migration/from-1.x-to-2.0' },
      { text: 'Migrating to 3.0', link: 'docs/en/migration/from-2.x-to-3.0' },
      { text: 'Migrating to 4.0', link: 'docs/en/migration/from-3.x-to-4.0' },
      { text: 'Showcase', link: 'docs/en/showcase' },
    ],
  },
};
