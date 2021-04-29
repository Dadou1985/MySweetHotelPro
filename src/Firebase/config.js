import * as firebase from 'firebase'
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDGf-DWOM8z-I4nC2jg0PxsfLKQ_GE7o0",
  authDomain: "notel-765b1.firebaseapp.com",
  databaseURL: "https://notel-765b1.firebaseio.com",
  projectId: "notel-765b1",
  storageBucket: "notel-765b1.appspot.com",
  messagingSenderId: "746435372425",
  appId: "1:746435372425:web:25e5561ab78f54eb04ed58",
  measurementId: "G-WTWN8J9PQE"
  };

firebase.initializeApp(firebaseConfig);
 
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, functions, storage }