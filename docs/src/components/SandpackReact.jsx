/** @jsxImportSource react */
import Sandpack from "./SandpackBase";

export default function ComponentSandpack({
  react,
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
  isCSSActive = false,
  ...props
}) {
  const isReactActive = !isCSSActive && !Object.values(files).some(file => file.active);

  return (
    <Sandpack
      template="vite-react-ts"
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
          'media-chrome': 'latest',
          ...dependencies
        }
      }}
      files={{
        "App.tsx": {
          active: isReactActive,
          code: `${react}`
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
          active: isCSSActive,
          code: `${css}`
        }} : {}),
        ...files
      }}
      {...props}
    />
  )
}
