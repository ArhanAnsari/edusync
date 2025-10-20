// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAmYRwVvlOWiAqi8GuO0XV_whm1XuQB7I",
  authDomain: "edusync-336a5.firebaseapp.com",
  projectId: "edusync-336a5",
  storageBucket: "edusync-336a5.firebasestorage.app",
  messagingSenderId: "656041936799",
  appId: "1:656041936799:web:85ce4cf0949288e9355faa",
  measurementId: "G-76ER5GSSZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);