# Smart Parking System - React Application

A modern, feature-rich parking management system built with React, Firebase, and Vite. This application provides both user and admin interfaces for managing parking operations.

## Features

### User Panel (Public Access)
- **Vehicle Search**: Search for vehicles by license plate number
- **Real-time Status**: View current parking status (Parked/Exited)
- **Parking Details**: See entry time, exit time, and duration
- **Payment Calculation**: Automatic calculation based on parking duration
  - First 30 minutes FREE
  - ₹20 per hour thereafter
- **UPI Payment**: Generate QR code for instant UPI payments
- **Responsive Design**: Works seamlessly on all devices

### Admin Dashboard (Protected)
- **Authentication**: Secure login with Firebase Authentication
- **Real-time Data**: Live updates from Firebase Realtime Database
- **Statistics Dashboard**: 
  - Total vehicles
  - Currently parked vehicles
  - Total exited vehicles
  - Today's revenue
- **Advanced Filtering**:
  - Search by plate number
  - Filter by date
  - View all records or specific dates
- **PDF Export**: Export parking records as PDF reports
- **Responsive Tables**: Mobile-friendly data display

## Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 8.0
- **Routing**: React Router DOM
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **QR Code**: qrcode.react
- **PDF Generation**: jsPDF with autotable plugin
- **Styling**: Vanilla CSS with custom design system

## Design System

The application features a premium dark theme with:
- **Primary Color**: Gold (#FFD700)
- **Background**: Deep Black (#0A0A0A)
- **Typography**: 
  - Headings: Syne (Google Fonts)
  - Body: Space Mono (Google Fonts)
- **Animations**: Smooth fade-in effects
- **Grid Background**: Subtle yellow grid overlay
- **Glassmorphism**: Modern card designs

## Installation

1. **Clone the repository** (if applicable)
   ```bash
   cd Parking_System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Firebase configuration is already set up in `src/config/firebase.js`
   - Update with your own Firebase credentials if needed

4. **Configure UPI Payment**
   - Edit `public/config.json` to set your UPI ID and name
   ```json
   {
     "upiId": "your-upi-id@bank",
     "upiName": "Your Business Name"
   }
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Routes

- `/` - User Panel (Public)
- `/admin` - Admin Dashboard (Protected)

## Firebase Setup

The application uses Firebase for:
1. **Authentication**: Admin login
2. **Realtime Database**: Storing parking records

### Database Structure
```json
{
  "numberplate": {
    "entry_id": {
      "number_plate": "TS15EL5671",
      "date_time": "29/1/26 14:00"
    }
  }
}
```

## Admin Credentials

To access the admin dashboard, you need to create a user in Firebase Authentication. Use the Firebase Console to add admin users.

## Fallback Data

If Firebase is unavailable, the application will attempt to load data from `public/numberplate.json` as a fallback.

## Features Breakdown

### Parking Logic
- **Entry Detection**: First scan of a plate number
- **Exit Detection**: Second scan of the same plate number
- **Duration Calculation**: Automatic calculation between entry and exit
- **Amount Calculation**: 
  - 0-30 minutes: Free
  - 30+ minutes: ₹20 per hour (rounded up)

### Data Processing
- Handles multiple date formats
- Robust timestamp parsing
- Automatic session pairing (entry + exit)
- Support for multiple parking sessions per vehicle

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Mobile Support

Fully responsive design optimized for:
- Desktop (1400px+)
- Tablet (768px - 1399px)
- Mobile (< 768px)

## Performance

- Lazy loading components
- Optimized Firebase queries
- Efficient state management
- Minimal re-renders

## Security

- Protected admin routes
- Firebase Authentication
- Secure database rules (configure in Firebase Console)

## Future Enhancements

- Email notifications
- SMS alerts
- Multiple parking zones
- Booking system
- Payment gateway integration
- Analytics dashboard

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using React and Firebase**
