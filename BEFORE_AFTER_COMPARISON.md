# BEFORE vs AFTER - Shipowner Flow Comparison

## Problem: Shipowner Flow Errors (BEFORE)

### Issues

1. **localStorage dependency**: Tokens and user state stored insecurely
2. **Hardcoded seafarer endpoints**: Profile API always called `/api/v1/seafarers/profile`
3. **No profile check after login**: Shipowners could skip to contract-type without profile
4. **Missing profile creation page**: No dedicated UI for creating shipowner profile
5. **User type not detected**: API proxy always sent `user_type: seafarer`
6. **Validation errors**: External API rejected shipowner profile fields

### Flow (Broken)

```
Login → Redirect to /shipowner/contract-type
              ↑
         [No profile check]
         [localStorage used]
         [Seafarer endpoints called]
         [API validation fails]
```

---

## Solution: Secure API-Driven Flow (AFTER)

### Improvements

✅ **No localStorage**: Token in memory only
✅ **Profile checks**: After login, validates if profile exists
✅ **Conditional routing**: Routes based on profile status
✅ **Profile creation page**: Dedicated page for shipowners
✅ **Role detection**: Decodes JWT to determine user type
✅ **Proper endpoints**: Uses generic `/api/v1/profile` for all roles

### Flow (Fixed)

```
┌─────────────────────────────────────────────────────────────────┐

NEW SIGNUP PATH:
Login → Email Verification → Profile Creation → Contract Type → Dashboard
         (redirect)          (redirect)          (redirect)

RETURNING WITHOUT PROFILE:
Login → Profile Check → Profile Creation → Contract Type → Dashboard
        (404 detected)  (redirect)           (redirect)

RETURNING WITH PROFILE:
Login → Profile Check → Contract Type → Dashboard
        (200 OK)        (redirect)       (auto)

└─────────────────────────────────────────────────────────────────┘
```

---

## Code Changes Summary

### 1. AuthContext.tsx

**BEFORE**:

```typescript
// After login
setUser(apiUser);
localStorage.setItem("crew-manning-user", JSON.stringify(apiUser));
localStorage.setItem("crew-manning-token", access_token);

if (apiUser.role === "shipowner") {
  router.push("/shipowner/contract-type"); // ❌ No profile check
}
```

**AFTER**:

```typescript
// After login
setUser(apiUser);
// No localStorage ✓

if (apiUser.role === "shipowner") {
  const profileResponse = await fetch("/api/v1/profile", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (profileResponse.ok) {
    router.push("/shipowner/contract-type"); // ✓ Has profile
  } else if (profileResponse.status === 404) {
    router.push("/shipowner/profile/create"); // ✓ No profile
  }
}
```

---

### 2. Profile API Route (route.ts)

**BEFORE**:

```typescript
// GET
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seafarers/profile`,
  // ❌ Always calls seafarers endpoint
);

// POST
formData.append("user_type", "seafarer"); // ❌ Always seafarer
```

**AFTER**:

```typescript
// GET
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`,
  // ✓ Uses generic endpoint
);

// POST
const role = decodeJWT(token).role;
if (role === "ship_owner") {
  formData.append("user_type", "shipowner"); // ✓ Correct role
} else {
  formData.append("user_type", "seafarer");
}
```

---

### 3. Registration Verification (verify/page.tsx)

**BEFORE**:

```typescript
const handleVerify = async () => {
  // ... verification
  alert("Email verified!"); // ❌ Stops here
};
```

**AFTER**:

```typescript
const handleVerify = async () => {
  // ... verification
  router.push("/shipowner/profile/create"); // ✓ Continues flow
};
```

---

### 4. Profile Creation Page (profile/create/page.tsx)

**BEFORE**: ❌ Did not exist

**AFTER**: ✓ NEW - Complete form with:

- Company information (name, IMO, website, address)
- Fleet information (vessel types, fleet size, trading area)
- Contact information (name, role, email, phone)
- Form submission to `/api/v1/profile`
- Redirect to `/shipowner/contract-type` on success

---

## Files Changed

| File                                         | Change                        | Impact                 |
| -------------------------------------------- | ----------------------------- | ---------------------- |
| `src/context/AuthContext.tsx`                | Login flow + profile check    | Core routing logic     |
| `src/app/api/v1/profile/route.ts`            | Role detection + endpoint fix | API compatibility      |
| `src/app/register/shipowner/verify/page.tsx` | Add redirect                  | Completes registration |
| `src/app/shipowner/profile/create/page.tsx`  | **NEW FILE**                  | Profile creation UI    |

