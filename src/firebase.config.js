import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyARlMB7gNdummdnsYEsDk7XwBrpO-VJND0',
  authDomain: 'house-marketplace-6971c.firebaseapp.com',
  projectId: 'house-marketplace-6971c',
  storageBucket: 'house-marketplace-6971c.appspot.com',
  messagingSenderId: '497907122776',
  appId: '1:497907122776:web:79542e1a5f2e841e20402d',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
