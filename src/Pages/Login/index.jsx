import React from "react";
import "./login.css";
import { db, signInWithGooglePopup } from "../../utils/firebase.utils";
import { useDispatch, useSelector } from "react-redux";
import { storeMeData } from "../../store/Reducer/meDataReducer";
import { doc, setDoc } from "firebase/firestore";
const Login = () => {
  const meData = useSelector((state) => state.meData);
  const dispatch = useDispatch();
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
    await setDoc(doc(db, "users", response?.user?.uid), {
      displayName: response.user.displayName,
      email: response.user.email,
      photoURL: response.user.photoURL,
      uid: response.user.uid,
      accessToken: response.user.accessToken,
    });
    dispatch(
      storeMeData({
        displayName: response.user.displayName,
        email: response.user.email,
        photoURL: response.user.photoURL,
        uid: response.user.uid,
        accessToken: response.user.accessToken,
      })
    );
  };
  return (
    <div className="total-login">
      <div className="login-middle">
        <h1>Login</h1>
        <p>Please login to start.</p>
        <button onClick={logGoogleUser}>Sign In With Google</button>
      </div>
    </div>
  );
};

export default Login;
