import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const collectionName = activeForm === "organizer" ? "Organizers" : "Sponsors";
      await setDoc(doc(db, collectionName, user.uid), {
        email: user.email,
        userType: activeForm,
        createdAt: new Date(),
      });

      toast.success("User registered successfully!", { position: "top-center" });
      navigate("/createprofile");
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Try logging in instead.", { position: "top-center" });
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters.", { position: "top-center" });
      } else {
        toast.error("Registration failed. Please try again.", { position: "top-center" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center font-poppins">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 border rounded-lg font-semibold text-sm transition ${
              activeForm === "organizer"
                ? "bg-purple-800 text-white border-purple-800"
                : "bg-purple-100 text-purple-800 border-purple-800"
            }`}
            onClick={() => handleFormSwitch("organizer")}
          >
            Event Organizer
          </button>
          <button
            className={`ml-4 px-4 py-2 border rounded-lg font-semibold text-sm transition ${
              activeForm === "sponsor"
                ? "bg-purple-800 text-white border-purple-800"
                : "bg-purple-100 text-purple-800 border-purple-800"
            }`}
            onClick={() => handleFormSwitch("sponsor")}
          >
            Sponsor
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-4">Welcome!</h1>
          <p className="text-sm text-gray-600 mb-6">
            {activeForm === "organizer"
              ? "Let's get your next big event the perfect sponsor."
              : "Discover the perfect events to showcase your brand."}
          </p>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email or phone number
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800"
              />
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-purple-800 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              By clicking Agree & Join, you agree to the Eventure User Agreement, Privacy Policy, and Cookie Policy.
            </p>
            <button
              type="submit"
              className="w-full py-2 bg-purple-800 text-white rounded-lg font-bold hover:bg-purple-900 transition"
            >
              Agree & Join
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-600 mt-6">
          Already on Eventure?{" "}
          <Link to="/Signin" className="text-purple-800 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
