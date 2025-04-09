import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./firebase"; // Import Firebase auth, Firestore, and storage
import { doc, setDoc } from "firebase/firestore";
import "./CreateProfile.css";

const CreateProfile = () => {
  const [activeForm, setActiveForm] = useState("organizer");
  const [organizerImage, setOrganizerImage] = useState("https://via.placeholder.com/100");
  const [sponsorImage, setSponsorImage] = useState("https://via.placeholder.com/100");

  // Form states
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [aboutorganization, setOrganizationAbout] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [previouslySponsoredEvents, setPreviouslySponsoredEvents] = useState("");

  const handleFormSwitch = (userType) => {
    setActiveForm(userType);
  };

  const handleImagePreview = async (setImage, event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    // Update local preview
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);

    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please log in to upload an image.");
      return;
    }

    // Upload image to Firebase Storage
    try {
      const fileRef = ref(storage, `profileImages/${currentUser.uid}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      // Update the image URL in the form state
      setImage(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please log in to create your profile.");
      return;
    }

    const profileData = {
      email,
      contactNumber,
      organizationName,
      aboutorganization,
      organizationType,
      location,
      website,
      profileImage: activeForm === "organizer" ? organizerImage : sponsorImage,
      ...(activeForm === "sponsor" && { previouslySponsoredEvents }),
    };

    try {
      const collectionName = activeForm === "organizer" ? "Organizers" : "Sponsors";
      await setDoc(doc(db, collectionName, currentUser.uid), profileData);
      alert("Profile created successfully!");
      window.location.href = "/SignIn";
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="create-profile">
      <div className="profile-container">
        <div className="head">
          <h1>
            Complete your profile to connect and unlock the best opportunities tailored just for you!
          </h1>
        </div>
        <div className="profile-user-selection">
          <button
            className={`toggle-btn ${activeForm === "organizer" ? "active" : ""}`}
            onClick={() => handleFormSwitch("organizer")}
          >
            Event Organizer
          </button>
          <button
            className={`toggle-btn ${activeForm === "sponsor" ? "active" : ""}`}
            onClick={() => handleFormSwitch("sponsor")}
          >
            Sponsor
          </button>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="profile-picture">
              <img
                src={activeForm === "organizer" ? organizerImage : sponsorImage}
                alt="Profile"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImagePreview(
                    activeForm === "organizer" ? setOrganizerImage : setSponsorImage,
                    e
                  )
                }
              />
            </div>
            <div className="form-control">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label>Contact Number</label>
              <input
                type="text"
                placeholder="Enter your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label>Name of the Organization</label>
              <input
                type="text"
                placeholder="Enter your organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label>Organization Type</label>
              <select
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="corporate">Corporate</option>
                <option value="non-profit">Non-Profit</option>
                <option value="educational">Educational</option>
              </select>
            </div>
            <div className="form-control">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label>About the Organization</label>
              <textarea
                placeholder="Give a short description of your organization"
                value={aboutorganization}
                onChange={(e) => setOrganizationAbout(e.target.value)}
                required
              />
            </div>
            {activeForm === "organizer" && (
              <div className="form-control">
                <label>Website/Social Media Links</label>
                <input
                  type="text"
                  placeholder="Enter your links"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            )}
            {activeForm === "sponsor" && (
              <div className="form-control">
                <label>Previously Sponsored Events</label>
                <textarea
                  placeholder="List the events you have sponsored"
                  value={previouslySponsoredEvents}
                  onChange={(e) => setPreviouslySponsoredEvents(e.target.value)}
                />
              </div>
            )}
            <button type="submit" className="submit-btn">
              Create Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
