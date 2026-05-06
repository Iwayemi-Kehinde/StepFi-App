# Dependencies Audit — StepFi-App

Last audited: 2026-05-05
Auditor: maintainer
Next scheduled audit: 2026-08-05 (quarterly)

Run audit: `npm audit`
Run list: `npm list --depth=0`

---

## Audit Summary

| Total | Critical | High | Moderate | Low |
|---|---|---|---|---|
| 5 vulnerabilities | 0 | 0 | 5 | 0 |

**Status: Acceptable ✅**
All remaining vulnerabilities are transitive through Expo and cannot be resolved without downgrading Expo to a breaking version (49.x). These are accepted as low-risk for a development-stage mobile app. Must be resolved before mainnet.

---

## Remaining Vulnerabilities 🟡 (Moderate — Not Actionable Without Breaking Expo)

### postcss (<8.5.10) via @expo/metro-config
- **Severity:** Moderate
- **Issue:** XSS via unescaped `</style>` in CSS Stringify output
- **Via:** `expo` → `@expo/cli` → `@expo/metro-config` → `postcss`
- **Fix:** `npm audit fix --force` → downgrades Expo to 49.x (breaking change — not acceptable)
- **Action:** Monitor Expo releases for an update that bumps postcss. Not user-facing risk (build tool only).

### brace-expansion (<1.1.13)
- **Severity:** Moderate
- **Issue:** Zero-step sequence causes process hang and memory exhaustion
- **Via:** Multiple Expo transitive dependencies
- **Fix:** `npm audit fix` — run on next dependency update cycle
- **Action:** Run `npm audit fix` — safe, non-breaking.

---

## Production Dependencies

| Package | Version | Purpose | Status |
|---|---|---|---|
| `expo` | ^54.0.0 | Expo managed workflow platform | ✅ Safe (transitive vulns only) |
| `expo-router` | ^6.0.21 | File-based navigation | ✅ Safe |
| `expo-status-bar` | ~3.0.8 | Status bar management | ✅ Safe |
| `expo-blur` | ~15.0.8 | Blur effects | ✅ Safe |
| `expo-image-picker` | ^17.0.10 | Camera/gallery access | ✅ Safe |
| `react` | 19.1.0 | React core | ✅ Safe |
| `react-native` | 0.81.5 | React Native framework | ✅ Safe |
| `react-native-reanimated` | ~4.1.1 | Animations | ✅ Safe |
| `react-native-safe-area-context` | ~5.6.0 | Safe area handling | ✅ Safe |
| `react-native-svg` | ^15.15.1 | SVG rendering | ✅ Safe |
| `react-native-web` | ^0.21.0 | Web support for Expo | ✅ Safe |
| `react-native-keyboard-aware-scroll-view` | ^0.9.5 | Keyboard handling | ✅ Safe |
| `react-native-worklets` | 0.5.1 | Reanimated worklets | ✅ Safe |
| `react-dom` | 19.1.0 | React DOM (web support) | ✅ Safe |
| `nativewind` | latest | Tailwind CSS for React Native | ✅ Safe |
| `tailwindcss` | ^3.4.0 | Tailwind CSS engine | ✅ Safe |
| `lucide-react-native` | ^0.562.0 | Icon library (stroke-based) | ✅ Safe |
| `@react-navigation/native` | ^7.1.27 | Navigation primitives | ✅ Safe |
| `@expo/vector-icons` | ^15.0.3 | Expo icon sets (not used — Lucide preferred) | ⚠️ Unused — remove when cleaning up |

---

## Dev Dependencies

| Package | Version | Purpose | Status |
|---|---|---|---|
| `typescript` | ~5.9.2 | TypeScript compiler | ✅ Safe |
| `babel-preset-expo` | ^54.0.10 | Expo Babel preset | ✅ Safe |
| `eslint` | ^9.25.1 | Linting | ✅ Safe |
| `eslint-config-expo` | ~10.0.0 | Expo ESLint config | ✅ Safe |
| `eslint-config-prettier` | ^10.1.2 | Prettier ESLint integration | ✅ Safe |
| `prettier` | ^3.2.5 | Code formatter | ✅ Safe |
| `prettier-plugin-tailwindcss` | ^0.5.11 | Tailwind class sorting | ✅ Safe |
| `@types/react` | ~19.1.10 | React type definitions | ✅ Safe |

---

## Planned Additions (Not Yet Installed)

These packages are planned for the foundation setup phase:

| Package | Purpose | When |
|---|---|---|
| `zustand` | Global state management | App foundation setup |
| `axios` | HTTP client with JWT interceptors | App foundation setup |
| `expo-secure-store` | Encrypted JWT token storage | App foundation setup |
| `@walletconnect/web3wallet` | WalletConnect v2 for wallet signing | Wallet integration phase |

---

## Packages to Remove

| Package | Reason |
|---|---|
| `@expo/vector-icons` | Unused — StepFi uses Lucide React Native exclusively |

---

## Web App Note

StepFi-App supports both mobile (iOS/Android) and web via `react-native-web` and Expo's web export. The web build targets Netlify for the Drips Wave submission URL. No additional web-specific packages are required beyond what is already installed.

---

## Rules for Adding New Dependencies

Before adding any new package to StepFi-App:

1. **Justify it** — explain in the PR why existing packages cannot solve the problem
2. **Check React Native compatibility** — must support RN 0.81 and Expo 54
3. **Check Expo managed workflow compatibility** — some native modules require ejecting
4. **Run `npm audit`** after installing — zero new high or critical vulnerabilities
5. **Check bundle size impact** — prefer lightweight alternatives for mobile
6. **Add to this file** — add to the Production or Dev Dependencies table on the same PR
7. **No packages with unresolved critical CVEs** — ever

---

## Quarterly Audit Schedule

| Date | Auditor | Critical | High | Moderate | Action Taken |
|---|---|---|---|---|---|
| 2026-05-05 | @EmeditWeb | 0 | 0 | 5 | Documented — all transitive through Expo, not actionable |
| 2026-08-05 | — | — | — | — | Scheduled |
| 2026-11-05 | — | — | — | — | Scheduled |