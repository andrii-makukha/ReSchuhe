# ReSchuhe Image Generation and Asset Handoff

Status: Governance confirmed; creative direction and toolchain pending | Last reviewed: 2026-08-07

## Boundary

Image exploration and source production take place in the separate Creative Studio. This repository receives only Approved Assets that the Product Experience needs.

Generated does not mean approved. Selection, rights review, provenance, accessibility, optimization, and intended-use approval are mandatory handoff steps.

## Asset lifecycle

```text
Confirmed brief
→ source/reference review
→ creation or generation
→ curation
→ brand and quality review
→ rights and provenance review
→ approval
→ web optimization
→ repository import
→ in-product validation
```

## Brief requirements

Before generating or commissioning an asset, record:

- product purpose and placement;
- audience and message, once confirmed;
- required subject and prohibited elements;
- composition/aspect-ratio needs without assuming final pixels too early;
- brand direction and reference status;
- accessibility role;
- usage-rights constraints;
- reviewer and approval criterion.

## Provenance record

An Approved Asset must retain enough information to understand where it came from and whether it may be used:

- stable asset identifier and version;
- creator or generation tool/model and relevant version;
- creation date and source references;
- prompt/workflow reference when generated;
- license, consent, trademark, likeness, and territory limitations as applicable;
- material edits;
- approving person and approval date;
- intended placements and expiry/review date if restricted.

Do not put sensitive prompts, credentials, restricted source material, or unnecessary personal data in the public repository.

## Quality rules

- Inspect anatomy, geometry, text, reflections, shadows, edges, repeated details, and product accuracy at useful zoom levels.
- Reject outputs with misleading product details or unverifiable representations.
- Keep a clear focal hierarchy and sufficient room for responsive crops when the placement requires it.
- Avoid embedding essential text in raster imagery.
- Test crop behavior, loading, contrast with overlays, and high-density displays in the actual component.
- Preserve a non-destructive Source Asset in the Creative Studio; optimize a copy for product use.

## Rights and representation

- Do not imitate a living artist’s style for publication without an approved rights basis.
- Do not use real people, private locations, protected marks, or third-party products without appropriate rights and review.
- Do not create deceptive testimonials, documentary evidence, or product capabilities.
- Clearly distinguish conceptual imagery where a reasonable user could mistake it for a real offering.

## Repository import

- Use descriptive, stable lowercase filenames; do not encode secret prompts or personal names.
- Import only the formats and dimensions required by a confirmed component.
- Prefer modern efficient formats when quality, transparency, and browser support permit.
- Record meaningful alternative text in the content source; use empty alternative text for genuinely decorative images.
- Remove unused variants from the product repository while retaining source history in the Creative Studio.

## Open decisions

- Approved visual direction and subject policy.
- Creative Studio toolchain and reproducibility standard.
- Asset metadata storage format.
- Repository asset locations after the Next.js scaffold.
- Image delivery/optimization provider, if any.
