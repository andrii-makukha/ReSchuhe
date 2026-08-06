# ReSchuhe Motion System

Status: Governance confirmed; motion language and values pending | Last reviewed: 2026-08-07

## Purpose

Motion may clarify hierarchy, continuity, feedback, and spatial relationships. It must not compensate for unclear information architecture or exist only as decoration.

## Tool boundary

- Prefer CSS transitions for simple state changes that do not need orchestration.
- Use Motion for ordinary component entry/exit, layout transitions, and interaction feedback.
- Use GSAP only for a documented complex timeline, scroll-linked sequence, or interaction that Motion/CSS cannot express clearly enough.
- Do not ship both libraries for the same role without a measured and documented need.

Final dependency choices and bundle impact are verified during application implementation.

## Motion roles

| Role        | Intended use                                                |
| ----------- | ----------------------------------------------------------- |
| Feedback    | Confirm direct input or state change                        |
| Continuity  | Preserve relationship across layout or route changes        |
| Orientation | Explain where content enters, leaves, expands, or collapses |
| Attention   | Draw limited attention to a new or important change         |
| Narrative   | Support an explicitly approved brand/product story          |

## Rules

- Every animation must have a named role and an end state that remains understandable without motion.
- Interaction feedback begins promptly and never blocks the primary task unnecessarily.
- Animate transform and opacity when possible; measure exceptions.
- Avoid simultaneous competing motion and repeated automatic loops.
- Never use scroll capture, surprise movement, flashing, or motion that prevents access to content.
- Define duration, easing, distance, and sequence through semantic tokens after the motion direction is approved.

## Reduced motion

- Respect the user’s reduced-motion preference.
- Remove non-essential movement and replace essential spatial movement with a low-motion state change.
- Do not auto-play narrative sequences for reduced-motion users.
- Test the complete journey with reduced motion enabled.

## Approval checklist

- The motion role and user benefit are documented.
- Static and reduced-motion behavior remains complete.
- Keyboard and assistive-technology behavior is unchanged or improved.
- Mobile performance and input responsiveness are measured.
- Storybook demonstrates the relevant states.
- Playwright covers behavior that affects a user journey.

## Open decisions

- Brand motion characteristics.
- Motion token values.
- Route-transition policy.
- Whether any approved experience justifies GSAP.
