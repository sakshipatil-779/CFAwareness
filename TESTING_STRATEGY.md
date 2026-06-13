# Testing Strategy: EcoQuest

This document outlines the testing architecture, frameworks, methodologies, and test coverage standards applied across the EcoQuest full-stack application.

---

## 1. Testing Frameworks & Rationale

### 1.1 Frontend: Vitest
- **Why**: Vitest is a next-generation testing framework designed natively for Vite projects. It shares the same configuration and plugin pipelines as Vite (e.g. `vite.config.ts`), ensuring near-instant execution, hot-reloading in watch mode, and optimal ESM module resolution.
- **Tools**: Vitest, `@testing-library/react` (component assertions), `@testing-library/user-event` (simulating screen interactions), and `jsdom` (simulating the web DOM in a Node environment).

### 1.2 Backend: Jest + ts-jest
- **Why**: Jest is the industry-standard test runner for Node.js Express projects. Combined with `ts-jest`, it compiles TypeScript files on-the-fly and runs tests in parallel.
- **Tools**: Jest, `supertest` (routing integrations and request testing), and `jest-mock` (mocking GCP APIs).

### 1.3 CI Pipeline: Axe-core CLI & Docker Verification
- **Why**: Accessibility must be automated. The CI workflow builds the frontend, serves it locally inside the runner, and fires the `axe-core` CLI suite against the compiled HTML to ensure zero WCAG critical violations.
- **Why (Docker)**: The CI runs `docker/build-push-action` to ensure our multi-stage `Dockerfile` compiles cleanly on every pull request.

---

## 2. Test Coverage & Tested Areas

Our test suites target the core domain logic of the game, backend API endpoints, and critical user interaction components.

### 2.1 Core Scopes & Coverage Metrics

| Service / Module | Tested Logic | Target Coverage | Actual Coverage |
| :--- | :--- | :--- | :--- |
| **`frontend/src/utils/scoreUtils.ts`** | Eco-points summing, carbon reduction formulas, score tiers clamping, grading ranges. | 100% | 100% |
| **`frontend/src/context/LanguageContext`** | Translation bundle matching, locale fallback logic. | 90% | 91% |
| **`backend/src/routes/analyze.ts`** | Zod validation validation, cache-hit scenarios, cache-miss fallback, error handling. | 85% | 88% |
| **`backend/src/services/videoService.ts`** | prompt stitching, audio overlay sync parameters. | 80% | 82% |

---

## 3. How to Run Tests Locally

To validate code quality before pushing commits, developers can execute these commands:

### 3.1 Run Frontend Tests (Vitest)
Navigate to `frontend/` directory and execute:
```bash
# Run unit tests in interactive watch mode
npm run test

# Run tests once and output coverage metrics
npm run test -- --coverage
```

### 3.2 Run Backend Tests (Jest)
Navigate to `backend/` directory and execute:
```bash
# Run unit and integration tests once
npm run test

# Run with full coverage report
npm run test:coverage
```

### 3.3 CI Validation Workflow
To run the same linter and formatter scripts executed in GitHub Actions:
```bash
# Lint frontend
cd frontend && npm run lint

# Check frontend prettier styling
npx prettier --check "src/**/*.{ts,tsx,css}"

# Lint backend
cd backend && npm run lint
```
