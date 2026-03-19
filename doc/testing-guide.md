# Testing Guide

Manual testing procedures and checklist for VeloxPark.

---

## Testing Overview

VeloxPark uses **manual testing** with comprehensive checklists. No automated testing framework is currently configured.

---

## Pre-Testing Setup

### 1. Test Data Preparation

Ensure Firebase has:
- At least 3 vehicles in `numberplate` node (legacy)
- At least 3 vehicles in `parkingLogs` node (PRD)
- Mix of parked and exited vehicles
- Sample rates configured in `settings/rates`

### 2. Test Environment

- Browser: Chrome, Firefox, Safari, Edge
- Network: Test on both WiFi and mobile data
- Devices: Desktop, tablet, mobile
- Firebase: Use test Firebase project (not production)

---

## User Panel Testing

### Test 1: Vehicle Search - Found

**Steps:**
1. Navigate to `/user`
2. Enter plate number: `TS15EL5671`
3. Click "Check Status"

**Expected:**
✅ Vehicle details appear
✅ Shows entry time
✅ If parked: "Currently Parked" status
✅ If exited: Duration and amount calculated

### Test 2: Vehicle Search - Not Found

**Steps:**
1. Enter non-existent plate: `XX99ZZ9999`
2. Click "Check Status"

**Expected:**
✅ Error message: "Vehicle not found. Please check the number plate and try again."
✅ No crash or console errors

### Test 3: Search Case Insensitivity

**Steps:**
1. Enter plate in lowercase: `ts15el5671`
2. Click "Check Status"

**Expected:**
✅ Finds vehicle (auto-converts to uppercase)
✅ Shows correct details

### Test 4: Search with Extra Spaces

**Steps:**
1. Enter: `  TS15EL5671  ` (with spaces)
2. Click "Check Status"

**Expected:**
✅ Trims spaces automatically
✅ Finds vehicle correctly

### Test 5: UPI Payment Flow

**Prerequisites:** Vehicle must have exited (amount calculated)

**Steps:**
1. Search for exited vehicle
2. Click "Proceed to Payment"
3. View QR code page

**Expected:**
✅ QR code displays correctly
✅ Amount shown matches calculated fee
✅ UPI ID from config.json used
✅ Clicking QR opens UPI app (mobile)

### Test 6: Payment Success Page

**Steps:**
1. From payment page, click "I've Paid"
2. View success page

**Expected:**
✅ Success message appears
✅ "Back to Home" button works

---

## Admin Dashboard Testing

### Test 7: Admin Login

**Steps:**
1. Navigate to `/admin`
2. Enter admin credentials
3. Click "Login"

**Expected:**
✅ Redirects to dashboard
✅ Shows statistics cards
✅ Shows vehicle table

### Test 8: Dashboard Statistics

**Steps:**
1. View dashboard KPI cards

**Expected:**
✅ Total Entries shows count
✅ Currently Parked shows active vehicles
✅ Total Exited Today shows count
✅ Total Revenue shows ₹ amount
✅ Values are accurate

### Test 9: Date Filter

**Steps:**
1. Select today's date from date picker
2. Check vehicle table

**Expected:**
✅ Only today's vehicles shown
✅ Statistics update accordingly
✅ Changing date updates table

### Test 10: Search by Plate

**Steps:**
1. Enter plate in search box: `TS15`
2. Observe results

**Expected:**
✅ Filters to matching plates
✅ Real-time search (no button needed)
✅ Case-insensitive matching

### Test 11: Manual Entry - Add Vehicle

**Steps:**
1. Click "Add Manual Entry" button
2. Fill form:
   - Plate: `NEW TEST 1234`
   - Type: `Car`
   - Zone: `Zone A`
3. Click "Add Vehicle"

**Expected:**
✅ Success message appears
✅ Vehicle appears in table immediately
✅ Firebase has new entry in `parkingLogs`
✅ Status is "Parked"
✅ Entry time is current time

### Test 12: Export PDF

**Steps:**
1. Click "Export PDF" button
2. Wait for download

**Expected:**
✅ PDF file downloads
✅ Contains vehicle data
✅ Includes statistics
✅ Formatted correctly

### Test 13: Settings - Update Rates

**Steps:**
1. Navigate to `/admin/settings`
2. Change rate: Car = 25 (from 20)
3. Click "Save"

**Expected:**
✅ Success message appears
✅ Firebase `settings/rates/car` = 25
✅ New entries use new rate

### Test 14: Admin Logout

**Steps:**
1. Click "Logout" button

**Expected:**
✅ Redirects to home page
✅ Cannot access `/admin` without login
✅ Session cleared

---

## Analytics Dashboard Testing

