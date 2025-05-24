import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { posts, profile } from "../services/api";
import { io } from "socket.io-client";
import imageCompression from 'browser-image-compression';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Parse user data from token
    try {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
      // Fetch profile data after setting user
      fetchProfileData(userData);
    } catch (error) {
      console.error('Error parsing token:', error);
      navigate('/signin');
    }

    // Connect to Socket.io
    const socket = io('http://localhost:5000');
    
    socket.on('newPost', (post) => {
      setAllPosts(prevPosts => [post, ...prevPosts]);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const fetchProfileData = async (userData) => {
    try {
      const response = await profile.get();
      console.log('Fetched profile:', response.data);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await posts.getAll();
      console.log('Fetched posts:', response.data);
      setAllPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920
      });
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      throw error;
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
      const formData = new FormData();
      if (postContent.trim()) {
        formData.append('content', postContent.trim());
      }
      
      if (postImage) {
        const compressedImage = await handleImageUpload(postImage);
        formData.append('image', compressedImage);
      }

      // Log the FormData contents
      console.log('Post FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      const response = await posts.create(formData);
      console.log('Post creation response:', response);
      
      setPostContent("");
      setPostImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <nav className="bg-blue-500 text-white flex justify-between items-center p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-xl font-bold">Eventure</h1>
        <div className="flex space-x-4">
          <a href="#home" className="hover:underline">Home</a>
          <a href="/profilepage" className="hover:underline">Profile</a>
          <a href="#settings" className="hover:underline">Settings</a>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/signin');
            }} 
            className="hover:underline"
          >
            Logout
          </button>
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
        {allPosts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={post.profile_image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                alt="Author"
                className="w-12 h-12 rounded-full mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                }}
              />
              <div>
                <h4 className="font-semibold">{post.organization_name || "Anonymous"}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post"
                className="rounded-lg max-w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
