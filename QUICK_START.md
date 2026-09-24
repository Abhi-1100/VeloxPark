# Quick Start Guide - Smart Parking System (React)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for production use)

### Installation

1. **Navigate to the project directory**
   ```bash
   cd Parking_System
   ```

2. **Install dependencies** (Already done if you see node_modules folder)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to: `http://localhost:5173`
   - You should see the Smart Parking home page

## 📱 Application Routes

### Public Routes
- **Home Page**: `http://localhost:5173/`
  - Landing page with navigation to User Panel and Admin Dashboard

- **User Panel**: `http://localhost:5173/user`
  - Search for vehicles by plate number
  - View parking status and payment details
  - Generate UPI QR codes for payment

### Protected Routes
- **Admin Dashboard**: `http://localhost:5173/admin`
  - Requires authentication
  - View all parking records
  - Filter by date and search
  - Export PDF reports
  - View statistics

## 🔐 Admin Access

To access the admin dashboard, you need to create an admin user in Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `parking-system-939dd`
3. Navigate to **Authentication** → **Users**
4. Click **Add User**
5. Enter email and password
6. Use these credentials to login at `/admin`

**Test Credentials** (if already set up):
- Email: `admin@parking.com`
- Password: `admin123` (change this in production!)

## 🎨 Features Overview

### User Panel Features
✅ Vehicle search by plate number  
✅ Real-time parking status  
✅ Entry/Exit time display  
✅ Duration calculation  
✅ Automatic payment calculation  
✅ UPI QR code generation  
✅ Mobile responsive design  

### Admin Dashboard Features
✅ Secure authentication  
✅ Real-time data updates  
✅ Statistics dashboard  
✅ Date filtering  
✅ Search functionality  
✅ PDF export  
✅ Responsive tables  

## 💳 Payment Configuration

Edit `public/config.json` to set your UPI details:

```json
{
  "upiId": "your-upi-id@bank",
  "upiName": "Your Business Name"
}
```

Current configuration:
- UPI ID: `abhikakadiya1043@okaxis`
- Name: `ParkMeee`

## 📊 Sample Data

The application includes sample data in `public/numberplate.json`:

```json
{
  "sample_1": {
    "number_plate": "TS15EL5671",
    "date_time": "29/1/26 14:00"
  },
  "sample_2": {
    "number_plate": "TS15EL5671",
    "date_time": "29/1/26 16:30"
  }
}
```

To test:
1. Go to User Panel
2. Search for: `TS15EL5671`
3. You should see parking details with calculated amount

## 🔥 Firebase Configuration

The app is already configured with Firebase:
- Project: `parking-system-939dd`
- Database: Realtime Database
- Authentication: Email/Password

### Database Structure
```
parking-system-939dd
└── numberplate
    ├── entry_1
    │   ├── number_plate: "TS15EL5671"
    │   └── date_time: "29/1/26 14:00"
    └── entry_2
        ├── number_plate: "TS15EL5671"
        └── date_time: "29/1/26 16:30"
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📱 Testing the Application

### Test User Panel
1. Open `http://localhost:5173/user`
2. Enter plate number: `TS15EL5671`
3. Click "Search"
4. View parking details and payment QR code

### Test Admin Dashboard
1. Open `http://localhost:5173/admin`
2. Login with admin credentials
3. View statistics and parking records
4. Try filtering by date
5. Search for specific plate numbers
6. Export PDF report

## 🎯 Parking Logic

### Entry/Exit Detection
- **First scan**: Vehicle entry
- **Second scan**: Vehicle exit
- **Third scan**: New entry (new session)

### Payment Calculation
- **0-30 minutes**: FREE
- **30+ minutes**: ₹20 per hour (rounded up)

Example:
- 25 minutes: ₹0
- 45 minutes: ₹20
- 90 minutes: ₹40
- 150 minutes: ₹60

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Other Platforms
- **Vercel**: Connect GitHub repo and deploy
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Use `gh-pages` package

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Firebase Connection Issues
- Check internet connection
- Verify Firebase config in `src/config/firebase.js`
- Check Firebase Console for project status

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Project Structure

```
Parking_System/
├── public/
│   ├── config.json          # UPI configuration
│   └── numberplate.json     # Sample data
├── src/
│   ├── components/
│   │   ├── Home.jsx         # Landing page
│   │   ├── UserPanel.jsx    # User interface
│   │   ├── AdminDashboard.jsx
│   │   └── Login.jsx
│   ├── config/
│   │   └── firebase.js      # Firebase setup
│   ├── utils/
│   │   └── parkingUtils.js  # Business logic
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Colors
- Primary: `#FFD700` (Gold)
- Background: `#0A0A0A` (Black)
- Text: `#FFFFFF` (White)
- Success: `#00FF88` (Green)
- Danger: `#FF3366` (Red)

### Typography
- Headings: **Syne** (Google Fonts)
- Body: **Space Mono** (Google Fonts)

## 📞 Support

For issues or questions:
1. Check this guide
2. Review README.md
3. Check browser console for errors
4. Verify Firebase configuration

## 🎉 Next Steps

1. ✅ Test the application locally
2. ✅ Create admin user in Firebase
3. ✅ Add real parking data
4. ✅ Customize UPI details
5. ✅ Deploy to production
6. ✅ Share with users!

---

**Happy Parking! 🚗💨**

## Interactive map quick check

The current user map is at /map and is reached from the dashboard/search flow. It uses React Leaflet and OpenStreetMap, not the old static map concept.

Test:

1. Open /dashboard.
2. Open the map preview or Search map view.
3. Continue to /map.
4. Allow location access.
5. Check the user marker, nearest station card, station marker selection, Locate Me, and Navigate.
6. Repeat once with permission denied.

Demo stations are in src/data/parkingStations.js and must be replaced before production.

See doc/map-feature.md for the complete contract and integration notes.