import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER,
    appId: process.env.FIREBASE_APP_ID,
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const googleProvider = new firebase.auth.GoogleAuthProvider();

const database = firebase.database();
export {firebase, googleProvider, database as default}