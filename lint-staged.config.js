// =============================================================================
// 🎯 Lint-Staged Configuration
// =============================================================================
// Runs linters on staged files before commit.
// Only checks files that are about to be committed, not the entire codebase.
// =============================================================================

const config = {
  // TypeScript/JavaScript files - lint and format
  "*.{ts,tsx,js,jsx}": ["eslint --fix --max-warnings=0", "prettier --write"],

  // JSON files - format only
  "*.json": ["prettier --write"],

  // Markdown files - format
  "*.md": ["prettier --write"],

  // CSS/SCSS files - format
  "*.{css,scss}": ["prettier --write"],

  // YAML files - format
  "*.{yml,yaml}": ["prettier --write"],
};

export default config;
