# System Architecture

High-level overview of VeloxPark architecture and design patterns.

---

## Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 8.0
- **Routing**: React Router DOM 7.13.0
- **Styling**: Tailwind CSS 4.1.18 + Custom CSS
- **Charts**: Custom SVG/Canvas implementations
- **QR Generation**: qrcode.react 4.2.0
- **PDF Export**: jsPDF 4.1.0 + jspdf-autotable 5.0.7

### Backend & Services
- **Database**: Firebase Realtime Database (NoSQL)
- **Authentication**: Firebase Auth (Email/Password)
- **Hosting**: Static (Vercel/Netlify/Firebase Hosting)

### Hardware
- **Microcontroller**: ESP32-WROOM-32
- **Camera**: OpenALPR compatible ANPR camera

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        VeloxPark System                      │
└─────────────────────────────────────────────────────────────┘

[User Devices]          [Admin Devices]        [Hardware]
     │                         │                    │
     │                         │                    │
  Browser                   Browser              ESP32
     │                         │                    │
     └─────────┬───────────────┘                    │
               │                                    │
          [React App]                               │
               │                                    │
        ┌──────┴──────┐                            │
        │   Routes    │                            │
        └──────┬──────┘                            │
               │                                    │
      ┌────────┼────────┐                          │
      │        │        │                          │
  [User]  [Admin]  [Analytics]                     │
      │        │        │                          │
      └────────┼────────┘                          │
               │                                    │
        [Services Layer]                           │
               │                                    │
          Firebase SDK◄──────────────────────────────┤
               │
          [Firebase]
               │
     ┌─────────┼─────────┐
     │         │         │
 Realtime   Auth    Hosting
 Database
     │
┌────┴─────┐
│numberplate│  parkingLogs│  settings│
└──────────┘────────────────────────┘
```

---

## Data Flow

### 1. User Flow - Vehicle Search

```
User enters plate → UserParkingInfo component
                  ↓
            Firebase Service (searchVehicle)
                  ↓
     Query both numberplate & parkingLogs nodes
                  ↓
            Normalize data (schemaUtils)
                  ↓
       Process parking sessions (parkingUtils)
                  ↓
     Calculate duration & amount if exited
                  ↓
            Display vehicle info
                  ↓
         Generate UPI QR code
```

### 2. Admin Flow - Manual Entry

```
Admin fills form → ManualEntryModal
                 ↓
          Validate input (validation.js)
                 ↓
     Fetch current rate (settingsService)
                 ↓
    Create entry (firebaseService.pushManualEntry)
                 ↓
    Write to Firebase parkingLogs node
                 ↓
     Real-time listener triggers
                 ↓
     Dashboard updates automatically
```

### 3. Hardware Flow - ANPR Detection

```
Vehicle enters → PIR sensor detects
              ↓
      ANPR camera captures image
              ↓
      OpenALPR performs OCR
              ↓
   Extract license plate text
              ↓
    Send to ESP32 via serial/HTTP
              ↓
ESP32 formats data + timestamp
              ↓
   Send to Firebase via WiFi
              ↓
Write to numberplate node
              ↓
 Web app receives real-time update
```

---

## Component Architecture

### Component Hierarchy

```
App.jsx (Root)
├── ErrorBoundary
│   └── Router
│       ├── Home
│       ├── RoleSelect
│       ├── UserParkingInfo (Page 1)
│       ├── UserPaymentPage (Page 2)
│       ├── UserPaymentSuccess (Page 3)
│       ├── AdminDashboard
│       │   ├── Topbar
│       │   ├── Sidebar
│       │   ├── StatCards
│       │   ├── VehicleTable
│       │   ├── ManualEntryModal
│       │   └── DashboardFooter
│       ├── AnalyticsDashboard
│       │   ├── AnalyticsHeader
│       │   ├── AnalyticsKPICards
│       │   ├── RevenueChart
│       │   ├── DurationChart
│       │   ├── TopZonesTable
│       │   └── ZoneHeatmap
│       └── Settings
│           └── RateEditor
```

### State Management Pattern

**No Redux/Zustand used** - React hooks only:
- `useState` - Local component state
- `useEffect` - Side effects, Firebase subscriptions
- Custom hooks - Shared logic (`useDashboardData`, `useAnalyticsData`)

---

## Service Layer Pattern

All Firebase operations go through service layer:

```javascript
// NOT this:
import { ref, push } from 'firebase/database';
push(ref(database, 'parkingLogs'), data); // ❌

