# Firebase Database Setup Guide

## Problem
If you're seeing these issues:
- ❌ Data is not showing in the dashboard
- ❌ Error when creating new manual entries  
- ❌ Console shows "PERMISSION_DENIED" errors

This is most likely due to **Firebase Realtime Database rules** not being configured.

---

## Solution: Configure Firebase Database Rules

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **parking-system-939dd**
3. In the left sidebar, click **Realtime Database**
4. Click the **Rules** tab

### Step 2: Update Database Rules

Replace the existing rules with one of the following options:

#### Option A: For Development (Less Secure - Use Only for Testing)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
⚠️ **Warning**: This allows anyone to read/write your database. Only use during development!

#### Option B: Authenticated Users Only (Recommended)
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
✅ **Better**: Only authenticated users can access the database.

#### Option C: Production-Ready (Most Secure)
```json
{
  "rules": {
    "numberplate": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$entryId": {
        ".validate": "newData.hasChildren(['number_plate', 'date_time', 'vehicle_type', 'zone'])"
      }
    },
    "settings": {
      ".read": "auth != null",
      ".write": "auth != null",
      "rates": {
        ".validate": "newData.hasChildren(['car', 'bike', 'truck'])"
      }
    }
  }
}
```
✅ **Best**: Validates data structure and requires authentication.

### Step 3: Publish Rules
1. Click **Publish** button in the Firebase Console
2. Confirm the changes

---

## Step 4: Initialize Default Data (Optional)

If your database is empty, you can add sample data:

1. Go to **Realtime Database** > **Data** tab
2. Click on the root `/` node
3. Click the **+** button to add child nodes

### Add Sample Rates
```
/settings/rates
{
  "car": 20,
  "bike": 10,
  "truck": 50,
  "lastUpdated": "2026-03-03T00:00:00.000Z"
}
```

### Add Sample Entry (Optional)
```
/numberplate/{random-id}
{
  "number_plate": "TS15EL5671",
  "date_time": "03 Mar 2026, 10:30 am",
  "vehicle_type": "Car", 
  "zone": "Zone A",
  "rate_at_entry": 20
}
```

---

## Verify the Fix

1. **Clear your browser cache** (Ctrl+Shift+Delete)
2. **Reload the app** (Ctrl+R or F5)
3. **Check the browser console** (F12 → Console tab)
   - You should see: `"Subscribing to Firebase numberplate data..."`
   - Followed by: `"Firebase snapshot received"`
   - And: `"Processed entries: X"`

4. **Test Manual Entry**:
   - Click "New Entry" button
   - Fill in the form
   - Click "Register Entry"
   - Should show "Entry Registered!" success message

---

## Troubleshooting

### Still seeing errors?

#### Check 1: Verify Firebase Config
Open [src/config/firebase.js](src/config/firebase.js) and ensure:
- ✅ `databaseURL` is present
- ✅ All config values match your Firebase project

#### Check 2: Check Console Logs
Press F12 and look for:
- ❌ `"Firebase database is not initialized"` → Config issue
- ❌ `"PERMISSION_DENIED"` → Rules issue (see above)
- ❌ `"Network error"` → Internet connection issue

#### Check 3: Authentication
Make sure you're logged in:
1. Go to `/admin` route
2. Log in with your admin credentials
3. Firebase requires authentication for Option B and C rules

---

## Need More Help?

### Enable Detailed Logging
The app now includes detailed console logging. Open your browser console (F12) to see:
- Firebase connection status
- Data loading progress  
- Detailed error messages

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `PERMISSION_DENIED` | Database rules block access | Update rules (see above) |
| `Firebase database is not initialized` | Config issue | Check firebase.js config |
| `Network error` | No internet | Check connection |
| `Failed to fetch rate` | No rates in database | Add default rates (see above) |

---

## Quick Test Checklist

- [ ] Firebase rules updated
- [ ] Rules published  
- [ ] Browser cache cleared
- [ ] Logged in as admin
- [ ] Console shows "Firebase snapshot received"
- [ ] Can create manual entries
- [ ] Data shows in dashboard

---

**Last Updated**: March 3, 2026
