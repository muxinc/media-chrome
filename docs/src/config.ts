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
      { text: 'Keyboard shortcuts', link: 'en/keyboard-shortcuts' },
    ],
    'Core Concepts': [
      { text: 'Media controller', link: 'en/media-controller' },
      { text: 'Architecture', link: 'en/architecture-diagrams' },
    ],
    Components: [
      { text: 'Play button', link: 'en/media-play-button' },
      { text: 'Seek backward button', link: 'en/media-seek-backward-button' },
      { text: 'Seek forward button', link: 'en/media-seek-forward-button' },
      { text: 'Time display', link: 'en/media-time-display' },
      { text: 'Volume range', link: 'en/media-volume-range' },
      { text: 'Mute button', link: 'en/media-mute-button' },
      { text: 'Time range', link: 'en/media-time-range' },
      { text: 'Captions button', link: 'en/media-captions-button' },
      { text: 'PiP button', link: 'en/media-pip-button' },
      { text: 'Airplay button', link: 'en/media-airplay-button' },
      { text: 'Fullscreen button', link: 'en/media-fullscreen-button' },
      { text: 'Playback Rate button', link: 'en/media-playback-rate-button' },
      { text: 'Loading indicator', link: 'en/media-loading-indicator' },
      { text: 'Poster image', link: 'en/media-poster-image' },
    ],
  },
};
