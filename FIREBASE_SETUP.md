# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Holiday Coverage Poll app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `holiday-coverage-poll` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional, not needed for this app)
6. Click **Create project**
7. Wait for Firebase to create your project, then click **Continue**

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Holiday Coverage Poll`
3. **DO NOT** check "Set up Firebase Hosting" (we're using GitHub Pages)
4. Click **Register app**
5. You'll see your Firebase configuration code - **keep this page open!**

## Step 3: Enable Realtime Database

1. In the left sidebar, click **Build** > **Realtime Database**
2. Click **Create Database**
3. Choose a location (e.g., `us-central1`)
4. Start in **test mode** (we'll secure it in Step 5)
5. Click **Enable**

## Step 4: Configure Your App

1. Open `app.js` in your code editor
2. Find the Firebase configuration section (lines 9-17)
3. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",                    // Copy from Firebase Console
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

**Where to find these values:**
- Go to Firebase Console > Project Settings (gear icon) > General
- Scroll down to "Your apps"
- Copy the config object

## Step 5: Secure Your Database

By default, test mode allows anyone to read/write. Let's secure it:

1. In Firebase Console, go to **Realtime Database**
2. Click the **Rules** tab
3. Replace the rules with:

```json
{
  "rules": {
    "votes": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. Click **Publish**

**Note:** These rules allow anyone with the URL to read/write votes. For a small internal team, this is fine. For more security, you could add Firebase Authentication.

## Step 6: Test Your Setup

1. Open `index.html` in your browser
2. Open the browser console (F12)
3. You should see: `Firebase initialized successfully`
4. Add `?vote` to the URL to test voting
5. Select a name and click on some days
6. Click **Submit Vote**
7. Check Firebase Console > Realtime Database - you should see the votes appear!

## Step 7: Deploy to GitHub Pages

1. Commit your changes with the Firebase config:
```bash
git add .
git commit -m "Add Firebase integration"
git push origin main
```

2. Enable GitHub Pages:
   - Go to your GitHub repository
   - Settings > Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click **Save**

3. Your app will be live at: `https://yourusername.github.io/on-call-scheduling-app/`

## Troubleshooting

### "Firebase not defined" error
- Make sure you're loading the app via HTTP/HTTPS (not `file://`)
- Check that the Firebase SDK scripts are loading before `app.js`

### Votes not saving
- Check the browser console for errors
- Verify your Firebase config is correct
- Make sure Realtime Database is enabled
- Check that database rules allow write access

### "Permission denied" error
- Check your database rules in Firebase Console
- Make sure the rules allow read/write access

### Data not syncing in real-time
- Open the app in two browser windows
- Vote in one window, you should see updates in the other
- If not, check browser console for errors

## Database Structure

Your Firebase Realtime Database will store data like this:

```json
{
  "votes": {
    "Matt": {
      "mon-nov-24": "yes",
      "tue-nov-25": "maybe",
      "fri-nov-28": "yes"
    },
    "Robert": {
      "mon-nov-24": "yes",
      "wed-nov-26": "yes"
    }
  }
}
```

## Firebase Free Tier Limits

The free "Spark" plan includes:
- **Realtime Database**: 1 GB stored, 10 GB/month downloaded
- **More than enough** for this app (will use < 1 MB)

## Optional: Add Authentication

If you want to restrict access to only your team:

1. Enable Email/Password auth in Firebase Console
2. Add login UI to the app
3. Update database rules to require authentication
4. Each team member creates an account

Let me know if you need help with this!
