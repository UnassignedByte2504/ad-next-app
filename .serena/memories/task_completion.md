# Task Completion Checklist
- Run validations: `bun lint`, `bun test` (or targeted suites), and `bun build` if changes affect build/runtime.
- Ensure components follow Atomic Design requirements: stories for all atoms+, tests for molecules/organisms/templates (update snapshots/fixtures), maintain coverage targets.
- Verify theming: all colors/typography/spacing from `@/app/ui/theme`; no hardcoded values; light-mode friendly.
- Confirm i18n compliance: user-facing strings routed through next-intl with entries in `messages/{locale}` and namespace registered in `i18n/messages.ts`.
- State & data: keep RSC by default; client components only when necessary; Zustand selectors granular; logging via `logger` (no console.log).
- Accessibility & responsiveness: ARIA labels, keyboard interactions, responsive layout checks.
- Prepare commit (if requested): follow conventional commits `<type>(<scope>): <subject>`; avoid committing secrets or env files.
- Summarize changes and tests run when reporting back.