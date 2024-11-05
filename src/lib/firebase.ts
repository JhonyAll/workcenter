import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFePAJHTewMidaUy4uSUU6bRflT_ndEG8",
  authDomain: "workcenter-af37b.firebaseapp.com",
  projectId: "workcenter-af37b",
  storageBucket: "workcenter-af37b.appspot.com",
  messagingSenderId: "203281946394",
  appId: "1:203281946394:web:0bec80cc63b147a11a7ea3",
  measurementId: "G-F2P4WN338C"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
