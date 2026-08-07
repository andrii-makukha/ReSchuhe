# ReSchuhe Creative Studio Workflow

Status: Confirmed and implemented | Last reviewed: 2026-08-07

## Purpose

The Creative Studio is the private, local workspace for briefs, references, prompts, editable
sources, variants, review material, rights evidence, and high-fidelity masters. It is separate from
the application repository and is not a second Git repository.

The local root on the development Mac is:

```text
Developer/labs/reschuhe-creative-studio
```

The repository contains only the public governance, validation tooling, sanitized manifest, and
Approved Asset derivatives needed by a confirmed product placement.

## Studio structure

| Directory      | Purpose                                                        | Repository eligibility |
| -------------- | -------------------------------------------------------------- | ---------------------- |
| `00-inbox/`    | Untrusted incoming files awaiting inventory                    | Never                  |
| `10-briefs/`   | Confirmed purpose, placement, constraints, and review criteria | Never                  |
| `20-sources/`  | Original, licensed, provided, or generated Source Assets       | Never                  |
| `30-working/`  | Editable files, prompts, workflows, and variants               | Never                  |
| `40-review/`   | Contact sheets, comparisons, feedback, and rejected candidates | Never                  |
| `50-approved/` | Approved master, private provenance, and rights evidence       | Never                  |
| `60-handoff/`  | Sanitized, optimized package ready for repository validation   | Package only           |
| `90-archive/`  | Retired versions and closed explorations                       | Never                  |
| `templates/`   | Brief, source-record, approval, and public-manifest templates  | Templates only         |
| `tools/`       | Local, non-destructive Studio helpers                          | Tools only             |

Existing unsorted material outside this Studio is not automatically imported. Each item must first
be inventoried, matched to a confirmed purpose, and reviewed for rights and relevance.

## Asset identity and versions

- Use one stable lowercase kebab-case `assetId`.
- Start approved output at version `1`.
- A version is immutable after repository import.
- Any change to pixels, vectors, crop, dimensions, compression, rights, purpose, accessibility, or
  public metadata requires a new version.
- Private records use the reference `studio:<asset-id>/v<version>`.

Create the private working structure with:

```bash
tools/new-asset.zsh <asset-id> <version>
```

The helper creates only missing directories and templates; it never overwrites existing records.

## Lifecycle

1. Create an asset ID/version and complete the brief in `10-briefs/`.
2. Place original files and rights evidence in `20-sources/`.
3. Keep prompts, model files, editable documents, and variants in `30-working/`.
4. Record review evidence and rejected candidates in `40-review/`.
5. Put the selected master, source record, and completed approval checklist in `50-approved/`.
6. Export a separate derivative for the confirmed placement; never optimize the master destructively.
7. Inspect the derivative, remove embedded metadata, and record its dimensions, byte size, SHA-256,
   tool, settings, and material edits in the private source record.
8. Create `60-handoff/<asset-id>/v<version>/` containing only:
   - `asset-manifest.json`;
   - the optimized files listed by that manifest.
9. From the application repository, validate and import the package.
10. Review the Git diff, use the asset in its confirmed component, and perform responsive,
    accessibility, quality, and performance validation before commit.

## Optimization contract

- Select dimensions and byte budget from the confirmed component, not from a universal preset.
- The accepted handoff allowlist is AVIF, WebP, PNG, JPEG, and constrained SVG.
- Keep transparency only when the placement needs it.
- Avoid essential text inside raster assets.
- Remove EXIF, IPTC, XMP, comments, private paths, personal data, and source-tool metadata.
- SVGs must have a `viewBox` and may not contain scripts, event handlers, embedded/external
  resources, style blocks, `foreignObject`, or metadata blocks.
- Record the exact export tool/version and settings in the private source record.
- Verify the optimized output visually at useful zoom and in the real component.

The local `tools/optimize-raster.zsh` helper can create a non-destructive JPEG or PNG derivative
with macOS `sips`, then removes JPEG application/comment metadata or PNG EXIF/text/time chunks with
the paired, repository-versioned sanitizer. It refuses to overwrite an output. The current `sips`
CLI cannot reliably export AVIF or WebP despite those formats appearing in the system format
inventory, so those formats require a separately verified exporter. The exact workflow must always
be recorded.

## Public handoff manifest

`asset-manifest.json` is intentionally sanitized for a public repository. It records:

- stable ID, version, approved status, title, purpose, and intended placements;
- informative alt text or an explicit decorative role;
- source category, creator role, tool/model summary, date, and private Studio record reference;
- rights basis, public summary, territories, expiry, and restrictions;
- approval date, reviewer role, and all required review scopes;
- filename, MIME type, SHA-256, actual bytes, approved byte budget, width, and height.

It must not contain prompts, local filesystem paths, email addresses, personal reviewer names,
credentials, private rights documents, private reference media, or unnecessary personal data.

## Repository validation and import

From the ReSchuhe repository:

```bash
pnpm assets:validate -- "<studio>/60-handoff/<asset-id>/v<version>"
pnpm assets:import -- "<studio>/60-handoff/<asset-id>/v<version>"
```

Validation uses an allowlist and defense in depth:

- strict Zod schema with no unknown fields;
- safe filenames and an exact file inventory;
- regular files only, with no links or nested directories;
- extension/MIME agreement and file-signature inspection;
- SHA-256 and exact byte-size verification;
- placement-specific byte budgets and global safety limits;
- embedded raster-metadata rejection;
- active/external SVG content rejection;
- complete provenance, rights, accessibility, and approval records;
- expired-rights rejection;
- manifest and asset-content secret and personal-data checks.

Successful import is atomic and writes:

```text
src/assets/approved/<asset-id>/v<version>/
  asset-manifest.json
  <manifest-listed files>
```

Imported versions cannot be overwritten. An identical retry is a safe no-op; a changed package must
use a new version.

## Public and private boundary

| Private Studio only                               | Public repository                            |
| ------------------------------------------------- | -------------------------------------------- |
| Raw prompts and conversation history              | Sanitized tool/model summary                 |
| Original references and editable sources          | Optimized approved derivative                |
| Personal names and contact details                | Reviewer role                                |
| Contracts, invoices, consent forms, license files | Public rights basis and restrictions summary |
| Rejected variants and review discussion           | Approved status and intended placement       |
| Local paths and tool caches                       | Stable Studio record reference               |

## Backup status

The Studio is local and not a Git repository. A Time Machine destination is configured on the Mac,
but it was unavailable during the Stage 7 verification. Connect and verify the backup destination
before creating irreplaceable Source Assets. Do not treat the application repository as a backup for
private creative sources.

## Stage 7 verification boundary

The workflow is tested with a synthetic, non-production SVG created in a temporary directory. No
legacy file, generated brand direction, or product asset is imported during Stage 7.
