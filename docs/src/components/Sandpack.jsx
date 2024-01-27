/** @jsxImportSource react */
import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
import mediaChromeRaw from "../../node_modules/media-chrome/dist/iife/index.js?raw";
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
    definition: '#22863a'
  },
  font: {
    ...githubLight.font,
    mono: 'var(--font-mono)',
  }
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
  editorHeight,
  editorWidthPercentage = 50,
  showLineNumbers = false,
  showNavigator = false,
  showTabs = false,
  externalResources = [],
  files = {},
  dependencies = {},
  active = Active.HTML,
  ...props
}) {

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
  }, [theme]);

  const importPaths = [
    '@internals/media-chrome',
    './styles.css',
    ...Object.keys(dependencies),
    ...Object.keys(files).reduce((importPaths, fileAbsPath) => {
      const disableImport = files[fileAbsPath].disableImport === true;
      // Only automatically import .css or .js files for now
      if (!disableImport && (fileAbsPath.endsWith('.css') || fileAbsPath.endsWith('.js'))) {
        importPaths.push(`./${fileAbsPath}`);
      }
      return importPaths;
    }, css ? ['./custom-styles.css'] : [])
  ];

  return (
    <Sandpack
      template="vanilla"
      theme={theme}
      options={{
        // recompileMode: "delayed",
        // recompileDelay: 500,
        // autorun: true,
        // autoReload: true,
        editorHeight,
        showLineNumbers,
        showNavigator,
        showTabs,
        editorWidthPercentage,
        externalResources,
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
          hidden: true,
          code: importPaths.map(path => `import '${path}';`).join('\n'),
        },
        '/styles.css': {
          code: `
body {
  margin: 0;
}

media-controller:not([audio]),
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
