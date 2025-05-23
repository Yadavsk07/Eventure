import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase"; // Import Firebase auth and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProfileData(currentUser.uid);
      } else {
        setUser(null);
        setProfileData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfileData = async (userId) => {
    setLoading(true);
    setError("");

    try {
      const organizerDoc = await getDoc(doc(db, "Organizers", userId));
      const sponsorDoc = await getDoc(doc(db, "Sponsors", userId));

      if (organizerDoc.exists()) {
        setProfileData({ ...organizerDoc.data(), userType: "Organizer" });
      } else if (sponsorDoc.exists()) {
        setProfileData({ ...sponsorDoc.data(), userType: "Sponsor" });
      } else {
        setError("No profile data found.");
      }
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
        <img
          src={profileData.profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover mr-6 shadow-md"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {profileData.organizationName}
          </h1>
          <p className="text-gray-600 text-sm">
            {profileData.userType} - {profileData.organizationType}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {profileData.location}
          </p>
        </div>
      </div>

      <div>
        <ProfileSection
          title="About"
          content={profileData.aboutorganization}
        />

        {profileData.userType === "Sponsor" && (
          <ProfileSection
            title="Previously Sponsored Events"
            content={
              profileData.previouslySponsoredEvents ||
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
              <p className="text-gray-600">Email: {profileData.email}</p>
              <p className="text-gray-600">Phone: {profileData.contactNumber}</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Home;
