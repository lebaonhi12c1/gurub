// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import 'firebase/auth'
import {
  VUE_APP_APIKEY,
  VUE_APP_AUTHDOMAIN,
  VUE_APP_PROJECTID,
  VUE_APP_STORAGEBUCKET,
  VUE_APP_MESSAGEINGSENDERID,
  VUE_APP_APPID,
  VUE_APP_MEASUREMENTID
} from "./variable-key"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: VUE_APP_APIKEY,
  authDomain: VUE_APP_AUTHDOMAIN,
  projectId: VUE_APP_PROJECTID,
  storageBucket: VUE_APP_STORAGEBUCKET,
  messagingSenderId: VUE_APP_MESSAGEINGSENDERID,
  appId: VUE_APP_APPID,
  measurementId: VUE_APP_MEASUREMENTID
};


const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const getFireBase = () => {
  return app;
}
