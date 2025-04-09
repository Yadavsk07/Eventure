import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Monitor user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfileData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch user profile data
  const fetchProfileData = async (userId) => {
    try {
      const organizerDoc = await getDoc(doc(db, "Organizers", userId));
      const sponsorDoc = await getDoc(doc(db, "Sponsors", userId));

      if (organizerDoc.exists()) {
        setProfileData({
          organizationName: organizerDoc.data().organizationName,
          profileImage: organizerDoc.data().profileImage,
        });
      } else if (sponsorDoc.exists()) {
        setProfileData({
          organizationName: sponsorDoc.data().organizationName,
          profileImage: sponsorDoc.data().profileImage,
        });
      } else {
        setProfileData({ organizationName: "Anonymous", profileImage: null });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch all posts
  const fetchPosts = () => {
    const postsQuery = query(collection(db, "Posts"), orderBy("createdAt", "desc"));
    onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });
  };

  // Upload an image and return its download URL
  const handleImageUpload = async (file) => {
    try {
      const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  // Handle create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!postContent.trim() && !postImage) {
      alert("Post content or image is required.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = null;

      if (postImage) {
        imageUrl = await handleImageUpload(postImage);
      }

      const postData = {
        authorId: user.uid,
        authorName: profileData?.organizationName || "Anonymous",
        authorProfileImage: profileData?.profileImage || "https://via.placeholder.com/150",
        content: postContent,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "Posts"), postData);

      // Clear form inputs
      setPostContent("");
      setPostImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Please log in to view the homepage.</p>;
  }

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>Eventure</h1>
        </div>
        <div className="navbar-links">
          <a href="#home">Home</a>
          <a href="/profilepage">Profile</a>
          <a href="#settings">Settings</a>
          <a href="/SignIn">Logout</a>
        </div>
      </nav>

      {/* Create Post Section */}
      <div className="create-post-section">
        <form onSubmit={handleCreatePost} className="create-post-form">
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPostImage(file); // Store the File object
              }
            }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>

      {/* Posts Section */}
      <div className="posts-section">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img
                src={
                  post.authorProfileImage && post.authorProfileImage.trim() !== ""
                    ? post.authorProfileImage
                    : "https://via.placeholder.com/150"
                }
                alt="Author"
                className="profile-image"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
              <div>
                <h4>{post.authorName || "Anonymous"}</h4>
                <p>{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="post-image"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
