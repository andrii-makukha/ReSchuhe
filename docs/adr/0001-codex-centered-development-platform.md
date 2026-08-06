# ADR-0001: Codex-Centered Development Platform

Date: 2026-08-07 | Status: Accepted

## Context

ReSchuhe needs a stable development foundation that separates engineering, UI exploration, browser validation, source control, and creative media production. Repeatedly changing the primary tools would create setup churn, duplicate sources of truth, and make later decisions harder to trace.

## Decision

Use the following platform:

- Cursor is the primary IDE.
- Codex is the primary engineering agent and coordinates code, architecture, tests, documentation, Git, and approved MCP integrations.
- Google Stitch through MCP provides UI concepts. Approved concepts are translated into documented design tokens, Storybook states, and production components; Stitch itself is not the final source of truth.
- Playwright through MCP and the project test suite provide browser validation.
- GitHub hosts source control and collaboration.
- The web application uses Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Storybook, and Motion or GSAP according to the interaction need.
- Creative source production remains in a separate Creative Studio. Only approved, optimized product assets enter this repository.
- Backend, CMS, analytics, and production services are selected only at their roadmap stages from confirmed requirements.

## Alternatives considered

- Make another IDE or agent the primary control surface.
- Use multiple equal primary agents with overlapping authority.
- Treat generated UI screens or creative outputs as production sources without a documented promotion step.
- Select the complete service stack before the product requirements are defined.

## Consequences

- The project has one engineering control point and explicit handoffs between design, code, validation, and creative production.
- UI concepts require translation and review before they become product components.
- Creative files require an approval and import process rather than direct use.
- Some implementation decisions remain intentionally deferred, so open questions must stay visible in the documentation.
- Replacing a core platform element requires explicit project-owner approval and a superseding ADR.
