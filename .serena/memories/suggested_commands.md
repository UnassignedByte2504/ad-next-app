# Suggested Commands (run from repo root)
- Dev server: `bun dev` (Next.js dev on 3000).
- Build / start: `bun build` then `bun start`.
- Lint: `bun lint` (eslint).
- Tests: `bun test` (vitest); focused: `bun test:unit`, `bun test:integration`, `bun test:watch`, `bun test:ui`, `bun test:coverage`.
- E2E: `bun test:e2e` (Playwright); variants `bun test:e2e:ui`, `bun test:e2e:headed`, `bun test:e2e:debug`.
- All critical tests: `bun test:all` (coverage + e2e).
- Storybook: `bun storybook` (dev, port 6006); build static: `bun build-storybook`.
- Package manager/runtime: Bun 1.3.x (uses `bun --bun next ...`).