# ReSchuhe Documentation

This directory is the canonical knowledge base for the ReSchuhe product and its delivery system. Documents separate confirmed decisions from open questions so future work can proceed without hidden assumptions.

## Status vocabulary

- **Confirmed** — approved and safe to use as a requirement.
- **Open** — a named decision that still needs the project owner’s answer.
- **Deferred** — deliberately postponed to a later roadmap stage.
- **Candidate** — an option under consideration, not an approved dependency or requirement.

## Reading map

| Area                   | Source of truth                                                                  | Purpose                                                                        |
| ---------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Project language       | [`../CONTEXT.md`](../CONTEXT.md)                                                 | Canonical ReSchuhe terminology                                                 |
| Agent behavior         | [`../AGENTS.md`](../AGENTS.md)                                                   | Repository working rules                                                       |
| Strategy sequence      | [`engineering/ROADMAP.md`](engineering/ROADMAP.md)                               | Fixed stages and current state                                                 |
| Product                | [`product/PRODUCT.md`](product/PRODUCT.md)                                       | Goals, scope, and open product decisions                                       |
| Brand                  | [`brand/BRAND_DNA.md`](brand/BRAND_DNA.md)                                       | Confirmed identity rules and brand decisions                                   |
| UX                     | [`design/UX.md`](design/UX.md)                                                   | Experience principles and interaction requirements                             |
| Design system          | [`design/DESIGN_SYSTEM.md`](design/DESIGN_SYSTEM.md)                             | Tokens, components, and promotion workflow                                     |
| Motion                 | [`design/MOTION_SYSTEM.md`](design/MOTION_SYSTEM.md)                             | Motion roles and implementation boundaries                                     |
| Architecture           | [`architecture/ARCHITECTURE.md`](architecture/ARCHITECTURE.md)                   | System boundaries and fixed technology choices                                 |
| Development            | [`engineering/DEVELOPMENT_WORKFLOW.md`](engineering/DEVELOPMENT_WORKFLOW.md)     | Branching, validation, and definition of done                                  |
| Application foundation | [`engineering/APPLICATION_FOUNDATION.md`](engineering/APPLICATION_FOUNDATION.md) | Installed stack, file boundaries, commands, and deliberate deferrals           |
| MCP integrations       | [`engineering/MCP_INTEGRATIONS.md`](engineering/MCP_INTEGRATIONS.md)             | Project-scoped Stitch and Playwright configuration, security, and verification |
| Security               | [`engineering/SECURITY.md`](engineering/SECURITY.md)                             | Security and privacy engineering baseline                                      |
| Image generation       | [`creative/IMAGE_GENERATION.md`](creative/IMAGE_GENERATION.md)                   | Creative asset lifecycle and provenance                                        |
| Creative Studio        | [`creative/CREATIVE_STUDIO_WORKFLOW.md`](creative/CREATIVE_STUDIO_WORKFLOW.md)   | Private workspace, approval, optimization, validation, and import workflow     |
| Content                | [`marketing/CONTENT.md`](marketing/CONTENT.md)                                   | Content standards and unresolved voice decisions                               |
| SEO                    | [`marketing/SEO.md`](marketing/SEO.md)                                           | Search foundations and research gates                                          |
| Legal readiness        | [`legal/LEGAL.md`](legal/LEGAL.md)                                               | Legal decision checklist, not legal advice                                     |
| Architecture decisions | [`adr/`](adr/)                                                                   | Durable decisions and their trade-offs                                         |

## Conflict handling

- `CONTEXT.md` controls terminology.
- Accepted ADRs control durable architecture decisions.
- Each domain document controls requirements in its named area.
- `AGENTS.md` controls how repository work is performed.
- Code and tests describe the current implementation but do not silently override a documented decision.

When two sources conflict, stop the affected work, identify the newer explicit decision, and update all impacted sources together.

## Documentation rules

- Canonical engineering documentation is written in English. Product-copy languages remain an open product decision.
- Record facts and decisions, not speculation.
- Link to the relevant source rather than duplicating detailed rules.
- Keep secrets, personal data, confidential commercial terms, and private legal documents out of this public repository.
- Update the “Last reviewed” date only after reviewing the whole document.

Last reviewed: 2026-08-07.
