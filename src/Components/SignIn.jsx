import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./SignIn.css"; // Importing the external CSS file
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!");
      window.location.href = "/homepage";

    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="signin-container">
      <h1 className="heading1">EVENTURE</h1>
      <h2 className="heading2">Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-control">
          <label htmlFor="email">Email or phone number</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="password-container-signin">
            <a href="#">Forgot password?</a>
          </div>
        </div>
        <button type="submit" className="button-signin">
          Sign in
        </button>
      </form>
      <p className="footer-signin">
        New to Eventure? <Link to="/signup">Join now</Link>
      </p>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default SignIn;
