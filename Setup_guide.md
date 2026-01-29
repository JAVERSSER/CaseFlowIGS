# 🚀 Complete Setup Guide

This guide will walk you through setting up the Case Management Dashboard from scratch.

## Prerequisites Checklist

Before you begin, make sure you have:
- ✅ Node.js 16 or higher installed ([Download](https://nodejs.org/))
- ✅ npm (comes with Node.js)
- ✅ A Google account for Firebase
- ✅ A code editor (VS Code recommended)
- ✅ Basic terminal/command line knowledge

## Step-by-Step Setup

### 1. Install Node.js and npm

**Check if already installed:**
```bash
node --version
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/) and install.

### 2. Download the Project

If you received this as a zip file:
1. Extract the zip file to a location of your choice
2. Open terminal/command prompt
3. Navigate to the project folder:
   ```bash
   cd path/to/case-management-app
   ```

### 3. Install Dependencies

Run this command in the project folder:
```bash
npm install
```

This will install all required packages. It may take 2-5 minutes.

### 4. Set Up Firebase

#### 4.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "case-management")
4. Disable Google Analytics (optional for this project)
5. Click "Create project"
6. Wait for setup to complete

#### 4.2 Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" in the Sign-in providers list
4. Toggle "Email/Password" to **Enabled**
5. Click "Save"

#### 4.3 Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location (closest to you or your users)
5. Click "Enable"

**Note:** Test mode allows all reads/writes. For production, you'll need proper security rules.

#### 4.4 Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Enter an app nickname (e.g., "Case Dashboard")
6. Don't check "Firebase Hosting" for now
7. Click "Register app"
8. Copy the `firebaseConfig` object

It should look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

#### 4.5 Update Configuration File

1. Open the project in your code editor
2. Navigate to `src/firebase/config.js`
3. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

4. Save the file

### 5. Start the Development Server

In your terminal (in the project folder), run:
```bash
npm run dev
```

You should see output like:
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 6. Open the Application

1. Open your web browser
2. Go to `http://localhost:5173`
3. You should see the login page!

### 7. Create Your First Account

1. Click "Don't have an account? Sign up"
2. Enter an email and password (minimum 6 characters)
3. Click "Create Account"
4. You'll be redirected to the dashboard!

## Testing the Application

### Create a Test Case
1. Click "New Case" button
2. Fill in:
   - Title: "Test Case"
   - Description: "This is my first test case"
   - Status: "Pending"
   - Start Date: Today's date
   - End Date: A future date
   - Remark: "Testing the application"
3. Click "Create Case"

### View Cases
1. Click "Cases" in the navigation
2. You should see your test case
3. Try the search and filter features

### Edit a Case
1. Click the edit (pencil) icon
2. Change the status to "Processing"
3. Update the remark
4. Click "Update Case"

### Test Other Features
- ✅ Dark mode toggle
- ✅ Search functionality
- ✅ Status filtering
- ✅ View case details
- ✅ Delete case
- ✅ Logout and login again

## Common Issues and Solutions

### Issue: "npm: command not found"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: "Port 5173 already in use"
**Solution:** 
- Close any other apps using port 5173
- Or change the port in `vite.config.js`

### Issue: Firebase errors on login
**Solution:**
- Check that Email/Password is enabled in Firebase Authentication
- Verify your Firebase config is correct
- Check browser console for specific error messages

### Issue: Cases not saving
**Solution:**
- Verify Firestore is created and in test mode
- Check browser console for errors
- Ensure you're logged in

### Issue: Page is blank
**Solution:**
- Check browser console for errors
- Make sure `npm run dev` is running
- Try refreshing the page
- Clear browser cache

### Issue: Styles look broken
**Solution:**
- Make sure all npm packages installed correctly
- Try deleting `node_modules` and running `npm install` again
- Clear browser cache

## Next Steps

### Customize the App
1. Change colors in `tailwind.config.js`
2. Modify the logo/branding in `Layout.jsx`
3. Add custom fields to cases
4. Create additional status types

### Deploy to Production
1. Build the app: `npm run build`
2. Deploy to:
   - Firebase Hosting
   - Vercel
   - Netlify
   - Your own server

### Security for Production
⚠️ **Important before going live:**

1. Update Firestore rules in Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cases/{caseId} {
      // Only authenticated users can read/write their own data
      allow read, write: if request.auth != null;
    }
  }
}
```

2. Add user-specific data:
   - Add `userId` field to cases
   - Filter cases by current user
   - Update security rules accordingly

3. Use environment variables:
   - Create `.env` file
   - Store Firebase config there
   - Never commit `.env` to git

## Getting Help

If you run into issues:

1. **Check the README.md** for additional documentation
2. **Check browser console** (F12 in most browsers)
3. **Check terminal/command line** for error messages
4. **Firebase Console** - Check for errors in Authentication and Firestore tabs

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## File Structure Overview

```
case-management-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── firebase/       # Firebase setup (EDIT THIS!)
│   ├── hooks/          # React hooks
│   └── App.jsx         # Main app
├── package.json        # Dependencies
└── README.md          # Documentation
```

## Resources

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

---

**Congratulations! 🎉**

You now have a fully functional case management system. Start adding your real cases and customize it to fit your needs!

Need help? Check the README.md or create an issue in the project repository.