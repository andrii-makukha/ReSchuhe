# ReSchuhe Delivery Roadmap

Status: Confirmed | Last reviewed: 2026-08-07

Stages 1–7 established the fixed foundation. On 2026-08-07 the project owner explicitly approved a
progressive public-release strategy: ship one production-ready visual and functional slice, then
continue the full Product Experience through controlled expansion. The platform remains unchanged.

| Stage | Scope                                                                                          | Status   | Completion evidence                                                                               |
| ----- | ---------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| 1     | Audit macOS without changes; establish shell, Node, pnpm, GitHub, SSH, and Codex prerequisites | Complete | Verified local environment and exact GitHub identity                                              |
| 2     | Establish repository and external project/Creative Studio directory foundation                 | Complete | Public GitHub repository, `main`/`develop`, runtime files, clean remote sync                      |
| 3     | Configure the Cursor workspace and project-scoped Codex safety settings                        | Complete | Workspace settings/extensions and repository-local Codex config                                   |
| 4     | Establish canonical documentation, terminology, rules, and architecture decision records       | Complete | Root instructions, domain documents, roadmap, and ADR-0001                                        |
| 5     | Configure and verify Google Stitch MCP and Playwright MCP                                      | Complete | Stitch read-only project listing and Playwright isolated-browser smoke test succeeded             |
| 6     | Scaffold Next.js, TypeScript, Tailwind CSS, shadcn/ui, Storybook, and test foundations         | Complete | Local app, Storybook, unit tests, 6 browser/a11y/header checks, audit, and production build pass  |
| 7     | Establish the separate Creative Studio workflow and approved-asset handoff                     | Complete | Private Studio, templates/helpers, strict atomic import, synthetic and raster smoke tests         |
| 8     | Define the Public Release Slice and select only the services its confirmed journey requires    | Active   | Approved release brief, journey, scope, data map, acceptance criteria, and threat/privacy outline |
| 9     | Establish CI/previews and build the approved Design Baseline plus first complete capability    | Planned  | Green CI, isolated preview, Storybook promotion, Playwright journey, a11y, and performance checks |
| 10    | Complete production readiness, publish the slice, and continue controlled expansion releases   | Planned  | Live URL, release approval, legal/privacy/security checks, monitoring, rollback, and ownership    |

## Progressive delivery tracks

- **Release track:** owns the smallest currently publishable slice, its hardening, operations, and
  regressions.
- **Expansion track:** researches, designs, and implements confirmed later capabilities in isolated
  branches and previews. It may run in parallel but cannot become a dependency of the public slice.
- Both tracks use the same repository, application, Design Baseline, Creative Studio handoff, and
  quality gates. There is no temporary public app to discard later.
- A capability moves from expansion to release only as a complete vertical slice. “Beta,” hidden
  navigation, or a feature flag does not waive security, privacy, accessibility, or content review.

## Stage rule

The numbered stages remain ordered decision gates. Within Stages 8–10, release and expansion work
may proceed in parallel only when their boundaries and dependencies are explicit. A missing product
decision blocks the affected journey, not safe decision-independent release foundations. No public
exposure occurs before the complete release gate passes.

## Change control

A roadmap change must include:

1. The project owner’s explicit approval.
2. The reason the current sequence no longer serves the project.
3. Impact on completed work, cost, risk, and rollback.
4. Updates to this roadmap and every affected domain document.
5. A new or superseding ADR when the platform or delivery architecture changes.
