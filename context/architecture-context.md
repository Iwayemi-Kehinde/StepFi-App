# Architecture Context — StepFi-App

## Role In The StepFi Ecosystem

StepFi-App is the learner-facing interface. It is the only layer that interacts directly with the user. It connects to StepFi-API for off-chain data and auth, and uses WalletConnect v2 to let users sign Soroban transactions with their Stellar wallet — without the app ever touching a private key.

The App never calls Soroban RPC or Horizon directly. All blockchain interactions are mediated through StepFi-API.

---

## Stack

| Layer | Technology | Version | Role |
|---|---|---|---|
| Framework | React Native | 0.81.5 | Cross-platform mobile (iOS + Android) |
| Platform tooling | Expo | 54 | Managed workflow, OTA updates, build service |
| Language | TypeScript | 5.9 | Strict typed throughout |
| Navigation | Expo Router | latest | File-based routing with auth guards |
| Styling | NativeWind | latest | Tailwind CSS utility classes for React Native |
| State management | Zustand | latest | Global auth, user, wallet, loan state |
| API client | Axios | latest | HTTP client with JWT interceptors and refresh logic |
| Wallet connection | WalletConnect v2 | latest | Deep-link signing for Lobstr, xBull |
| Secure storage | Expo SecureStore | latest | JWT token persistence |
| Animations | React Native Reanimated | 4.1 | Smooth transitions and gestures |
| Icons | Lucide React Native | latest | Stroke-based icon library |
| Testing | Jest + React Native Testing Library | latest | Component and hook tests |

---

## System Boundaries

### What the App does

- Authenticates users via Stellar wallet signature (WalletConnect v2 → StepFi-API)
- Displays learner profile, reputation score, and credit limit
- Lets learners browse vendors and apply for loans
- Presents unsigned XDR transactions from the API for user signing
- Submits signed XDR back to API after wallet signs
- Tracks active loans, installment schedules, and payment history
- Shows notifications and payment reminders
- Lets sponsors view pool stats and deposit into the liquidity pool

### What the App does NOT do

- Call Soroban RPC or Horizon directly
- Store or handle private keys
- Build Stellar transactions — that is StepFi-API's job
- Handle contract logic — that is StepFi-Contracts' job

---

## Folder Structure

```
StepFi-App/
├── app/                          # Expo Router screens (file = route)
│   ├── _layout.tsx               # Root layout — auth guard, font loading
│   ├── (auth)/
│   │   ├── _layout.tsx           # Auth stack layout
│   │   ├── sign-in.tsx           # Wallet connect screen
│   │   └── register.tsx          # Learner profile creation
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigator
│   │   ├── pay.tsx               # Borrower dashboard (default tab)
│   │   ├── invest.tsx            # Sponsor / LP dashboard
│   │   └── settings.tsx          # Profile and preferences
│   └── loan/
│       ├── [id].tsx              # Loan detail screen
│       └── apply.tsx             # Loan application wizard
├── components/
│   ├── pages/                    # Full-page composites (assembled from shared)
│   └── shared/                   # Reusable components (cards, buttons, badges)
├── hooks/                        # Custom hooks — all API calls live here
├── services/                     # Axios service layer — all HTTP calls
│   ├── api.ts                    # Axios instance with interceptors
│   ├── auth.service.ts           # Auth endpoints
│   ├── loans.service.ts          # Loan endpoints
│   ├── reputation.service.ts     # Reputation endpoints
│   ├── vendors.service.ts        # Vendor endpoints
│   └── liquidity.service.ts      # Liquidity pool endpoints
├── stores/                       # Zustand global state
│   ├── auth.store.ts             # JWT tokens, wallet address, auth status
│   ├── user.store.ts             # Learner profile, preferences
│   ├── wallet.store.ts           # WalletConnect session, signing state
│   └── loans.store.ts            # Active loans, installment state
├── constants/
│   ├── colors.ts                 # StepFi dark theme color tokens
│   ├── config.ts                 # API base URL, WalletConnect project ID
│   └── theme.ts                  # Border radius, spacing, font sizes
├── types/                        # Shared TypeScript interfaces
│   ├── api.types.ts              # API response types
│   ├── loan.types.ts             # Loan, installment, repayment types
│   └── wallet.types.ts           # Wallet session, signing types
└── docs/                         # App-specific documentation
```

