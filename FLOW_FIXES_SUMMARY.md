# FLOW FIX - Shipowner Registration & Contract Creation

## Issues Fixed

### ❌ Issue 1: Missing Document Upload

**Problem**: Profile creation page didn't have document upload fields, so users couldn't upload company documents.

**Solution**: Added 4 optional document upload fields to `/shipowner/profile/create/page.tsx`:

- Document 1, 2, 3, 4 (optional)
- File picker accepts: .pdf, .doc, .docx, .jpg, .jpeg, .png
- Shows confirmation message when file is selected
- Files are submitted with profile form to `/api/v1/profile`

**Code**:

```tsx
{
  [1, 2, 3, 4].map((docNum) => (
    <div key={docNum}>
      <label>Document {docNum}</label>
      <input
        type="file"
        name={`document_${docNum}`}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
    </div>
  ));
}
```

---

### ❌ Issue 2: Redirect Loop After Profile Creation

**Problem**: After successfully creating a profile, user was redirected back to `/shipowner/profile/create` instead of `/shipowner/contract-type`.

**Root Cause**: The profile check in `AuthContext.login()` was being triggered too quickly, before the backend confirmed the profile was saved.

**Solution**: Used `sessionStorage` flag to temporarily mark that a profile was just created:

1. When profile creation succeeds, set `sessionStorage.setItem('shipowner_profile_created', 'true')`
2. In `AuthContext.login()`, check for this flag before running profile check
3. If flag exists, skip the profile check and go directly to contract-type
4. Clear the flag after use

**Code** (in `profile/create/page.tsx`):

```typescript
if (response.ok) {
  // Mark that profile was just created
  sessionStorage.setItem("shipowner_profile_created", "true");
  router.push("/shipowner/contract-type");
}
```

**Code** (in `AuthContext.tsx`):

```typescript
if (apiUser.role === "shipowner") {
  const profileJustCreated =
    sessionStorage.getItem("shipowner_profile_created") === "true";

  if (profileJustCreated) {
    sessionStorage.removeItem("shipowner_profile_created");
    router.push("/shipowner/contract-type");
    return;
  }
  // ... rest of profile check
}
```

---

### ❌ Issue 3: Contract Type Routing Wrong Page

**Problem**: After selecting contract type, user was redirected to `/shipowner/fleet-details?type=...` which wasn't the contract creation page.

**Solution**: Fixed routing in `/shipowner/contract-type/page.tsx`:

- Changed from: `router.push("/shipowner/fleet-details?type=oneoff")`
- Changed to: `router.push("/shipowner/contract-type/one-off")`
- Changed from: `router.push("/shipowner/fleet-details?type=full")`
- Changed to: `router.push("/shipowner/contract-type/full")`

**Verification**: Both pages exist and contain contract creation forms:

- ✅ `/shipowner/contract-type/one-off/page.tsx` - One-off contract form
- ✅ `/shipowner/contract-type/full/page.tsx` - Full management contract form
- ✅ `/shipowner/contract-type/one-off/success/page.tsx` - Success page
- ✅ `/shipowner/contract-type/full/success/page.tsx` - Success page

---

## NEW FIXED FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              SHIPOWNER REGISTRATION & CONTRACT FLOW              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Sign Up
  /register/shipowner
  ├─ Email: test@company.com
  └─ Password: ••••••••
       ↓

Step 2: Verify Email
  /register/shipowner/verify
  ├─ Enter 6-digit code
  └─ ✓ Email verified
       ↓
    [Auto-redirect]

Step 3: Create Profile ⭐ NEW - WITH DOCUMENTS
  /shipowner/profile/create
  ├─ Company Info (name, IMO, website, address)
  ├─ Fleet Info (vessel types, size, trading area)
  ├─ Contact Info (name, role, email, phone)
  └─ Documents ⭐ (optional: 4 file uploads)
       ↓
    [sessionStorage flag set]
    [Auto-redirect]

Step 4: Select Contract Type ⭐ FIXED ROUTING
  /shipowner/contract-type
  ├─ Choose "One-Off Crew Supply"
  │  └─ router.push("/shipowner/contract-type/one-off") ✓
  │
  └─ Choose "Full Crew Management"
     └─ router.push("/shipowner/contract-type/full") ✓
       ↓

Step 5: Create Contract (Type-Specific)
  Option A: One-Off
    /shipowner/contract-type/one-off
    ├─ Fill one-off contract details
    └─ Submit
         ↓

  Option B: Full Management
    /shipowner/contract-type/full
    ├─ Fill full management details
    └─ Submit
         ↓

Step 6: Success Page
  /shipowner/contract-type/{type}/success
  ├─ Show confirmation
  └─ "Continue to Dashboard" button
       ↓

