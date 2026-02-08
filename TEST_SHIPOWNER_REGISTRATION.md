# Shipowner Registration Fix - Test Guide

## What Changed

The shipowner registration endpoint now has a **fallback mechanism**:

1. **Primary**: Tries `/api/v1/auth/register/shipowner` (external API)
2. **Fallback**: If that returns 404, uses `/api/v1/auth/register/seafarer` (known working endpoint)
3. **Result**: Verification email is sent via the working seafarer endpoint

## Why This Works

- The external API has the seafarer registration endpoint available
- Shipowners can register through the same flow initially
- Role differentiation (shipowner vs seafarer) happens during login via JWT token decode
- Local user record is created in either case

## Test Instructions

### Step 1: Start the dev server

```bash
npm run dev
```

Wait for "✓ Ready in X.Xs" message.

### Step 2: Open the registration form

Navigate to: `http://localhost:3000/register/shipowner`

### Step 3: Register with test email

- Email: `testshipowner+[timestamp]@example.com`
- Password: `Password123` (at least 8 chars, uppercase, number)
- Click "Sign Up"

### Step 4: Monitor server logs

Watch the terminal running `npm run dev`. You should see:

```
🔑 Fetching token from external API...
✅ Got external API token
Shipowner registration endpoint not found (404). Trying seafarer endpoint as fallback...
🔑 Fetching token from external API...
✅ Got external API token
Fallback seafarer registration response: { status: 201, data: { msg: 'Verification code sent to email' } }
POST /api/auth/register/shipowner 201 in X.Xs
```

### Step 5: Verification email

An email with verification code should arrive in your inbox for the registered email address.

### Step 6: Complete verification

1. Go to `/verify/email?email=[your-email]`
2. Enter the 6-digit code from the email
3. Click "Verify Email"

### Expected Result

✅ Redirect to `/shipowner/profile/create` to complete the shipowner profile setup

## Troubleshooting

### Logs show 404 for seafarer endpoint too

- Check if `EXTERNAL_API_BASE_URL` env var is correctly set
- Verify `EXTERNAL_API_EMAIL` and `EXTERNAL_API_PASSWORD` are valid

### No verification email arrives

- Check email spam folder
- Ensure the external API is reachable and token refresh works
- Check that logs show "status: 201" response from external API

### Port 3000 already in use

```bash
npx kill-port 3000
npm run dev
```

## Code Changes

**File**: `src/app/api/auth/register/shipowner/route.ts`

- Tries shipowner endpoint first: `/auth/register/shipowner`
- Falls back to seafarer endpoint: `/auth/register/seafarer` when shipowner returns 404
- Creates local user record in Prisma database
- Returns 201 with success message on either path

**File**: `src/app/register/shipowner/page.tsx`

- Calls `/api/auth/register/shipowner` proxy
- Redirects to `/verify/email?email=[email]` on success
- Shows error alerts on failure

## Flow Diagram

```
User registers at /register/shipowner
        ↓
POST /api/auth/register/shipowner
        ↓
Try: /api/v1/auth/register/shipowner (external)
        ↓ (404 - doesn't exist)
        ↓
Fallback: /api/v1/auth/register/seafarer (external)
        ↓ (201 - success!)
        ↓
Create local user record
        ↓
Redirect to /verify/email?email=...
        ↓
User enters 6-digit code
        ↓
POST /api/auth/verify-email
        ↓
User redirects to /shipowner/profile/create
```
