import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCJoOzHU4_Y1eJkWT3U8LEsVCJWsZdNkrI",
  authDomain: "chat-421015.firebaseapp.com",
  projectId: "chat-421015",
  storageBucket: "chat-421015.appspot.com",
  messagingSenderId: "564137234708",
  appId: "1:564137234708:web:cf1a839c313c5a3d5a3201",
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account ",
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
