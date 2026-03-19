# API Reference

Complete API documentation for VeloxPark services, utilities, hooks, and schemas.

---

## Table of Contents

### Services
- [firebaseService.js](#firebaseservicejs)
- [settingsService.js](#settingsservicejs)

### Utilities
- [parkingUtils.js](#parkingutilsjs)
- [schemaUtils.js](#schemautilsjs)
- [validation.js](#validationjs)

### Custom Hooks
- [useDashboardData.js](#usedashboarddatajs)
- [useAnalyticsData.js](#useanalyticsdatajs)
- [useExportPDF.js](#useexportpdfjs)
- [useMonthlyReport.js](#usemonthlyreportjs)

---

## firebaseService.js

**Location**: `src/services/firebaseService.js`

Firebase Realtime Database service with support for dual schema (legacy + PRD).

###  subscribeToNumberplates`(onSuccess, onError)`

Subscribes to real-time updates from both `numberplate` and `parkingLogs` Firebase nodes.

**Parameters:**
- `onSuccess` *(function)*: Callback with `{ rawData, processedData }`
- `onError` *(function)*: Error handler callback

**Returns:** `function` - Unsubscribe function

**Example:**
```javascript
import { subscribeToNumberplates } from './services/firebaseService';

const unsubscribe = subscribeToNumberplates(
  ({ rawData, processedData }) => {
    console.log('Raw entries:', rawData.length);
    console.log('Processed sessions:', processedData.length);

    // Update state
    setVehicles(processedData);
  },
  (error) => {
    console.error('Firebase error:', error);
    // Fallback to local data
  }
);

// Cleanup on unmount
return () => unsubscribe();
```

**Data Structure:**
```javascript
{
  rawData: [
    {
      id: '-N8xK4LmP3qR5tU9wX2z',
      plate: 'TS15EL5671',
      timestamp: '29/1/26 14:00',
      rate_at_entry: 20,
      // ... other legacy fields
    },
    {
      id: '-N8xK4LmP3qR5tU9wX3a',
      plate: 'MH12AB1234',
      inTime: '2026-03-01T08:30:00.000Z',
      outTime: '2026-03-01T10:45:00.000Z',
      status: 'exited',
      // ... other PRD fields
    }
  ],
  processedData: [
    {
      id: '-N8xK4LmP3qR5tU9wX3a',
      plate: 'MH12AB1234',
      inTime: '2026-03-01T08:30:00.000Z',
      outTime: '2026-03-01T10:45:00.000Z',
      duration: { hours: 2, minutes: 15, totalMinutes: 135 },
      amount: 60,
      status: 'exited',
      vehicleType: 'Car',
      zone: 'Zone A',
      // ... calculated fields
    }
  ]
}
```

###  `loadLocalFallback(onSuccess, onError)`

Loads local JSON fallback data when Firebase is unavailable.

**Parameters:**
- `onSuccess` *(function)*: Callback with `{ rawData, processedData }`
- `onError` *(function)*: Error handler

**Returns:** `Promise<void>`

**Example:**
```javascript
try {
  await loadLocalFallback(
    ({ processedData }) => {
      setVehicles(processedData);
      setOfflineMode(true);
    },
    (error) => console.error('Fallback load failed:', error)
  );
} catch (error) {
  console.error('No data available:', error);
}
```

###  `pushManualEntry(plate, type, zone)`

Creates new parking entry in Firebase `parkingLogs` node (PRD schema).

**Parameters:**
- `plate` *(string)*: Vehicle license plate (auto-uppercased)
- `type` *(string)*: Vehicle type (`'Car'|'Bike'|'Truck'|'EV'`)
- `zone` *(string)*: Parking zone (e.g., `'Zone A'`)

**Returns:** `Promise<string>` - Firebase push key (entry ID)

**Throws:** `Error` if Firebase write fails

**Example:**
```javascript
import { pushManualEntry } from './services/firebaseService';

// Create new entry
const handleAddVehicle = async () => {
  try {
    const entryId = await pushManualEntry(
      'TS15EL5671',
      'Car',
      'Zone A'
    );

    console.log('Entry created:', entryId);
    alert('Vehicle added successfully!');
  } catch (error) {
    console.error('Failed to add vehicle:', error);
    alert('Error: ' + error.message);
  }
};
```

**Created Entry Structure:**
```javascript
{
  plate: 'TS15EL5671',
  inTime: '2026-03-19T14:30:00.000Z',
  outTime: null,
  duration: null,
  amount: null,
  status: 'parked',
  vehicleType: 'Car',
  zone: 'Zone A',
  rateAtEntry: 20,           // Fetched from settings
  manualEntry: true,
  createdAt: '2026-03-19T14:30:00.000Z',
  createdBy: '<firebase_uid>',
  lastModified: '2026-03-19T14:30:00.000Z',
  schemaVersion: 2
}
```

###  `logoutAdmin()`

Signs out the current Firebase authenticated user.

**Returns:** `Promise<void>`

**Example:**
```javascript
import { logoutAdmin } from './services/firebaseService';

const handleLogout = async () => {
  try {
    await logoutAdmin();
    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

---

## settingsService.js

**Location**: `src/services/settingsService.js`

Manages parking rates and system settings in Firebase.

###  `getRates()`

Fetches current parking rates from Firebase `settings/rates` node.

**Returns:** `Promise<Object>` - Rates object

**Example:**
```javascript
import { getRates } from './services/settingsService';

const rates = await getRates();
console.log(rates);

// Output:
// {
//   car: 20,
//   bike: 10,
//   truck: 50,
//   lastUpdated: '2026-03-03T00:00:00.000Z'
// }
```

###  `updateRates(newRates)`

Updates parking rates in Firebase.

**Parameters:**
- `newRates` *(object)*: Rates object with `car`, `bike`, `truck` properties

**Returns:** `Promise<void>`

**Throws:** Error if update fails

**Example:**
```javascript
import { updateRates } from './services/settingsService';

const handleUpdateRates = async () => {
  try {
    await updateRates({
      car: 25,
      bike: 15,
      truck: 60
    });
    alert('Rates updated successfully!');
  } catch (error) {
    console.error('Failed to update rates:', error);
  }
};
```

###  `getRateForVehicleType(vehicleType)`

Gets rate for specific vehicle type.

**Parameters:**
- `vehicleType` *(string)*: `'Car'|'Bike'|'Truck'|'EV'`

**Returns:** `Promise<number>` - Rate per hour

**Example:**
```javascript
import { getRateForVehicleType } from './services/settingsService';

const carRate = await getRateForVehicleType('Car');
console.log(`Car parking: ₹${carRate}/hour`);

// Output: Car parking: ₹20/hour
```

---

## parkingUtils.js

**Location**: `src/utils/parkingUtils.js`

Core business logic for parking calculations and data processing.

###  `parseToDate(dateTimeStr)`

Parses various date/time formats into JavaScript Date object.

**Supported Formats:**
- ISO 8601: `2026-03-01T08:30:00.000Z`
- Legacy: `29/1/26 14:00`
- Locale: `03 Mar 2026 10:30 am`
- Short: `29-1-2026 14:00`

**Parameters:**
- `dateTimeStr` *(string)*: Timestamp in any supported format

**Returns:** `Date|null` - Parsed date or null if invalid

**Example:**
```javascript
import { parseToDate } from './utils/parkingUtils';

const date1 = parseToDate('2026-03-01T08:30:00.000Z');
const date2 = parseToDate('29/1/26 14:00');
const date3 = parseToDate('03 Mar 2026 10:30 am');

console.log(date1.toLocaleString());
// Output: 3/1/2026, 8:30:00 AM
```

###  `calculateDuration(entryTime, exitTime)`

Calculates parking duration between two timestamps.

**Parameters:**
- `entryTime` *(string)*: Entry timestamp
- `exitTime` *(string)*: Exit timestamp

**Returns:** `Object|null` - Duration object or null if invalid

**Example:**
```javascript
import { calculateDuration } from './utils/parkingUtils';

const duration = calculateDuration(
  '2026-03-01T08:30:00.000Z',
  '2026-03-01T10:45:00.000Z'
);

console.log(duration);
// Output:
// {
//   hours: 2,
//   minutes: 15,
//   totalMinutes: 135
// }
```

###  `calculateAmount(duration, rateAtEntry)`

Calculates parking fee based on duration and rate.

**Pricing Logic:**
- First 30 minutes: **FREE**
- After 30 minutes: **Charged per hour** (rounded up)

**Parameters:**
- `duration` *(object)*: Duration from `calculateDuration()`
- `rateAtEntry` *(number)*: Rate per hour (default: 20)

**Returns:** `number` - Amount in ₹

**Example:**
```javascript
import { calculateAmount, calculateDuration } from './utils/parkingUtils';

const dur1 = { hours: 0, minutes: 25, totalMinutes: 25 };
const amount1 = calculateAmount(dur1, 20);
console.log(amount1); // 0 (under 30 mins = free)

const dur2 = { hours: 1, minutes: 45, totalMinutes: 105 };
const amount2 = calculateAmount(dur2, 20);
console.log(amount2); // 40 (2 hours rounded up)

const dur3 = { hours: 2, minutes: 15, totalMinutes: 135 };
const amount3 = calculateAmount(dur3, 25);
console.log(amount3); // 75 (3 hours at ₹25/hr)
```

###  `formatDateTime(dateTimeStr)`

Formats timestamp to readable string.

**Parameters:**
- `dateTimeStr` *(string)*: Timestamp in any supported format

**Returns:** `string` - Formatted date/time

**Example:**
```javascript
import { formatDateTime } from './utils/parkingUtils';

const formatted = formatDateTime('2026-03-01T08:30:00.000Z');
console.log(formatted);
// Output: "1 Mar 2026, 8:30 AM"
```

###  `formatDuration(duration)`

Formats duration object to readable string.

**Parameters:**
- `duration` *(object)*: Duration from `calculateDuration()`

**Returns:** `string` - Formatted duration

**Example:**
```javascript
import { formatDuration } from './utils/parkingUtils';

const dur = { hours: 2, minutes: 15, totalMinutes: 135 };
const formatted = formatDuration(dur);
console.log(formatted);
// Output: "2h 15m"
```

###  `generateUPILink(amount, upiId, upiName, plate)`

Generates UPI payment deep link.

**Parameters:**
- `amount` *(number)*: Amount in ₹
- `upiId` *(string)*: UPI ID (e.g., `parking@upi`)
- `upiName` *(string)*: Payee name
- `plate` *(string)*: Vehicle plate (for transaction note)

**Returns:** `string` - UPI deep link

**Example:**
```javascript
import { generateUPILink } from './utils/parkingUtils';

const upiLink = generateUPILink(
  60,
  'abhikakadiya1043@okaxis',
  'ParkMeee',
  'TS15EL5671'
);

console.log(upiLink);
// Output: upi://pay?pa=abhikakadiya1043@okaxis&pn=ParkMeee&tn=Parking%20-%20TS15EL5671&am=60&cu=INR
```

###  `processParkingData(rawData)`

Processes raw database entries into parking sessions. Handles both schemas.

**Parameters:**
- `rawData` *(array)*: Array of raw entries from Firebase

**Returns:** `array` - Processed parking sessions (sorted newest-first)

**Example:**
```javascript
import { processParkingData } from './utils/parkingUtils';

const processed = processParkingData(rawData);
console.log(processed);
// Output: Array of sessions with calculated fields
```

---

## schemaUtils.js

**Location**: `src/utils/schemaUtils.js`

Utilities for handling dual database schemas (legacy + PRD).

###  `normalizeEntry(entry)`

Normalizes entry from any schema to canonical field names.

**Parameters:**
- `entry` *(object)*: Raw database entry

**Returns:** `object|null` - Normalized entry

**Example:**
```javascript
import { normalizeEntry } from './utils/schemaUtils';

// Legacy entry
const legacy = { number_plate: 'TS15EL5671', date_time: '29/1/26 14:00' };
const normalized1 = normalizeEntry(legacy);
console.log(normalized1);
// Output: { plate: 'TS15EL5671', inTime: '29/1/26 14:00' }

// PRD entry
const prd = { plate: 'MH12AB1234', inTime: '2026-03-01T08:30:00.000Z', status: 'parked' };
const normalized2 = normalizeEntry(prd);
console.log(normalized2);
// Output: { plate: 'MH12AB1234', inTime: '2026-03-01T08:30:00.000Z', status: 'parked' }
```

###  `validateEntry(entry)`

Validates if entry has required fields.

**Parameters:**
- `entry` *(object)*: Database entry

**Returns:** `boolean` - True if valid

**Example:**
```javascript
import { validateEntry } from './utils/schemaUtils';

const valid = validateEntry({ plate: 'TS15EL5671', inTime: '...' });
console.log(valid); // true

const invalid = validateEntry({ inTime: '...' }); // Missing plate
console.log(invalid); // false
```

---

## validation.js

**Location**: `src/utils/validation.js`

Input validation utilities for license plates, vehicle types, zones, and rates.

###  `validateLicensePlate(plate)`

Validates Indian license plate format.

**Format:** XX00XX0000 (e.g., TS15EL5671, MH12AB1234)

**Parameters:**
- `plate` *(string)*: License plate to validate

**Returns:** `object` - `{ valid, message?, cleaned? }`

**Example:**
```javascript
import { validateLicensePlate } from './utils/validation';

const result1 = validateLicensePlate('TS15EL5671');
console.log(result1);
// { valid: true, cleaned: 'TS15EL5671' }

const result2 = validateLicensePlate('  ts15el5671  ');
console.log(result2);
// { valid: true, cleaned: 'TS15EL5671' }

const result3 = validateLicensePlate('abc123');
console.log(result3);
// { valid: false, message: 'Invalid format. Use XX00XX0000...' }
```

###  `validateVehicleType(type)`

Validates vehicle type.

**Valid Types:** Car, Bike, Truck, EV

**Returns:** `boolean`

**Example:**
```javascript
import { validateVehicleType } from './utils/validation';

validateVehicleType('Car');   // true
validateVehicleType('Bus');   // false
```

###  `validateRate(rate)`

Validates parking rate (must be positive number).

**Returns:** `object` - `{ valid, message? }`

**Example:**
```javascript
import { validateRate } from './utils/validation';

validateRate(20);   // { valid: true }
validateRate(-5);   // { valid: false, message: 'Rate cannot be negative' }
validateRate('x'); // { valid: false, message: 'Rate must be a valid number' }
```

---

## useDashboardData.js

**Location**: `src/hooks/useDashboardData.js`

Custom hook for dashboard data management with filtering and searching.

###  `useDashboardData()`

**Returns:** `object` - Dashboard state and methods

**Example:**
```javascript
import useDashboardData from './hooks/useDashboardData';

function AdminDashboard() {
  const {
    allVehicles,      // All vehicles (unfiltered)
    vehicles,         // Filtered vehicles
    stats,            // Statistics
    loading,          // Loading state
    error,            // Error state
    filters,          // Current filters
    searchTerm,       // Search term
    setSearchTerm,    // Set search
    setFilters,       // Set filters
    refreshData       // Manual refresh
  } = useDashboardData();

  return (
    <div>
      <Stats data={stats} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <VehicleTable data={vehicles} />
    </div>
  );
}
```

**Filters Object:**
```javascript
{
  date: '2026-03-19',      // Filter by specific date (yyyy-mm-dd)
  status: 'all',            // 'all' | 'parked' | 'exited'
  zone: 'all',              // 'all' | 'Zone A' | 'Zone B' | ...
  vehicleType: 'all'        // 'all' | 'Car' | 'Bike' | 'Truck' | 'EV'
}
```

**Stats Object:**
```javascript
{
  totalEntries: 150,
  parkedNow: 23,
  exitedToday: 127,
  totalRevenue: 2540,
  avgDuration: { hours: 1, minutes: 45 }
}
```

---

## useAnalyticsData.js

**Location**: `src/hooks/useAnalyticsData.js`

Custom hook for analytics calculations and data aggregation.

###  `useAnalyticsData(vehicles)`

**Parameters:**
- `vehicles` *(array)*: Array of parking sessions

**Returns:** `object` - Analytics data

**Example:**
```javascript
import useAnalyticsData from './hooks/useAnalyticsData';

function AnalyticsDashboard() {
  const { vehicles } = useDashboardData();
  const analytics = useAnalyticsData(vehicles);

  return (
    <div>
      <KPICards data={analytics.kpis} />
      <RevenueChart data={analytics.revenueByDate} />
      <DurationChart data={analytics.durationDistribution} />
      <TopZonesTable zones={analytics.topZones} />
    </div>
  );
}
```

**Analytics Object:**
```javascript
{
  kpis: {
    totalRevenue: 15420,
    totalSessions: 487,
    avgDuration: 92,           // minutes
    peakHour: '14:00'
  },
  revenueByDate: [
    { date: '2026-03-01', amount: 1240 },
    { date: '2026-03-02', amount: 1580 },
    // ...
  ],
  durationDistribution: [
    { range: '0-30min', count: 45 },
    { range: '30-60min', count: 120 },
    { range: '1-2hrs', count: 180 },
    // ...
  ],
  topZones: [
    { zone: 'Zone A', revenue: 5230, sessions: 142 },
    { zone: 'Zone B', revenue: 4120, sessions: 118 },
    // ...
  ],
  peakHours: [
    { hour: '08:00', count: 45 },
    { hour: '14:00', count: 67 },
    // ...
  ]
}
```

---

## useExportPDF.js

**Location**: `src/hooks/useExportPDF.js`

Custom hook for exporting dashboard data to PDF.

###  `useExportPDF()`

**Returns:** `function` - Export function

**Example:**
```javascript
import useExportPDF from './hooks/useExportPDF';

function Dashboard() {
  const { vehicles } = useDashboardData();
  const exportPDF = useExportPDF();

  const handleExport = () => {
    exportPDF(vehicles, {
      filename: 'parking-report-2026-03-19',
      title: 'Parking Report',
      includeStats: true
    });
  };

  return (
    <button onClick={handleExport}>
      Export to PDF
    </button>
  );
}
```

---

## useMonthlyReport.js

**Location**: `src/hooks/useMonthlyReport.js`

Custom hook for generating monthly reports.

###  `useMonthlyReport(vehicles, month, year)`

**Parameters:**
- `vehicles` *(array)*: All parking sessions
- `month` *(number)*: Month (1-12)
- `year` *(number)*: Year

**Returns:** `object` - Monthly report data

**Example:**
```javascript
import useMonthlyReport from './hooks/useMonthlyReport';

function MonthlyReport() {
  const { vehicles } = useDashboardData();
  const report = useMonthlyReport(vehicles, 3, 2026); // March 2026

  return (
    <div>
      <h2>March 2026 Report</h2>
      <p>Total Revenue: ₹{report.totalRevenue}</p>
      <p>Total Sessions: {report.totalSessions}</p>
      <p>Average per Day: ₹{report.avgRevenuePerDay}</p>
    </div>
  );
}
```

---

## Common Patterns

### Real-time Data Subscription

```javascript
import { useEffect, useState } from 'react';
import { subscribeToNumberplates } from './services/firebaseService';

function MyComponent() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToNumberplates(
      ({ processedData }) => setVehicles(processedData),
      (error) => console.error(error)
    );

    return () => unsubscribe();
  }, []);

  return <VehicleList vehicles={vehicles} />;
}
```

### Manual Entry with Validation

```javascript
import { pushManualEntry } from './services/firebaseService';
import { validateLicensePlate, validateVehicleType } from './utils/validation';

const handleSubmit = async (formData) => {
  // Validate
  const plateValidation = validateLicensePlate(formData.plate);
  if (!plateValidation.valid) {
    alert(plateValidation.message);
    return;
  }

  if (!validateVehicleType(formData.vehicleType)) {
    alert('Invalid vehicle type');
    return;
  }

  // Create entry
  try {
    const entryId = await pushManualEntry(
      plateValidation.cleaned,
      formData.vehicleType,
      formData.zone
    );
    alert('Vehicle added!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### Calculating Total Amount

```javascript
import { calculateDuration, calculateAmount } from './utils/parkingUtils';

const getTotalAmount = (inTime, outTime, rateAtEntry) => {
  const duration = calculateDuration(inTime, outTime);
  if (!duration) return 0;

  const amount = calculateAmount(duration, rateAtEntry);
  return amount;
};

// Example
const total = getTotalAmount(
  '2026-03-01T08:30:00.000Z',
  '2026-03-01T10:45:00.000Z',
  20
);
console.log(`Total: ₹${total}`);
// Output: Total: ₹60
```

---

## Error Handling

All async functions can throw errors. Always use try-catch:

```javascript
try {
  await pushManualEntry('TS15EL5671', 'Car', 'Zone A');
} catch (error) {
  console.error('[Firebase Error]', error.code, error.message);

  // Handle specific errors
  if (error.code === 'PERMISSION_DENIED') {
    alert('You do not have permission to add vehicles');
  } else if (error.code === 'NETWORK_ERROR') {
    alert('Network error. Check your internet connection.');
  } else {
    alert('An error occurred: ' + error.message);
  }
}
```

---

## TypeScript Types (Reference)

If migrating to TypeScript, use these type definitions:

```typescript
// types.ts

interface ParkingEntry {
  id: string;
  plate: string;
  inTime: string;
  outTime: string | null;
  duration: Duration | null;
  amount: number | null;
  status: 'parked' | 'exited';
  vehicleType: 'Car' | 'Bike' | 'Truck' | 'EV';
  zone: string;
  rateAtEntry: number;
  manualEntry: boolean;
}

interface Duration {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

interface Stats {
  totalEntries: number;
  parkedNow: number;
  exitedToday: number;
  totalRevenue: number;
  avgDuration: Duration;
}

interface Rates {
  car: number;
  bike: number;
  truck: number;
  lastUpdated: string;
}
```

---

**API Reference Complete!** 🎉

For more information:
- [Database Schema](./database-schema.md) - Schema details
- [Component Guide](./component-guide.md) - React components
- [Troubleshooting](./troubleshooting.md) - Common issues
