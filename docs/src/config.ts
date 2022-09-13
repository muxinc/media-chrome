export const SITE = {
  title: 'Media Chrome Docs',
  description: 'Documentation for Media Chrome, a set of fully customizable media player controls using web components.',
  defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
  image: {
    src: 'https://www.media-chrome.org/favicon/android-icon-48x48.png',
    alt: 'closing html tag on a pink background',
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
  indexName: 'dev_media_chrome',
  appId: '57LJZR6XKN',
  apiKey: 'ec6de967b91bcd3b0ea96b5fcfedaa7d',
};

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    Basics: [
      { text: 'Get Started', link: 'en/get-started' },
      { text: 'Styling', link: 'en/styling' },
    ],
    'Core Concepts': [
      { text: 'Media Controller', link: 'en/media-controller' },
      { text: 'Architecture', link: 'en/architecture-diagrams' },
    ],
    Guides: [{ text: 'React Usage', link: 'en/react' }],
    Components: [
      { text: 'Play Button', link: 'en/media-play-button' },
      { text: 'Seek Backward Button', link: 'en/media-seek-backward-button' },
      { text: 'Seek Forward Button', link: 'en/media-seek-forward-button' },
      { text: 'Time Display', link: 'en/media-time-display' },
      { text: 'Volume Range', link: 'en/media-volume-range' },
      { text: 'Mute Button', link: 'en/media-mute-button' },
      { text: 'Time Range', link: 'en/media-time-range' },
      { text: 'Captions Button', link: 'en/media-captions-button' },
      { text: 'PiP Button', link: 'en/media-pip-button' },
      { text: 'Airplay Button', link: 'en/media-airplay-button' },
      { text: 'Fullscreen Button', link: 'en/media-fullscreen-button' },
      { text: 'Playback Rate Button', link: 'en/media-playback-rate-button' },
      { text: 'Loading Indicator', link: 'en/media-loading-indicator' },
      { text: 'Poster Image', link: 'en/media-poster-image' },
    ],
  },
};
