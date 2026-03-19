# Getting Started with VeloxPark

Quick start guide to get VeloxPark running on your local machine.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Sign up](https://firebase.google.com/)
- **Code Editor** - VS Code recommended

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VeloxPark
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React 19.2.0
- Vite 8.0
- Firebase SDK
- Tailwind CSS 4.1.18
- And all other dependencies

### 3. Configure Firebase

**Create Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., `veloxpark-dev`)
4. Enable Google Analytics (optional)
5. Create project

**Enable Realtime Database:**
1. In Firebase Console, go to **Realtime Database**
2. Click "Create Database"
3. Choose location closest to you
4. Start in **Test Mode** (for development)
5. Click "Enable"

**Get Firebase Configuration:**
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (</>) to add a web app
4. Register app with nickname `veloxpark-web`
5. Copy the Firebase configuration object

### 4. Configure Environment

Create `src/config/firebase.js` with your Firebase credentials:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
```

### 5. Set Up Firebase Database Rules

In Firebase Console → Realtime Database → Rules:

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
      ".indexOn": ["plate", "inTime", "status", "zone"]
    },
    "settings": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Click **Publish**.

### 6. Configure UPI Payment

Edit `public/config.json`:

```json
{
  "upiId": "your-upi-id@okaxis",
  "upiName": "YourParkingName"
}
```

### 7. (Optional) Add Sample Data

Import sample data to Firebase:

**Option A: Via Firebase Console**
1. Go to Realtime Database
2. Click ⋮ (three dots) → Import JSON
3. Upload `public/numberplate.json` to `/numberplate`
4. Upload `public/parkingLogs.json` to `/parkingLogs`

**Option B: Copy-paste**
1. In Realtime Database, click `+` next to root
2. Name: `numberplate`, paste data from `public/numberplate.json`
3. Repeat for `parkingLogs`

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Application runs at: **http://localhost:5173**

Hot reload is enabled - changes reflect instantly.

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Previews production build at: **http://localhost:4173**

---

## Application Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/select` | Role selection (User/Admin) | Public |
| `/user` | User parking info (Page 1) | Public |
| `/user/payment` | UPI payment QR (Page 2) | Public |
| `/user/payment/success` | Payment confirmation (Page 3) | Public |
| `/admin` | Admin dashboard | Protected (login required) |
| `/admin/analytics` | Analytics dashboard | Protected |
| `/admin/settings` | System settings | Protected |

---

## Default Admin Credentials

Create an admin account:

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Click **Add User**
5. Enter:
   - **Email**: `admin@veloxpark.com`
   - **Password**: Choose a strong password
6. Click **Add User**

Use these credentials to log in at `/admin`.

---

## Testing the Setup

### 1. Test Landing Page

Navigate to [http://localhost:5173](http://localhost:5173)

Expected: VeloxPark landing page with navigation.

### 2. Test User Panel

1. Click **"Get Started"** → **"I'm a User"**
2. Enter a test plate: `TS15EL5671`
3. Click **"Check Status"**

Expected: If sample data is loaded, vehicle details appear.

### 3. Test Admin Dashboard

1. Go to [http://localhost:5173/admin](http://localhost:5173/admin)
2. Log in with admin credentials
3. Click **"Add Manual Entry"**
4. Fill form:
   - Plate: `MH12AB1234`
   - Type: `Car`
   - Zone: `Zone A`
5. Click **"Add Vehicle"**

Expected: Vehicle appears in dashboard, Firebase shows new entry.

### 4. Test Real-time Updates

1. Keep admin dashboard open
2. In another tab, manually add entry in Firebase Console
3. Dashboard should update automatically (real-time)

---

## Common Issues

### Issue: `npm install` fails

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Firebase error "PERMISSION_DENIED"

**Solution:**
- Check Firebase rules are published
- Verify `.read: true` for public nodes
- Ensure `.write: "auth != null"` for protected nodes

### Issue: Port 5173 already in use

**Solution:**
```bash
# Change port in vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

Or kill the process using port 5173.

### Issue: "Cannot find module 'firebase'"

**Solution:**
```bash
npm install firebase
```

### Issue: Tailwind CSS not working

**Solution:**
Ensure `tailwind.config.js` exists and `index.css` imports Tailwind:

```css
@import "tailwindcss";
```

---

## Next Steps

✅ **Setup complete!** Now you can:

1. **Explore the code** - Start with `src/App.jsx`
2. **Read documentation** - Check [Architecture Guide](./architecture.md)
3. **Customize design** - Edit `src/index.css` and component styles
4. **Add features** - Refer to [API Reference](./api-reference.md)
5. **Deploy** - Follow [Deployment Guide](./deployment.md)
6. **Set up hardware** - See [Hardware Integration](./hardware-integration.md)

---

## Quick Reference

**Start development:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Run linter:**
```bash
npm run lint
```

**Clear build cache:**
```bash
rm -rf dist node_modules .vite
npm install
npm run build
```

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
│   ├── config/          # Firebase config
│   ├── hooks/           # Custom hooks
│   ├── services/        # Firebase services
│   ├── utils/           # Utilities
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── doc/                 # Documentation
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # Project overview
```

---

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Edit code
   - Test locally

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

4. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create pull request**
   - Review changes
   - Merge to main

---

## Support

- **Documentation**: Check other files in `/doc` folder
- **Issues**: Review [Troubleshooting Guide](./troubleshooting.md)
- **Questions**: Open GitHub issue

---

**You're all set to start developing with VeloxPark!** 🚀
