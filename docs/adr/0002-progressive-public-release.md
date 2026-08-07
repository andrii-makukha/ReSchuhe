# ADR-0002: Progressive Public Release

Date: 2026-08-07 | Status: Accepted

## Context

Waiting until every planned ReSchuhe capability is complete would delay real-world use and feedback, while publishing the current technical shell or a visual-only mockup would create false expectations and production risk. The project owner explicitly approved an early public-facing release that combines approved visual quality with the first real capability while the broader Product Experience continues to develop.

## Decision

Deliver a **Public Release Slice**: the smallest production-ready vertical slice with one complete, useful journey, approved content and visual baseline, and the security, privacy, legal, accessibility, performance, operational, and rollback controls required by the behavior actually exposed.

The fixed Cursor, Codex, Stitch, Playwright, GitHub, Next.js, TypeScript, Tailwind CSS, shadcn/ui, Storybook, and Creative Studio platform remains unchanged. ReSchuhe remains one application and one source repository; no disposable public mockup or parallel product codebase is created.

Release work and confirmed expansion work may proceed in parallel, but incomplete expansion capabilities remain isolated from the public experience and cannot become a dependency of the Public Release Slice. Every later capability must pass the same release gate before public exposure. Backend, CMS, authentication, analytics, and other services are still selected only when the confirmed slice requires them.

## Consequences

- Product, audience, outcome, locale, first capability, content/data behavior, and minimum brand direction must be confirmed before production design and feature implementation.
- CI, preview deployment, release controls, and minimum production readiness move ahead of speculative full-product infrastructure.
- The live slice stays stable and supportable while expansion work continues through isolated branches and previews.
- “Early” changes scope, not quality: public behavior is held to production standards from its first release.
