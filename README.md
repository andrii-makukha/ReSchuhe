# ReSchuhe

ReSchuhe is the repository for the brand's digital product. The product definition is intentionally being established before application code is scaffolded.

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

The environment, repository, Cursor/Codex workspace, documentation foundation, and project-scoped Stitch/Playwright MCP integrations are established and verified. Application scaffolding intentionally begins in Stage 6. There are no install or run commands yet.

Local runtime requirements are recorded in [.node-version](.node-version); pnpm is the package manager for future JavaScript dependencies.
