// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChQopH4rqK7WtjgURWz2cRDwNnt-Az1f8",
  authDomain: "travelnest-264f8.firebaseapp.com",

  projectId: "travelnest-264f8",
  storageBucket: "travelnest-264f8.appspot.com",
  messagingSenderId: "791369914872",
  appId: "1:791369914872:web:e7559ac35b07158aea5e0d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { db, auth, storage  };

