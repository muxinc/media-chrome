/** @jsxImportSource react */
import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
import mediaChromeRaw from "../../node_modules/media-chrome/dist/iife/index.js?raw";
import { useState, useEffect } from 'react';

const light = {
  ...githubLight,
  syntax: {
    ...githubLight.syntax,
    definition: '#22863a'
  },
  font: {
    ...githubLight.font,
    mono: 'var(--font-mono)',
  }
};

const dark = {
  ...sandpackDark,
  font: {
    ...sandpackDark.font,
    mono: 'var(--font-mono)',
  }
};


export const Active = {
  HTML: 'html',
  CSS: 'css',
};

export default function ComponentSandpack({
  html,
  css,
  hiddenCss = '',
  height = 230,
  files = {},
  dependencies = {},
  active = Active.HTML,
  ...props
}) {

  const [theme, setTheme] = useState(light);
  // const [theme, setTheme] = useState(() => {
  //   if (import.meta.env.SSR) {
  //     return themes.githubLight;
  //   }
  //   if (typeof localStorage !== undefined && localStorage.getItem('theme')) {
  //     if (localStorage.getItem('theme') === 'dark') {
  //       return themes.sandpackDark;
  //     }
  //     return themes.githubLight;
  //   }
  //   if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  //     return themes.sandpackDark;
  //   }
  //   return themes.githubLight;
  // });

  // watch for the theme updating on a live page
  useEffect(() => {
    const darkModeObserver = new MutationObserver((mutationList) => {
      mutationList.forEach((mutationRecord) => {
        const {
          type,
          target,
          attributeName,
        } = mutationRecord;
        if (
          type === 'attributes' &&
          attributeName === 'class'
        ) {
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
  }, [theme])

  const importPaths = [
    '@internals/media-chrome',
    './styles.css',
    ...Object.keys(dependencies),
    ...Object.keys(files).reduce((importPaths, fileAbsPath) => {
      // Only automatically import .css or .js files for now
      if (fileAbsPath.endsWith('.css') | fileAbsPath.endsWith('.js')) {
        importPaths.push(`.${fileAbsPath}`);
      }
      return importPaths;
    }, css ? ['./custom-styles.css'] : [])
  ];

  return (
    <Sandpack
      template="vanilla"
      theme={theme}
      options={{
        editorHeight: 'auto',
        editorWidthPercentage: 50,
      }}
      customSetup={{
        dependencies: {
          ...dependencies
        },
        devDependencies: {
          "@babel/core": "7.2.0"
        },
      }}
      files={{
        "/node_modules/@internals/media-chrome/package.json": {
          hidden: true,
          code: JSON.stringify({
            name: "@media-chrome",
            main: "./index.js",
          }),
        },
        "/node_modules/@internals/media-chrome/index.js": {
          hidden: true,
          code: mediaChromeRaw,
        },
        "/index.html": {
          active: active === Active.HTML,
          code: `${html}`
        },
        '/index.js': {
          code: importPaths.map(path => `import '${path}';`).join(' '),
          hidden: true,
        },
        '/styles.css': {
          code: `media-controller,
video {
width: 100%;
aspect-ratio: 2.4;
}
${hiddenCss}`,
          hidden: true,
        },
        ...(css ? {'/custom-styles.css': {
          active: active === Active.CSS,
          code: `${css}`
        }} : {}),
        ...files
      }}
      {...props}
    />
  )
}
