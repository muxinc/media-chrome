#!/usr/bin/env bash

# npm publish with goodies
# inspired by https://gist.github.com/stevemao/280ef22ee861323993a0
#
# prerequisites:
# `npm install -D conventional-recommended-bump \
#   conventional-changelog-cli conventional-github-releaser`
# `release` with optional argument `patch`/`minor`/`major`/`<version>`
# defaults to conventional-recommended-bump

# `np` is not suitable for CI/CD
# https://github.com/sindresorhus/np/issues/619#issuecomment-994493179

release() {
  BUMP=$(conventional-recommended-bump -p angular)
  VERSION=$(npm --no-git-tag-version version ${1:-$BUMP})
  conventional-changelog -p angular -i CHANGELOG.md -s
  git add CHANGELOG.md
  git commit -m "docs(CHANGELOG): $VERSION"
  npm --force --allow-same-version version $VERSION -m "chore(release): %s"
  git push --follow-tags
  conventional-github-releaser -p angular
  npm publish
};

canary() {
  # get last published version from NPM without alpha / beta, remove -SHA hash
  LAST_VERSION=$(npm view media-chrome versions --json |
    jq -r '. - map(select(contains("alpha") or contains("beta"))) | last' |
    sed -r 's/-[a-z0-9]{7}$//g')
  PRE_VERSION=$(semver $LAST_VERSION -i prerelease --preid canary)
  VERSION=$PRE_VERSION-$(git rev-parse --short HEAD)
  npm --no-git-tag-version version $VERSION
  npm publish --tag canary
}
