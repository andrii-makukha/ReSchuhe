# ReSchuhe Product Definition

Status: Progressive release strategy confirmed; offering and first capability open | Last reviewed: 2026-08-07

## Product statement

ReSchuhe is a digital product under the ReSchuhe brand. Its exact offering, primary audience, market, and primary user outcome are open decisions. No narrower product category is canonical yet.

## Confirmed product constraints

- The experience will be implemented as a modern, responsive web product on the approved stack.
- Brand, UX, content, and engineering decisions must converge into one coherent Product Experience.
- The product will be built in the fixed roadmap sequence rather than by adding features opportunistically.
- The first public version will be a Public Release Slice: one complete useful journey combined with
  an approved visual baseline, not a visual-only demo or speculative full build.
- The Public Release Slice will remain viable while confirmed expansion work continues in parallel
  behind the documented release boundary.
- Accessibility, security, performance, maintainability, and truthful content are product quality requirements, not final-stage polish.
- Backend, CMS, authentication, payments, analytics, and other data-bearing services are deferred until requirements justify them.

## Open product decisions

| Decision                         | Why it is required                                                                 | Needed before                                  |
| -------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| Commercial offering              | Defines what ReSchuhe provides and what must be represented digitally              | Product feature design                         |
| Primary audience                 | Determines language, information hierarchy, accessibility needs, and trust signals | User journeys and content architecture         |
| Primary user outcome             | Defines the main journey and conversion                                            | Navigation and page scope                      |
| Initial market and locale        | Affects language, currency, legal duties, search strategy, and operations          | Production content and legal review            |
| Launch scope                     | Separates the first releasable product from later capabilities                     | Feature implementation                         |
| First public capability          | Defines the one real end-to-end action available in the Public Release Slice       | Production journey and interface design        |
| Content owner and update cadence | Determines whether a CMS or repository-managed content is appropriate              | Backend/CMS decision                           |
| Data collected from users        | Determines privacy, security, consent, and retention requirements                  | Any form, account, or analytics implementation |
| Success measures                 | Defines what launch quality and product impact mean                                | Analytics selection and launch review          |

## Scope rules

- Do not infer a store, showroom, marketplace, service catalog, editorial site, or account system from the name alone.
- Do not add a feature because it is common in similar products; trace it to a confirmed user need.
- Keep candidate ideas outside the confirmed scope until the project owner approves them.
- Prefer the smallest complete journey that proves the primary user outcome once that outcome is defined.
- Do not publish the technical shell, dead controls, unsupported claims, or an attractive interface
  without a complete useful outcome.
- Do not create a disposable launch site or second application; grow the same Product Experience
  through releasable slices.

## Progressive release model

The current definition checklist and release contract live in
[PUBLIC_RELEASE_SLICE.md](PUBLIC_RELEASE_SLICE.md). The delivery architecture and trade-off are
recorded in [ADR-0002](../adr/0002-progressive-public-release.md).

Release work protects the smallest production-ready slice. Expansion work may proceed in parallel
only for confirmed later needs and remains unavailable publicly until it independently satisfies the
same release gate.

## Decision gates

- Stage 5 may verify MCP integrations without defining the product offering.
- Stage 6 may establish the technical shell and component foundation without inventing user-facing features.
- Before designing the first production journey, confirm the offering, primary audience, primary
  outcome, first public capability, and initial locale.
- Before publishing the Public Release Slice, approve its scope exclusions, content/data behavior,
  minimum brand direction, success criterion, legal readiness, and operational owner.
- Before integrating a backend or CMS, document the content/data owner, update model, permissions, and retention needs.
- Before production launch, approve success measures, legal obligations, privacy behavior, and operational ownership.

## Explicitly deferred

- Full feature inventory beyond the Public Release Slice.
- Broader information architecture and journeys beyond the Public Release Slice.
- Pricing, transactions, booking, lead capture, accounts, personalization, and localization.
- Operational integrations and internal workflows.

These are not rejected; they are unconfirmed.
