# Accessibility (a11y) Compliance Report: EcoQuest

This document reviews the accessibility audit details, WCAG 2.1 AA compliance check, testing methodology, and verified accessibility integrations across the EcoQuest platform.

---

## 1. WCAG 2.1 AA Compliance Checklist

We have audited and aligned the application UI against the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA criteria.

| Guideline | Standard | Status | EcoQuest Integration Implementation Details |
| :--- | :--- | :--- | :--- |
| **1.1.1** | Non-text Content | **Passed** | All image assets (e.g. badges, scenario drawings) carry meaningful `alt` attributes. Decorative images use `alt=""` so screen readers ignore them. |
| **1.3.1** | Info and Relationships | **Passed** | All quiz forms are wrapped in `<fieldset>` tags with a corresponding `<legend>` explaining the scenario. Inputs are linked directly to `<label>` elements via `htmlFor`/`id`. |
| **1.4.3** | Contrast (Minimum) | **Passed** | Text elements utilize high-contrast slate-800 on light backgrounds (contrast ratio exceeds 5.2:1, beating the 4.5:1 requirement). Custom rings use vibrant emerald tints. |
| **2.1.1** | Keyboard Navigable | **Passed** | Users can navigate the entire platform (character setup, quiz scenarios, video controls, leaderboard submission) using `Tab`, `Shift+Tab`, `Space`, and `Enter`. |
| **2.4.1** | Bypass Blocks | **Passed** | A visible **"Skip to main content"** link is placed as the first focusable child in `index.html` allowing users to jump past headers. |
| **2.4.3** | Focus Order | **Passed** | Focus follows a logical layout sequence matching the reading direction (top-to-bottom, left-to-right). No focus traps exist in video playbacks. |
| **2.4.7** | Focus Visible | **Passed** | Interactive elements (buttons, inputs) utilize custom focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none`) instead of browser defaults. |
| **4.1.2** | Name, Role, Value | **Passed** | Implicit roles have been cleaned up (e.g. list elements use semantic `ul`/`li` without duplicate ARIA roles). Custom elements carry correct `aria-describedby` links. |

---

## 2. Automated Axe-Core Auditing

Automated audits are integrated into our local validation scripts and GitHub Actions pipeline to prevent accessibility regressions.

### 2.1 Components Audited
The following core interactive components are verified clean of any critical violations:
- **`AIVideoPlayer.tsx`**: Verified that custom audio tracks, play buttons, and volume toggles carry explicit ARIA labels.
- **`ChoicePanel.tsx`**: Checked radio selection button groups, ensuring correct focus rings and association with fieldset legends.
- **`ScoreBar.tsx`**: Ensured structural layout and progress bar roles carry `aria-live="polite"` so screen-readers announce changing carbon scores.
- **`ResultsPage.tsx`**: Monitored the transition from the loading animation to the AI results card. The dynamic summary section is announced using `aria-live="polite"`, and alerts use `role="alert"` for high priority updates.

---

## 3. Keyboard Navigation Guide

For physical testing, we mapped the layout key mappings:
- **`Tab`**: Move forward between character lists, choices, video controls, and input forms.
- **`Shift + Tab`**: Move backward through the focus tree.
- **`Space` / `Enter`**: Activate selections, play video, and submit input fields.
- **`Escape`**: Closes overlays or resets choices if active.
