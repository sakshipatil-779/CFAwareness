# Security Policy: EcoQuest (Carbon Footprint Awareness Platform)

This document details the security posture, threat model, data storage policies, and defense mechanisms implemented across the EcoQuest full-stack application.

---

## 1. Threat Model & Risk Profile

### 1.1 Data Assets
EcoQuest operates under a **Data Minimization** paradigm. We do not store or process sensitive personally identifiable information (PII), payment data, or health records.
- **Leaderboard Records**: Public screen name (user-provided, arbitrary), total eco-score, carbon footprint tier, and timestamp.
- **AI Analytics**: Temporary session choice inputs (commute mode, diet, heating source) sent to Google Gemini Flash.
- **Authentication**: Local/session-based state. External OAuth metadata is managed entirely by Firebase Authentication.

### 1.2 Identified Threats & Mitigation Matrix

| Threat Category | Specific Vector | Business / Technical Impact | Mitigation Status | Implementation Detail |
| :--- | :--- | :--- | :--- | :--- |
| **API Denial of Service (DDoS)** | Quota exhaustion on Vertex AI / Gemini / Text-to-Speech endpoints. | Financial loss from api fees; service downtime. | **Mitigated** | Multi-tiered rate limiters via `express-rate-limit` (Global: 200/15min, AI: 10/min, Veo: 2/min). |
| **Input Injection / XSS** | Attacker injects malicious scripts into leaderboard usernames or choices. | Execution of script in other users' browsers. | **Mitigated** | Zod strict schema parsing in backend endpoints; React automatic text escaping in components; JSX avoids `dangerouslySetInnerHTML`. |
| **Data Scraping / Abuse** | Script harvesting generated AI videos or TTS narration audio assets. | Resource abuse and elevated Cloud Storage egress fees. | **Mitigated** | Non-predictable UUID names generated for media assets; short-lived GCS Signed URLs; strict CORS origin mapping. |
| **Man-in-the-Middle (MitM)** | Interception of API tokens or payload parameters. | Session hijacking or data manipulation. | **Mitigated** | Strict-Transport-Security (HSTS) headers enforced by Helmet. |
| **Direct API Access / CORS Bypass** | Rogue clients calling the API outside the web frontend. | Access to backend utilities bypassing rate limits. | **Mitigated** | Strict CORS configurations restricted to the production domain, plus Helmet's Content Security Policy. |

---

## 2. Security Controls & System Architecture

### 2.1 Network Security & Traffic Control
- **Cross-Origin Resource Sharing (CORS)**: Restricted strictly to the designated frontend domain. Unrecognized origins are blocked at the middleware layer.
- **Rate Limiting**: Enforced dynamically per IP address on the API server. We apply separate rate limit buckets for generic queries, AI analytics, and heavy media generations (Vertex AI Veo 3.1).

### 2.2 Endpoint Protection & Input Validation
- All backend routes utilize `zod` schema objects to inspect incoming JSON request payloads.
- Any request containing unexpected properties, type mismatches, or malformed data is rejected immediately at the router boundary with a `400 Bad Request` before invoking any domain logic.

### 2.3 Response Header Hardening
The application enforces strict security headers via Express `helmet` middleware:
- **Content-Security-Policy (CSP)**: Limits scripts, images, connect requests, and media sources to trusted CDNs (Google AI/GCS/Firebase) and self.
- **X-Frame-Options**: Enforces `DENY` to fully prevent clickjacking.
- **X-Content-Type-Options**: Set to `nosniff` to prevent MIME-type sniffing.
- **Strict-Transport-Security (HSTS)**: Instructs browsers to communicate exclusively over HTTPS.
- **Referrer-Policy**: Set to `strict-origin-when-cross-origin` to protect user navigation paths.

---

## 3. Cryptographic Controls & Secrets Management

- **No Hardcoded Secrets**: Secrets (like API keys, service accounts, and buckets) are strictly injected at runtime via process environment variables (`process.env`).
- **Development Safeguards**: `.env` is excluded in `.gitignore`. A `.env.example` file is provided with empty/placeholder keys to prevent leakage.
- **Cloud Storage Security**: Narrations and video files are cached in private buckets. Access is granted through short-lived Google Cloud Signed URLs or read-only service accounts using IAM policies with minimal permissions (Least Privilege Principle).

---

## 4. Reporting Vulnerabilities

If you discover a security vulnerability within EcoQuest, please do not open a public GitHub issue. Instead, report it directly to the team:
- **Email**: security-alert@ecoquest-awareness.org
- **PGP Key**: (Available upon request)

We will acknowledge reports within 48 hours and provide a status update on remediation within 7 days.
