# Code Standards — StepFi-App

## Language: TypeScript + React Native + Expo

These standards apply to all code in StepFi-App. They exist to keep the codebase consistent as contributors join, prevent common React Native pitfalls, and enforce the learner-first UX principles that define StepFi.

---

## TypeScript Rules

- Strict mode is required. `"strict": true` in `tsconfig.json`.
- No `any`. Use explicit interfaces or narrowly scoped generics.
- All API response types must be defined in `types/api.types.ts` — never type inline API responses as `any`.
- Use `interface` for object shapes. Use `type` for unions, aliases, and computed types.
- Never use `!` non-null assertion — handle nullability explicitly with conditionals or optional chaining.
- All async functions must handle errors — `try/catch` in hooks, Axios interceptors handle global cases.

---

## Component Rules

- Default to functional components with hooks only. No class components.
- Screen files (`app/**/*.tsx`) contain layout and composition only — no business logic, no API calls.
- Reusable components live in `components/shared/`. Full-page assembled views live in `components/pages/`.
- No API calls inside components — delegate to custom hooks from `hooks/`.
- No global state mutations inside components — use store actions from `stores/`.
- Props must be explicitly typed with an interface: `interface CardProps { ... }`.
- Avoid inline styles for colors — use `constants/colors.ts` tokens via `style={{ color: colors.textPrimary }}`.

```tsx
// CORRECT
interface ReputationBadgeProps {
  score: number
  tier: 'gold' | 'silver' | 'bronze' | 'starter'
}

export function ReputationBadge({ score, tier }: ReputationBadgeProps) {
  const tierColor = colors.tier[tier]
  return (
    <View className="rounded-xl px-3 py-1" style={{ backgroundColor: tierColor + '20' }}>
      <Text className="text-sm font-semibold" style={{ color: tierColor }}>
        {tier} · {score}/100
      </Text>
    </View>
  )
}

// WRONG — inline color, missing prop types, API call in component
export function ReputationBadge({ wallet }: any) {
  const [score, setScore] = useState(0)
  useEffect(() => { fetch(`/reputation/${wallet}`).then(...) }, []) // ❌ API in component
  return <View style={{ backgroundColor: '#F59E0B20' }}> // ❌ hardcoded color
    ...
  </View>
}
```

---

## Hook Rules

- Custom hooks own all API calls and derived local state logic.
- Hook names start with `use`: `useReputation`, `useLoanDetail`, `useApplyLoan`.
- Hooks return consistent shapes: `{ data, isLoading, error, refetch }`.
- Hooks call service functions from `services/` — they do not use Axios directly.
- Hooks that trigger mutations return an action function and a loading/error state.

```typescript
// CORRECT hook shape
export function useReputation(wallet: string) {
  const [data, setData] = useState<ReputationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await reputationService.getScore(wallet)
      setData(result)
    } catch (e) {
      setError('Failed to load reputation score')
    } finally {
      setIsLoading(false)
    }
  }, [wallet])

  useEffect(() => { fetch() }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}
```

---

## Service Layer Rules

- All HTTP calls go through the Axios instance in `services/api.ts`.
- No raw `fetch()` calls anywhere in the codebase.
- Each domain has its own service file: `auth.service.ts`, `loans.service.ts`, etc.
- Service functions are async and return typed data — they do not handle loading or error state (that's the hook's job).
- Service functions throw errors on failure — hooks catch them.

```typescript
// CORRECT
export const loansService = {
  async getMyLoans(): Promise<Loan[]> {
    const { data } = await api.get<ApiResponse<Loan[]>>('/loans/my-loans')
    return data.data
  },

  async createLoan(dto: CreateLoanDto): Promise<{ unsignedXdr: string }> {
    const { data } = await api.post<ApiResponse<{ unsignedXdr: string }>>('/loans/create', dto)
    return data.data
  },
}
```

---

## State Management Rules

- Global state lives in Zustand stores in `stores/` — one store per domain.
- Store files export a single `useXxxStore` hook.
- Store state is flat — avoid deeply nested objects.
- Store actions are defined inside the store — not in hooks or components.
- Local UI state (modal open/close, input values) stays in `useState` — it does not go into Zustand.

