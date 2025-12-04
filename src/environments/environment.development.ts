export const environment = {
    production: false,
    firebase: {
        // Replace these with your Firebase project configuration
        // You can find these values in Firebase Console -> Project Settings
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID",
        // Optional App Check config for web; fill these to enable.
        // For local development, you can set appCheckDebugToken to true to print a token in the console,
        // then paste that token here and keep it during development.
        recaptchaV3SiteKey: "",
        appCheckDebugToken: ""
    }
};
