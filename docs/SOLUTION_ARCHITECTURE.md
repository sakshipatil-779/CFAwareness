# Solution Architecture & ADRs: EcoQuest

This document details the high-level architecture, technology decisions, design trade-offs, and Architecture Decision Records (ADRs) for the EcoQuest platform.

---

## 1. System Topology

EcoQuest is built as a decoupled Client-Server architecture utilizing Google Cloud and Firebase.

```
       +--------------------------------------------+
       |             Browser Client                 |
       |      React 19 SPA (Tailwind + PWA)         |
       +-----+--------------------------------+------+
             |                                |
             | REST Requests                  | Reads / Writes
             v                                v
+------------+-------------+        +---------+---------+
|     API Server (Node)     |        |     Firebase      |
|  - Rate Limit & Helmet   |        |  - Auth (Anon)    |
|  - Zod Payload Parsing   |        |  - Firestore DB   |
|  - LRU Caching Layer     |        +-------------------+
+------+-------------+-----+
       |             |
       | SDK Calls   | TTS API
       v             v
+------+-------------+-----+
|   Vertex AI (Veo 3.1)    |
|   Google Gemini Flash    |
+--------------------------+
```

---

## 2. Architectural Decision Records (ADRs)

### ADR-001: Vite React 19 + Tailwind CSS for Frontend
- **Context**: The hackathon project demands an ultra-responsive, accessible, and premium visual experience with glassmorphism.
- **Decision**: Adopt React 19 bootstrapped with Vite, using Tailwind CSS for fluid, utility-driven UI management.
- **Rationale**: Vite provides near-instant Hot Module Replacement (HMR) and optimized rollup production bundles. Tailwind CSS enables fast design iterations using utility classes while maintaining accessibility utilities (e.g. `focus-visible:ring`).

### ADR-002: Node.js Express + Strict TypeScript for Backend
- **Context**: Need a robust middleware layer to interface with GCP APIs, handle rate limiting, cache AI results, and validate requests.
- **Decision**: Node.js utilizing Express and compiled with strict TypeScript (`tsconfig`).
- **Rationale**: Single-language stack (TypeScript frontend and backend) reduces developer friction. Node's non-blocking I/O is ideal for proxying Vertex AI requests and processing audio buffers.

### ADR-003: GCP Vertex AI (Veo 3.1 & Gemini Flash) + Google Cloud Storage
- **Context**: The platform generates custom situational videos illustrating the environmental consequences of user choices, accompanied by spoken audio scripts.
- **Decision**: Google Cloud Vertex AI SDK for Veo 3.1 video generation, Gemini Flash for scenario text summary, and GCS for storing audio narrations and videos.
- **Rationale**: Veo 3.1 provides state-of-the-art cinematic video synthesis. Gemini Flash acts as a low-cost, fast parser to write the custom scripts. Private GCS Buckets paired with Signed URLs prevent resource direct-linking.

### ADR-004: Firebase Client-Side Auth and Firestore
- **Context**: Leaderboard score persistence requires serverless storage with minimal latency, and anonymous user authentication is needed to avoid sign-up friction.
- **Decision**: Firebase Client SDK for Anonymous Authentication and Cloud Firestore for the global leaderboard.
- **Rationale**: Firestore's SDK enables instant real-time data sync. Running this client-side bypasses backend load, leaving the Express server dedicated to CPU-heavy video and TTS stitching.

---

## 3. Performance & Optimization Layer

To achieve sub-second load times and minimize cloud infrastructure costs:
1. **LRU Caching**: We utilize `lru-cache` inside the backend. If a user repeats the exact same choices in the same language, the server instantly returns the cached Gemini summary and assets, avoiding redundant API costs and saving ~3-4 seconds.
2. **React.memo**: Expensive game and leaderboard panels are memoized to prevent re-renders when global language translation hooks trigger.
3. **PWA Assets**: Service workers pre-cache static icons, Google Fonts, and core styles.
