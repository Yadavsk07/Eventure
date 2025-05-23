import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const CreateProfile = () => {
  const [activeForm, setActiveForm] = useState("organizer");
  const [organizerImage, setOrganizerImage] = useState("https://via.placeholder.com/100");
  const [sponsorImage, setSponsorImage] = useState("https://via.placeholder.com/100");

  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [aboutOrganization, setAboutOrganization] = useState("");
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

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please log in to upload an image.");
      return;
    }

    try {
      const fileRef = ref(storage, `profileImages/${currentUser.uid}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
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
      aboutOrganization,
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
    <div className="bg-[#fdf7f8] flex flex-col items-center justify-center min-h-screen font-poppins">
      <div className="text-center px-4 py-2">
        <h1 className="text-2xl text-[#4c3197] font-bold">
          Complete your profile to connect and unlock the best opportunities tailored just for you!
        </h1>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md font-semibold ${
              activeForm === "organizer"
                ? "bg-[#4c3197] text-white"
                : "bg-[#f3f0fa] text-[#4c3197] border border-[#4c3197]"
            }`}
            onClick={() => handleFormSwitch("organizer")}
          >
            Event Organizer
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${
              activeForm === "sponsor"
                ? "bg-[#4c3197] text-white"
                : "bg-[#f3f0fa] text-[#4c3197] border border-[#4c3197]"
            }`}
            onClick={() => handleFormSwitch("sponsor")}
          >
            Sponsor
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6">
            <img
              src={activeForm === "organizer" ? organizerImage : sponsorImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-sm"
              onChange={(e) =>
                handleImagePreview(
                  activeForm === "organizer" ? setOrganizerImage : setSponsorImage,
                  e
                )
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              placeholder="Enter your contact number"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name of the Organization</label>
            <input
              type="text"
              placeholder="Enter your organization name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Organization Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Enter your location"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">About the Organization</label>
            <textarea
              placeholder="Give a short description of your organization"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
              value={aboutOrganization}
              onChange={(e) => setAboutOrganization(e.target.value)}
              required
            />
          </div>
          {activeForm === "organizer" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Website/Social Media Links</label>
              <input
                type="text"
                placeholder="Enter your links"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          )}
          {activeForm === "sponsor" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Previously Sponsored Events
              </label>
              <textarea
                placeholder="List the events you have sponsored"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
                value={previouslySponsoredEvents}
                onChange={(e) => setPreviouslySponsoredEvents(e.target.value)}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-[#4c3197] text-white font-semibold rounded-md hover:bg-[#372d70] transition-colors"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