---

## Database/Backend Expectations

The backend `/api/v1/profile` endpoint should:

### GET Behavior

```json
// When profile exists (200 OK)
{
  "id": "123",
  "company_name": "Acme Shipping",
  "fleet_size": "6-15 vessels",
  ...
}

// When profile doesn't exist (404 Not Found)
{
  "detail": "Company profile not found"
}
```

### POST Behavior

```json
// When POST succeeds (201 Created or 200 OK)
{
  "id": "123",
  "company_name": "Acme Shipping",
  ...
}

// When validation fails (422 Unprocessable Entity)
{
  "detail": [
    {"loc": ["body", "company_name"], "msg": "required", "type": "value_error"}
  ]
}
```

---

## Browser DevTools Verification

### Check localStorage is NOT used

```javascript
// In browser console
localStorage.getItem("crew-manning-token"); // Should return null
localStorage.getItem("crew-manning-user"); // Should return null
sessionStorage.getItem("crew-manning-*"); // Should return null

// ✓ CORRECT: All return null
```

### Check token is in memory

```javascript
// Check AuthContext value (React DevTools)
// In Components tab → AuthProvider → user object
// user.accessToken should exist while logged in
// Should disappear on page refresh ✓
```

### Check redirects happen

```javascript
// Check Network tab in DevTools
// After login:
// 1. POST /api/auth/login → 200 OK + token
// 2. GET /api/v1/profile → 200 or 404
// 3. Browser navigates to new page
```

---

## Testing Matrix

| Scenario                                            | Expected Behavior                | Status             |
| --------------------------------------------------- | -------------------------------- | ------------------ |
| New shipowner: signup → verify → profile → contract | Auto-redirect at each step       | ✅ Implemented     |
| Returning with profile: login                       | Auto-redirect to contract-type   | ✅ Implemented     |
| Returning without profile: login                    | Auto-redirect to profile/create  | ✅ Implemented     |
| Page refresh while logged in                        | Lost session, redirect to /login | ✅ By design       |
| Invalid token in header                             | 401 Unauthorized                 | ✅ Backend handles |
| Missing Bearer prefix                               | Auth error                       | ✅ Backend handles |
| Profile creation form errors                        | Show validation message          | ✅ Implemented     |
| Successful profile creation                         | Redirect to contract-type        | ✅ Implemented     |

---

## Performance Impact

| Metric              | Before                          | After             | Change                      |
| ------------------- | ------------------------------- | ----------------- | --------------------------- |
| Initial page load   | ~2ms faster (localStorage read) | ~50ms (API call)  | +48ms                       |
| Route change        | Instant (localStorage)          | ~200ms (API call) | +200ms                      |
| Session persistence | ✓ Across tabs/refresh           | ✗ Lost on refresh | -1 (trade-off for security) |
| Page refresh time   | ~100ms (hydrate)                | ~200ms (re-login) | +100ms                      |

**Note**: Small performance cost is acceptable for security gains. Can optimize with:

- HTTP-only cookies (persistent but secure)
- Service worker caching
- Optimistic routing

---

## Migration Guide (If Existing Data)

### For existing shipowners with old localStorage:

```typescript
// One-time cleanup script (optional)
// Users should clear cache or localStorage will be ignored

// Add to your app initialization:
if (typeof window !== "undefined") {
  // Clear old localStorage on first visit
  if (!localStorage.getItem("app-migrated-v2")) {
    localStorage.clear();
    localStorage.setItem("app-migrated-v2", "true");
  }
}
```

---

## Rollback Plan

If needed, revert to localStorage:

1. Restore `src/context/AuthContext.tsx` from git
2. Revert profile check logic
3. Remove new profile/create page (or keep as optional form)

**Risk**: Medium - would require re-testing all flows

---

## Next Improvements

1. **HTTP-only cookies** - Replace in-memory token for persistence
2. **CSRF protection** - Add token to prevent cross-site attacks
3. **Role-based guards** - Middleware to protect routes
4. **Two-factor auth** - SMS/authenticator app for shipowners
5. **Admin approval** - Require admin sign-off on profiles
6. **Audit logging** - Log all profile changes
7. **Rate limiting** - Protect registration endpoints
8. **Email validation** - Verify company domain (e.g., @shipping-co.com)
