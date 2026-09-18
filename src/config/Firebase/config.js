import firebase from 'firebase/compat/app';
// import { getPerformance } from "firebase/performance";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
  measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID
};

// Only initialize Firebase in the browser and when env vars are present
const isBrowser = typeof window !== 'undefined';
const hasCredentials = Boolean(firebaseConfig.apiKey);

if (isBrowser && hasCredentials && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = isBrowser && hasCredentials && firebase.apps.length ? firebase.firestore() : null;
const auth = isBrowser && hasCredentials && firebase.apps.length ? firebase.auth() : null;
const storage = isBrowser && hasCredentials && firebase.apps.length ? firebase.storage() : null;
const functions = isBrowser && hasCredentials && firebase.apps.length ? firebase.functions() : null;
const specialFirestoreOptions = isBrowser && hasCredentials && firebase.apps.length ? firebase.firestore.FieldValue : null;
// const perf = getPerformance(firebase.initializeApp(firebaseConfig));

export { firebase, db, auth, functions, storage, specialFirestoreOptions }