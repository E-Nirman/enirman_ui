# Releasing `@enirman/ui`

This is the publish ritual for shipping a new version of `@enirman/ui` to
the public npm registry.

## Prerequisites

- You have publish access to the `@enirman` npm organization. (Check at
  https://www.npmjs.com/settings/enirman/members.)
- You're authenticated to npm — either via `npm login`, or via an
  `NPM_TOKEN` environment variable that's set in your shell. Never commit
  tokens.
- All consumer apps that depend on `@enirman/ui` have been tested against
  the new code in some way (locally via `yarn link`, or through a beta
  publish). A breaking change here breaks every app that runs `yarn
  upgrade`.

## The standard release

```bash
cd apps/enirman_ui

# 1. Make sure your working tree is clean and committed.
git status

# 2. Bump the version. Pick patch / minor / major per semver:
#    - patch: bug fixes, no API change         (1.0.0 → 1.0.1)
#    - minor: new components, no API change    (1.0.0 → 1.1.0)
#    - major: breaking changes to props/exports (1.0.0 → 2.0.0)
npm version patch    # creates the version commit + tag

# 3. (Recommended) Inspect what's about to ship before publishing.
npm pack --dry-run
# or
npm pack && tar -tzf enirman-ui-*.tgz | head -50

# 4. Publish. Scoped packages default to private; --access public is
#    required for the public registry. publishConfig in package.json
#    sets this automatically, but you can pass it explicitly to be sure.
npm publish --access public

# 5. Push the version commit + tag.
git push origin HEAD --follow-tags

# 6. In each consumer app, bump the dep range and reinstall:
cd ../<consumer-app>/frontend
# Edit package.json: "@enirman/ui": "^1.0.1"
yarn install
yarn build
```

## Pre-publish checklist

Before running `npm publish`:

- [ ] `npm pack --dry-run` shows the tarball contains exactly what you
      expect — `src/`, `tailwind-preset.js`, `docs/`, `LICENSE`,
      `README.md`, `package.json`. No `node_modules/`, no `yarn.lock`,
      no internal scratch files.
- [ ] `peerDependencies` are accurate — anything imported by a component
      and not in `dependencies` should be there.
- [ ] Component additions/changes are reflected in `docs/COMPONENTS.md`.
- [ ] Token additions/changes are reflected in `docs/DESIGN_TOKENS.md`.
- [ ] If breaking changes: `CHANGELOG.md` (or git tag message) records
      what changed and how to migrate. Major bump.

## After publishing

- Visit `https://www.npmjs.com/package/@enirman/ui` and verify the new
  version appears.
- In a fresh directory (not the source repo), test:
  ```bash
  mkdir /tmp/test-enirman-ui && cd /tmp/test-enirman-ui
  npm init -y
  npm install @enirman/ui
  ls node_modules/@enirman/ui
  ```
  Verify the tarball contents match expectations.
- npm gives a 72-hour window to `npm unpublish` if you ship something
  broken. After that, the version is permanent — you'll have to publish
  a patch.

## Troubleshooting

- **`npm publish` fails with `403 Forbidden`** — you don't have publish
  access to the `@enirman` org, or your token has expired. Re-auth.
- **`npm publish` fails with `EPUBLISHCONFLICT`** — that version already
  exists. `npm version patch` again to bump.
- **Consumer apps don't pick up the change** — they may have the old
  version cached. `rm -rf node_modules yarn.lock && yarn install`.

## Versioning convention

We follow standard semver:

- **Major** — anything that changes a public API (component props,
  exported names, slot names, CSS variable names that consumers
  reference, peer-dep ranges that drop support for previously-supported
  versions). Migrate consumers explicitly.
- **Minor** — new components, new variants, new tokens, broader peer-dep
  ranges. Backward-compatible.
- **Patch** — bug fixes, internal refactors with no API impact.

When in doubt, bump higher. Cheap to bump, expensive to ship a
backwards-incompatible change as a patch.
