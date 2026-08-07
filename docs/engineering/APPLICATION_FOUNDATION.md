# ReSchuhe Application Foundation

Status: Confirmed and implemented | Last reviewed: 2026-08-07

## Purpose

Stage 6 establishes a reproducible web-development and verification environment without deciding
what ReSchuhe sells, who its audience is, how the product is structured, or what its visual identity
looks like. Stage 7 adds the Approved Asset trust boundary without changing those open decisions.
The current route is a technical status shell only.

## Installed baseline

| Concern                | Locked implementation                               |
| ---------------------- | --------------------------------------------------- |
| Runtime                | Node.js 24.19.0 and pnpm 11.20.0                    |
| Application            | Next.js 16.3.0, React 19.2.8, and TypeScript 5.9.3  |
| Styling                | Tailwind CSS 4.3.3 with semantic CSS variables      |
| UI source              | Local shadcn 4.16.1 components using Base UI 1.7.0  |
| Components             | Storybook 10.5.6 with docs and accessibility addons |
| Unit tests             | Vitest 4.1.10, jsdom, and Testing Library           |
| Browser tests          | Playwright 1.62.1 with managed Chromium             |
| Accessibility          | Storybook a11y plus axe checks in Playwright        |
| Asset handoff          | Zod 4.4.3 plus signature, digest, and policy checks |
| Formatting and linting | Prettier 3.9.6 and ESLint 9.39.5 with Next.js rules |

`package.json` and `pnpm-lock.yaml` are the exact dependency sources of truth.

## File boundaries

| Path                   | Responsibility                                                    |
| ---------------------- | ----------------------------------------------------------------- |
| `src/app/`             | App Router shell, document metadata, and global semantic tokens   |
| `src/components/ui/`   | Local shadcn-based primitives with stories and unit tests         |
| `src/assets/approved/` | Immutable, versioned Approved Asset derivatives and manifests     |
| `src/lib/`             | Shared implementation utilities                                   |
| `scripts/assets/`      | Creative Studio package validation and atomic repository import   |
| `.storybook/`          | Isolated component-development configuration                      |
| `e2e/`                 | Desktop/mobile browser, accessibility, and response-header checks |
| `next.config.ts`       | Framework behavior and baseline response headers                  |
| `pnpm-workspace.yaml`  | Runtime enforcement and dependency build-script policy            |

New domain, service-adapter, content, and asset directories must follow confirmed requirements
rather than being created speculatively.

## Local commands

```bash
fnm use
pnpm install
pnpm dev
```

The development application runs at `http://localhost:3000`. Storybook runs at
`http://localhost:6006` with `pnpm storybook`.

Validation commands:

```bash
pnpm check
pnpm storybook:build
pnpm test:e2e
pnpm build
pnpm audit --audit-level high
```

Creative Studio handoff commands:

```bash
pnpm assets:validate -- "<handoff-package>"
pnpm assets:import -- "<handoff-package>"
```

The Playwright browser is installed once per machine with:

```bash
pnpm exec playwright install chromium
```

## Technical UI boundary

The neutral light tokens, system font stack, status page, and `Button` stories exist to prove the
pipeline. They are not an approved palette, typography system, component inventory, landing page,
product copy, or dark-theme decision. Stitch concepts must still pass through the documented design
promotion pipeline before replacing them.

## Deliberately deferred dependencies

Zod is installed as a development dependency for the confirmed Creative Studio asset-manifest trust
boundary. This does not define a future application-form schema. React Hook Form remains deferred
until a confirmed form requires it. Motion or GSAP is likewise added only for a documented motion
requirement. This keeps the dependency graph tied to implemented boundaries without changing the
fixed architecture.

No backend, CMS, authentication, analytics, deployment SDK, external font, or runtime secret has
been added.

## Supply-chain policy

- Direct dependencies use exact versions and are captured in the pnpm lockfile.
- A strict 24-hour minimum release age is enforced without project exceptions.
- Node and pnpm compatibility are enforced at install time.
- Dependency install scripts are denied unless reviewed in `allowBuilds`.
- `esbuild` is the only allowed dependency build script; `sharp` and `unrs-resolver` are
  explicitly denied.
- The Stage 7 lockfile audit found no known vulnerabilities on 2026-08-07.
