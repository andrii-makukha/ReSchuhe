# ReSchuhe Public Release Slice

Status: Definition in progress — strategy confirmed, product choices open | Last reviewed: 2026-08-07

## Purpose

The Public Release Slice is the first production-ready ReSchuhe experience for real people. It must
look intentional, deliver one complete useful outcome, and remain a sound base for the full Product
Experience.

It is not the current technical shell, a visual-only concept, a collection of disconnected controls,
or a temporary site that will be discarded.

## Confirmed release strategy

- Publish the smallest complete vertical slice before the full Product Experience is finished.
- Combine an approved visual baseline with one real capability; neither alone is sufficient.
- Keep the fixed development platform and one application/repository.
- Continue confirmed expansion work in parallel without exposing unfinished behavior.
- Hold the first public version to production standards for accessibility, performance, security,
  privacy, legal readiness, truthful content, operations, and rollback.
- Add backend, CMS, authentication, analytics, or other services only when the confirmed slice
  requires them.

The delivery decision is recorded in
[ADR-0002](../adr/0002-progressive-public-release.md).

## Decisions required now

| Decision                  | Status | Required outcome                                                                     |
| ------------------------- | ------ | ------------------------------------------------------------------------------------ |
| Commercial offering       | Open   | One precise statement of what ReSchuhe provides                                      |
| Primary audience          | Open   | One primary group and the context in which they arrive                               |
| First user outcome        | Open   | The useful result a visitor must be able to achieve                                  |
| First public capability   | Open   | One complete action/journey that delivers that result                                |
| Initial market and locale | Open   | Countries served and release language                                                |
| Public scope boundary     | Open   | Explicit included and unavailable capabilities                                       |
| Data behavior             | Open   | Data requested, purpose, owner, retention, and deletion — or confirmed no collection |
| Content and support owner | Open   | Who approves claims, updates content, and responds when something fails              |
| Release visibility        | Open   | Indexable public launch or deliberately non-indexed initial availability             |
| Success criterion         | Open   | Observable evidence that the slice works for users and operations                    |

## Release contract

The slice is releasable only when:

- the journey has a defined entry point, decision information, primary action, success state, error
  recovery, and support path;
- the minimum brand promise, voice, visual direction, and trust evidence used by the slice are
  explicitly approved;
- Stitch concepts have been promoted through semantic tokens, Storybook component states, production
  code, and Playwright checks;
- every visible control works and every published claim is supportable;
- responsive, keyboard, screen-reader, zoom, reduced-motion, and realistic-content behavior is
  reviewed;
- performance budgets and asset rights are verified;
- public routes, metadata, indexation, errors, security headers, privacy behavior, and applicable
  legal notices match actual behavior;
- deployment ownership, monitoring, incident handling, and rollback are tested;
- the project owner approves the exact release candidate.

## Delivery sequence

```text
Confirm release decisions
→ define the first complete journey
→ approve minimum brand/content direction
→ explore in Stitch and Creative Studio
→ promote the Design Baseline through Storybook
→ implement the vertical slice
→ run automated and manual validation
→ deploy an isolated preview
→ complete production readiness review
→ publish the Public Release Slice
→ expand through additional releasable slices
```

## Parallel expansion boundary

Expansion work may research, design, and implement later confirmed capabilities while the release
slice is being prepared or is already live. It stays on isolated branches and previews until complete.
It must not:

- create a second application or competing design system;
- make the public slice depend on unreleased code, data, or services;
- expose dead controls, inaccessible routes, fabricated content, or unsupported promises;
- weaken live security, performance, accessibility, or rollback behavior;
- bypass the release gate because a capability is labeled beta or experimental.

## Current boundary

No commercial offering, primary audience, first capability, production visual identity, release
locale, or data behavior has yet been approved. Therefore, product UI design and implementation
remain blocked only on those product decisions; CI and other decision-independent release
foundations may proceed when their roadmap stage begins.
