export const environment = {
    production: true,
    firebase: {
        // Thay thế bằng API Key từ Firebase Console của bạn
        apiKey: "YOUR_FIREBASE_API_KEY_HERE",
        
        // Thay thế bằng Auth Domain (thường là project-id.firebaseapp.com)
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        
        // Project ID của bạn
        projectId: "YOUR_PROJECT_ID",
        
        // Storage Bucket (thường là project-id.appspot.com)
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        
        // Sender ID (dãy số)
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        
        // App ID (1:xxxxxxxx:web:xxxxxxx)
        appId: "YOUR_APP_ID_HERE",
        
        // Measurement ID (G-XXXXXXXX)
        measurementId: "G-XXXXXXXXXX",
        
        // Optional App Check config for web; fill these to enable.
        recaptchaV3SiteKey: "YOUR_RECAPTCHA_KEY_OR_LEAVE_EMPTY",
        appCheckDebugToken: "YOUR_DEBUG_TOKEN_OR_LEAVE_EMPTY"
    }
};
