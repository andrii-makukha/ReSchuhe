# ReSchuhe

ReSchuhe is the repository for the brand's digital product. A verified application foundation is in place while product and brand decisions remain explicitly documented.

## Fixed development platform

- Cursor is the primary IDE.
- Codex is the primary engineering agent.
- Google Stitch provides UI concepts through MCP.
- Playwright provides browser validation through MCP and automated tests.
- GitHub is the source-control and collaboration platform.
- The application stack is Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Storybook, and task-appropriate Motion or GSAP.
- Creative source work remains in the separate Creative Studio; only approved, web-ready assets enter this repository.

Changing this platform requires explicit project-owner approval and a superseding architecture decision record.

## Start here

1. Read [AGENTS.md](AGENTS.md) for repository working rules.
2. Read [CONTEXT.md](CONTEXT.md) for canonical project language.
3. Use the [documentation index](docs/README.md) to find the relevant source of truth.
4. Check the [implementation roadmap](docs/engineering/ROADMAP.md) before starting a new stage.

## Current repository state

Stages 1–7 are complete. The repository contains a neutral technical shell, a local shadcn component
foundation, Storybook, unit tests, and Playwright checks for desktop, mobile, accessibility, and
baseline response headers. A separate local Creative Studio and a validated, immutable
approved-asset handoff are also established. The shell is not an approved product experience or
visual identity, and no production brand asset has been imported.

The progressive public-release strategy is now confirmed. Stage 8 is active: define one
production-ready Public Release Slice with an approved visual baseline and one real useful journey,
then keep that slice live while the full Product Experience expands through controlled releases. The
offering, audience, first capability, locale, and production visual direction are still open and are
not inferred by the technical scaffold.

Implementation details and boundaries are recorded in the
[application foundation](docs/engineering/APPLICATION_FOUNDATION.md) and
[Creative Studio workflow](docs/creative/CREATIVE_STUDIO_WORKFLOW.md). The current release boundary
is defined in the [Public Release Slice](docs/product/PUBLIC_RELEASE_SLICE.md).

## Local development

Use the versions pinned by [.node-version](.node-version) and `package.json`:

```bash
fnm use
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the complete local foundation validation with:

```bash
pnpm check
pnpm storybook:build
pnpm test:e2e
pnpm build
```

Validate and import an approved Creative Studio handoff with:

```bash
pnpm assets:validate -- "<handoff-package>"
pnpm assets:import -- "<handoff-package>"
```
