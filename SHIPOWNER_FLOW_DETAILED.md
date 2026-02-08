# Shipowner Flow - Detailed Walkthrough

## Overview

The shipowner flow now works in 3 distinct scenarios:

### Scenario 1: Brand New Shipowner (No Account)

```
User Action                  Page/Route              System Action
────────────────────────────────────────────────────────────────────
1. Click "Sign up as Shipowner" → /register/shipowner
   Fill email + password          ↓
                                 Submit to /api/auth/register
                                 ↓
                                 Backend: Create account (unverified)
                                 ↓
                                 Redirect → /register/shipowner/verify

2. Check email                 /register/shipowner/verify
   Enter 6-digit code            ↓
                                 Submit verification code
                                 ↓
                                 Backend: Mark email as verified
                                 ↓
                                 Redirect → /shipowner/profile/create

3. Fill company profile        /shipowner/profile/create
   (Company info, fleet info,    ↓
    contact info)                Submit form with Bearer token
                                 ↓
                                 Backend: Save profile to DB
                                 ↓
                                 Redirect → /shipowner/contract-type

4. Choose contract type        /shipowner/contract-type
   (One-Off or Full Mgmt)        ↓
                                 Click button
                                 ↓
                                 Redirect → /shipowner/fleet-details?type=...

5. See success page            /shipowner/contract-type/{type}/success
                                 ↓
                                 (Optional: Click "Continue to Dashboard")
                                 ↓
                                 Redirect → /shipowner/dashboard

✅ COMPLETE - User is now onboarded
```

---

### Scenario 2: Returning Shipowner (Already Has Profile)

```
User Action                  Page/Route              System Action
────────────────────────────────────────────────────────────────────
1. Click "Log in"            /login
   Enter email + password       ↓
                                Submit credentials
                                ↓
                                Backend: Verify email/password
                                ↓
                                Return JWT access_token
                                ↓
                                Frontend: Decode token, get role

2. [AuthContext check]         (Implicit)
   Is role = "shipowner"?        ↓
   YES                           Make GET /api/v1/profile
                                 with Bearer token
                                 ↓
                                 Backend: Find profile for user
                                 ↓
                                 Return 200 + profile data
                                 ↓
                                 Redirect → /shipowner/contract-type

✅ READY - User can work with contracts
```

---

### Scenario 3: Existing Account, Missing Profile

```
User Action                  Page/Route              System Action
────────────────────────────────────────────────────────────────────
1. Click "Log in"            /login
   Enter email + password       ↓
                                Submit credentials
                                ↓
                                Backend: Verify email/password
                                ↓
                                Return JWT access_token
                                ↓
                                Frontend: Decode token, get role

2. [AuthContext check]         (Implicit)
   Is role = "shipowner"?        ↓
   YES                           Make GET /api/v1/profile
                                 with Bearer token
                                 ↓
                                 Backend: No profile found
                                 ↓
                                 Return 404 + error: "profile not found"
                                 ↓
                                 Redirect → /shipowner/profile/create

3. Fill company profile        /shipowner/profile/create
   (Company info, fleet info,    ↓
    contact info)                Submit form with Bearer token
                                 ↓
                                 Backend: Save profile to DB
                                 ↓
                                 Redirect → /shipowner/contract-type

✅ COMPLETE - User can now work with contracts
```

---

## Key Code Locations

### AuthContext Login Flow (where profile check happens)

**File**: `src/context/AuthContext.tsx`

```typescript
// After successful login
if (apiUser.role === "shipowner") {
  // Check if shipowner has a profile
  const profileResponse = await fetch("/api/v1/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (profileResponse.ok) {
    // Profile exists
    router.push("/shipowner/contract-type");
  } else if (profileResponse.status === 404) {
    // No profile - redirect to creation
    router.push("/shipowner/profile/create");
  }
}
```

### Profile Creation Form

**File**: `src/app/shipowner/profile/create/page.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Collect form data
  // POST to /api/v1/profile with Bearer token
  // On success: router.push("/shipowner/contract-type")
};
```

### Email Verification Redirect

**File**: `src/app/register/shipowner/verify/page.tsx`

