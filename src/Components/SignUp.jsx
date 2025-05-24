import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [activeForm, setActiveForm] = useState("organizer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFormSwitch = (userType) => {
    setActiveForm(userType);
    setEmail("");
    setPassword("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await auth.register({ email, password, userType: activeForm });
      // Automatically sign in after successful registration
      const loginResponse = await auth.login({ email, password });
      localStorage.setItem('token', loginResponse.data.token);
      toast.success("User registered and logged in successfully!", { position: "top-center" });
      navigate("/createprofile");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.error || "Registration failed. Please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleFormSwitch("organizer")}
            className={`px-4 py-2 rounded-md ${
              activeForm === "organizer"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Organizer
          </button>
          <button
            onClick={() => handleFormSwitch("sponsor")}
            className={`px-4 py-2 rounded-md ${
              activeForm === "sponsor"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sponsor
          </button>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:text-blue-600">
            Sign In
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
