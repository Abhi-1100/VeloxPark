# Development Setup

Developer environment setup guide for VeloxPark.

---

## Prerequisites

Install these before starting:

### Required
- **Node.js** v18+ - [Download](https://nodejs.org/)
- **npm** v9+ (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Recommended
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Firebase Tools** - `npm install -g firebase-tools`

---

## Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd VeloxPark

# Install dependencies
npm install
```

---

## VS Code Setup

### Recommended Extensions

Install from VS Code marketplace:

1. **ESLint** (dbaeumer.vscode-eslint)
   - Linting JavaScript/JSX

2. **Prettier** (esbenp.prettier-vscode)
   - Code formatting

3. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
   - Tailwind class autocomplete

4. **ES7+ React Snippets** (dsznajder.es7-react-js-snippets)
   - React code snippets

5. **Firebase Explorer** (jsayol.firebase-explorer)
   - Browse Firebase data in VS Code

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*[\"']([^\"']*)", "([^\"']*)"]
  ]
}
```

---

## Firebase Configuration

### 1. Create Firebase Project

See [Getting Started Guide](./getting-started.md#firebase-configuration)

### 2. Configure Locally

Update `src/config/firebase.js` with your credentials.

### 3. Set Database Rules

Copy from [Database Schema](./database-schema.md#firebase-security-rules).

---

## Development Workflow

### Start Dev Server

```bash
npm run dev
```

Opens at: http://localhost:5173

**Features:**
- Hot Module Replacement (HMR)
- Fast refresh
- Instant updates on save

### Run Linter

```bash
npm run lint
```

**Fix auto-fixable issues:**
```bash
npm run lint -- --fix
```

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/`.

### Preview Production Build

```bash
npm run preview
```

Tests production build locally.

---

## Project Structure

```
VeloxPark/
├── public/              # Static assets
│   ├── config.json      # UPI configuration
│   ├── numberplate.json # Fallback data (legacy)
│   └── parkingLogs.json # Fallback data (PRD)
├── src/
│   ├── components/      # React components
│   │   ├── dashboard/   # Admin dashboard components
│   │   ├── analytics/   # Analytics components
│   │   └── *.jsx        # Page components
│   ├── config/          # Firebase config
│   │   └── firebase.js
│   ├── hooks/           # Custom hooks
│   │   ├── useDashboardData.js
│   │   ├── useAnalyticsData.js
│   │   └── ...
│   ├── services/        # API/Firebase services
│   │   ├── firebaseService.js
│   │   └── settingsService.js
│   ├── utils/           # Utility functions
│   │   ├── parkingUtils.js
│   │   ├── schemaUtils.js
│   │   └── validation.js
│   ├── App.jsx          # Root component with routes
│   ├── main.jsx         # Entry point
│   ├── App.css          # App-specific styles
│   └── index.css        # Global styles + Tailwind
├── doc/                 # Documentation (14 files)
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── package.json         # Dependencies & scripts
├── tailwind.config.js   # Tailwind CSS config
├── vite.config.js       # Vite configuration
└── README.md            # Project overview
```

---

## Coding Standards

### JavaScript Style

- **ES6+ syntax**: Use let/const, arrow functions, destructuring
- **Async/await**: Prefer over .then() chains
- **Naming**: camelCase for variables, PascalCase for components

### React Best Practices

```jsx
// ✅ Good
const MyComponent = ({ data, onAction }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  return <div>{/* JSX */}</div>;
};

// ❌ Avoid
function myComponent(props) {
  // No cleanup
  useEffect(() => {
    doSomething();
  });
}
```

### Import Order

```javascript
// 1. External libraries
import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';

// 2. Internal services/utils
import { subscribeToNumberplates } from './services/firebaseService';
import { calculateDuration } from './utils/parkingUtils';

// 3. Components
import VehicleTable from './components/VehicleTable';

// 4. Styles
import './MyComponent.css';
```

---

## Git Workflow

### Branch Naming

- `feature/add-export-csv` - New features
- `fix/vehicle-search-bug` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/simplify-utils` - Refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add PDF export functionality
fix: Resolve vehicle search case sensitivity issue
docs: Update API reference with new functions
refactor: Extract validation logic to separate file
```

### Workflow Steps

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: Add my feature"

# 3. Push to remote
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# 5. After review & approval, merge to main
```

---

## Debugging

### Browser DevTools

**console.log debugging:**
```javascript
console.log('[Component] State:', state);
console.error('[Service] Error:', error);
```

**React DevTools:**
- Install React DevTools extension
- Inspect component tree
- View props and state

**Network Tab:**
- Monitor Firebase API calls
- Check request/response
- View timing

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## Testing

Currently manual testing only. See [Testing Guide](./testing-guide.md).

**Future**: Add Jest + React Testing Library.

---

## Common Issues

### Port 5173 in use

```bash
npx kill-port 5173
# Or change port in vite.config.js
```

### Module not found

```bash
npm install
# Clear cache if persists
rm -rf node_modules package-lock.json
npm install
```

### Firebase errors

- Check config in `firebase.js`
- Verify database rules published
- Check Firebase Console for issues

---

## Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Development Environment Ready!** 🚀
