// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import  Constants  from "expo-constants";
import  ReactNativeAsyncStorage  from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.manifest2.extra.API_KEY,
  authDomain: Constants.manifest2.extra.AUTH_DOMAIN,
  projectId: Constants.manifest2.extra.PROJECT_ID,
  storageBucket: Constants.manifest2.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.manifest2.extra.MESSAGING_SENDER_ID,
  appId: Constants.manifest2.extra.APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});