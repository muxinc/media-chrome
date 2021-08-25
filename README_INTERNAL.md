# Releasing

1. Bump version in the `package.json`
1. Squash and merge changes into `main`
1. Tag `@mux-elements/{package-name}@{version}` -- for example: `git tag @mux-elements/mux-video@0.1.1 && git push origin --tags`
1. From the package directory (For example: `packages/mux-video` run `yarn build && npm publish`

