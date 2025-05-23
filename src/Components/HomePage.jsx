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

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfileData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

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
    return <p className="text-center text-gray-600">Please log in to view the homepage.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <nav className="bg-blue-500 text-white flex justify-between items-center p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-xl font-bold">Eventure</h1>
        <div className="flex space-x-4">
          <a href="#home" className="hover:underline">Home</a>
          <a href="/profilepage" className="hover:underline">Profile</a>
          <a href="#settings" className="hover:underline">Settings</a>
          <a href="/SignIn" className="hover:underline">Logout</a>
        </div>
      </nav>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPostImage(file);
              }
            }}
            className="block w-full text-gray-700 border border-gray-300 rounded-lg file:bg-blue-500 file:text-white file:rounded-lg file:px-4 file:py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={post.authorProfileImage || "https://via.placeholder.com/150"}
                alt="Author"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold">{post.authorName || "Anonymous"}</h4>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="rounded-lg"
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
