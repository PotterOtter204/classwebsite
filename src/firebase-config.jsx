// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwhfRMpWctSaAGoZTpuV1goaPzOdH5Mgs",
  authDomain: "codeprofai.firebaseapp.com",
  projectId: "codeprofai",
  storageBucket: "codeprofai.appspot.com",
  messagingSenderId: "197164588312",
  appId: "1:197164588312:web:9c1a61ddee9d9817f9526d",
  measurementId: "G-XS7P0WS6CG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);