// But this:
import { pushManualEntry } from './services/firebaseService';
await pushManualEntry(plate, type, zone); // ✅
```

**Benefits:**
- Centralized Firebase logic
- Easier testing
- Consistent error handling
- Audit trail automation

---

## Database Design Patterns

### Dual Schema Pattern

**Problem:** Legacy hardware uses different data format
**Solution:** Support both schemas simultaneously

```javascript
// Normalize on read, not on write
const normalized = normalizeEntry(rawEntry);
```

### Denormalization

For performance, data is intentionally duplicated:

```json
{
  "parkingLogs/-N8x...": {
    "plate": "TS15EL5671",
    "inTime": "...",
    "rateAtEntry": 20,  // ← Duplicated from settings
    "zone": "Zone A"     // ← Instead of zone ID reference
  }
}
```

**Why?**
- Faster reads (no joins needed)
- Historical accuracy (rates change over time)
- Handles Firebase's NoSQL limitations

---

## Security Model

### Authentication
- **Method**: Firebase Email/Password
- **Protected Routes**: `/admin`, `/admin/analytics`, `/admin/settings`
- **Public Routes**: `/`, `/user`, `/select`

### Database Rules
- **Public Read**: Users can search vehicles without login
- **Authenticated Write**: Only logged-in admins can write data
- **Validation**: Schema enforcement in Firebase rules

---

## Real-time Updates

Uses Firebase real-time listeners:

```javascript
onValue(ref(database, 'parkingLogs'), (snapshot) => {
  // Triggered automatically on any change
  updateUI(snapshot.val());
});
```

**Benefits:**
- No polling needed
- Instant updates across all clients
- Efficient (only sends changes, not full data)

---

## Offline Support

**Fallback Strategy:**
1. Try Firebase (primary)
2. If fails → Load local JSON (`public/numberplate.json`)
3. If both fail → Show error

```javascript
try {
  await fetchFromFirebase();
} catch {
  await loadLocalFallback();
}
```

---

## Performance Optimizations

### 1. Firebase Indexes
```json
".indexOn": ["plate", "inTime", "status", "zone"]
```

### 2. Code Splitting
- Routes lazy-loaded
- Vite handles automatic code splitting

### 3. Caching
- Browser caches static assets
- Firebase SDK caches queries

---

## Error Handling Strategy

### Layers of Error Handling

**1. Component Level (ErrorBoundary)**
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**2. Service Level (try-catch)**
```javascript
try {
  await pushManualEntry(...);
} catch (error) {
  console.error('[Service Error]', error);
  throw error;
}
```

**3. UI Level (error states)**
```javascript
const [error, setError] = useState('');
// Display error to user
```

---

## Deployment Architecture

```
[GitHub Repo]
     │
     │ git push
     ↓
[Vercel/Netlify CI/CD]
     │
     │ npm run build
     ↓
[Static Files (dist/)]
     │
     │ Deploy
     ↓
[CDN Edge Servers]
     │
     │ HTTPS
     ↓
[User Browsers]
     │
     │ API Calls
     ↓
[Firebase Servers]
```

---

## Design Patterns Used

- **Service Pattern**: Firebase operations abstracted
- **Hook Pattern**: Reusable logic in custom hooks
- **Component Composition**: Small, focused components
- **Controlled Components**: React manages form state
- **Error Boundary Pattern**: Graceful error handling

---

**Architecture Documentation Complete!**

For implementation details:
- [API Reference](./api-reference.md)
- [Component Guide](./component-guide.md)
- [Database Schema](./database-schema.md)
