// Firebase settings for Pip's Sky Islands.
// Paste the values from: Firebase console > Project settings (gear icon) > General > Your apps > Web app > "SDK setup and configuration" > Config.
// These values are not secret: they only identify the project. Your data is protected by firestore.rules.
// While apiKey says PASTE_..., the game runs without accounts and saves only in the browser.
window.PIP_FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
