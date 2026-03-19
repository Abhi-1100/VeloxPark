# Component Guide

React component documentation for VeloxPark.

---

## Component Catalog

### Pages (Routes)
- **Home** (`/`) - Landing page
- **RoleSelect** (`/select`) - User/Admin selection
- **UserParkingInfo** (`/user`) - Vehicle search & parking info
- **User PaymentPage** (`/user/payment`) - UPI QR payment
- **UserPaymentSuccess** (`/user/payment/success`) - Payment confirmation
- **AdminDashboard** (`/admin`) - Main admin interface
- **AnalyticsDashboard** (`/admin/analytics`) - Analytics & insights
- **Settings** (`/admin/settings`) - Rate configuration
- **Login** - Admin authentication
- **NotFound** (`/*`) - 404 page

### Shared Components
- **ErrorBoundary** - Error handling wrapper
- **LoadingScreen** - Initial app loading state

---

## Key Components

### UserParkingInfo

**Path**: `src/components/UserParkingInfo.jsx`
**Route**: `/user`

**Purpose**: Primary user interface for vehicle search and parking status.

**Key Features:**
- Searches both `numberplate` and `parkingLogs` nodes
- Displays Vehicle info (plate, entry time, zone)
- Shows parking status (Parked vs Exited)
- Calculates duration and amount for exited vehicles
- Navigates to payment page

**Props**: None (standalone page)

**State:**
```javascript
const [plateInput, setPlateInput] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [vehicleData, setVehicleData] = useState(null);
```

**Usage:**
```jsx
<Route path="/user" element={<UserParkingInfo />} />
```

---

### AdminDashboard

**Path**: `src/components/AdminDashboard.jsx`
**Route**: `/admin`

**Purpose**: Main admin interface with real-time vehicle management.

**Key Features:**
- Real-time vehicle table
- Statistics (Total, Parked, Exited, Revenue)
- Date filtering
- Search by plate
- Manual entry creation
- PDF export
- Delete/edit operations

**Props:**
```typescript
user: FirebaseUser  // Firebase auth user object
```

**Custom Hooks Used:**
- `useDashboardData()` - Vehicle data & filtering
- `useExportPDF()` - PDF generation

---

### ManualEntryModal

**Path**: `src/components/dashboard/ManualEntryModal.jsx`

**Purpose**: Form to manually add parking entries.

**Props:**
```typescript
isOpen: boolean
onClose: () => void
onSuccess: (entryId: string) => void
```

**Form Fields:**
- License Plate (validated)
- Vehicle Type (Car/Bike/Truck/EV)
- Parking Zone (dropdown)

**Usage:**
```jsx
<ManualEntryModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={(id) => {
    alert('Vehicle added!');
    setShowModal(false);
  }}
/>
```

---

### VehicleTable

**Path**: `src/components/dashboard/VehicleTable.jsx`

**Purpose**: Displays parking records in table format.

**Props:**
```typescript
vehicles: Array<ParkingEntry>
onDelete?: (id: string) => void
onEdit?: (id: string) => void
```

**Features:**
- Sortable columns
- Status badges (Parked/Exited)
- Duration & amount display
- Action buttons (Delete/Edit)

---

### StatCards

**Path**: `src/components/dashboard/StatCards.jsx`

**Purpose**: Displays key metrics in card format.

**Props:**
```typescript
total: number
parked: number
exited: number
revenue: number
```

**Usage:**
```jsx
<StatCards
  total={stats.totalEntries}
  parked={stats.parkedNow}
  exited={stats.exitedToday}
  revenue={stats.totalRevenue}
/>
```

---

### ErrorBoundary

**Path**: `src/components/ErrorBoundary.jsx`

**Purpose**: Catches React errors and displays fallback UI.

**Features:**
- Catches rendering errors
- Shows user-friendly error message
- Provides "Reload" and "Go Home" buttons
- Displays error details in development mode

**Usage:**
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Design System

### Colors
- Primary: `#FFD700` (Gold)
- Background: `#0A0A0A` (Deep Black)
- Card: `#161616` (Dark Gray)
- Success: `#00FF88` (Green)
- Danger: `#FF3366` (Red)
- Text: `#F1F5F9` (Off-white)

### Typography
- Display: Space Grotesk
- Body: Space Mono (monospace)
- Headings: Barlow Condensed

### Spacing Scale
```css
xs: 0.25rem  /* 4px */
sm: 0.5rem   /* 8px */
md: 1rem     /* 16px */
lg: 1.5rem   /* 24px */
xl: 2rem     /* 32px */
2xl: 3rem    /* 48px */
```

---

## Component Patterns

### Pattern 1: Service Integration

```jsx
import { subscribeToNumberplates } from './services/firebaseService';

useEffect(() => {
  const unsubscribe = subscribeToNumberplates(
    ({ processedData }) => setVehicles(processedData),
    (error) => console.error(error)
  );
  return () => unsubscribe(); // Cleanup
}, []);
```

### Pattern 2: Error Handling

```jsx
const [error, setError] = useState('');

try {
  await someAsyncOperation();
} catch (err) {
  setError(err.message);
}

{error && <div className="error">{error}</div>}
```

### Pattern 3: Loading States

```jsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await asyncOperation();
  } finally {
    setLoading(false);
  }
};

{loading ? <Spinner /> : <Content />}
```

---

## Styling Approach

### Tailwind CSS v4
```jsx
<div className="bg-[#161616] rounded-xl border border-[#1e1e1e] p-6">
  <h2 className="text-xl font-bold text-[#f9d006]">
    Title
  </h2>
</div>
```

### Custom CSS (for animations/complex styles)
```css
/* Home.css */
.grid-overlay {
  background-image:
    linear-gradient(#f9d006 1px, transparent 1px),
    linear-gradient(90deg, #f9d006 1px, transparent 1px);
  opacity: 0.03;
}
```

---

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1399px
- Desktop: 1400px+

### Media Queries
```css
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr; /* Stack on mobile */
  }
}
```

---

## Accessibility

### Focus Styles
All interactive elements have visible focus:
```css
button:focus {
  outline: 2px solid #f9d006;
  outline-offset: 2px;
}
```

### Semantic HTML
```jsx
<button aria-label="Close modal">×</button>
<input aria-invalid={hasError} />
```

---

## Component Best Practices

✅ **DO:**
- Keep components small and focused
- Use custom hooks for shared logic
- Handle errors gracefully
- Clean up subscriptions in useEffect
- Use semantic HTML

❌ **DON'T:**
- Call Firebase directly from components (use services)
- Store sensitive data in state
- Forget to handle loading states
- Ignore accessibility

---

**Component Guide Complete!**

For more details:
- [API Reference](./api-reference.md) - Services & hooks
- [Architecture](./architecture.md) - System design
