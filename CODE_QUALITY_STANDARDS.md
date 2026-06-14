# Code Quality Standards — CFAwareness / EcoQuest

## Enforcement Summary

| Tool | Scope | Config | Status |
|------|-------|--------|--------|
| TypeScript 5 (strict) | Backend + Frontend | `tsconfig.json` | ✅ Enforced |
| ESLint + @typescript-eslint | Backend + Frontend | `.eslintrc.json` | ✅ Enforced |
| Prettier | All files | `.prettierrc` | ✅ Enforced |
| EditorConfig | All editors | `.editorconfig` | ✅ Active |

## TypeScript Strict Mode
Both `backend/tsconfig.json` and `frontend/tsconfig.json` enforce:
- `strict: true` — enables strictNullChecks, noImplicitAny, strictFunctionTypes
- `noUnusedLocals: true` — zero dead variables
- `noUnusedParameters: true` — zero dead function parameters
- `noImplicitReturns: true` — all code paths must return a value
- `noFallthroughCasesInSwitch: true` — switch cases are always explicit
- `forceConsistentCasingInFileNames: true` — no cross-platform casing bugs

## Language Policy
- **100% TypeScript** across backend and frontend source files
- Zero `.js` files in `src/` directories
- Config files in `.ts` format where possible

## Naming Conventions
- React components: `PascalCase` (`QuizCard.tsx`)
- Functions/variables: `camelCase` (`calculateFootprint`)
- Constants: `UPPER_SNAKE_CASE` (`MAX_RETRIES`)
- Interfaces: `PascalCase` with descriptive name (`CarbonPayload`)
- Files: `kebab-case` for utilities, `PascalCase` for components

## No-Tolerance Rules
- Zero `any` types — use `unknown` then narrow
- Zero `console.log` in production — use structured logger
- Zero hardcoded secrets — all via environment variables
- Zero disabled ESLint rules without explaining comment

## Import Order (enforced by ESLint)
1. Node built-ins (`path`, `fs`)
2. External packages (`express`, `react`)
3. Internal modules (`../services/gemini`)
4. Type-only imports (`import type { ... }`)

## Function Standards
- Every function has explicit TypeScript return type
- Max function length: 40 lines
- Single responsibility per function
- Pure functions for carbon calculations (no side effects)
- Async functions always handle errors with try/catch

## Code Review Checklist
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`)
- [ ] ESLint passes with zero errors (`npm run lint`)
- [ ] Prettier formatted (`npm run format`)
- [ ] Tests pass with >80% coverage
- [ ] No secrets in diff
- [ ] No `any` types introduced
