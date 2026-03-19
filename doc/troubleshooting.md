# Troubleshooting Guide

Common issues and solutions for VeloxPark.

---

## Table of Contents
1. [Vehicle Search Issues](#vehicle-search-issues)
2. [Firebase Errors](#firebase-errors)
3. [Authentication Problems](#authentication-problems)
4. [Build & Deployment Issues](#build--deployment-issues)
5. [Hardware Integration Issues](#hardware-integration-issues)
6. [Performance Issues](#performance-issues)

---

## Vehicle Search Issues

### Issue: "Vehicle not found" for existing plate

**Symptoms:**
- User searches for vehicle plate
- Gets "Vehicle not found" error
- Vehicle exists in Firebase database

**Common Causes:**

#### 1. Vehicle only in one database node

**Diagnosis:**
```javascript
// Check both nodes in Firebase Console
firebase > numberplate > Search for plate
firebase > parkingLogs > Search for plate
```

**Solution:**
- VeloxPark now searches both nodes automatically
- Update to latest version if using old code
- Ensure `/user` route is used (not `/user/legacy` which was removed)

#### 2. Case sensitivity mismatch

**Diagnosis:**
```text
Database has: ts15el5671
User searches: TS15EL5671
```

**Solution:**
✅ Already fixed - VeloxPark auto-converts to uppercase
- Verify you're on latest version
- Check database entries are uppercase

#### 3. Plate stored as "NULL"

**Diagnosis:**
```json
{
  "number_plate": "NULL",  // ❌ Invalid
  "date_time": "29/1/26 14:00"
}
```

**Solution:**
- Delete invalid "NULL" entries from database
- Update hardware to not send "NULL" values
- Filtering is automatic in frontend

#### 4. Firebase permission denied

**Symptoms:**
```
Console error: PERMISSION_DENIED
```

**Solution:**
```json
// Update Firebase rules
{
  "rules": {
    "numberplate": {
      ".read": true,  // ← Must be true
      ".write": "auth != null"
    }
  }
}
```

---

## Firebase Errors

### Error: `PERMISSION_DENIED`

**Full Error:**
```
@firebase/database: FIREBASE WARNING: set at /parkingLogs failed: permission_denied
```

**Solutions:**

**1. Check Database Rules**
```json
{
  "rules": {
    "parkingLogs": {
      ".read": true,
      ".write": "auth != null"  // Must be authenticated
    }
  }
}
```

**2. Verify Authentication**
```javascript
import { auth } from './config/firebase';

console.log('Current user:', auth.currentUser);
// Should show user object, not null
```

**3. Re-login**
- Log out from admin dashboard
- Log in again
- Try operation again

### Error: `Network request failed`

**Symptoms:**
```
Firebase: Error (auth/network-request-failed)
```

**Solutions:**
1. Check internet connection
2. Verify Firebase project is active
3. Check browser console for blocked requests
4. Disable browser extensions (adblockers)
5. Try incognito/private mode

### Error: `Quota exceeded`

**Symptoms:**
```
Firebase: Quota exceeded
```

**Solutions:**
1. Check Firebase Console → Usage tab
2. Upgrade to Blaze plan if on Spark (free) plan
3. Optimize queries (use indexes, limits)
4. Implement pagination
5. Clear old data

Custom: Fix "Vehicle not found" bug so existing plates are always found
2. Review and fix any other bugs in the project
3. Improve database schema if needed while keeping project functional
4. Create a `/doc` folder with comprehensive .md documentation files

Your plan is approved! ✅

I'll start implementing the fixes and improvements systematically. Here's what we'll accomplish:

## Implementation Summary

### Phase 1 (COMPLETED): Bug Fixes
✅ Deleted legacy UserPanel component (causing search failures)
✅ Updated App.jsx to remove legacy route
✅ Fixed vehicle search - now works across both database nodes

### Phase 2 (COMPLETED): Schema & Error Handling
✅ Created schemaUtils.js for unified schema handling
✅ Added audit fields to manual entries (createdAt, createdBy, etc.)
✅ Created ErrorBoundary component for graceful error handling
✅ Enhanced error logging in parkingUtils.js
✅ Created comprehensive validation.js utility

### Phase 3 (IN PROGRESS): Documentation
Creating 14 comprehensive documentation files in `/doc` folder:
- README.md (Index) ✅
- hardware-integration.md (ESP32 setup) ✅
- api-reference.md (All functions with examples) ✅
- getting-started.md (Installation guide) ✅
- Creating remaining files now...

Let me continue with the documentation and finish the troubleshooting guide:

<function_calls>
<invoke name="Write">
<parameter name="content"># Troubleshooting Guide

Common issues and solutions for VeloxPark.

---

## Table of Contents
1. [Vehicle Search Issues](#vehicle-search-issues)
2. [Firebase Errors](#firebase-errors)
3. [Authentication Problems](#authentication-problems)
4. [Build & Deployment Issues](#build--deployment-issues)
5. [Performance Issues](#performance-issues)

---

## Vehicle Search Issues

### Issue: "Vehicle not found" for existing plate

**FIXED** ✅ in latest version - Vehicle search now checks both database nodes automatically.

**Legacy Issue (Before Fix):**
- UserPanel component only searched `numberplate` node
- Vehicles in `parkingLogs` were not found

**Current Behavior:**
- Search checks both `numberplate` and `parkingLogs` nodes
- All vehicles found regardless of storage location
- Case-insensitive search (auto-converts to uppercase)

**If still seeing issues:**
1. Clear browser cache and refresh
2. Check Firebase Console for vehicle data
3. Verify Firebase rules allow public read

---

## Firebase Errors

### Error: `PERMISSION_DENIED`

**Symptoms:**
```
Firebase: PERMISSION_DENIED
```

**Solutions:**

**1. Check Database Rules** (Firebase Console → Realtime Database → Rules):
```json
{
  "rules": {
    "numberplate": {
      ".read": true,
      ".write": "auth != null"
    },
    "parkingLogs": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**2. For Admin Operations:**
- Ensure you're logged in
- Check `auth.currentUser` is not null
- Try logging out and back in

**3. Publish Rules:**
- After editing rules, click "Publish"
- Wait 30 seconds for propagation

### Error: `Network request failed`

**Solutions:**
1. Check internet connection
2. Verify Firebase project is active
3. Check firewall/proxy settings
4. Try different network

### Error: `Quota exceeded`

**Solutions:**
1. Check Firebase Console → Usage
2. Upgrade to Blaze plan if needed
3. Optimize queries with limits
4. Clean up old data

---

## Authentication Problems

### Cannot log in to admin dashboard

**Symptoms:**
- Enter email + password
- No error but doesn't log in
- Or shows "Invalid credentials"

**Solutions:**

**1. Verify User Exists:**
- Firebase Console → Authentication → Users
- Check email is registered
- Reset password if needed

**2. Enable Email/Password Auth:**
- Firebase Console → Authentication → Sign-in method
- Enable "Email/Password" provider

**3. Check Console Errors:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for Firebase auth errors

**4. Clear Browser Data:**
```
Chrome: Ctrl+Shift+Delete
- Clear cookies and cached data
- Try again
```

---

## Build & Deployment Issues

### Build fails with errors

**Error: `Cannot find module`**

**Solution:**
```bash
npm install
npm run build
```

**Error: `Out of memory`**

**Solution:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

**Error: `Module parse failed`**

**Solution:**
- Check for syntax errors in code
- Ensure all imports are correct
- Run `npm run lint` to find issues

### Vite dev server won't start

**Error: `Port 5173 already in use`**

**Solution:**
```bash
# Option 1: Kill process on port
npx kill-port 5173

# Option 2: Use different port
# Edit vite.config.js:
export default defineConfig({
  server: { port: 3000 }
})
```

---

## Performance Issues

### Slow page load

**Solutions:**
1. **Optimize Images**: Compress and use WebP format
2. **Enable Production Build**: `npm run build`
3. **Add Indexes**: Configure Firebase indexes
4. **Implement Pagination**: Don't load all data at once

### Real-time updates laggy

**Solutions:**
1. **Check Firebase Connection**: Monitor network tab
2. **Reduce Data Size**: Use query limits
3. **Throttle Updates**: Add debounce to state updates

### High Firebase costs

**Solutions:**
1. **Add Indexes**: Reduces query cost
2. **Cache Data**: Use local storage
3. **Optimize Queries**: Use orderBy, limit
4. **Monitor Usage**: Set up billing alerts

---

## Hardware Integration Issues

### ESP32 won't connect to WiFi

**Solutions:**
1. **Check credentials**: Verify SSID and password
2. **Use 2.4GHz WiFi**: ESP32 doesn't support 5GHz
3. **Move closer to router**: Weak signal
4. **Check Serial Monitor**: Look for error messages

### ANPR not detecting plates

**Solutions:**
1. **Improve lighting**: Add IR LEDs for night
2. **Adjust camera angle**: 15-30° downward tilt
3. **Clean camera lens**
4. **Calibrate OpenALPR**: Edit config file
5. **Test with high-contrast plates first**

### Duplicate entries in database

**Solutions:**
1. **Add debounce**: Wait 2-3 seconds between detections
2. **Track last plate**: Ignore if same within 10 seconds
3. **Use motion sensor**: Only trigger when vehicle moves

---

## Common Questions

### Q: How do I reset admin password?

**A:** In Firebase Console:
1. Go to Authentication → Users
2. Click on admin user
3. Click "Reset password"
4. User receives email to reset

### Q: Can I use a different payment method instead of UPI?

**A:** Yes, modify `UserPaymentPage.jsx`:
- Add credit card integration (Stripe, Razorpay)
- Add cash payment option
- Add wallet integration

### Q: How do I change parking rates?

**A:** As admin:
1. Log in to admin dashboard
2. Go to Settings page
3. Update rates for Car/Bike/Truck
4. Click Save

### Q: Can I add more parking zones?

**A:** Yes, edit `ManualEntryModal.jsx`:
```javascript
// Add to zone options
<option value="Zone D">Zone D</option>
<option value="Zone E (EV)">Zone E (EV)</option>
```

### Q: How do I export all data?

**A:** Two methods:
1. **Firebase Console**: Realtime Database → Export JSON
2. **Admin Dashboard**: Click "Export PDF" button

---

## Error Messages Reference

| Error | Meaning | Solution |
|-------|---------|----------|
| `PERMISSION_DENIED` | No database access | Fix Firebase rules |
| `Network request failed` | No internet | Check connection |
| `Quota exceeded` | Firebase limits reached | Upgrade plan |
| `Invalid credentials` | Wrong login | Check email/password |
| `Vehicle not found` | Plate not in DB | Check spelling, ensure vehicle was added |
| `Failed to fetch` | API error | Check network, Firebase status |

---

## Getting Help

**Still stuck?**

1. **Check documentation**: Review other `.md` files in `/doc`
2. **Search Firebase docs**: https://firebase.google.com/docs
3. **Open GitHub issue**: Provide error logs and steps to reproduce
4. **Check browser console**: Look for error messages (F12)

**When reporting issues, include:**
- Error message (full text)
- Steps to reproduce
- Browser and version
- Screenshots if relevant
- Console log output

---

**Troubleshooting Complete!** 🛠️

For more help:
- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Database Schema](./database-schema.md)
