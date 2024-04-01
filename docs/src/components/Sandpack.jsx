/** @jsxImportSource react */
import Sandpack from "./SandpackBase";
// import { Sandpack } from "@codesandbox/sandpack-react";
import mediaChromeRaw from "../../node_modules/media-chrome/dist/iife/index.js?raw";

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
        "sandbox.config.json": {
          hidden: true,
          // Required for the changes to take effect on the live page.
          code: `{
  "hardReloadOnChange": true
}`
        },
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
