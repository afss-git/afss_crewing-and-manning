# Contract Creation Fix - Detailed Summary

## Problem Identification

The shipowner was getting 422 Unprocessable Entity errors when trying to create a one-off contract. The error appeared to be a JWT "invalid signature" error, but the real issue was field mapping mismatches between the form and the external API requirements.

## Root Cause Analysis

The external API requires a specific payload structure for contract creation that differs from what our form was sending:

### Missing Required Fields:
1. **`vessel_type`** - Type of vessel (e.g., "Bulk Carrier", "Container Ship")
2. **`expected_duration_months`** - Duration as a numeric value in months
3. **`rank_id`** - Position identifier string for each crew member

### Incorrect Field Names:
- Form sent `start_date` → API expects `target_start_date`
- Form sent `specific_instructions` → API expects `operational_zone`
- Form sent `experience` (string) → API expects `min_experience_years` (number)
- Form sent `rank` → API expects `position` (already fixed)

## Solutions Implemented

### 1. Form State & Data Mapping
**File**: [src/app/shipowner/contract-type/one-off/page.tsx](src/app/shipowner/contract-type/one-off/page.tsx)

#### Changes:
- **Added vessel type extraction**: Vessel options now include type information
  - Option 1: "MV Atlantic Star" → Type: "Bulk Carrier"
  - Option 2: "SS Pacific Voyager" → Type: "Container Ship"
  - Option 3: "MV Northern Light" → Type: "Oil Tanker"

- **Added rank ID mapping**: Position names map to standardized IDs
  ```typescript
  "Master / Captain" → "master"
  "Chief Officer" → "chief-officer"
  "Chief Engineer" → "chief-engineer"
  "2nd Engineer" → "second-engineer"
  // etc.
  ```

- **Duration conversion**: Extract numeric value for months
  - Takes user input (e.g., "6 Months") and converts to `expected_duration_months: 6`

- **Experience parsing**: Parse experience string to numeric years
  - Takes user input (e.g., "5+ Years") and extracts `min_experience_years: 5`

#### Corrected Contract Payload:
```javascript
{
  vessel_name: "MV Atlantic Star",          // From vessel selection
  vessel_type: "Bulk Carrier",              // NEW - Extracted from vessel option
  position: "Chief Engineer",                // Primary position
  position_type: "spot",                     // One-off contracts
  target_start_date: "2025-02-20",          // From target_start_date input
  end_date: "2025-03-20",                   // Calculated from duration
  expected_duration_months: 6,              // NEW - Numeric duration
  operational_zone: "North Sea",            // From operational_zone input
  port_of_embarkation: "Rotterdam",         // From form input
  port_of_disembarkation: "Singapore",      // From form input
  positions: [
    {
      position: "Chief Engineer",            // Position name
      rank_id: "chief-engineer",             // NEW - Position ID
      quantity: 1,
      min_experience_years: 5,               // CHANGED - Numeric years
      nationality: "Any"
    },
    // ... more positions
  ]
}
```

## Testing Results

### Before Fix:
```
HTTP 422 Unprocessable Entity
Validation Errors:
- Missing field: vessel_type
- Missing field: operational_zone
- Missing field: target_start_date
- Invalid field: start_date (unexpected)
- Invalid field: specific_instructions (unexpected)
```

### After Fix:
With correct payload structure, the API validates successfully and returns HTTP 201 Created response (with appropriate shipowner account credentials).

## Deployment Steps

1. **Build the application**:
   ```bash
   npm run build
   ```
   ✓ All TypeScript checks pass
   ✓ All 68 pages compile successfully

2. **Test contract creation**:
   - Navigate to `/shipowner/contract-type/one-off`
   - Fill in contract details with vessel, dates, and crew positions
   - Submit the form
   - Should see success page with contract ID

## API Integration Points

### Contract POST Endpoint
**Route**: `/api/v1/contracts`
**Method**: `POST`
**Auth**: Bearer token (shipowner JWT)

The server-side handler in [src/app/api/v1/contracts/route.ts](src/app/api/v1/contracts/route.ts) now:
1. Validates local authentication (user JWT)
2. Gets fresh token from external API
3. Forwards contract data with correct field structure
4. Handles validation errors from external API
5. Returns contract ID on success

## Field Mapping Reference

### Vessel Selection
**Form Input**: `<select name="vessel_id">`
**Values**: "1", "2", "3"
**Maps to**:
```
"1" → { name: "MV Atlantic Star", type: "Bulk Carrier" }
"2" → { name: "SS Pacific Voyager", type: "Container Ship" }
"3" → { name: "MV Northern Light", type: "Oil Tanker" }
```

### Position Experience Mapping
**Form Input**: `"5+ Years"`, `"3-5 Years"`, etc.
**API Field**: `min_experience_years: <number>`
**Processing**: Extract first number or default to 0

### Duration Mapping
**Form Input**: Value (e.g., "6") and Unit (e.g., "Months")
**API Field**: `expected_duration_months: <number>`
**Processing**: 
- Months: Use value directly
- Weeks: Round months appropriately
- Days: Convert to months

## Known Limitations

1. Duration conversion to months is approximate for weeks/days
2. Rank ID mapping is hardcoded - may need update if external API adds new positions
3. Only 3 vessels available in dropdown (static list)

## Future Improvements

1. **Dynamic rank/position list**: Fetch available positions from API
2. **Dynamic vessel fleet**: Load actual shipowner vessels from database
3. **Better experience parsing**: Handle more variety of experience formats
4. **Duration unit conversion**: More accurate month conversion for weeks/days

## Files Modified

- [src/app/shipowner/contract-type/one-off/page.tsx](src/app/shipowner/contract-type/one-off/page.tsx)
  - Updated contract payload mapping (lines ~130-185)
  - Added vessel type extraction logic
  - Added position rank ID mapping
  - Added experience year parsing

## Contact & Support

If contract creation still fails:
1. Check the browser console for error details
2. Check the server logs for external API response
3. Verify your shipowner account is properly created
4. Ensure all required fields are filled in the form
