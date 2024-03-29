import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCJJi0uJuWaIyuEVZ8qUpHBV6nn1YyvbCI",
  authDomain: "lumia-arredamenti.firebaseapp.com",
  projectId: "lumia-arredamenti",
  storageBucket: "lumia-arredamenti.appspot.com",
  messagingSenderId: "1070039103903",
  appId: "1:1070039103903:web:46e9ce3cb3662ab8bc65aa",
  measurementId: "G-NDC268WNKY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); /*Per Google analytics*/
const storage = getStorage();

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export default getFirestore(app);