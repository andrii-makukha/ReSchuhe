# ReSchuhe UX Principles

Status: Experience baseline confirmed; journeys pending product definition | Last reviewed: 2026-08-07

## Experience goal

The Product Experience should help its defined audience reach a defined outcome with clear orientation, trustworthy information, accessible controls, and predictable feedback. The audience and outcome remain open in `docs/product/PRODUCT.md`.

## Principles

1. **Make the next meaningful action clear.** Hierarchy follows the user’s goal, not internal organization.
2. **Explain before asking.** Users should understand value, consequences, and required information before committing.
3. **Preserve context.** Navigation, state changes, and errors should not make users reconstruct where they are.
4. **Design every state.** Loading, empty, partial, offline/error, success, disabled, and permission states are part of the experience.
5. **Use progressive disclosure.** Show essential information first and reveal complexity when the task requires it.
6. **Earn trust.** Claims, pricing, availability, policies, and system status must be accurate and understandable.
7. **Include users by default.** Keyboard, touch, assistive technology, zoom, reduced motion, and clear language are baseline inputs.
8. **Protect user effort.** Preserve valid input, prevent avoidable errors, and make recovery specific.

## Journey definition template

Do not design a production journey until these fields are answered:

- primary user and context;
- user goal and triggering need;
- entry point;
- information needed to decide;
- primary action and success state;
- likely hesitation or failure;
- data requested and why;
- recovery path;
- measurement of successful completion.

## Interaction requirements

- Links navigate; buttons perform actions.
- Controls expose a clear label and current state.
- Focus order follows the visual and logical flow.
- Destructive or irreversible actions communicate impact and require proportionate confirmation.
- Validation occurs close to the input, retains entered data, and explains how to recover.
- Async actions expose progress and prevent accidental duplicate submission.
- Empty states explain why the state exists and offer a relevant next action when one exists.
- Error messages describe the problem without exposing sensitive system detail.

## Content and media behavior

- Critical meaning must remain available without decorative media.
- Images need an explicit role and appropriate alternative text or deliberate empty alternative text when decorative.
- Text must tolerate localization expansion and real content lengths.
- Motion must not be required to understand navigation, status, or completion.

## Research and validation

Once the primary audience is confirmed, validate terminology, information hierarchy, and the main journey with representative users before expanding secondary journeys. Combine observation with accessibility and browser checks; analytics alone cannot explain user intent.

## Open decisions

- Primary and secondary audiences.
- Main journey and conversion.
- Information architecture and navigation model.
- Supported languages, locales, and content reading level.
- Device/context priorities derived from actual audience needs.
- Research participants, method, and success criteria.
