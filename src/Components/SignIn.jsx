import React, { useState } from "react";
import { Link } from 'react-router-dom';
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-purple-800 text-center mb-4">EVENTURE</h1>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
              Email or phone number
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <div className="text-right mt-2">
              <a href="#" className="text-sm text-purple-800 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-purple-800 text-white rounded-md font-bold hover:bg-purple-900 transition"
          >
            Sign in
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          New to Eventure?{" "}
          <Link to="/signup" className="text-purple-800 hover:underline">
            Join now
          </Link>
        </p>

        {/* Toast Container */}
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default SignIn;
