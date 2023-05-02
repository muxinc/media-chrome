/** @jsxImportSource react */
import { Sandpack } from "@codesandbox/sandpack-react";

export default function ComponentSandpack({ html }) {

  return (
    <div style={{ marginTop: '1rem' }}>
      <Sandpack
        template="vanilla"
        theme="auto"
        options={{
          editorHeight: 200,
          editorWidthPercentage: 60,
        }}
        customSetup={{
          dependencies: {
            'media-chrome': 'latest',
          },
        }}
        files={{
          "/index.html": {
            active: true,
            code: `${html}`
          },
          '/index.js': {
            code: `import './styles.css'; import 'media-chrome'`,
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
          }
        }}
      />
    </div>
  )
}
