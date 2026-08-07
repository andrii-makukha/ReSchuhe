# ReSchuhe Agent Instructions

## Mission

Build ReSchuhe incrementally without changing the approved platform or inventing unresolved product, brand, legal, or business decisions.
Deliver the approved Public Release Slice early, protect it as production, and grow the same Product
Experience through controlled expansion releases.

## Read before working

1. Read `CONTEXT.md` for canonical terms.
2. Read `docs/README.md` and the documents relevant to the task.
3. Read accepted records in `docs/adr/` before proposing architectural changes.
4. Check `docs/engineering/ROADMAP.md` and stay within the active stage unless the project owner explicitly expands scope.

## Non-negotiable platform

- Cursor is the primary IDE.
- Codex is the primary engineering agent.
- Google Stitch through MCP is the UI concept source.
- Playwright through MCP and the Playwright test suite provide browser validation.
- GitHub is the source-control and collaboration platform.
- The web stack is Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Storybook, and Motion or GSAP according to the documented need.
- Creative source production stays outside this repository in the separate Creative Studio.

Do not replace, duplicate, or substantially expand this platform without explicit project-owner approval and a new ADR that supersedes the affected decision.

## Decision discipline

- Treat confirmed facts, open decisions, and deferred work as different states.
- Do not convert assumptions into requirements.
- If essential product information is missing, record the decision needed and continue only where that choice does not affect the result.
- Keep `CONTEXT.md` limited to canonical project terminology; put behavior and implementation details in domain documents.
- Update the relevant document and ADR in the same change whenever a durable decision changes.
- If code and documentation disagree, surface the conflict and resolve it deliberately; do not silently choose one.

## Repository workflow

- `main` represents the exact production-ready history for the Public Release Slice and later
  releases.
- `develop` integrates reviewed release and isolated expansion work.
- Use `codex/<short-scope>` branches from `develop` for isolated feature work when the change warrants a branch.
- Use small, descriptive Conventional Commit messages.
- Never force-push, rewrite shared history, delete branches, or commit directly to `main` without explicit approval.
- Preserve unrelated user changes and keep each change inside the requested scope.

See `docs/engineering/DEVELOPMENT_WORKFLOW.md` for the full workflow.

## Engineering constraints

- Use the Node version recorded in `.node-version` and pnpm for JavaScript dependencies.
- Prefer TypeScript with strict typing. Do not bypass errors with `any`, unchecked assertions, or disabled rules without a documented reason.
- Use shared design tokens and components instead of one-off visual values.
- Treat Stitch output as a concept. Promote an approved concept through documented tokens, Storybook states, and production components.
- Use Motion for normal interface transitions and GSAP only when a complex timeline or interaction justifies it.
- Keep server-only code and secrets out of client bundles.
- Do not add a backend, CMS, authentication provider, analytics platform, or other service before its roadmap stage and decision record.
- Prefer the smallest dependency set that solves the documented requirement.

## Progressive delivery

- Treat `docs/product/PUBLIC_RELEASE_SLICE.md` and ADR-0002 as the release boundary.
- Keep `main` production-ready and the live slice independently buildable and reversible.
- Isolate incomplete expansion work in scoped branches and previews; do not expose dead controls,
  routes, claims, or dependencies publicly.
- Do not create a disposable launch app, second repository, or competing design system.
- Promote one complete vertical slice at a time through product, design, Storybook, code, Playwright,
  security/privacy/legal, operations, and owner approval.

## Creative boundary

- Drafts, prompts, source files, model files, and generated variants belong in the external Creative Studio.
- Only approved, licensed, optimized assets needed by the product may be copied into this repository.
- Validate and import handoff packages with `pnpm assets:validate` and `pnpm assets:import`; do not manually copy files into `src/assets/approved/`.
- Imported assets must retain the sanitized provenance, usage-rights, approval, and accessibility information defined in `docs/creative/CREATIVE_STUDIO_WORKFLOW.md`.

## Validation

Always run checks appropriate to the change. At minimum:

- Run `git diff --check` for every change.
- Validate internal documentation links for documentation changes.
- When the scripts exist, run `pnpm lint`, `pnpm typecheck`, and relevant tests.
- For application changes, run the relevant Storybook and Playwright checks.
- For release-impacting changes, run the production build.

Never claim a check passed unless it was actually run. If a check cannot run, report the reason.

## Security and public-repository rules

- This repository is public. Never add secrets, credentials, private customer data, confidential contracts, or internal personal data.
- Use environment variables for runtime secrets and commit only documented placeholders in `.env.example`.
- Redact sensitive values from logs, screenshots, fixtures, prompts, and issue text.
- Review third-party packages, MCP servers, and external services before granting them data or write access.

## Definition of done

A change is complete only when its scope is implemented, relevant documentation is current, applicable validation passes, the working tree contains no accidental files, and remaining risks or open decisions are stated clearly.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
