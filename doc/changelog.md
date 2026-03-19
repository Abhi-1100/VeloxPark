# Changelog

Version history and release notes for VeloxPark.

---

## [4.0.0] - 2026-03-19

### 🎯 Major Improvements

#### Bug Fixes
- **FIXED**: "Vehicle not found" error for existing plates
  - Removed legacy `UserPanel.jsx` component that only searched `numberplate` node
  - `UserParkingInfo.jsx` now searches both `numberplate` AND `parkingLogs` nodes
  - Removed `/user/legacy` route
  - All vehicles found regardless of storage location

#### Schema Enhancements
- Added unified schema utilities (`schemaUtils.js`)
  - `normalizeEntry()` - Handles both legacy and PRD schemas
  - `validateEntry()` - Validates minimum required fields
  - `convertLegacyToPRD()` - Schema conversion helper
- Added audit fields to manual entries:
  - `createdAt` - ISO timestamp of creation
  - `createdBy` - Firebase UID or "system"
  - `lastModified` - ISO timestamp of last update
  - `schemaVersion` - Schema version number (2)

#### Error Handling
- Added `ErrorBoundary` component
  - Catches React rendering errors
  - Displays user-friendly error UI
  - Shows error details in development mode
  - Provides "Reload" and "Go Home" actions
- Enhanced error logging in `parkingUtils.js`
  - Added try-catch to `parseToDate()` function
  - Console logging for debugging
  - Graceful handling of invalid timestamps

#### Validation
- Created comprehensive `validation.js` utility
  - `validateLicensePlate()` - Indian plate format validation
  - `validateVehicleType()` - Type validation
  - `validateZone()` - Zone format validation
  - `validateRate()` - Rate validation
  - `validateTimestamp()` - ISO timestamp validation
  - `validateParkingEntry()` - Complete entry validation
  - `sanitizeInput()` - XSS prevention

### 📚 Documentation
- Created comprehensive `/doc` folder with 14 files:
  - `README.md` - Documentation index
  - `getting-started.md` - Installation & setup guide
  - `architecture.md` - System architecture overview
  - `database-schema.md` - Complete schema documentation
  - `api-reference.md` - API documentation with code examples
  - `component-guide.md` - React component documentation
  - `hardware-integration.md` - ESP32/ANPR setup guide
  - `deployment.md` - Production deployment guide
  - `troubleshooting.md` - Common issues & solutions
  - `user-manual.md` - End-user guide
  - `admin-manual.md` - Admin operations guide
  - `development-setup.md` - Developer environment setup
  - `testing-guide.md` - Manual testing checklist
  - `changelog.md` - This file

### ⚠️ Breaking Changes
- Removed `/user/legacy` route (replaced by `/user`)
- Deleted `UserPanel.jsx` component
- Deleted `UserPanel.css`

### 🔄 Migration Notes
- No data migration required
- Existing data in both schemas continues to work
- Hardware (ESP32) unchanged - still writes to `numberplate` node
- All existing features preserved

---

## [3.0.0] - 2026-03-01

### Added
- User-facing payment flow (3-page UPI system)
  - Page 1: Vehicle info (`/user`)
  - Page 2: QR code payment (`/user/payment`)
  - Page 3: Payment success (`/user/payment/success`)
- Analytics dashboard (`/admin/analytics`)
  - Revenue charts
  - Duration analysis
  - Zone performance
  - Peak hours insights
- Settings page (`/admin/settings`)
  - Dynamic rate management
  - Per-vehicle-type pricing

### Changed
- Migrated from HTML to React 19
- Updated to Vite 8.0 build tool
- Redesigned UI with modern design system

---

## [2.0.0] - 2025-12-15

### Added
- Admin dashboard
- Manual entry creation
- Real-time Firebase sync
- PDF export functionality
- Date filtering
- Search by plate

### Changed
- Introduced PRD schema (`parkingLogs` node)
- Dual schema support (legacy + PRD)

---

## [1.0.0] - 2025-10-01

### Initial Release
- Basic user panel for vehicle search
- Firebase Realtime Database integration
- Legacy schema (`numberplate` node)
- ESP32 + ANPR hardware support
- Duration & amount calculation
- Basic admin authentication

---

## Versioning

VeloxPark follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality
- **PATCH** version for backward-compatible bug fixes

## Release Planning

### Upcoming (v4.1.0)
- [ ] Automated testing framework (Jest + RTL)
- [ ] TypeScript migration
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

### Future Considerations
- Mobile app (React Native)
- SMS notifications
- Email receipts
- Advanced analytics (ML predictions)
- Multi-location support

---

**Last Updated**: March 19, 2026
**Current Version**: 4.0.0
