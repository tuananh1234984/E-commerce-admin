// Firebase Configuration
// To use this application, you need to configure Firebase:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Go to Project Settings > General > Your apps
// 3. Copy your Firebase configuration values and paste them below
export const environment = {
    production: true,
    firebase: {
        apiKey: "", // Your Firebase API Key
        authDomain: "", // Your Firebase Auth Domain (e.g., your-project.firebaseapp.com)
        projectId: "", // Your Firebase Project ID
        storageBucket: "", // Your Firebase Storage Bucket (e.g., your-project.appspot.com)
        messagingSenderId: "", // Your Firebase Messaging Sender ID
        appId: "", // Your Firebase App ID
        measurementId: "", // Your Firebase Measurement ID (optional)
        // Optional App Check config for web; fill these to enable.
        recaptchaV3SiteKey: "",
        appCheckDebugToken: ""
    }
};
