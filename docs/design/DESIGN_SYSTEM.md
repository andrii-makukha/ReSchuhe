# ReSchuhe Design System

Status: Governance and neutral technical scaffold confirmed; brand values pending | Last reviewed: 2026-08-07

## Purpose

The design system turns approved brand and UX decisions into a reusable Design Baseline. It prevents raw generated screens, arbitrary values, and isolated components from becoming competing sources of truth.

## Promotion pipeline

```text
Confirmed product need
→ Stitch concept exploration
→ explicit review and approval
→ semantic design tokens
→ Storybook component states
→ production composition
→ Playwright validation
```

Stitch is an exploration and concept source. Approved tokens, documented component contracts, Storybook states, code, and tests form the implementation baseline.

## Token model

Tokens describe roles rather than isolated appearance. Core semantic roles now exist in
`src/app/globals.css` so components and Storybook can be built without arbitrary one-off values.
Their neutral values are technical defaults, not approved ReSchuhe brand values.

| Category    | Intended roles                                                          |
| ----------- | ----------------------------------------------------------------------- |
| Color       | canvas, surface, text, border, action, focus, status, and overlay roles |
| Typography  | display, heading, body, label, and supporting-text roles                |
| Space       | layout rhythm, component gaps, and control insets                       |
| Size        | content widths, controls, icons, and responsive containers              |
| Shape       | radius and border roles                                                 |
| Elevation   | layering and shadow roles                                               |
| Motion      | duration, easing, distance, and sequence roles                          |
| Breakpoints | content-driven responsive transitions                                   |

Rules:

- Components consume semantic roles instead of raw brand values.
- A repeated exception becomes a reviewed token or variant, not copied arbitrary styling.
- Token names describe purpose and remain independent of a particular screen.
- Light/dark or theme variants are introduced only when product requirements confirm them.
- No dark-theme variant is implemented in the Stage 6 scaffold.

## Component contract

Use shadcn/ui as an accessible implementation foundation, then adapt it to approved ReSchuhe tokens and behavior. It is not the visual identity by itself.

Every shared component must document, as applicable:

- purpose and permitted composition;
- semantic element and accessible name;
- variants and sizes;
- default, hover, focus-visible, active, disabled, loading, empty, error, and success states;
- keyboard and assistive-technology behavior;
- responsive behavior and content limits;
- motion behavior, including reduced motion;
- test coverage and known constraints.

Avoid creating a shared component for a single accidental similarity. Extract a component when it protects a stable concept or repeated contract.

The current `Button` and its Storybook stories verify the component pipeline, accessible state
forwarding, and semantic tokens. They are an infrastructure fixture, not an approved product
component inventory or visual direction.

## First production Design Baseline

The Public Release Slice may approve a small but complete token and component subset before the
entire future design system is known. That subset must cover every real state in the first journey,
use approved brand roles and content, and pass Storybook, responsive, accessibility, performance,
and Playwright review. Later components extend this baseline; they do not create a parallel visual
language.

## Responsive baseline

- Design from content constraints and user tasks, not named device models.
- Preserve hierarchy and primary actions at every supported width.
- Avoid horizontal scrolling for ordinary page content.
- Make controls usable by touch, keyboard, pointer, and zoomed layouts.
- Test long content, missing media, localization expansion, and narrow viewports.

## Accessibility baseline

- Prefer native semantic elements before custom behavior.
- Keep full keyboard operation and visible focus.
- Give controls programmatic names and expose validation/status changes appropriately.
- Use color as reinforcement, never as the only carrier of meaning.
- Verify readable contrast after brand colors are selected.
- Respect text resizing, zoom, reduced motion, and platform accessibility preferences.
- Validate with automated checks and manual keyboard/screen-reader review appropriate to the component.

## Governance

A design-system change is accepted only when the use case is confirmed, tokens and component contracts are updated together, Storybook demonstrates relevant states, accessibility is reviewed, and existing consumers are checked for regressions.

## Open decisions

- Brand palette and color-role values.
- Typefaces, licensing, type scale, and loading strategy.
- Spacing, shape, elevation, layout, and breakpoint values.
- Icon treatment and illustration relationship.
- Theme support.
- Initial component inventory, which must follow the first confirmed journey.
