# ReSchuhe Development Workflow

Status: Confirmed progressive delivery workflow | Last reviewed: 2026-08-07

## Branch model

- `main` contains the exact production-ready history for the Public Release Slice and later releases;
  it is not the default working branch.
- `develop` integrates reviewed release and isolated expansion work.
- `codex/<short-scope>` branches start from `develop` for isolated changes that benefit from review or parallel development.

Do not force-push shared branches, rewrite published history, or delete remote branches without explicit project-owner approval.

## Parallel delivery tracks

- **Release track:** fixes, hardening, and complete behavior intended for the next public release.
- **Expansion track:** confirmed later capabilities developed on `codex/<short-scope>` branches and
  isolated previews.
- Expansion work must not make the public slice depend on unreleased routes, data, services, assets,
  or controls.
- Do not create a second temporary application, competing design system, or disposable public site.
- Promote only complete vertical slices to `main`; labels such as experimental or beta do not lower
  the release gate.
- Keep the live slice independently buildable, testable, deployable, supportable, and reversible.

## Change flow

1. Confirm the active roadmap stage and the task boundary.
2. Read `CONTEXT.md`, the relevant domain documents, and applicable ADRs.
3. Inspect the current working tree and preserve unrelated changes.
4. Implement the smallest complete change consistent with confirmed decisions.
5. Update documentation and tests affected by the change.
6. Run the relevant validation from a cleanly understood state.
7. Review the diff for accidental files, secrets, generated noise, and scope expansion.
8. Commit with a descriptive Conventional Commit message.
9. Push only to the intended non-protected branch and report the result.

## Commit language

Use concise English Conventional Commit subjects:

- `feat:` user-visible capability
- `fix:` defect correction
- `docs:` documentation-only change
- `test:` test-only change
- `refactor:` behavior-preserving code change
- `chore:` tooling, dependency, or repository maintenance

One commit should express one coherent outcome. Do not combine unrelated cleanup with requested work.

## Validation matrix

| Change                      | Required validation when available                                         |
| --------------------------- | -------------------------------------------------------------------------- |
| Documentation               | Internal-link check and `git diff --check`                                 |
| TypeScript or configuration | Lint, typecheck, and targeted tests                                        |
| Component or styling        | Lint, typecheck, Storybook, responsive states, and accessibility checks    |
| Creative asset handoff      | Manifest/package validation, targeted tests, visual review, and diff       |
| User journey                | Targeted Playwright scenarios plus relevant component checks               |
| Public Release Slice        | Full journey, preview, a11y, performance, security/privacy/legal, rollback |
| Dependency                  | Lockfile review, compatibility check, audit/reputation review, and build   |
| Release-impacting           | Full relevant test suite and production build                              |

If a script does not exist yet, state that clearly; do not simulate a pass.

## Core commands

- `pnpm check` runs formatting verification, ESLint, TypeScript, and unit tests.
- `pnpm storybook:build` verifies that the component environment builds statically.
- `pnpm test:e2e` runs desktop and mobile Chromium scenarios, response-header checks, and axe.
- `pnpm build` creates the optimized Next.js production build.
- `pnpm assets:validate -- "<handoff-package>"` verifies a sanitized Creative Studio package without
  changing the repository.
- `pnpm assets:import -- "<handoff-package>"` revalidates and atomically imports an immutable version.

Run commands with the Node and pnpm versions pinned in the repository. Browser tests require the
managed Chromium installed with `pnpm exec playwright install chromium`.

## Documentation update map

- New or changed product behavior: `docs/product/PRODUCT.md` and relevant UX/content docs.
- Durable architecture change: `docs/architecture/ARCHITECTURE.md` plus a new ADR.
- New canonical term: root `CONTEXT.md`.
- Visual-system change: design documents and Storybook when present.
- Creative asset or workflow change: `docs/creative/`, the public asset manifest, and the consuming
  component or story.
- New external data/service behavior: architecture, security, product, and legal readiness documents.
- Roadmap change: `docs/engineering/ROADMAP.md` with explicit owner approval.

## Definition of done

- The requested outcome is complete and stays within scope.
- Confirmed requirements are satisfied without inventing open decisions.
- Applicable checks actually pass.
- Documentation, examples, and tests match the behavior.
- No secrets, private data, temporary files, or accidental generated assets are included.
- The branch and remote state are known.
- Remaining risks, limitations, and open decisions are reported.
- A public change has an owner, verified preview, release approval, monitoring path, and rollback.
