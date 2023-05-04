/** @jsxImportSource react */
import { Sandpack } from "@codesandbox/sandpack-react";

export const Active = {
  HTML: 'html',
  CSS: 'css',
};

export default function ComponentSandpack({
  html,
  css,
  height = 230,
  files = {},
  active = Active.HTML,
  ...props
}) {
  return (
    <div style={{ marginTop: '1rem', height }}>
      <Sandpack
        template="vanilla"
        theme="auto"
        options={{
          editorHeight: height,
          editorWidthPercentage: 50,
        }}
        customSetup={{
          dependencies: {
            'media-chrome': 'canary',
          },
        }}
        files={{
          "/index.html": {
            active: active === Active.HTML,
            code: `${html}`
          },
          '/index.js': {
            code: `import './styles.css'; import 'media-chrome';${css ? "import './custom-styles.css';" : ""}`,
            hidden: true,
          },
          '/styles.css': {
            code: `
media-controller,
video {
  width: 100%;
  aspect-ratio: 2.4;
}
      `,
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
    </div>
  )
}
