# @repo/prettier-config

Shared Prettier configuration for the Budget App monorepo.

## 📚 Overview

This package provides consistent code formatting across all packages.

## 🚀 Usage

Add to your package's `package.json`:

```json
{
  "prettier": "@repo/prettier-config"
}
```

Or create a `.prettierrc.js`:

```javascript
module.exports = require('@repo/prettier-config');
```

## 🔧 Configuration

The default configuration includes:

- Semi-colons: enabled
- Single quotes
- Tab width: 2
- Trailing commas: ES5
- Print width: 100
- And more...

## 📁 Structure

```
tools/prettier/
├── index.js          # Prettier configuration
├── package.json
└── tsconfig.json
```

## 📝 Customization

To extend the config in a specific package:

```javascript
// .prettierrc.js
const baseConfig = require('@repo/prettier-config');

module.exports = {
  ...baseConfig,
  // Your overrides
  printWidth: 120,
};
```
