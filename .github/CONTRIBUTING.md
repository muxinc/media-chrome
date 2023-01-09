# Contributing to `<media-chrome>`

- [Questions](#questions)
- [Bugs and Issues](#issues)
- [Documentation Updates](#documentation)
- [Feature Requests](#features)
- [Submitting a Pull Request](#pull-requests)
- [Releasing](#releasing)

## <a name="questions">Questions</a>

Have a question? Want to start a discussion? For now, you can simply [Open a New Discussion](https://github.com/muxinc/media-chrome/discussions/new), and choose a fitting category and title.

## <a name="issues">Bugs and Issues</a>

If you think you've found a bug, make sure you review and fill out a [Bug Report](https://github.com/muxinc/media-chrome/issues/new/choose) before starting any work. This will ensure for both yourself and the maintainers that the issue in question can be properly confirmed, reproduced, smoke tested, etc. Once done, go ahead and follow our [Submitting a Pull Request](#pull-requests) guide.

## <a name="documentation">Documentation Updates</a>

Our documentation update request requirements are similar to the requirements for [Bugs and Issues](#issues).

## <a name="features">Feature Requests</a>

For feature requests, you can start by reviewing and filling out a [Feature Request](https://github.com/muxinc/media-chrome/discussions/new). Unlike bug fixes, Feature Requests will likely require more discussion from the maintainers, including whether or not it is consistent with our overall architectural goals, our timeline and priorities, and the like. Once done, assuming you've gotten a 👍 to work on the feature, go ahead and follow our [Submitting a Pull Request](#pull-requests) guide.

## <a name="pull-requests">Submitting a Pull Request</a>

Before submitting a pull request, make sure you've reviewed and filled out an appropriate [Issue](https://github.com/muxinc/media-chrome/issues/new/choose). We recommend doing this before starting any work, just in case an issue already exists, or it's unlikely the maintainers will be able to review the PR because it e.g. lacks sufficient reproduction steps. In addition, we recommend the following:

1. We use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), please try to prefix your commits according to the type of changes you're making, and try to be as descriptive as possible in your commit messages. For example:

- For Bug Fixes: `fix: foo by bar`
- For Features: `feat: add video feat`
- For Documentation Updates: `docs: update audio copy`

2. Make sure you base your branch off of the latest in `main`, e.g.

   ```shell
   git checkout -b my-fix-for-foo main
   ```

3. When issuing your Pull Request, be sure to [Link it to the corresponding issue(s)](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)

4. Add any additional comments to your PR's description that will help the reviewer(s), such as call outs, open questions, areas that merit extra attention, etc.

5. When addressing any feedback, you can simply add it as new commits.

6. We use a [rebase strategy](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-rebasing-for-pull-requests) when merging PR branches into `main`. If your branch has merge conflicts, if possible, please try to resolve them by doing a [`git rebase`](https://git-scm.com/docs/git-rebase) onto `main` and then doing a `git push --force-with-lease`. For example:

   ```shell
   git fetch upstream
   git rebase --onto main your-old-base my-fix-for-foo
   ... resolve any conflicts
   git push --force-with-lease
   ```

   (See the [git docs](https://git-scm.com/docs/git-rebase) for more details on `git rebase --onto`)

## <a name="releasing">Releasing (maintainers only)</a>

This repo uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
and Github Actions for continuous deployment (CD).

1. Go to the [Github Actions tab](https://github.com/muxinc/media-chrome/actions), 
select the "CD" action in the left sidebar.
1. Click the "Run workflow" dropdown and choose the correct "Version" on the `main` branch.  
If you wrote the commit messages with correct conventional commit style select `conventional`.  
If not, choose the correct semver version `patch`, `minor`, `major`.  
After click the "Run workflow" button to start the release.
1. After a few minutes a new release will be made and the most important things will have been
published. The NPM package, the version tags and the Github release. The only thing left is
merging the release commits to the `main` branch.
1. Check the [Releases](https://github.com/muxinc/media-chrome/releases) page and in the left sidebar click the link of the newly created version tag.
1. Now open the "Switch branches/tags" dropdown and create a new branch 
by entering a new branch name and pressing return.
1. Next create a new [Pull Request](#pull-requests) from the branch, get approval and merge the PR.
That's it!
