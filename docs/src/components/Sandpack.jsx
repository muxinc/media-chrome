/** @jsxImportSource react */
import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
import mediaChromeRaw from "../../node_modules/media-chrome/dist/iife/index.js?raw";

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
      theme={{
        ...githubLight,
        font: {
          ...githubLight.font,
          mono: 'var(--font-mono)',
        }
      }}
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
