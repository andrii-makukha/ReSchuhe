# ReSchuhe MCP Integrations

Status: Verified foundation configuration | Last reviewed: 2026-08-07

## Scope

Google Stitch and Playwright are configured in the trusted repository-level `.codex/config.toml`. This keeps them available to Codex when ReSchuhe is the active workspace without making them defaults for unrelated repositories.

Codex CLI, the Codex IDE extension, and the Codex desktop host share MCP configuration. Start a new Codex session or restart the IDE extension after changing MCP settings so the tool inventory is rebuilt.

## Verified inventory

| Server | Transport | Authentication | Persistent safety policy | Verification on 2026-08-07 |
| --- | --- | --- | --- | --- |
| Google Stitch | Google-hosted Streamable HTTP endpoint | `STITCH_API_KEY` mapped at runtime to `X-Goog-Api-Key` | Owner-approved design creation/editing is automatic; other writes prompt; server is optional at startup | `list_projects` completed successfully; no project names, IDs, or content were retained |
| Playwright | Local stdio process via `npx` | None | Prompt for tools not marked read-only; isolated headless browser profile; server is optional at startup | Navigation, accessibility snapshot, title/heading read, and browser close completed on `https://example.com` |

## Google Stitch

Configuration:

- Endpoint: `https://stitch.googleapis.com/mcp`.
- Authentication header: `X-Goog-Api-Key`.
- Secret source: host environment variable `STITCH_API_KEY`.
- Tool timeout: 300 seconds to allow bounded generation tasks to finish.
- Project-owner authorization for sending this key to the named Google endpoint was recorded on 2026-08-07.
- Project-owner authorization for automatic bounded design creation and editing was recorded on 2026-08-07.

The secret value is not stored in this repository. `env_http_headers` records only the environment-variable name. A functional read-only call, rather than the OAuth status column in `codex mcp list`, is the reliable verification for this API-key configuration; “Not logged in” refers to OAuth and is expected here.

Stitch remains a concept source. Generated screens or code do not become the Design Baseline until they pass the promotion process in [`../design/DESIGN_SYSTEM.md`](../design/DESIGN_SYSTEM.md).

## Playwright

Configuration:

- Package: official Microsoft `@playwright/mcp`, pinned to `0.0.79`.
- Launcher: `npx -y` using the exact package version.
- Browser: locally installed Google Chrome.
- Mode: headless and isolated; cookies, sessions, and browser profile state are not persisted.
- Disposable MCP evidence directory: `.playwright-mcp/`, explicitly ignored by Git.
- Code-generation language: TypeScript.
- Startup timeout: 60 seconds; tool timeout: 90 seconds.

The exact package pin prevents an unreviewed `latest` release from changing the MCP tool surface between sessions. `npx` may contact npm when the pinned package is not already cached.

## Approval and usage rules

- Keep `default_tools_approval_mode = "writes"` for both servers.
- Stitch may run these explicitly pre-approved design operations without another tool prompt: `create_project`, `generate_screen_from_text`, `edit_screens`, `generate_variants`, `create_design_system`, `create_design_system_from_design_md`, `update_design_system`, and `apply_design_system`.
- `delete_project` remains confirmation-gated because it is destructive.
- `upload_design_md` remains confirmation-gated because it sends local content to the remote service.
- Use read-only discovery before any remote creation or browser interaction that could alter state.
- Automatic tool approval does not create design scope by itself; use the approved operations only when the active task calls for ReSchuhe design work.
- Do not expose private prompts, customer data, credentials, or restricted Creative Studio sources to Stitch.
- Use Playwright against local ReSchuhe builds, approved preview deployments, public test pages, or explicitly authorized destinations.
- Do not load personal browser profiles, saved sessions, or unrestricted filesystem access into Playwright MCP.
- Do not add `--no-sandbox`, `--allow-unrestricted-file-access`, persistent storage state, saved sessions, or broad permissions without a documented requirement and security review.
- MCP output is evidence for review, not a substitute for committed tests or product documentation.

## Safe verification

1. Open the ReSchuhe repository as the active trusted workspace.
2. Start a new Codex session or restart the IDE extension.
3. Confirm `stitch` and `playwright` appear in `/mcp` or `codex mcp list`.
4. For Stitch, perform a read-only project listing and avoid printing project metadata into public logs.
5. For Playwright, use an approved page, read a deterministic element, and close the isolated browser.
6. Confirm no files, remote resources, or persistent browser data changed during the smoke test.

## Upgrade policy

### Playwright

Before changing the pinned version:

1. Confirm the current release from the official package and repository.
2. Review release changes, Node requirements, CLI flags, tool names, and security notes.
3. Update the exact version in `.codex/config.toml`.
4. Re-run the isolated-browser smoke test and update this document.

### Stitch

The remote service version is managed by Google and cannot be pinned in this repository. Revalidate the endpoint, authentication contract, tool inventory, and read-only smoke test after a documented service change or connection failure.

## Primary references

- [Codex MCP configuration](https://learn.chatgpt.com/docs/extend/mcp)
- [Google Stitch documentation](https://stitch.withgoogle.com/docs)
- [Google Labs Stitch SDK](https://github.com/google-labs-code/stitch-sdk)
- [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp)
