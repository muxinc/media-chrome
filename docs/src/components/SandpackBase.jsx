/** @jsxImportSource react */
import { Sandpack } from '@codesandbox/sandpack-react';
import { githubLight, sandpackDark } from '@codesandbox/sandpack-themes';
import { useState, useEffect } from 'react';

const light = {
  ...githubLight,
  colors: {
    ...githubLight.colors,
    accent: 'var(--theme-text)',
    surface1: 'var(--theme-code-bg)',
  },
  syntax: {
    ...githubLight.syntax,
    definition: '#22863a',
  },
  font: {
    ...githubLight.font,
    mono: 'var(--font-mono)',
  },
};

// Make more like GitHub dark to complement the Markdown code blocks.
const dark = {
  ...sandpackDark,
  colors: {
    ...sandpackDark.colors,
    accent: 'var(--theme-text)',
    surface1: 'var(--theme-code-bg)',
  },
  syntax: {
    ...sandpackDark.syntax,
    definition: '#7EE787',
    property: '#79C0FF',
    plain: '#79C0FF',
    static: '#79C0FF',
    string: '#A5D6FF',
    keyword: '#FF7B72',
  },
  font: {
    ...sandpackDark.font,
    mono: 'var(--font-mono)',
  },
};

export default function ComponentSandpack({ ...props }) {
  const [theme, setTheme] = useState(light);

  useEffect(() => {
    if (typeof localStorage !== undefined && localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') === 'dark') {
        setTheme(dark);
        return;
      }
      setTheme(light);
      return;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(dark);
      return;
    }
    setTheme(light);
  }, []);

  // watch for the theme updating on a live page
  useEffect(() => {
    const darkModeObserver = new MutationObserver((mutationList) => {
      mutationList.forEach((mutationRecord) => {
        const { type, target, attributeName } = mutationRecord;
        if (type === 'attributes' && attributeName === 'class') {
          if (target.classList.contains('theme-dark')) {
            setTheme(dark);
          } else {
            setTheme(light);
          }
        }
      });
    });
    darkModeObserver.observe(document.documentElement, {
      childList: false,
      attributes: true,
      subtree: false,
    });
  }, [theme]);

  return <Sandpack theme={theme} {...props} />;
}
