// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import  Constants  from "expo-constants";
import  ReactNativeAsyncStorage  from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.API_KEY || Constants.manifest2.extra.API_KEY,
  authDomain: Constants.expoConfig?.extra?.AUTH_DOMAIN || Constants.manifest2.extra.AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.PROJECT_ID || Constants.manifest2.extra.PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.STORAGE_BUCKET || Constants.manifest2.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.MESSAGING_SENDER_ID || Constants.manifest2.extra.MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.APP_ID || Constants.manifest2.extra.APP_ID
};

console.log("Firebase Config:", firebaseConfig);
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
export const db = getFirestore(app);