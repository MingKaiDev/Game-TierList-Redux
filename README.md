# Game Tier List Redux

A multi-user web app for logging games, rating them, building shareable tier lists, and writing reviews. Remake of [Game-TierList](https://github.com/MingKaiDev/Game-TierList).

## Stack (free tiers only)

| Layer     | Choice                                           |
| --------- | ------------------------------------------------ |
| Web       | React + Vite (TypeScript) on Cloudflare Pages    |
| API       | Cloudflare Workers + Hono                        |
| Database  | Cloudflare D1 (SQLite)                           |
| Images    | Cloudflare R2 (game art copied once at import)   |
| Auth      | Firebase Auth (ID tokens verified in the Worker) |
| Game data | IGDB, at import time only                        |

## Repo layout

```
apps/
  web/        React + Vite frontend          (arrives in R0 PR 5)
  api/        Worker + Hono API, D1 migrations (arrives in R0 PR 3)
packages/
  shared/     Types and schemas used by both apps
```

## Getting started

Requirements: Node 22+, pnpm 10 (`corepack enable` picks the version from `package.json`).

```sh
pnpm install
pnpm check      # format check, lint, typecheck, tests
```

| Script           | What it does                   |
| ---------------- | ------------------------------ |
| `pnpm check`     | Everything CI runs             |
| `pnpm format`    | Format all files with Prettier |
| `pnpm lint`      | ESLint over the whole repo     |
| `pnpm typecheck` | `tsc` in every package         |
| `pnpm test`      | Vitest in every package        |

## Rollouts

R0 Foundation → R1 Game catalog → R2 Library + Profile → R3 Tier lists → R4 Reviews → R5 Social + public launch → R6 Stats/Wrapped → R7 LLM features.
