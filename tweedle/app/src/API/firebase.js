import { initializeApp } from "@firebase/app";


const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
export const app = initializeApp(firebaseConfig);