---

## Auth Flow (App Side)

```
User taps "Connect Wallet"
        │
        ▼
WalletConnect v2 opens wallet deep link (Lobstr / xBull)
        │
        ▼
User approves connection → App receives wallet public key
        │
        ▼
App calls POST /auth/nonce with wallet public key
        │
        ▼
App receives nonce → passes nonce to WalletConnect for signing
        │
        ▼
Wallet signs nonce → App receives base64 signature
        │
        ▼
App calls POST /auth/verify with { wallet, nonce, signature }
        │
        ▼
API returns { accessToken, refreshToken }
        │
        ▼
App stores tokens in Expo SecureStore
App updates auth.store with wallet address and auth status
App navigates to (tabs)/pay
```

---

## Transaction Signing Flow (App Side)

```
User taps "Apply for Loan" / "Pay Now"
        │
        ▼
App calls API endpoint (e.g., POST /loans/create)
        │
        ▼
API returns { unsignedXdr }
        │
        ▼
App passes XDR to WalletConnect → wallet shows transaction details
        │
        ▼
User reviews and approves in wallet app
        │
        ▼
Wallet returns signed XDR → App receives it
        │
        ▼
App calls POST /transactions/submit with { signedXdr }
        │
        ▼
API submits to Horizon → returns { txHash }
        │
        ▼
App shows confirmation screen with txHash
App polls GET /transactions/:hash for final status
```

---

## State Management (Zustand)

### auth.store.ts
```typescript
interface AuthStore {
  accessToken: string | null
  refreshToken: string | null
  walletAddress: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setTokens: (access: string, refresh: string) => void
  setWallet: (address: string) => void
  clearAuth: () => void
}
```

### wallet.store.ts
```typescript
interface WalletStore {
  isConnected: boolean
  publicKey: string | null
  session: WalletConnectSession | null
  isSigning: boolean
  connect: () => Promise<void>
  disconnect: () => void
  signXdr: (xdr: string) => Promise<string>
}
```

### user.store.ts
```typescript
interface UserStore {
  profile: LearnerProfile | null
  reputation: ReputationData | null
  isLoading: boolean
  fetchProfile: () => Promise<void>
  fetchReputation: () => Promise<void>
}
```

### loans.store.ts
```typescript
interface LoansStore {
  activeLoans: Loan[]
  selectedLoan: Loan | null
  isLoading: boolean
  fetchLoans: () => Promise<void>
  selectLoan: (id: string) => void
}
```

---

## API Service Layer (Axios)

All HTTP calls go through `services/api.ts`:

```typescript
// Axios instance with base URL and JWT interceptor
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
})

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle 401, refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // attempt refresh → retry original request
      // if refresh fails → clear auth → redirect to sign-in
    }
    return Promise.reject(error)
  }
)
```

---

## Navigation Guard (Expo Router)

Auth guard lives in `app/_layout.tsx`:

```typescript
// Redirect unauthenticated users to sign-in
// Redirect authenticated users away from auth screens
const { isAuthenticated } = useAuthStore()
const segments = useSegments()

useEffect(() => {
  const inAuthGroup = segments[0] === '(auth)'
  if (!isAuthenticated && !inAuthGroup) router.replace('/(auth)/sign-in')
  if (isAuthenticated && inAuthGroup) router.replace('/(tabs)/pay')
}, [isAuthenticated])
```

---

## Invariants

1. **App never stores or touches private keys** — all signing goes through WalletConnect
2. **JWT tokens are stored in Expo SecureStore only** — never AsyncStorage, never component state
3. **No API calls in screen files or components** — all HTTP calls go through hooks and services
4. **No global state mutations outside Zustand stores** — no prop drilling beyond 2 levels
5. **All colors reference `constants/colors.ts`** — no hardcoded hex values anywhere
6. **All navigation uses Expo Router** — no manual `navigation.navigate()` calls
7. **All icons use Lucide React Native** — no other icon libraries
8. **All screens handle loading, error, and empty states** — no screens that only handle the happy path
9. **Token refresh is handled in the Axios interceptor** — not in individual hooks or screens
10. **WalletConnect session is managed in `wallet.store.ts` only** — no direct WalletConnect calls in screens
