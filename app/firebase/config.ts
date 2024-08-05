import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
  

const firebaseConfig = {
  apiKey: "AIzaSyCxAS65d4UchB5H4t-Ua96A0N7d0nvtUk4",
  authDomain: "preto-be747.firebaseapp.com",
  projectId: "preto-be747",
  storageBucket: "preto-be747.appspot.com",
  messagingSenderId: "407287979285",
  appId: "1:407287979285:ios:951515e5e3f57479ccdd1c",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };
