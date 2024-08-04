// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFOa0Aa-3ANaCvFXx-tFGINolEfkqx9fM",
  authDomain: "inventory-management-5dd50.firebaseapp.com",
  projectId: "inventory-management-5dd50",
  storageBucket: "inventory-management-5dd50.appspot.com",
  messagingSenderId: "166952853808",
  appId: "1:166952853808:web:675013af050577bac1e8f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app)
const firestore = getFirestore(app)

export {firestore}