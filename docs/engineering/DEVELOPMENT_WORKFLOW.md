# ReSchuhe Development Workflow

Status: Confirmed foundation workflow | Last reviewed: 2026-08-07

## Branch model

- `main` contains production-ready history and is not the default working branch.
- `develop` integrates foundation and reviewed product work.
- `codex/<short-scope>` branches start from `develop` for isolated changes that benefit from review or parallel development.

Do not force-push shared branches, rewrite published history, or delete remote branches without explicit project-owner approval.

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

| Change | Required validation when available |
| --- | --- |
| Documentation | Internal-link check and `git diff --check` |
| TypeScript or configuration | Lint, typecheck, and targeted tests |
| Component or styling | Lint, typecheck, Storybook, responsive states, and accessibility checks |
| User journey | Targeted Playwright scenarios plus relevant component checks |
| Dependency | Lockfile review, compatibility check, audit/reputation review, and build |
| Release-impacting | Full relevant test suite and production build |

If a script does not exist yet, state that clearly; do not simulate a pass.

## Documentation update map

- New or changed product behavior: `docs/product/PRODUCT.md` and relevant UX/content docs.
- Durable architecture change: `docs/architecture/ARCHITECTURE.md` plus a new ADR.
- New canonical term: root `CONTEXT.md`.
- Visual-system change: design documents and Storybook when present.
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
