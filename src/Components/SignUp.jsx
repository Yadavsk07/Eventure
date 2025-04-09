import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";

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
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add the user data to Firestore in the respective collection
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
    <div className="SignUp">
      <div className="login-container">
        <div className="user-selection">
          <button
            className={activeForm === "organizer" ? "active" : ""}
            onClick={() => handleFormSwitch("organizer")}
          >
            Event Organizer
          </button>
          <button
            className={activeForm === "sponsor" ? "active" : ""}
            onClick={() => handleFormSwitch("sponsor")}
          >
            Sponsor
          </button>
        </div>

        <div className="form-section active">
          <h1>Welcome!</h1>
          <p className="subtitle">
            {activeForm === "organizer"
              ? "Let's get your next big event the perfect sponsor."
              : "Discover the perfect events to showcase your brand."}
          </p>
          <form onSubmit={handleSignUp}>
            <div className="form-control">
              <label htmlFor="email">Email or phone number</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <div className="password-container">
                <a href="#">Forgot password?</a>
              </div>
            </div>
            <p className="terms">
              By clicking Agree & Join, you agree to the Eventure User Agreement,
              Privacy Policy, and Cookie Policy.
            </p>
            <button type="submit" className="submit-btn">
              Agree & Join
            </button>
          </form>
        </div>

        <p className="footer-signup">
          Already on Eventure? <Link to="/Signin">Sign in</Link>
        </p>
      </div>

      {/* Toast notification container */}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
