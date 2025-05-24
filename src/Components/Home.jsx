import React, { useEffect, useState } from "react";
import { profile } from "../services/api";

const ProfileSection = ({ title, content }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-600 inline-block mb-2">
      {title}
    </h2>
    <p className="text-gray-600 text-sm">{content}</p>
  </section>
);

const Home = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setProfileData(null);
      setLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
      fetchProfileData();
    } catch (error) {
      console.error('Error parsing token:', error);
      setUser(null);
      setProfileData(null);
      setLoading(false);
    }
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await profile.get();
      console.log('Fetched profile data:', response.data);
      console.log('Profile image URL:', response.data.profile_image);
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Failed to fetch profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium mt-8">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-600 font-medium mt-8">
        Please log in to view your profile.
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center text-gray-600 font-medium mt-8">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mt-12">
      <div className="flex items-center mb-8">
        {console.log('Rendering profile image with URL:', profileData.profile_image)}
        <img
          src={profileData.profile_image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover mr-6 shadow-md"
          onError={(e) => {
            console.error('Error loading profile image:', e);
            e.target.onerror = null;
            e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
          }}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {profileData.organization_name}
          </h1>
          <p className="text-gray-600 text-sm">
            {user.userType} - {profileData.organization_type}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {profileData.location}
          </p>
        </div>
      </div>

      <div>
        <ProfileSection
          title="About"
          content={profileData.about_organization}
        />

        {user.userType === "sponsor" && (
          <ProfileSection
            title="Previously Sponsored Events"
            content={
              profileData.previously_sponsored_events ||
              "No events sponsored yet."
            }
          />
        )}

        {profileData.website && (
          <ProfileSection
            title="Website / Social Media"
            content={
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {profileData.website}
              </a>
            }
          />
        )}

        <ProfileSection
          title="Contact Information"
          content={
            <div>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Phone: {profileData.contact_number}</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Home;
