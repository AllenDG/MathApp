import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env";

const firebaseConfig = {
  apiKey: "AIzaSyBBUjokJLG8YrSJ6BJEkKB0GYGdgx4oJ_o",
  authDomain: "mathwiseapp.firebaseapp.com",
  projectId: "mathwiseapp",
  storageBucket: "mathwiseapp.appspot.com",
  messagingSenderId: "931201823943",
  appId: "1:931201823943:web:6d2cfc4ed57e7152d6bae2",
  measurementId: "G-R7Z6W1BFL3",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
