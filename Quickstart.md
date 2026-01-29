# ⚡ Quick Start Guide

Get your Case Management Dashboard running in 5 minutes!

## TL;DR

```bash
# 1. Install dependencies
npm install

# 2. Set up Firebase (see below)
# Edit src/firebase/config.js with your Firebase credentials

# 3. Run the app
npm run dev

# 4. Open http://localhost:5173
```

## Minimal Firebase Setup

### 1. Create Firebase Project (2 minutes)
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it and create

### 2. Enable Services (1 minute)
1. **Authentication**
   - Click "Authentication" → "Get started"
   - Enable "Email/Password"

2. **Firestore**
   - Click "Firestore Database" → "Create database"
   - Select "Test mode"
   - Choose location → Enable

### 3. Get Config (1 minute)
1. Click ⚙️ → Project settings
2. Scroll to "Your apps"
3. Click web icon `</>`
4. Copy the config object

### 4. Add to App (1 minute)
Edit `src/firebase/config.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_KEY_HERE",
  authDomain: "YOUR_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_HERE",
  storageBucket: "YOUR_BUCKET_HERE",
  messagingSenderId: "YOUR_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};
```

## That's It! 🎉

Now run:
```bash
npm run dev
```

Visit: http://localhost:5173

## First Steps in App

1. **Sign Up** - Create account with email/password
2. **Create Case** - Click "New Case" button
3. **Explore** - Try search, filters, edit, delete

## Need More Help?

- 📖 Full guide: See `SETUP_GUIDE.md`
- 📋 Features: See `FEATURES.md`
- 🐛 Issues: See `README.md` troubleshooting section

## Project Structure

```
src/
├── pages/          # Login, Dashboard, Cases
├── components/     # Reusable UI components
├── firebase/       # ⚠️ EDIT THIS with your config
└── hooks/          # React hooks (auth, etc.)
```

## Key Files to Know

- `src/firebase/config.js` - **Edit this with your Firebase config**
- `src/pages/CaseList.jsx` - Main cases page
- `src/pages/Dashboard.jsx` - Dashboard page
- `tailwind.config.js` - Customize colors/theme

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
```

## Troubleshooting

**"Can't connect to Firebase"**
→ Check your config in `src/firebase/config.js`

**"npm: command not found"**
→ Install Node.js from https://nodejs.org/

**"Port already in use"**
→ Close other apps or change port in `vite.config.js`

---

**Questions?** Check the full README.md or SETUP_GUIDE.md