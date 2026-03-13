# MealRo Design System Foundation

## Context

The Figma work is not complete and the full design system has not been formalized yet. This document defines a working foundation so implementation can proceed without locking the team into brittle one-off styling.

The current direction is based on the existing product, plus the dominant tone visible in the Figma boards:

- muted olive primary
- soft off-white canvas
- rounded surfaces
- restrained contrast with occasional accent emphasis

## Design Principles

1. Calm, not clinical.
   The UI should feel health-oriented and reliable without looking like a hospital dashboard.

2. Structured warmth.
   Use softer neutrals and rounded geometry instead of cold gray utility surfaces.

3. Mobile-first clarity.
   The app is primarily a mobile flow even when rendered on desktop.

4. Progressive emphasis.
   Most surfaces should stay quiet; strong color is reserved for primary action, active state, and success cues.

## Token Foundations

### Color Roles

- `--color-bg`: application canvas
- `--color-bg-elevated`: soft elevated background blocks
- `--color-surface`: primary cards and panels
- `--color-surface-muted`: secondary surfaces and quiet states
- `--color-border`: standard boundary
- `--color-border-strong`: stronger selected/hover boundary
- `--color-text`: primary copy
- `--color-text-muted`: secondary copy
- `--color-text-subtle`: tertiary copy and placeholders
- `--color-primary`: main brand/action color
- `--color-primary-hover`: hover/pressed primary state
- `--color-primary-soft`: selected or supportive background
- `--color-danger`: destructive/error state

### Typography

- Font family: Pretendard Variable
- Headlines: bold or semibold, compact line-height
- Body: regular to medium, readable Korean spacing
- Labels: semibold, smaller size, high clarity

### Shape

- small radius: `12px`
- medium radius: `16px`
- large radius: `20px`
- pill radius: `999px`

Use larger radii for cards and bottom sheets; medium radii for inputs and buttons.

### Elevation

- `shadow-xs`: default cards and controls
- `shadow-sm`: hover or active emphasis
- `shadow-md`: modal or promoted emphasis

Shadows should be soft and wide, never sharp and dramatic.

## Primitive Rules

### Button

- Primary: filled olive
- Secondary: muted surface with border
- Outline: transparent with primary border
- Ghost: transparent with text emphasis only

Primary buttons should be visually strong but not neon.

### Card

- White or dark-tinted surface depending on theme
- soft border
- large radius
- low elevation by default

Cards should be the default way to cluster content.

### Input

- medium radius
- strong enough idle border
- visible focus ring from token layer
- placeholders use tertiary text color

### Selectable Option

- same structural language as cards
- selected state uses `primary-soft` + primary border

This lets onboarding, filters, meal choices, and plan selections feel related.

## Page Templates To Standardize Next

### App Page

- sticky header or contextual header
- centered content column
- stacked sections with `24px` vertical rhythm
- optional fixed action bar at bottom

### Form Page

- clear title block
- one primary task per screen
- grouped fields inside page sections or cards
- persistent CTA only when needed

### Result Page

- hero summary
- 1 to 2 decision blocks
- secondary details below the fold

### Feed/History Grid

- dense item cards
- strong empty state
- consistent filter bar treatment

## Immediate Implementation Guidance

When building from unfinished Figma:

1. use semantic tokens, not raw hex values
2. implement patterns, not just one screen
3. if a Figma decision appears only once, do not treat it as a global rule yet
4. promote something into the design system only after repeated use

## Scope Of This Foundation

This is a working system, not a frozen brand guideline. It should help implementation move faster while leaving room for later visual refinement once the full Figma direction is finalized.
