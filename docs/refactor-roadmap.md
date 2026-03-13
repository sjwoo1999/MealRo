# MealRo Refactor Roadmap

## Why This Refactor Exists

The project already has useful product direction, but the implementation has grown as a mix of prototype code, production code, and partial redesign work. That makes page-by-page UI work expensive because each new screen has to solve styling, layout, and state decisions again.

This roadmap defines the order for refactoring so the remaining Figma screens can be implemented on a stable base instead of as one-off pages.

## Current Problems

1. Styling has no single source of truth.
   Multiple pages and components hard-code greens, grays, borders, radii, and shadows directly in JSX.

2. Global styling is split and partially dead.
   `src/styles/globals.css` is loaded, while `src/app/globals.css` contains animation utilities that were not actually in the active stylesheet.

3. Shared UI primitives are too thin.
   `Button`, `Card`, `Input`, and `Select` exist, but most pages still bypass them with inline Tailwind classes.

4. Product state is split by feature rather than ownership.
   `AuthContext` and `OnboardingContext` both participate in user identity/profile behavior, which makes future account migration and personalization work harder.

5. API surface has overlap and legacy paths.
   Food analysis currently has more than one route and more than one analyzer implementation, which will make maintenance and debugging harder.

6. Mock behavior is mixed into live pages.
   Nearby restaurants, insights, and parts of dashboard behavior still contain MVP fallback logic inside production UI.

## Refactor Goal

Create a system where:

- visual decisions come from tokens and shared primitives
- page shells and layout patterns are reusable
- feature code is grouped by domain
- API routes have one clear owner per workflow
- mock states are explicit and removable

## Target Architecture

### 1. Design System Layer

Use shared tokens and primitives as the first dependency for all page work.

- Tokens: color, spacing, radius, shadow, type scale, motion
- Primitives: `Button`, `Input`, `Select`, `Card`, `Badge`, `SectionHeader`, `PageShell`
- Page patterns: auth page, form page, feed/detail page, dashboard page, scan result page

### 2. Feature Layer

Organize feature code by domain rather than by UI type alone.

- `src/features/auth`
- `src/features/onboarding`
- `src/features/scan`
- `src/features/planner`
- `src/features/history`
- `src/features/profile`

Each feature should own:

- API client helpers
- presentational components
- feature hooks
- feature-specific types

### 3. App Layer

App routes should become thin composition files.

- route file loads data or feature entry component
- route file does not carry large styling decisions
- route file does not carry fallback mock logic

## Recommended Execution Order

### Phase 0: Foundation

- Consolidate active global styles into one stylesheet
- Introduce semantic design tokens
- Move shared primitives to token-driven styling
- Define page shell and common layout rules

Status: started in this pass

### Phase 1: Shell and Navigation

- Refactor `Header`, bottom navigation, footer, container widths
- Define canonical mobile content width and desktop expansion rules
- Remove repeated `max-w-* + px-* + py-*` page wrappers

### Phase 2: High-Leverage Flows

- Onboarding
- Auth
- Scan
- Planner

These are the flows most likely to receive design iteration from Figma, so they should be cleaned before static pages.

### Phase 3: Data and Identity Cleanup

- unify anonymous ID naming
- decide one profile owner: auth/session or onboarding profile service
- collapse duplicate food-analysis endpoints
- isolate offline restore logic behind a service boundary

### Phase 4: Secondary Screens

- Insights
- Feed
- MyPage subtree
- Nearby
- Static pages

### Phase 5: QA Hardening

- visual regression sweep
- interaction states
- empty/loading/error states
- remove temporary mock UI

## Rules For New Work

1. New page work should not introduce new hard-coded brand colors unless they are added to the token layer first.
2. Repeated card, chip, tab, and button styles should be extracted by the second usage.
3. Route files should stay small; move logic to feature components or hooks.
4. Mock data must be marked clearly and live behind feature flags or dedicated mock helpers.
5. Figma implementation work should start from primitives and templates, not from ad-hoc page duplication.

## What Was Done In This Pass

- active global stylesheet became the single source for animation and token foundations
- semantic UI tokens were introduced
- shared primitives were moved toward token-based styling
- documentation for the broader refactor direction was added
