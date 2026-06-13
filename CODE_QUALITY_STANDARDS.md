# Code Quality Standards: EcoQuest

This document outlines the coding conventions, quality gates, folder structure, and formatting guidelines enforced within the EcoQuest project codebase.

---

## 1. Directory Structure & Architecture

EcoQuest is organized as a decoupled monorepo containing a React 19 SPA frontend and an Express Node.js backend.

```
e:\CFAwareness
├── .github/                  # CI/CD Workflows
├── docs/                     # Architectural decision records and problem analyses
├── frontend/                 # Client React SPA
│   ├── src/
│   │   ├── assets/           # Images, logo, global styling
│   │   ├── components/       # Visual elements (Game, Video, UI elements)
│   │   ├── context/          # State providers (Language, GameState)
│   │   ├── hooks/            # Custom reusable hooks (e.g. useGameState)
│   │   ├── services/         # API integration wrappers (api.ts)
│   │   ├── test/             # Vitest test files
│   │   ├── types/            # Strict TypeScript typings
│   │   └── utils/            # Calculation utilities (scoreUtils.ts)
│   └── index.html
└── backend/                  # Server API
    ├── src/
    │   ├── routes/           # Endpoint routers (analyze, video, tts)
    │   ├── services/         # External integrations (Gemini, Vertex AI, TTS)
    │   ├── test/             # Backend unit and integration tests
    │   └── index.ts          # Server entry point
```

---

## 2. Code Design Rules

### 2.1 Function Length & Complexity
- **Max 30 Lines**: To ensure readability and clean division of concerns, all function bodies must be kept under 30 lines of active logic.
- **Single Responsibility Principle (SRP)**: Each function must perform exactly one conceptual operation. If a function parses an input, evaluates a score, and calls an API, it must be split into three distinct helper functions.

### 2.2 Strict Typing Guidelines
- **Zero `any` Types**: Declaring `any` is strictly prohibited. If typing external libraries is complex, use appropriate union types, generics, or `@ts-expect-error` with a descriptive comment detailing the reason.
- **Strict Mode**: `tsconfig.json` configurations have `strict: true` enabled, forcing null checks and typed return fields.

### 2.3 Comments and Documentation
- **JSDoc/Docstrings**: All exported components, helper methods, functions, and TypeScript interfaces must carry clean JSDoc headers explaining parameters, return values, and expected exceptions.
- **No Commented-out Code**: Dead code blocks must be removed. We rely on Git history for recovery, keeping file bodies clean and active.

---

## 3. Formatting & Linting Pipeline

### 3.1 EditorConfig
We enforce uniform tab styling, line endings (`LF`), and file encodings (`UTF-8`) across all integrated development environments (IDEs) via a root-level `.editorconfig` file.

### 3.2 Prettier
The `.prettierrc` configuration enforces standard JavaScript/TypeScript styling:
- Trailing commas for clean git diffs
- Double-quotes or single-quotes standardized
- Tab width: 2 spaces

### 3.3 ESLint Gateways
- **Frontend ESLint**: Uses modern flat configuration (`eslint.config.js`) supporting React 19 hooks and TypeScript.
- **Backend ESLint**: Uses strict Node rules ensuring unused variables are prefixed with an underscore (`_var`) and return parameters are typed.
- Both projects must pass linter validation (`npm run lint`) with `0` errors to qualify for a pipeline build.
