# Database Schema Documentation

Complete Firebase Realtime Database schema for VeloxPark.

---

## Overview

VeloxPark uses **Firebase Realtime Database** with a **dual schema** approach:
- **Legacy Schema** (`numberplate/` node) - Hardware (ESP32) writes
- **PRD Schema** (`parkingLogs/` node) - Manual admin entries

Both schemas are supported indefinitely for backward compatibility.

---

## Database Structure

```
firebase-root/
├── numberplate/          # Legacy schema (hardware entries)
│   └── <pushKey>/
│       ├── number_plate  # String
│       └── date_time     # String (DD/M/YY HH:MM)
│
├── parkingLogs/          # PRD schema (manual entries)
│   └── <pushKey>/
│       ├── plate         # String (UPPERCASE)
│       ├── inTime        # ISO 8601 timestamp
│       ├── outTime       # ISO 8601 | null
│       ├── duration      # Number (minutes) | null
│       ├── amount        # Number (₹) | null
│       ├── status        # "parked" | "exited"
│       ├── vehicleType   # "Car" | "Bike" | "Truck" | "EV"
│       ├── zone          # String
│       ├── rateAtEntry   # Number
│       ├── manualEntry   # Boolean
│       ├── createdAt     # ISO 8601 timestamp
│       ├── createdBy     # Firebase UID | "system"
│       ├── lastModified  # ISO 8601 timestamp
│       └── schemaVersion # Number (2)
│
└── settings/
    └── rates/
        ├── car           # Number
        ├── bike          # Number
        ├── truck         # Number
        └── lastUpdated   # ISO 8601 timestamp
```

---

## Legacy Schema (`numberplate/`)

### Entry Structure

```json
{
  "-N8xK4LmP3qR5tU9wX2z": {
    "number_plate": "TS15EL5671",
    "date_time": "29/1/26 14:00"
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `number_plate` | String | ✅ | Vehicle license plate |
| `date_time` | String | ✅ | Timestamp (DD/M/YY HH:MM) |

### Logic
- Each scan creates ONE record
- Odd number of scans = Vehicle parked
- Even scans = Last two form entry/exit pair

---

## PRD Schema (`parkingLogs/`)

### Entry Structure

```json
{
  "-N8xK4LmP3qR5tU9wX3b": {
    "plate": "MH12AB1234",
    "inTime": "2026-03-01T08:30:00.000Z",
    "outTime": "2026-03-01T10:45:00.000Z",
    "duration": 135,
    "amount": 60,
    "status": "exited",
    "vehicleType": "Car",
    "zone": "Zone A",
    "rateAtEntry": 20,
    "manualEntry": true,
    "createdAt": "2026-03-01T08:30:00.000Z",
    "createdBy": "abc123uid",
    "lastModified": "2026-03-01T10:45:00.000Z",
    "schemaVersion": 2
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `plate` | String | ✅ | License plate (4-12 chars) |
| `inTime` | ISO String | ✅ | Entry timestamp |
| `outTime` | ISO String/null | ✅ | Exit timestamp |
| `duration` | Number/null | ✅ | Minutes parked |
| `amount` | Number/null | ✅ | Fee in ₹ |
| `status` | String | ✅ | "parked" or "exited" |
| `vehicleType` | String | ✅ | Car/Bike/Truck/EV |
| `zone` | String | ✅ | Parking zone |
| `rateAtEntry` | Number | ✅ | Rate at entry time |
| `manualEntry` | Boolean | ✅ | Manual vs hardware |
| `createdAt` | ISO String | ✅ | Creation timestamp |
| `createdBy` | String | ✅ | Firebase UID |
| `lastModified` | ISO String | ✅ | Last update |
| `schemaVersion` | Number | ✅ | Schema version (2) |

---

## Firebase Security Rules

```json
{
  "rules": {
    "numberplate": {
      ".read": true,
      ".write": "auth != null",
      ".indexOn": ["number_plate", "date_time"]
    },
    "parkingLogs": {
      ".read": true,
      ".write": "auth != null",
      ".indexOn": ["plate", "inTime", "status", "zone"],
      "$entryId": {
        ".validate": "newData.hasChildren(['plate', 'inTime', 'status'])",
        "plate": {
          ".validate": "newData.isString() && newData.val().length >= 4 && newData.val().length <= 12"
        },
        "status": {
          ".validate": "newData.val() === 'parked' || newData.val() === 'exited'"
        }
      }
    },
    "settings": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### Rule Explanation
- **`.read: true`**: Public read access (users can search without login)
- **`.write: "auth != null"`**: Only authenticated writes
- **`.indexOn`**: Query optimization
- **`.validate`**: Schema enforcement

---

## Query Examples

### Get all parked vehicles

```javascript
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';

const logsRef = ref(database, 'parkingLogs');
const parkedQuery = query(logsRef, orderByChild('status'), equalTo('parked'));
const snapshot = await get(parkedQuery);
```

### Get vehicles by zone

```javascript
const zoneQuery = query(logsRef, orderByChild('zone'), equalTo('Zone A'));
const snapshot = await get(zoneQuery);
```

---

## Pricing Logic

**Free Period:** First 30 minutes FREE
**Calculation:** After 30 min, charged per hour (rounded up)

**Example:**
- 25 min → ₹0
- 45 min → ₹20 (1 hour)
- 2h 15m → ₹60 (3 hours)

---

## Best Practices

✅ **DO:**
- Always uppercase license plates
- Use ISO 8601 for timestamps
- Include audit fields
- Validate before writing

❌ **DON'T:**
- Write directly from client
- Store sensitive data
- Download entire database
- Poll Firebase (use listeners)

---

**For more information:**
- [API Reference](./api-reference.md)
- [Hardware Integration](./hardware-integration.md)
- [Troubleshooting](./troubleshooting.md)
