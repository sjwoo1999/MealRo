# 🥗 MealRo (Refactored)
> **"Visual AI Nutrition Coach"** - Scan, Analyze, and Improve your diet with KDRI 2025 precision.

[![Status](https://img.shields.io/badge/Status-Beta_Refactored-emerald?style=for-the-badge)]()
[![Tech](https://img.shields.io/badge/Stack-Next.js_14_PWA-black?style=for-the-badge)]()
[![Offline](https://img.shields.io/badge/Offline-Dexie.js-blue?style=for-the-badge)]()

---

## 📖 Introduction
MealRo is an AI-powered nutrition coaching app designed for the Korean market. It leverages **computer vision** to analyze food instantly and compares it against the **2025 KDRI (Korea Dietary Reference Intakes)** standards.

This project has been extensively refactored to provide a seamless **"Guest-First"** user experience, allowing users to experience the core value (AI Analysis) before account creation.

---

## ✨ Key Features (New)

### 1. Progressive Onboarding Flow 🌊
Instead of a boring sign-up form, we engage users with a value-driven journey:
*   **Step 1: Soft Goal**: Choose your primary objective (Diet, Muscle, Health).
*   **Step 2: Guest Trial**: Experience the camera scanner immediately.
*   **Step 3: Aha Moment**: See a simulated breakdown of "Kimchi Stew" to understand the value.
*   **Result**: Only then do we ask for basic info to personalize the experience.

### 2. Visual Food Analysis 🔍
Precise control over AI results:
*   **Bounding Box Tagging**: Tap on specific foods in your photo to identify them.
*   **Portion Slider**: Adjust intake (0.5x, 1.0x, 1.5x) with a simple slider.
*   **Edit Bottom Sheet**: Refine food names and calories instantly.

### 3. Smart Restore & Offline Mode 💾
*   **Offline-First**: Uses `Dexie.js` (IndexedDB) to store meals locally even without internet.
*   **Smart Restore**: When a guest user finally logs in, their local data is automatically synced to Supabase, ensuring no data loss.

### 4. Advanced IA & Dashboard 📊
*   **5-Tab Navigation**: Home, Insights, Scan (FAB), Feed, MyPage.
*   **Insights Tab**: Weekly/Monthly charts for Calorie & Macro breakdown + Streak tracking.
*   **MyPage Suite**: Detailed management for Profile, KDRI Goals, and Notifications.

---

## 🛠 Tech Stack

### Frontend
*   **Next.js 14** (App Router)
*   **React 18** & TypeScript
*   **TailwindCSS** (Styling)
*   **Lucide React** (Icons)
*   **Framer Motion** (Micro-interactions)

### Data & Logic
*   **Supabase** (PostgreSQL, Auth, Storage)
*   **Dexie.js** (Client-side IndexedDB)
*   **KDRI 2025 Calculator** (Custom Logic)

### AI
*   **GPT-4o Vision** (Food Identification)
*   **Vercel AI SDK** (Streaming Responses)

---

## 🎨 Design Philosophy & UX/UI
This project isn't just about code; it's built on core **UX Laws** to ensure high conversion and retention.

### 1. Progressive Disclosure (Miller’s Law)
*   **Problem**: Asking for weight/height/age upfront causes high drop-off.
*   **Solution**: We defer sign-up until **after** the user experiences value (the "Aha! Moment"). The `Onboarding` flow is broken into small, digestible chunks to reduce cognitive load.

### 2. Fitts’s Law & Thumb Zone
*   **Implementation**: Key actions like the **Scan Button (FAB)** and **Portion Slider** are placed in the bottom 30% of the screen, easily reachable with a thumb.

### 3. Jacob’s Law
*   **Consistency**: The "MyPage" and "Feed" layouts follow standard mental models (similar to Instagram/Toss), reducing the learning curve for new users.

### 4. Peak-End Rule
*   **Delight**: The analysis completion isn't just a spinner; it uses a standardized `AnalysisProgress` (Optimistic UI) to keep users engaged, ending with a satisfying result card.

---

## 📂 Project Structure

```plaintext
src/
├── app/                  # Next.js App Router
│   ├── insights/         # Analysis Dashboard
│   ├── onboarding/       # Progressive Flow
│   ├── mypage/           # Settings & Profile
│   └── ...
├── components/
│   ├── common/           # Atoms (Skeleton, EmptyState, Button)
│   ├── layout/           # BottomNav, Header
│   ├── onboarding/       # ValueProp, SoftQuestion, etc.
│   ├── scan/             # BoundingBox, PortionSlider
│   └── restore/          # RestoreModal
└── lib/
    ├── db.ts             # Dexie.js Configuration
    └── kdri-calculator.ts # Nutrition Engine
```

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📱 PWA Support
MealRo is fully PWA-ready.
*   **Manifest**: `public/manifest.json` included.
*   **Installable**: capable of being added to the home screen on iOS/Android.

---

© 2025 MealRo. All Rights Reserved.