```typescript
// CORRECT — flat state, actions inside store
export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  walletAddress: null,
  isAuthenticated: false,

  setTokens: (access, refresh) => set({
    accessToken: access,
    refreshToken: refresh,
    isAuthenticated: true,
  }),

  clearAuth: () => set({
    accessToken: null,
    refreshToken: null,
    walletAddress: null,
    isAuthenticated: false,
  }),
}))
```

---

## Design System Rules

### Colors

All colors come from `constants/colors.ts`. No exceptions.

```typescript
// CORRECT
import { colors } from '@/constants/colors'
<Text style={{ color: colors.textPrimary }}>Balance</Text>

// WRONG
<Text style={{ color: '#F0F4F8' }}>Balance</Text>  // ❌ hardcoded hex
<Text className="text-slate-100">Balance</Text>      // ❌ raw Tailwind color class
```

### Dark Theme

StepFi-App is dark theme only. No light mode. No theme toggle. All backgrounds, surfaces, and text colors reference the dark token system in `constants/colors.ts`.

### Icons

Lucide React Native only. No other icon libraries. Stroke-based icons only — no filled variants.

```tsx
import { Wallet, ChevronRight, AlertCircle } from 'lucide-react-native'

// Sizes
size={16}  // inline text icons
size={20}  // button icons
size={24}  // tab bar icons
size={28}  // feature icons in empty states
```

### NativeWind

Use NativeWind for layout, spacing, and flex. Use inline `style` for color tokens.

```tsx
// CORRECT — NativeWind for layout, inline style for colors
<View className="flex-1 px-4 pt-6 gap-4" style={{ backgroundColor: colors.background }}>

// WRONG — trying to use NativeWind for custom color tokens
<View className="bg-[#080F1A]">  // ❌ arbitrary value
```

---

## Screen Structure Rules

Every screen must handle three states explicitly:

```tsx
export default function PayScreen() {
  const { data: loans, isLoading, error, refetch } = useMyLoans()

  if (isLoading) return <Loader />  // loading state

  if (error) return (            // error state
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      message={error}
      action={{ label: 'Try again', onPress: refetch }}
    />
  )

  if (!loans?.length) return (   // empty state
    <EmptyState
      icon={CreditCard}
      title="No loans yet"
      message="Apply for your first loan to get started"
    />
  )

  return (                       // happy path
    <SafeAreaView ...>
      ...
    </SafeAreaView>
  )
}
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Screen files | `kebab-case.tsx` (Expo Router) | `sign-in.tsx`, `apply.tsx` |
| Component files | `PascalCase.tsx` | `ReputationBadge.tsx`, `LoanCard.tsx` |
| Hook files | `use-kebab-case.ts` | `use-reputation.ts`, `use-loan-detail.ts` |
| Service files | `kebab-case.service.ts` | `loans.service.ts` |
| Store files | `kebab-case.store.ts` | `auth.store.ts` |
| Type files | `kebab-case.types.ts` | `loan.types.ts` |
| Constants files | `kebab-case.ts` | `colors.ts`, `config.ts` |
| Component names | `PascalCase` | `ReputationBadge`, `InstallmentRow` |
| Hook names | `useFeatureName` | `useReputation`, `useApplyLoan` |
| Store hooks | `useFeatureStore` | `useAuthStore`, `useLoansStore` |
| Service exports | `featureService` object | `loansService`, `authService` |

---

## Learner-First UX Rules (Technical Implementation)

- Every financial term must have a `tooltip` or `subtitle` prop — never show raw DeFi terminology alone.
- Error messages shown to users must be human-readable — never expose API error codes to the UI.
- Every screen that initiates a blockchain transaction must show a confirmation step before calling the wallet.
- Wallet connection must include a "What is a Stellar wallet?" help link for first-time users.
- Amounts must always show in both XLM/USDC and a human-friendly currency equivalent where possible.
- Reputation score always displays with context text: never just the number alone.

---

## What Not To Do

- No API calls in screen files or components
- No global state mutations outside Zustand store actions
- No hardcoded hex colors — always use `constants/colors.ts`
- No raw `fetch()` calls — always go through `services/api.ts`
- No `any` types
- No `!` non-null assertions
- No raw `navigation.navigate()` calls — use Expo Router `router.push()`
- No JWT token handling outside `auth.store.ts` and the Axios interceptor
- No WalletConnect calls outside `wallet.store.ts`
- No other icon libraries — Lucide React Native only
- No light mode styles — dark theme only
- No screens that only handle the happy path — always handle loading, error, and empty states
