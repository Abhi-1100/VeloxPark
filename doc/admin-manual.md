# Admin Manual

Administrator operations guide for VeloxPark.

---

## Admin Access

**Login:**
1. Navigate to `/admin`
2. Enter admin email and password
3. Click "Login"

**Logout:**
- Click "Logout" button in top-right corner

---

## Dashboard Overview

### Statistics Cards
- **Total Entries**: All parking records
- **Currently Parked**: Active vehicles now
- **Total Exited Today**: Vehicles that left today
- **Total Revenue**: Total earnings

### Vehicle Table
- Real-time list of parking records
- Columns: Plate, Entry, Exit, Duration, Amount, Status
- Sortable by clicking column headers

---

## Common Operations

### 1. Add Manual Entry

**When to use:** Hardware failure, manual vehicle registration

**Steps:**
1. Click "Add Manual Entry" button
2. Fill form:
   - **License Plate**: Enter plate number
   - **Vehicle Type**: Select Car/Bike/Truck/EV
   - **Parking Zone**: Select zone
3. Click "Add Vehicle"
4. Vehicle appears in table with "Parked" status

**Notes:**
- Current rate automatically applied
- Entry time set to now
- Cannot add duplicate active entries

### 2. Filter Records

**By Date:**
- Click date picker at top
- Select date
- Table shows only that date's records
- Statistics update automatically

**By Search:**
- Type in search box
- Filters by license plate
- Real-time filtering (no button needed)

### 3. Export Data

**PDF Export:**
1. Filter data as needed (date, search)
2. Click "Export PDF" button
3. PDF downloads with:
   - Statistics summary
   - Vehicle table
   - Timestamp

**Firebase Export:**
1. Go to Firebase Console
2. Realtime Database → ⋮ menu
3. Click "Export JSON"
4. Save file

### 4. Update Parking Rates

**Steps:**
1. Navigate to `/admin/settings`
2. Change rates:
   - Car (default: ₹20/hour)
   - Bike (default: ₹10/hour)
   - Truck (default: ₹50/hour)
3. Click "Save"
4. New entries use updated rates

**Important:** Changing rates does NOT affect existing entries (they use rate at entry time).

---

## Analytics Dashboard

**Access:** Navigate to `/admin/analytics`

**Available Insights:**
- Revenue trends over time
- Parking duration distribution
- Top-performing zones
- Peak hours analysis
- Vehicle type breakdown

**Use Cases:**
- Identify busiest times
- Optimize staff scheduling
- Plan rate adjustments
- Zone capacity planning

---

## Best Practices

### Daily Tasks
- ☐ Review overnight entries
- ☐ Check for anomalies
- ☐ Verify hardware is online
- ☐ Respond to user queries

### Weekly Tasks
- ☐ Export data for records
- ☐ Review analytics trends
- ☐ Clean up test entries
- ☐ Check Firebase usage/costs

### Monthly Tasks
- ☐ Generate monthly report
- ☐ Analyze revenue trends
- ☐ Review rate effectiveness
- ☐ Plan improvements

---

## Troubleshooting

**Real-time updates not working:**
- Check internet connection
- Refresh browser
- Check Firebase Console for issues

**Cannot add manual entry:**
- Ensure you're logged in
- Check Firebase write permissions
- Verify plate format (4-12 chars)

**PDF export fails:**
- Check browser allows downloads
- Ensure data is loaded
- Try different browser

---

## Security Guidelines

✅ **DO:**
- Log out when leaving computer
- Use strong password
- Change password regularly
- Only share credentials with authorized staff

❌ **DON'T:**
- Save password in browser on shared computers
- Share login credentials
- Leave admin panel open unattended

---

## Data Privacy

**Sensitive Data:**
- License plates are personal data
- Handle in compliance with privacy laws
- Do not share without authorization

**Data Retention:**
- Archive old records periodically
- Follow organization's retention policy

---

For technical issues, see [Troubleshooting Guide](./troubleshooting.md).
