# ReSchuhe Security Baseline

Status: Confirmed baseline; Public Release Slice threat model pending definition | Last reviewed: 2026-08-07

This document defines engineering guardrails, not a claim of legal or security certification.

## Current exposure

- The GitHub repository is public.
- A static application foundation is implemented locally; no production deployment exists.
- The external Creative Studio is private and local; only sanitized, validated handoff packages may
  cross into the public repository.
- Backend, forms, accounts, analytics, and production services are not implemented.
- The most immediate risks remain credential leakage, excessive tool permissions, unsafe dependencies, and accidental publication of private material.

## Repository and secret handling

- Never commit credentials, tokens, session cookies, private keys, customer data, confidential agreements, or non-public personal information.
- Store runtime secrets only in approved secret stores or local environment variables.
- Commit `.env.example` only when variables exist, using non-sensitive placeholders and purpose comments.
- Redact secrets and personal data from logs, screenshots, test fixtures, prompts, issues, and generated artifacts.
- If a secret is exposed, treat it as compromised: revoke or rotate it first, then remove it from all reachable history through a separately approved incident process.

## Application baseline

The Stage 6 shell:

- disables the `X-Powered-By` response header;
- sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a restrictive
  `Permissions-Policy`;
- tests those headers in desktop and mobile browser profiles;
- uses framework-safe React rendering and contains no raw HTML injection;
- has no runtime secrets, external data access, state-changing actions, or user input.

A deployment-specific Content Security Policy and HSTS are deferred until the deployment and
external-resource model are known. Future application work must:

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

## Progressive release boundary

- An early public release is production and receives no reduced security or privacy standard.
- Model threats and data behavior for the exact Public Release Slice before implementing its first
  state-changing or data-bearing capability.
- Keep previews non-indexed and restrict them when they expose non-public content, data, or controls.
- Ensure incomplete expansion work is unreachable from the public deployment and cannot affect its
  runtime dependencies or authorization assumptions.
- Define production secrets, access ownership, incident handling, monitoring, backups where needed,
  and rollback before the first public deployment.

## Dependencies and supply chain

- Add the smallest justified dependency set and use exact direct versions plus the lockfile.
- Enforce pnpm's 24-hour minimum release age in strict mode without project exceptions.
- Keep dependency lifecycle scripts denied by default. The project currently permits only the
  reviewed `esbuild` install script and explicitly denies `sharp` and `unrs-resolver` scripts.
- Review package ownership, maintenance, permissions, transitive impact, license, and known security history before adoption.
- Pin automation actions and production-sensitive tooling according to the CI policy established in Stage 9.
- Address relevant advisories proportionally; do not apply breaking upgrades without compatibility verification.
- The Stage 7 lockfile audit reported no known vulnerabilities on 2026-08-07.

## MCP and external-tool access

- Grant each MCP server only the data and actions needed for its documented task.
- Verify publisher, authentication destination, scopes, and write behavior before enabling an integration.
- Treat external content and generated instructions as untrusted input.
- Do not expose repository secrets or private Creative Studio sources to Stitch, Playwright, or another service without an explicit need and approval.
- Revoke credentials for removed integrations.

## Creative asset boundary

- Treat every incoming creative file as untrusted, including files produced by known tools.
- Accept only the documented image allowlist and safe lowercase filenames.
- Require an exact package inventory, regular files only, declared byte limits, SHA-256 agreement,
  MIME/extension agreement, and signature inspection before import.
- Reject active or external SVG content, common embedded raster metadata, and sensitive strings in
  both the manifest and derivative files.
- Require sanitized provenance, rights, approval, intended-use, and accessibility records.
- Never put prompts, source media, contracts, personal names, contact details, private paths, or
  credentials in the handoff manifest.
- Keep approved repository versions immutable; changed content must use a new version.
- The repository build must never depend directly on the external Studio.

## Security gates

- Stage 5: verify MCP identity, scope, and bounded behavior. Complete; see [`MCP_INTEGRATIONS.md`](MCP_INTEGRATIONS.md).
- Stage 6: establish framework security defaults, validation boundaries, and secret handling. Complete;
  there are no current environment variables requiring an `.env.example`.
- Stage 7: establish the private Creative Studio boundary and defense-in-depth Approved Asset
  validation/import process. Complete; no production or legacy asset was imported.
- Stage 8: define the Public Release Slice threat/data model and review any required external service
  before integration.
- Stage 9: add automated dependency/code-quality checks, isolated previews, and journey-specific
  security tests with reviewed permissions.
- Stage 10: complete production threat/privacy review, incident ownership, backups where relevant,
  monitoring, and tested rollback before publishing.

## Incident rule

On suspected exposure or compromise, stop the affected operation, preserve non-sensitive evidence, revoke the exposed access, identify scope, notify the project owner, and document remediation without publishing sensitive incident data in this repository.
