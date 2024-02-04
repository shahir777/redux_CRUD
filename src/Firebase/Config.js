// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC23Z48elcqFXocBt5wknlP_pTT6ycxATM",
  authDomain: "reduxcrud-65139.firebaseapp.com",
  projectId: "reduxcrud-65139",
  storageBucket: "reduxcrud-65139.appspot.com",
  messagingSenderId: "18525224258",
  appId: "1:18525224258:web:bd44ba981c8e37152e9cdb",
  measurementId: "G-007VYX89T8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app)
export const storage=getStorage(app);

export default db;
