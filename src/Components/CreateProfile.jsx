import React, { useState, useEffect } from "react";
import { profile } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
  const [activeForm, setActiveForm] = useState("organizer");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y");

  const [contactNumber, setContactNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [aboutOrganization, setAboutOrganization] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [previouslySponsoredEvents, setPreviouslySponsoredEvents] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const handleFormSwitch = (userType) => {
    setActiveForm(userType);
  };

  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    // Store the actual file
    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      contactNumber,
      organizationName,
      aboutOrganization,
      organizationType,
      location,
      website,
      profileImage,
      ...(activeForm === "sponsor" && { previouslySponsoredEvents }),
    };

    try {
      console.log('Sending profile data:', profileData);
      const response = await profile.create(profileData);
      console.log('Profile creation response:', response);
      alert("Profile created successfully!");
      navigate("/homepage");
    } catch (error) {
      console.error("Error creating profile:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
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
            type="button"
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
            type="button"
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
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-sm"
              onChange={handleImagePreview}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              placeholder="Enter your website URL (e.g., https://example.com)"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
              value={website}
              onChange={(e) => {
                let url = e.target.value;
                // Add https:// if not present
                if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                  url = 'https://' + url;
                }
                setWebsite(url);
              }}
            />
          </div>
          {activeForm === "sponsor" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Previously Sponsored Events
              </label>
              <textarea
                placeholder="List any events you have sponsored before"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c3197]"
                value={previouslySponsoredEvents}
                onChange={(e) => setPreviouslySponsoredEvents(e.target.value)}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-[#4c3197] hover:bg-[#3a2469]"
            }`}
          >
            {loading ? "Creating Profile..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
