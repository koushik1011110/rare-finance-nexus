import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAtayHNisgJF8IIm2TFYDWv2y0gv4TMjQ0",
  authDomain: "raredu-190c1.firebaseapp.com",
  projectId: "raredu-190c1",
  storageBucket: "raredu-190c1.firebasestorage.app",
  messagingSenderId: "951768943347",
  appId: "1:951768943347:web:c14b523a61cfc4990d8586",
  measurementId: "G-WZKY9CQXGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);