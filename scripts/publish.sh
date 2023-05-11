#!/usr/bin/env bash

# npm publish with goodies
# inspired by https://gist.github.com/stevemao/280ef22ee861323993a0
#
# release with optional argument `patch`/`minor`/`major`/`canary`/`<version>`
# defaults to conventional-recommended-bump

dry_run=false
canary_run=false
tag=latest
release_type=

function main {
  processCommandLineArgs "$@"
  if "$dry_run"; then
    echo
    echo "Running publish on media-chrome in dry-run move. This will run things locally but never push to the remote"
    echo
  fi

  if "$canary_run"; then
    canary "$@"
  else
    release "$@"
  fi
}

function processCommandLineArgs {
  for arg in "$@"
  do
    case $arg in
      canary)
        canary_run=true
        ;;
      --help|help)
        echo "Commands:"
        echo "  $0              Publish a release from conventional commits."
        echo "  $0 canary       Publish a canary."
        echo "  $0 patch        Publish a patch release."
        echo "  $0 minor        Publish a minor release."
        echo "  $0 major        Publish a major release."
        echo "  $0 <version>    Publish a release with a specific version."
        echo
        echo "  $0 --tag|t      In non-canary mode, publish to this npm tag. Default is latest."
        echo "  $0 --dry-run|n  Run the release as a dry-run."
        exit 0
        ;;
      --dry-run|n)
        dry_run=true
        ;;
      patch|minor|major)
        release_type=$arg
        ;;
      --tag|t)
        tag=$arg
        ;;
      *)
        ;;
    esac
  done
}

function release {
  BUMP=$(npx -p conventional-changelog-angular -p conventional-recommended-bump -c 'conventional-recommended-bump -p angular')
  VERSION=$(npm --no-git-tag-version version "${release_type:-$BUMP}")

  if "$dry_run"; then
    echo
    echo "In non-dry-mode, we would do a release to version $VERSION."
    if [ -z "$release_type" ]; then
      echo "Conventional release was used to do *$BUMP* update"
    else
      echo "A release type of *$release_type* was provided and used"
    fi
    echo "The version in package.json may have changed. Please revert it manually."
    echo
  else
    npx conventional-changelog-cli -p angular -i CHANGELOG.md -s
    git add CHANGELOG.md
    git commit -m "docs(CHANGELOG): $VERSION"
    npm --force --allow-same-version version "$VERSION" -m "chore(release): %s"
    git push --follow-tags
    npx --package @gkatsev/conventional-github-releaser conventional-github-releaser -p angular -d Releases
    npm publish --tag "$tag"
  fi
};

function canary {
  # get last published version from NPM without alpha / beta, remove -SHA hash
  LAST_VERSION=$(npm view "$(npm pkg get name | sed 's/"//g')" versions --json |
    jq -r '. - map(select(contains("alpha") or contains("beta"))) | last' |
    sed -r 's/-[a-z0-9]{7}$//g')
  PRE_VERSION=$(npx semver "$LAST_VERSION" -i prerelease --preid canary)
  VERSION=$PRE_VERSION-$(git rev-parse --short HEAD)

  if "$dry_run"; then
    echo
    echo "In non-dry-mode, we would do a canary release to version $VERSION."
    echo "The previous version was $LAST_VERSION."
    echo "The next version to use is $PRE_VERSION."
    echo
  else
    npm --no-git-tag-version version "$VERSION"
    npm publish --tag canary
  fi

}

main "$@"
