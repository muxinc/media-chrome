/** @jsxImportSource react */
import { Sandpack } from "@codesandbox/sandpack-react";

export default function ComponentSandpack({
  html,
  height = 230,
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
        {...props}
      />
    </div>
  )
}
