# User Journey: EcoQuest Experience

This document maps the user journey through the EcoQuest platform, detailing each step, user actions, accessibility points, and expected technical outcomes.

---

## The 5-Step Core User Journey

```mermaid
graph LR
    Step1(1. Select Language & Role) --> Step2(2. Make Lifestyle Choices)
    Step2 --> Step3(3. Watch AI Custom Video)
    Step3 --> Step4(4. Get Actionable Tips)
    Step4 --> Step5(5. Submit to Leaderboard)
```

---

### Step 1: Language & Persona Selection
*   **User Action**: The user lands on the EcoQuest page. They are presented with a clean, premium light-themed UI. They select their preferred language (English, Spanish, Hindi, etc.) and choose a character persona (e.g. *Elena the Student*, *Marcus the Office Worker*).
*   **A11y Touchpoints**: Logical keyboard focus ordering (`tabindex`), clean visual rings, and screen-readers announcing role options.
*   **Expected Outcome**: The React context switches translation bundles instantly. The game state initializes with base metrics (Eco-points and Carbon Footprint meters) specific to the chosen persona.

### Step 2: The Lifestyle Decisions
*   **User Action**: The user progresses through three scenario cards:
    1.  **Morning Commute**: e.g., Choosing between a single-occupancy petrol vehicle, electric vehicle, or electric bicycle.
    2.  **Lunch Choice**: e.g., Selecting a locally-sourced vegetarian meal vs. an imported beef steak.
    3.  **Evening Routine**: e.g., Leaving electronic appliances on standby vs. powering off grid zones.
*   **A11y Touchpoints**: All options are grouped within `<fieldset>` tags with descriptive `<legend>` text. Custom radios are keyboard selectable.
*   **Expected Outcome**: With each selection, the score bars update dynamically, accompanied by `aria-live` announcements informing visually impaired users of their changing score tiers.

### Step 3: Generative AI Video Playback
*   **User Action**: Upon submitting the quiz, the frontend makes an API request to the backend. The backend utilizes **Google Gemini** to analyze the profile, writes a script, synthesizes a voiceover via **Text-to-Speech API**, and triggers a cinematic **Vertex AI Veo 3.1** video. The user watches the synchronized results.
*   **A11y Touchpoints**: Play/Pause controls have visible labels. The language dropdown lets users switch audio voiceover tracks on-the-fly (e.g., from Hindi to Spanish) without re-buffering the video stream.
*   **Expected Outcome**: A customized educational video demonstrating the real-world impact of their choices plays smoothly.

### Step 4: Actionable Takeaways
*   **User Action**: The results card exposes a personalized breakdown of the user's score, highlighting their weakest category and showing 3 concrete, actionable tips (e.g., "Replacing 2 car commutes a week with your e-bike will save 300kg CO2/year").
*   **Expected Outcome**: The user leaves the platform with clear steps to reduce their real-life carbon footprint, fulfilling the core environmental education goal.

### Step 5: Leaderboard Submission
*   **User Action**: The user inputs a nickname and clicks "Submit Score".
*   **Expected Outcome**: An anonymous Firebase user is created under the hood, and the score is logged in Cloud Firestore. The leaderboard updates in real-time to show where the user ranks compared to global peers.
