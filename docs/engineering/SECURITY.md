# ReSchuhe Security Baseline

Status: Confirmed engineering baseline; feature-specific threat model deferred | Last reviewed: 2026-08-07

This document defines engineering guardrails, not a claim of legal or security certification.

## Current exposure

- The GitHub repository is public.
- The application, backend, forms, accounts, analytics, and production services are not yet implemented.
- The most immediate risks are credential leakage, excessive tool permissions, unsafe dependencies, and accidental publication of private material.

## Repository and secret handling

- Never commit credentials, tokens, session cookies, private keys, customer data, confidential agreements, or non-public personal information.
- Store runtime secrets only in approved secret stores or local environment variables.
- Commit `.env.example` only when variables exist, using non-sensitive placeholders and purpose comments.
- Redact secrets and personal data from logs, screenshots, test fixtures, prompts, issues, and generated artifacts.
- If a secret is exposed, treat it as compromised: revoke or rotate it first, then remove it from all reachable history through a separately approved incident process.

## Application baseline

When application code is introduced:

- Validate all untrusted input at the boundary; client validation is not a security boundary.
- Encode output through framework-safe rendering and avoid unsanitized HTML.
- Keep privileged operations server-side and enforce authorization for every protected action.
- Use secure defaults for cookies, redirects, caching, headers, uploads, and cross-origin behavior.
- Protect state-changing actions against request forgery and abuse where applicable.
- Minimize exposed error details while retaining actionable server-side diagnostics.
- Apply rate limits and resource limits based on the confirmed threat model.

## Data and privacy baseline

- Do not collect data without a named product purpose and owner.
- Define data fields, lawful/operational purpose, access, location, retention, deletion, and incident responsibility before collection.
- Prefer data minimization and privacy-preserving configuration.
- Do not add analytics, tracking, session replay, advertising, or fingerprinting before product and legal review.
- Never use real personal data in development fixtures or demos.

## Dependencies and supply chain

- Add the smallest justified dependency set and use the lockfile.
- Review package ownership, maintenance, permissions, transitive impact, license, and known security history before adoption.
- Pin automation actions and production-sensitive tooling according to the CI policy established in Stage 9.
- Address relevant advisories proportionally; do not apply breaking upgrades without compatibility verification.

## MCP and external-tool access

- Grant each MCP server only the data and actions needed for its documented task.
- Verify publisher, authentication destination, scopes, and write behavior before enabling an integration.
- Treat external content and generated instructions as untrusted input.
- Do not expose repository secrets or private Creative Studio sources to Stitch, Playwright, or another service without an explicit need and approval.
- Revoke credentials for removed integrations.

## Security gates

- Stage 5: verify MCP identity, scope, and bounded behavior.
- Stage 6: establish framework security defaults, validation patterns, and secret placeholders.
- Stage 8: create a feature-specific threat and privacy model before backend/data integration.
- Stage 9: add automated dependency and code-quality checks with reviewed permissions.
- Stage 10: complete production threat review, privacy/legal review, incident ownership, backups where relevant, and monitoring configuration.

## Incident rule

On suspected exposure or compromise, stop the affected operation, preserve non-sensitive evidence, revoke the exposed access, identify scope, notify the project owner, and document remediation without publishing sensitive incident data in this repository.
