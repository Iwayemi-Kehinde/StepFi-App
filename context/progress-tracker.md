# Progress Tracker — StepFi-App

Update this file after every completed screen, component, hook, or architectural decision. Progress state must reflect the actual working state — not the intended state.

---

## Current Phase

**Phase 0 — Foundation Setup**

## Current Goal

Build StepFi-App's design system and UI foundation from scratch. Set up Expo Router navigation, Zustand stores, Axios service layer, and WalletConnect v2 integration before building any screens.

---

## Completed

### Project Setup
- `app.json` — name updated to StepFi
- `package.json` — name updated to stepfi-app
- All source files cleaned — zero external project references
- README.md fully written as StepFi-App
- NativeWind configured (tailwind.config.js, metro.config.js)
- Lucide React Native installed as the icon library

---

## In Progress

- None currently. Design system and foundation setup is the next step.

---

## Next Up (In Order)

### Foundation
1. constants/colors.ts — StepFi dark theme color token system
2. constants/config.ts — API base URL, WalletConnect project ID
3. constants/theme.ts — Border radius, spacing, font size constants
4. types/ — api.types.ts, loan.types.ts, wallet.types.ts

### Service & State Layer
5. services/api.ts — Axios instance with JWT interceptor and refresh logic
6. services/auth.service.ts — Auth API calls
7. services/loans.service.ts — Loan API calls
8. services/reputation.service.ts — Reputation API calls
9. stores/auth.store.ts — JWT tokens, wallet address, auth status
10. stores/wallet.store.ts — WalletConnect session and signing
11. stores/user.store.ts — Learner profile and reputation
12. stores/loans.store.ts — Active loans and installment state

### Navigation
13. app/_layout.tsx — Root layout with auth guard
14. app/(auth)/_layout.tsx — Auth stack layout
15. app/(tabs)/_layout.tsx — Bottom tab navigator

### Shared Components (Design System — built from scratch)
16. components/shared/Button.tsx
17. components/shared/Card.tsx
18. components/shared/EmptyState.tsx
19. components/shared/Loader.tsx
20. components/shared/Input.tsx
21. components/shared/ReputationBadge.tsx
22. components/shared/InstallmentRow.tsx
23. components/shared/NotificationsPanel.tsx
24. components/shared/ConfirmTransaction.tsx

### Screens (all redesigned from scratch)
25. app/(auth)/sign-in.tsx
26. app/(auth)/register.tsx
27. app/(tabs)/pay.tsx
28. app/(tabs)/invest.tsx
29. app/(tabs)/settings.tsx
30. app/loan/[id].tsx
31. app/loan/apply.tsx

### Wallet Integration
32. WalletConnect v2 — Lobstr and xBull deep link integration

### Deployment
33. Expo preview build (EAS)
34. Netlify web build

---

## Screen Status

| Screen | Route | Status | Notes |
|---|---|---|---|
| Sign In | /(auth)/sign-in | To redesign | Shell exists, no real logic or design |
| Register | /(auth)/register | To redesign | Shell exists, no real logic or design |
| Pay Dashboard | /(tabs)/pay | To redesign | Shell exists, data hardcoded |
| Invest Dashboard | /(tabs)/invest | To redesign | Shell exists, data hardcoded |
| Settings | /(tabs)/settings | To redesign | Shell exists, local-only toggles |
| Loan Detail | /loan/[id] | Not started | — |
| Loan Apply | /loan/apply | Not started | — |
| Vendor Browse | — | Not started | — |
| Reputation Detail | — | Not started | — |
| Onboarding | — | Not started | — |
| Wallet Setup Guide | — | Not started | — |

---

## Component Status

| Component | Status |
|---|---|
| Button.tsx | Not started |
| Card.tsx | Not started |
| EmptyState.tsx | Not started |
| Loader.tsx | Not started |
| Input.tsx | Not started |
| ReputationBadge.tsx | Not started |
| InstallmentRow.tsx | Not started |
| NotificationsPanel.tsx | Not started |
| ConfirmTransaction.tsx | Not started — critical before any blockchain action |

---

## Open Questions

- Does StepFi-App target Android only, iOS only, or both?
- Which wallets at launch — Lobstr only, or Lobstr + xBull?
- Should amounts display in USD equivalent, local currency, or XLM/USDC only?
- Should sponsor/LP features be in the same app or a separate app?

---

## Architecture Decisions

- Expo Router — file-based routing, simpler auth guards
- Zustand — simpler API, less boilerplate
- Axios — JWT refresh handled globally via interceptors
- WalletConnect v2 — mobile deep link signing for Lobstr and xBull
- Expo SecureStore — encrypted JWT token storage
- Dark theme only — no light mode in v1
- Lucide React Native — single icon library, stroke-based only
- All screens and components built from scratch to StepFi's own design system
- No custodial wallet in v1

---

## Session Notes

- constants/colors.ts is the single source of truth for all colors
- All WalletConnect logic stays in stores/wallet.store.ts
- Every screen must handle loading, error, and empty states
- Use the frontend-design skill for all screen and component work
- Run npx expo start and verify before committing any UI changes
