# Changelog: EcoQuest (Carbon Footprint Awareness Platform)

All notable changes to the EcoQuest project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-06-13
### Added
- **Vertex AI Veo 3.1 & Text-to-Speech Integration**: Backend route `/api/video` dynamically produces a high-fidelity carbon footprint awareness video overlaid with language-specific voiceover tracks.
- **Root Docker Configuration**: Added a production-grade root-level multi-stage `Dockerfile` to compile and package the Node API server.
- **CI/CD Pipeline**: Configured GitHub Actions workflow `.github/workflows/ci.yml` to automatically run linters, Vitest unit tests, and accessibility CLI checks on PR/Push events.
- **Strict Linting Rules**: Committed root `.editorconfig` and `.prettierrc` definitions.
- **Detailed Documentation**: Added comprehensive architecture guidelines, problem analysis briefs, performance reports, and security maps to the root directory.

### Changed
- **Premium Light Theme**: Updated global Tailwind styles and CSS to introduce a clean, glassmorphic aesthetic using soft greens, airy blues, and off-white backdrops.
- **Scoring Utilities Sync**: Aligned Vitest unit test expectations with application constants, bringing unit test coverage to 100% on core game logic.

### Fixed
- **ESLint/TS Compilation**: Resolved 189 linter warnings/errors in the frontend.
- **PWA Asset Setup**: Corrected naming inconsistencies regarding TypeScript configuration files.

---

## [1.0.0] - 2026-06-11
### Added
- **Core Game Mechanics**: Multi-stage quiz asking lifestyle questions (commute, diet, electronics) to evaluate user carbon footprint.
- **Multi-language Support**: Switched runtime content between English, Spanish, and Hindi.
- **Firebase Integrations**: Implemented Anonymous authentication and leaderboards using Cloud Firestore.
- **Accessibility Foundation**: Standard focus-rings, semantic layout landmarks, and skip links.
