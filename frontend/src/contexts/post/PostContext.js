import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { postService } from "../../services/postService";

export const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get user posts (for profile page)
  const getUserPosts = () => {
    return posts.filter((post) => post.userId._id === user?._id);
  };

  // Get unresolved posts (for home page)
  const getUnresolvedPosts = () => {
    return posts.filter((post) => post.status === "unresolved");
  };

  // Add new post
  const addPost = async (postData) => {
    try {
      const newPost = await postService.createPost(postData);
      // Make sure we're updating the state with the complete post data
      setPosts((prevPosts) => [
        {
          ...newPost,
          userId: {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
          },
        },
        ...prevPosts,
      ]);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  // Update post
  const updatePost = async (postId, formData) => {
    try {
      const updatedPost = await postService.updatePost(postId, formData);
      // Refetch all posts to ensure we have fresh data
      const freshPosts = await postService.getAllPosts();
      setPosts(freshPosts);
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  const value = {
    posts,
    loading,
    error,
    getUserPosts,
    getUnresolvedPosts,
    addPost,
    updatePost,
    deletePost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
