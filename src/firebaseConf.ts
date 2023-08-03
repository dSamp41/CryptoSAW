import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAU9V74XZs4zMQyjrCmtrY0Ty7gbga3xJI",
    authDomain: "cryptosaw-4dee9.firebaseapp.com",
    projectId: "cryptosaw-4dee9",
    storageBucket: "cryptosaw-4dee9.appspot.com",
    messagingSenderId: "481172466191",
    appId: "1:481172466191:web:7b5d50a7e425102e8a917a",
    measurementId: "G-90DJXPZY3D"
};
  

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