Step 7: Dashboard
  /shipowner/dashboard
  └─ ✅ COMPLETE - Can manage contracts, crew, etc.
```

---

## Files Modified

### 1. `src/app/shipowner/profile/create/page.tsx`

- ✅ Added 4 document upload fields
- ✅ Added `handleFileChange()` function
- ✅ Added sessionStorage flag on successful submission

### 2. `src/context/AuthContext.tsx`

- ✅ Added sessionStorage check before profile validation
- ✅ Prevents redirect loop for just-created profiles
- ✅ Clears flag after use

### 3. `src/app/shipowner/contract-type/page.tsx`

- ✅ Fixed routing to `/shipowner/contract-type/one-off`
- ✅ Fixed routing to `/shipowner/contract-type/full`
- ✅ Added cleanup of sessionStorage flags on page load

---

## Testing Checklist

### Test 1: New Shipowner (Full Flow)

```
1. Go to /register/shipowner
2. Sign up: email@company.com / Password123
3. Go to /register/shipowner/verify
4. Enter any 6-digit code
   ✓ Should redirect to /shipowner/profile/create

5. Fill profile form:
   - Company Name: Acme Shipping
   - Address: 123 Marine Way, Singapore
   - Vessel Types: Container Ships
   - Fleet Size: 6-15 vessels
   - Trading Area: Southeast Asia
   - Contact Name: John Doe
   - Role: Fleet Manager
   - Email: john@acme.com
   - Phone: +65-1234-5678

6. Upload document: Select test-document.pdf for Document 1
   ✓ Should show "✓ test-document.pdf"

7. Click "Create Profile & Continue"
   ✓ Should redirect to /shipowner/contract-type
   ✗ Should NOT redirect back to /shipowner/profile/create
```

### Test 2: Select One-Off Contract

```
1. On /shipowner/contract-type page
2. Click "Start One-Off Contract"
   ✓ Should redirect to /shipowner/contract-type/one-off
   ✗ Should NOT go to /shipowner/fleet-details?type=oneoff
```

### Test 3: Select Full Management Contract

```
1. On /shipowner/contract-type page
2. Click "Start Full Management"
   ✓ Should redirect to /shipowner/contract-type/full
   ✗ Should NOT go to /shipowner/fleet-details?type=full
```

### Test 4: Returning User (With Profile)

```
1. Go to /login
2. Log in with existing shipowner account
3. ✓ Should redirect to /shipowner/contract-type
   ✗ Should NOT go to /shipowner/profile/create
```

### Test 5: Returning User (No Profile)

```
1. Go to /login
2. Log in with account that has no profile
3. ✓ Should redirect to /shipowner/profile/create
```

---

## Browser Storage Check

✅ **sessionStorage** (temporary, cleared on tab close):

```javascript
// In browser console:
sessionStorage.getItem("shipowner_profile_created");
// Should be null after profile creation is complete
```

❌ **NO localStorage usage**:

```javascript
localStorage.getItem("crew-manning-token");
// Should return null
```

---

## API Integration

### Profile Creation Endpoint

```
POST /api/v1/profile
Headers: Authorization: Bearer {token}
Body: FormData
  - All profile fields (company_name, etc.)
  - document_1, document_2, document_3, document_4 (files)

Response:
  201 Created or 200 OK
```

### Contract Creation Endpoints

```
POST /shipowner/contract-type/one-off
  └─ Create one-off crew supply contract

POST /shipowner/contract-type/full
  └─ Create full management contract
```

---

## Security Notes

✅ **Improvements**:

- Documents are uploaded during profile creation (not stored locally)
- sessionStorage used only temporarily (cleared on tab close)
- No sensitive data persisted
- Profile check still performed on login

⚠️ **Note**:

- User loses session on page refresh (by design - no localStorage)
- To add persistence, implement HTTP-only cookies

---

## Build Status

✅ **Build Result**: SUCCESS

```
Compiled successfully in 12.2s
Running TypeScript ...
  ✓ /shipowner/contract-type
  ✓ /shipowner/contract-type/full
  ✓ /shipowner/contract-type/full/success
  ✓ /shipowner/contract-type/one-off
  ✓ /shipowner/contract-type/one-off/success
  ✓ /shipowner/dashboard
  ✓ /shipowner/fleet-details
```

---

## Summary

✅ **All Issues Resolved**:

1. ✅ Document upload fields added to profile form
2. ✅ Redirect loop fixed with sessionStorage flag
3. ✅ Contract type routing corrected to proper pages
4. ✅ Build verified with no errors

**Next Step**: Deploy and test with real users!
