// =============================================================================
// 📝 Commitlint Configuration - Conventional Commits
// =============================================================================
// Enforces consistent commit message format across the team.
//
// Format: <type>(<scope>): <subject>
//
// Types:
//   feat     - New feature
//   fix      - Bug fix
//   docs     - Documentation only
//   style    - Code style (formatting, semicolons, etc)
//   refactor - Code refactoring
//   perf     - Performance improvement
//   test     - Adding/fixing tests
//   build    - Build system or dependencies
//   ci       - CI/CD configuration
//   chore    - Other changes (maintenance)
//   revert   - Revert previous commit
//   ui       - UI/UX changes
//
// Scopes (optional):
//   atoms, molecules, organisms, templates
//   hooks, store, lib, utils
//   i18n, middleware, api
//   auth, db, services
//   deps, config
// =============================================================================

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type must be one of these
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation
        "style", // Code style
        "refactor", // Refactoring
        "perf", // Performance
        "test", // Tests
        "build", // Build/deps
        "ci", // CI/CD
        "chore", // Maintenance
        "revert", // Revert
        "ui", // UI/UX changes
      ],
    ],
    // Scope is optional but if provided, must be lowercase
    "scope-case": [2, "always", "kebab-case"],
    // Subject must be lowercase
    "subject-case": [2, "always", "lower-case"],
    // Subject must not end with period
    "subject-full-stop": [2, "never", "."],
    // Subject max length
    "subject-max-length": [2, "always", 72],
    // Header max length (type + scope + subject)
    "header-max-length": [2, "always", 100],
    // Body max line length
    "body-max-line-length": [2, "always", 100],
  },
  prompt: {
    questions: {
      type: {
        description: "Select the type of change you are committing",
        enum: {
          feat: {
            description: "A new feature",
            title: "Features",
            emoji: "✨",
          },
          fix: {
            description: "A bug fix",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          docs: {
            description: "Documentation only changes",
            title: "Documentation",
            emoji: "📚",
          },
          style: {
            description: "Code style changes (formatting, semicolons)",
            title: "Styles",
            emoji: "💎",
          },
          refactor: {
            description: "Code refactoring (no feature/fix)",
            title: "Code Refactoring",
            emoji: "♻️",
          },
          perf: {
            description: "Performance improvements",
            title: "Performance",
            emoji: "⚡",
          },
          test: {
            description: "Adding or fixing tests",
            title: "Tests",
            emoji: "🧪",
          },
          build: {
            description: "Build system or dependencies",
            title: "Builds",
            emoji: "📦",
          },
          ci: {
            description: "CI/CD configuration",
            title: "CI",
            emoji: "🔧",
          },
          chore: {
            description: "Other changes (maintenance)",
            title: "Chores",
            emoji: "🔨",
          },
          revert: {
            description: "Revert previous commit",
            title: "Reverts",
            emoji: "⏪",
          },
          ui: {
            description: "UI/UX changes",
            title: "UI",
            emoji: "🎨",
          },
        },
      },
      scope: {
        description:
          "What is the scope of this change (e.g. atoms, hooks, api)",
      },
      subject: {
        description: "Write a short, imperative description of the change",
      },
      body: {
        description: "Provide a longer description of the change (optional)",
      },
      isBreaking: {
        description: "Are there any breaking changes?",
      },
      breakingBody: {
        description: "Describe the breaking changes",
      },
      isIssueAffected: {
        description: "Does this change affect any open issues?",
      },
      issuesBody: {
        description: 'Add issue references (e.g. "Closes #123")',
      },
    },
  },
};

export default config;
