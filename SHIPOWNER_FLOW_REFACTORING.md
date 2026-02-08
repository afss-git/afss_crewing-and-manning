# Shipowner Flow Refactoring - Complete Summary

## Changes Made

### 1. **AuthContext.tsx** - Removed localStorage, added profile checks

**File**: [src/context/AuthContext.tsx](src/context/AuthContext.tsx)

**Changes**:

- Removed all `localStorage` usage (no more storing user/token/profile locally)
- User state is now in-memory only (lost on page refresh - secure)
- Removed hydration from localStorage in `useEffect`
- **Updated login flow for shipowners**:
  - After login, makes an API call to `/api/v1/profile` to check if profile exists
  - If 404 or "profile not found" error: redirect to `/shipowner/profile/create`
  - If profile exists: redirect to `/shipowner/contract-type`
  - If any error: default to profile creation for safety
- **Updated login flow for seafarers**: same logic but checks `/api/v1/seafarers/profile`

**Why**: Eliminates localStorage security concerns and enables conditional routing based on profile status.

---

### 2. **Shipowner Profile Creation Page** - NEW

**File**: [src/app/shipowner/profile/create/page.tsx](src/app/shipowner/profile/create/page.tsx) (CREATED)

**Purpose**: First step for new or profile-less shipowners

- Collects company information (name, IMO, website, address)
- Collects fleet information (vessel types, fleet size, trading area)
- Collects contact information (name, role, email, phone)
- On successful submission, redirects to `/shipowner/contract-type`
- Uses Bearer token from `useAuth()` hook (no localStorage)

**Why**: Centralizes profile creation in one place; required before contract selection.

---

### 3. **Shipowner Registration Verification** - Updated

**File**: [src/app/register/shipowner/verify/page.tsx](src/app/register/shipowner/verify/page.tsx)

**Changes**:

- After email verification succeeds: redirect to `/shipowner/profile/create` (instead of alert)
- Imported `useRouter` from `next/navigation`

**Why**: Completes the registration flow by taking verified users to profile creation.

---

### 4. **Profile API Proxy** - Enhanced error handling

**File**: [src/app/api/v1/profile/route.ts](src/app/api/v1/profile/route.ts)

**Changes to GET**:

- Forwards request to generic `/api/v1/profile` endpoint (not seafarers-only)
- Properly detects and returns 404 when external API returns "profile not found"
- Returns `{ detail: "Company profile not found" }` with status 404

**Changes to POST**:

- Decodes JWT token to extract user role
- Sets `user_type` to `shipowner` or `seafarer` based on role (not always `seafarer`)
- Falls back to `seafarer` if token decode fails

**Why**: Ensures shipowner profile requests are routed correctly and return proper 404 responses.

---

## New Shipowner Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEW SHIPOWNER SIGNUP FLOW                   │
└─────────────────────────────────────────────────────────────────┘

Step 1: SIGNUP
  └─> /register/shipowner → submit email + password
                          → Create account

Step 2: EMAIL VERIFICATION
  └─> /register/shipowner/verify → Enter 6-digit code
                                   → Verify email

Step 3: PROFILE CREATION
  └─> /shipowner/profile/create → Fill company info
                                → Fill fleet info
                                → Fill contact info
                                → POST to /api/v1/profile

Step 4: SERVICE SELECTION
  └─> /shipowner/contract-type → Choose "One-Off" or "Full Management"

Step 5: SUCCESS
  └─> /shipowner/contract-type/{type}/success → Display confirmation

Step 6: DASHBOARD
  └─> /shipowner/dashboard → View contracts, crew, etc.
```

---

## Returning Shipowner Flow (Already Has Profile)

```
┌────────────────────────────────────────────────────┐
│        RETURNING SHIPOWNER LOGIN (With Profile)    │
└────────────────────────────────────────────────────┘

Login
  └─> /login → Submit email + password
               → Receive JWT token

Check Profile
  └─> GET /api/v1/profile (with Bearer token)
         → Profile exists (200 OK)
         → Redirect to /shipowner/contract-type

OR if profile not found:
  └─> GET /api/v1/profile (with Bearer token)
         → Returns 404 "Company profile not found"
         → Redirect to /shipowner/profile/create
```

---

## Security Changes

| Aspect        | Before                       | After                  |
| ------------- | ---------------------------- | ---------------------- |
| Token Storage | localStorage                 | In-memory only         |
| User State    | Persisted locally            | Lost on refresh        |
| Profile State | Cached locally               | Fetched fresh from API |
| XSS Risk      | High (localStorage readable) | Reduced                |
| Flow Reset    | User can bypass pages        | User must authenticate |
| Auto-redirect | Based on localStorage        | Based on API response  |

---

## API Endpoints Used

1. **POST /api/auth/login** - Authenticate user, receive JWT
2. **GET /api/v1/profile** - Check if shipowner profile exists
3. **POST /api/v1/profile** - Create/update shipowner profile
4. **GET /api/v1/seafarers/profile** - Check seafarer profile (for seafarers only)

---

## Required Environment Variables

Ensure these are set in `.env` or `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

---

## Testing Checklist

- [ ] **New shipowner signup** → Verify email → Create profile → Select service → See success → Dashboard
- [ ] **Returning shipowner (with profile)** → Login → Redirected to /shipowner/contract-type
- [ ] **Returning shipowner (no profile)** → Login → Redirected to /shipowner/profile/create
- [ ] **Token expiration** → Auto logout, redirect to /login
- [ ] **Page refresh** → User loses session (expected, no localStorage)
- [ ] **API errors** → Graceful error messages, no blank screens
- [ ] **Invalid token** → Redirect to login
- [ ] **Profile form submission** → Success message + redirect to contract-type

---

## Next Steps (Optional Enhancements)

1. Add session persistence using **HTTP-only cookies** (instead of localStorage)
2. Implement **OAuth/SSO** for enterprise users
3. Add **profile pre-population** from uploaded company documents (OCR)
4. Build **admin dashboard** to approve/reject profiles
5. Add **profile edit** capability for existing shipowners
6. Implement **role-based access control (RBAC)** middleware
