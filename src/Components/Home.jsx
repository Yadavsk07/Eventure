import React, { useEffect, useState } from "react";
import "./Home.css";
import { auth, db } from "./firebase"; // Import Firebase auth and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LoadingSpinner from "./LoadingSpinner"; // A simple loading spinner component

const ProfileSection = ({ title, content }) => (
  <section className="profile-section">
    <h2>{title}</h2>
    <p>{content}</p>
  </section>
);

const Home = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Update user state
        fetchProfileData(currentUser.uid); // Fetch profile data
      } else {
        setUser(null); // Clear user state
        setProfileData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Clean up listener
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!user) {
    return <p className="no-data-message">Please log in to view your profile.</p>;
  }

  if (!profileData) {
    return <p className="no-data-message">No profile data available.</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={profileData.profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-details">
          <h1>{profileData.organizationName}</h1>
          <p className="profile-type">
            {profileData.userType} - {profileData.organizationType}
          </p>
          <p className="profile-location">{profileData.location}</p>
        </div>
      </div>

      <div className="profile-body">
        <ProfileSection title="About" content={profileData.aboutorganization} />

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
              >
                {profileData.website}
              </a>
            }
          />
        )}

        <ProfileSection
          title="Contact Information"
          content={
            <>
              <p>Email: {profileData.email}</p>
              <p>Phone: {profileData.contactNumber}</p>
            </>
          }
        />
      </div>
    </div>
  );
};

export default Home;