### Test 15: Analytics KPIs

**Steps:**
1. Navigate to `/admin/analytics`
2. View KPI cards

**Expected:**
✅ Total Revenue calculated correctly
✅ Average Duration shown in hours/minutes
✅ Peak Hour identified
✅ Total Sessions count accurate

### Test 16: Revenue Chart

**Steps:**
1. View revenue over time chart

**Expected:**
✅ Chart renders without errors
✅ Shows data for last 7-30 days
✅ Hover shows exact values

### Test 17: Zone Performance

**Steps:**
1. View top zones table

**Expected:**
✅ Shows all zones
✅ Revenue per zone calculated
✅ Session count per zone shown
✅ Sorted by revenue (highest first)

---

## Cross-Browser Testing

Test on all major browsers:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | [ ] Pass |
| Firefox | Latest | [ ] Pass |
| Safari | Latest | [ ] Pass |
| Edge | Latest | [ ] Pass |

**Test each:**
- User panel search
- Admin login
- Manual entry
- PDF export

---

## Mobile Testing

Test on mobile devices:

| Device | OS | Status |
|--------|-----|--------|
| iPhone | iOS 15+ | [ ] Pass |
| Android | 11+ | [ ] Pass |

**Mobile-specific tests:**
- Touch interactions
- QR code scanning
- Responsive layout
- UPI app integration

---

## Performance Testing

### Test 18: Load Time

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Clear cache
4. Navigate to `/admin`
5. Measure load time

**Expected:**
✅ Initial load < 3 seconds
✅ Dashboard data loads < 2 seconds
✅ No console errors

### Test 19: Real-time Updates

**Steps:**
1. Open dashboard in Browser A
2. Open Firebase Console in Browser B
3. Add entry in Firebase
4. Watch dashboard in Browser A

**Expected:**
✅ Dashboard updates automatically
✅ No page refresh needed
✅ Update appears within 1-2 seconds

### Test 20: Firebase Offline Mode

**Steps:**
1. Navigate to `/user`
2. Disconnect internet
3. Try to search vehicle

**Expected:**
✅ Falls back to local JSON data
✅ Shows vehicles from `public/numberplate.json`
✅ Error message if local data also fails

---

## Edge Cases & Error Handling

### Test 21: Empty Plate Search

**Steps:**
1. Leave plate input empty
2. Click "Check Status"

**Expected:**
✅ Validation error or no action
✅ No crash

### Test 22: Special Characters in Plate

**Steps:**
1. Enter: `TS@15#EL`
2. Try to search

**Expected:**
✅ Validation message
✅ Or filters special characters

### Test 23: Very Long Plate Number

**Steps:**
1. Enter 20-character plate

**Expected:**
✅ Input limited to 12 characters
✅ Or validation error shown

### Test 24: Firebase Connection Lost (Long-term)

**Steps:**
1. Open dashboard
2. Disconnect internet for 5 minutes
3. Reconnect

**Expected:**
✅ Reconnects automatically
✅ Data syncs
✅ No data loss

---

## Regression Testing

After any code changes, retest:

**Critical Paths:**
1. [ ] User vehicle search (Test 1-6)
2. [ ] Admin login (Test 7)
3. [ ] Manual entry creation (Test 11)
4. [ ] Real-time updates (Test 19)
5. [ ] Firebase read/write (Test 11, 13)

---

## Bug Reporting Template

When you find a bug:

```markdown
**Bug Title:** Brief description

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
(attach if relevant)

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Screen Size: 1920x1080
- Network: WiFi

**Console Errors:**
(paste any JavaScript errors)
``` **Test Coverage Summary**

| Category | Tests | Pass Rate Target |
|----------|-------|------------------|
| User Panel | 6 | 100% |
| Admin Dashboard | 8 | 100% |
| Analytics | 3 | 100% |
| Cross-Browser | 4 browsers | 100% |
| Mobile | 2 platforms | 95%+ |
| Performance | 3 | 90%+ |
| Edge Cases | 4 | 100% |

**Total Tests:** 28 core tests
**Estimated Time:** 2-3 hours for full suite

---

## Continuous Testing

**Before Every Release:**
1. Run full test suite
2. Test on at least 2 browsers
3. Test on mobile device
4. Verify Firebase integration
5. Check console for errors
6. Review performance metrics

**After Major Changes:**
1. Run regression tests
2. Test affected features
3. Verify backward compatibility

---

**Testing Complete!** ✅

For more information:
- [Troubleshooting Guide](./troubleshooting.md) - Known issues
- [User Manual](./user-manual.md) - User flows
- [Admin Manual](./admin-manual.md) - Admin operations
