# ReSchuhe Foundation Roadmap

Status: Confirmed | Last reviewed: 2026-08-07

This sequence is the fixed implementation strategy. Reordering, replacing, or adding a major platform stage requires explicit project-owner approval and corresponding documentation updates.

| Stage | Scope | Status | Completion evidence |
| --- | --- | --- | --- |
| 1 | Audit macOS without changes; establish shell, Node, pnpm, GitHub, SSH, and Codex prerequisites | Complete | Verified local environment and exact GitHub identity |
| 2 | Establish repository and external project/Creative Studio directory foundation | Complete | Public GitHub repository, `main`/`develop`, runtime files, clean remote sync |
| 3 | Configure the Cursor workspace and project-scoped Codex safety settings | Complete | Workspace settings/extensions and repository-local Codex config |
| 4 | Establish canonical documentation, terminology, rules, and architecture decision records | Complete | Root instructions, domain documents, roadmap, and ADR-0001 |
| 5 | Configure and verify Google Stitch MCP and Playwright MCP | Complete | Stitch read-only project listing and Playwright isolated-browser smoke test succeeded |
| 6 | Scaffold Next.js, TypeScript, Tailwind CSS, shadcn/ui, Storybook, and test foundations | Planned | Local app, component environment, checks, and production build pass |
| 7 | Establish the separate Creative Studio workflow and approved-asset handoff | Planned | Repeatable creation, approval, provenance, optimization, and import process |
| 8 | Select and integrate backend/CMS capabilities only from confirmed product requirements | Deferred | Decision record, threat/privacy review, implementation, and tests |
| 9 | Establish CI, automated quality gates, browser testing, and preview deployments | Planned | GitHub checks and preview workflow pass from a clean branch |
| 10 | Prepare production deployment, analytics, security, privacy, and monitoring | Deferred | Launch checklist and owner-approved production readiness review |

## Stage rule

Complete the active stage before starting the next one. Discovery for a later stage is allowed only when it is read-only and needed to prevent a current-stage mistake. Implementation does not move forward merely because a tool is available.

## Change control

A roadmap change must include:

1. The project owner’s explicit approval.
2. The reason the current sequence no longer serves the project.
3. Impact on completed work, cost, risk, and rollback.
4. Updates to this roadmap and every affected domain document.
5. A new or superseding ADR when the platform architecture changes.
