export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Build system or dependencies
        'ci', // CI/CD changes
        'chore', // Other changes (maintenance)
        'revert', // Revert a commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'api', // Backend API
        'web', // Frontend web app
        'ui', // UI package
        'config', // Configuration packages
        'deps', // Dependencies
        'release', // Release related
        'root', // Root/monorepo level
        'auth', // Authentication
        'db', // Database/Prisma
        'tools', // Tools packages
      ],
    ],
    'scope-empty': [1, 'never'], // Warn if scope is empty
    'subject-case': [0], // Disable case check to allow proper nouns like PostgreSQL
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
