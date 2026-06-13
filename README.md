# EcoQuest

[![EcoQuest CI](https://github.com/ecoquest-org/ecoquest/actions/workflows/ci.yml/badge.svg)](https://github.com/ecoquest-org/ecoquest/actions/workflows/ci.yml)
[![Test Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)](https://github.com/ecoquest-org/ecoquest)
[![Accessibility Level](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue.svg)](https://github.com/ecoquest-org/ecoquest)
[![Deployment Status](https://img.shields.io/badge/Deployment-Cloud%20Run-orange.svg)](https://github.com/ecoquest-org/ecoquest)

EcoQuest: An interactive, AI-powered carbon footprint game designed to inspire sustainable lifestyle changes.

## 3. Live Demo
[Access Deployed Live Demo](https://ecoquest-cfa.web.app)

---

## 4. Problem Statement

> "Carbon Footprint Awareness: Individuals lack concrete, immediate visual understanding of how daily micro-decisions (diet, commuting, energy) translate to global carbon footprints, leading to educational fatigue and inaction."

---

## 5. Solution Overview

EcoQuest is an interactive, gamified simulation that allows users to roleplay typical daily decisions and witness their ecological impact in real-time. By leveraging Google Vertex AI (Veo 3.1 & Gemini Flash) and the Cloud Text-to-Speech API, the platform dynamically generates personalized animated videos and language-specific audio narration illustrating the environmental future shaped by their choices. Users are then presented with three actionable tips for immediate, real-world reduction and can register their scores on a global live leaderboard.

---

## 6. Architecture Diagram

```
+-------------------------------------------------------------------------+
|                              Browser Client                             |
|                    React 19 SPA (Tailwind + Axe-a11y)                   |
+-------------------+---------------------------------+-------------------+
                    |                                 |
                    | Secure REST Requests            | Real-time Sync
                    v                                 v
+-------------------+-------------------+   +---------+-------------------+
|             API Server (Node)         |   |          Firebase           |
|  - Rate Limiting (express-rate-limit) |   |  - Anonymous Auth           |
|  - Security Headers (Helmet CSP)      |   |  - Cloud Firestore          |
|  - In-Memory Caching (LRU cache)      |   |    (Global Leaderboard)     |
+-------------------+-------------------+   +-----------------------------+
                    |
                    | GCP SDK Integrations
                    v
+-------------------+-------------------+
|                GCP Services           |
|  - Gemini (Custom script generation)  |
|  - Vertex AI (Veo 3.1 Video Synthesis)|
|  - TTS API (Narration Synthesis)     |
|  - Cloud Storage (Secure Signed URLs) |
+---------------------------------------+
```

---

## 7. Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS | High-performance SPA compilation, responsive glassmorphic UI. |
| **Backend** | Node.js, Express, TypeScript | Non-blocking CPU I/O, lightweight middleware proxy. |
| **Database & Auth**| Cloud Firestore, Firebase Auth | Real-time score sync, zero-friction anonymous authentication. |
| **Generative AI** | Vertex AI Veo 3.1, Gemini Flash | State-of-the-art video synthesis, low-latency script compilation. |
| **Voice & Speech** | Cloud Text-to-Speech, Translate | Native language audio narrations (English, Spanish, Hindi). |
| **Infrastructure** | Multi-stage Docker, Cloud Run | Minimal container footprint, elastic scaling. |
| **Testing Suite** | Vitest, Jest, Supertest, Axe-CLI | Automated accessibility and unit coverage on every build. |

---

## 8. Key Features

- **Dynamic Lifestyle Quiz**: Simulates morning commute, lunch menu, and household energy choices, feeding dynamic visual meters (Eco-points and Carbon Saved).
- **Custom Generative AI Video**: Synthesizes a cinematic 5-second video (using Google Veo 3.1) visually depicting the environmental outcome of the user's choices.
- **Synced Audio narration**: Google TTS overlays language-specific audio voiceovers on top of the Veo timeline, adjustable by users in real-time.
- **Local Caching Layer**: Node `lru-cache` prevents hitting Gemini API twice for identical game answers, optimizing latency to under 5ms.
- **Global Leaderboard**: Secure Firestore read/write rules present global rankings immediately after score submission.

---

## 9. Quick Start

Ensure you have [Node.js v20+](https://nodejs.org) and [Git](https://git-scm.com) installed.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ecoquest-org/ecoquest.git && cd ecoquest
   ```
2. **Initialize environments**:
   ```bash
   cp .env.example backend/.env && cp .env.example frontend/.env
   ```
   *(Ensure to configure credentials in `backend/.env` and Firebase settings in `frontend/.env`)*
3. **Install and build Backend**:
   ```bash
   cd backend && npm install && npm run build
   ```
4. **Install and build Frontend**:
   ```bash
   cd ../frontend && npm install && npm run build
   ```
5. **Start Development Servers**:
   Run the backend and frontend servers in separate terminal panes:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

---

## 10. Running Tests

Run all unit and integration tests with a single command from the respective directories:

- **Frontend tests** (Vitest):
  ```bash
  cd frontend && npm run test
  ```
- **Backend tests** (Jest):
  ```bash
  cd backend && npm run test
  ```

---

## 11. Deployment Instructions

### 11.1 Deploying Backend to Google Cloud Run
1. Build and tag the Docker image using Google Cloud Build:
   ```bash
   gcloud builds submit --tag gcr.io/your-project-id/ecoquest-backend
   ```
2. Deploy the container:
   ```bash
   gcloud run deploy ecoquest-backend \
     --image gcr.io/your-project-id/ecoquest-backend \
     --platform managed \
     --allow-unauthenticated \
     --region us-central1
   ```

### 11.2 Deploying Frontend to Firebase Hosting
1. Build the production assets:
   ```bash
   cd frontend && npm run build
   ```
2. Deploy static files:
   ```bash
   firebase deploy --only hosting
   ```

---

## 12. Security & Privacy

- **Data Privacy**: No tracking PII is requested. The leaderboard stores usernames as transient aliases.
- **Protected Operations**: Endpoints use rate limiters (`express-rate-limit`) to prevent Vertex AI resource abuse. All payloads are sanitized via `Zod` schemas before processing.
- **Response Hardening**: `Helmet` is configured with strict Content Security Policies restricting executable scripts to self and trusted Google Cloud zones.

---

## 13. Accessibility & WCAG Compliance

- **WCAG 2.1 Level AA**: The application UI is strictly compliant with standard contrast rules (minimum text contrast 4.5:1), custom visible focus outline rings, and keyboard-logical tab indices.
- **Screen Reader Support**: Complex metrics are accompanied by hidden text alerts (`role="alert"`), and dynamic changes are wrapped in `aria-live="polite"` elements.
- **Automated Audits**: Accessible interfaces are verified using `axe-core` in CI/CD pipeline runs.
