# Working on Game Tier List Redux

## Rules

- Free tiers only. No always-on servers, no paid services.
- IGDB is called only at import time, never on a page view.
- Core data model stays separate: Game, User, LibraryEntry, Review, TierList. Never merge them into one document.
- Each rollout goes spec, then plan, then small PRs. Nothing merges without green CI and a reviewed preview deploy.
- Keep features simple; cut anything that wouldn't be used weekly.

## Visual design

- Theme: Gallery Placard (museum wall label). White space, hairline rules, Instrument Serif + DM Sans + DM Mono, one vermilion accent, square corners, no shadows.
- Use the design tokens only; no raw hex values in components. No purple-and-black, no generic dashboard look.

## Code conventions

- TypeScript strict everywhere. Shared types and schemas live in `packages/shared`.
- `pnpm check` must pass before a PR is opened.
- LF line endings (enforced by `.gitattributes`).
- Secrets go in `.dev.vars` locally and in Cloudflare/GitHub secrets, never in the repo.

## Decisions

Full decision log, R0 plan and theme tokens live in the claude.ai project "Game Tier List" (`claude/remake-decisions.md`, `claude/r0-plan.md`, `claude/theme-gallery-placard.md`).
