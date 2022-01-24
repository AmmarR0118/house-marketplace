import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: <-- YOUR API KEY GOES HERE -->,
  authDomain: <-- YOUR AUTH DOMAIN GOES HERER -->,
  projectId: <-- YOUT PROJECT ID GOES HERE -->,
  storageBucket: <-- YOUT STORAGE GOES HERE -->,
  messagingSenderId: <-- YOUT MESSAGING SENDER ID GOES HERE -->,
  appId: <-- YOUT APP ID GOES HERE -->,
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