```typescript
const handleVerify = async (e: React.FormEvent) => {
  // Verify code
  // On success: router.push("/shipowner/profile/create")
};
```

---

## Data Flow Diagram

```
┌──────────────────┐
│  Browser/Client  │
└────────┬─────────┘
         │ 1. Login credentials
         ├──────────────────────────────────────────────┐
         │                                              │
         ▼                                              │
    ┌─────────────────────────────────┐                │
    │  API Auth Endpoint              │ 2. JWT token  │
    │ /api/auth/login                 │◄──────────────┘
    └────────┬────────────────────────┘
             │ 3. Bearer token
             │
             ▼
    ┌─────────────────────────────────┐
    │  Next.js API Route              │ 4a. Profile found? YES
    │ /api/v1/profile (GET)           │ ──────────────┐
    │  [Proxy layer]                  │               │
    └────────┬────────────────────────┘               │
             │ 5. Forward to backend                    │
             │                                         │
             ▼                                         │
    ┌─────────────────────────────────┐               │
    │  Backend API                    │               │
    │ /api/v1/profile (GET)           │               │
    │                                 │               │
    │ 6a. Profile exists? 200 ✓      │               │
    │ 6b. Profile missing? 404 ✗      │               │
    └────────┬────────────────────────┘               │
             │                                         │
             ├─────────────────┬──────────────────────┘
             │                 │
        6a. 200 OK          6b. 404 Not Found
             │ Profile data    │
             │                 │
             ▼                 ▼
    ┌─────────────────┐  ┌──────────────────┐
    │ Go to Contract  │  │ Go to Create     │
    │ Type Selection  │  │ Profile Form     │
    │ (/shipowner/    │  │ (/shipowner/     │
    │  contract-type) │  │  profile/create) │
    └─────────────────┘  └──────────────────┘
```

---

## Security Implications

### ✅ Improvements

- **No localStorage**: Token not stored on disk, lost on page refresh
- **In-memory only**: Token only in RAM, cleared on navigation
- **Automatic session loss**: User must log in again after refresh
- **API-first validation**: Role and profile checked from backend, not client

### ⚠️ Trade-offs

- User loses session on page refresh (requires re-login)
- No persistence across tabs
- Not ideal for mobile apps

### 🚀 Future: Use Secure Cookies Instead

```typescript
// Replace in-memory token with HTTP-only cookie:
// Backend sets: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
// Frontend: Browser automatically includes token in requests
// Benefits: Secure, persistent, XSS-safe
```

---

## Testing Commands

### Scenario 1: New Shipowner

```bash
# 1. Open app
npm run dev

# 2. Go to /register/shipowner
# 3. Fill form: email=test@company.com, password=Test1234
# 4. Go to /register/shipowner/verify
# 5. Enter any 6-digit code
# ✓ Should redirect to /shipowner/profile/create

# 6. Fill profile form
# 7. Click "Create Profile & Continue"
# ✓ Should redirect to /shipowner/contract-type
```

### Scenario 2: Returning Shipowner (with profile)

```bash
# 1. Assume profile already exists in backend for test@company.com

# 2. Go to /login
# 3. Enter test@company.com + password
# ✓ Should redirect to /shipowner/contract-type
```

### Scenario 3: Returning Shipowner (no profile)

```bash
# 1. Create account but don't fill profile
# OR manually delete profile from backend

# 2. Go to /login
# 3. Enter email + password
# ✓ Should redirect to /shipowner/profile/create
```

---

## Troubleshooting

| Issue                             | Cause                              | Solution                                                 |
| --------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| Stuck on /login                   | No response from /api/v1/profile   | Check backend is running, NEXT_PUBLIC_API_URL is correct |
| Goes to profile/create every time | Backend returns 404 for valid user | Verify profile was saved correctly on backend            |
| localStorage still being used     | Old code                           | Check browser DevTools > Application > Storage           |
| Token shows as undefined          | Decode error                       | Check JWT format, ensure Bearer prefix in header         |
| Redirect loops                    | Profile check infinite loop        | Check API not redirecting, check role detection          |
