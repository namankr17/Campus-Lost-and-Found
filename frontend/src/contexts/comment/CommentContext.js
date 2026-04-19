import { createContext, useContext, useState } from "react";
import { commentService } from "../../services/commentService";

const CommentContext = createContext();

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};

export const CommentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get comments for a post
  const getComments = async (postId) => {
    setLoading(true);
    try {
      const comments = await commentService.getComments(postId);
      setLoading(false);
      return comments;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching comments");
      setLoading(false);
      throw err;
    }
  };

  // Add a new comment
  const addComment = async (postId, text) => {
    setLoading(true);
    try {
      const newComment = await commentService.addComment(postId, text);
      setLoading(false);
      return newComment;
    } catch (err) {
      setError(err.response?.data?.message || "Error adding comment");
      setLoading(false);
      throw err;
    }
  };

  // Delete a comment
  const deleteComment = async (postId, commentId) => {
    setLoading(true);
    try {
      await commentService.deleteComment(postId, commentId);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting comment");
      setLoading(false);
      throw err;
    }
  };

  const value = {
    loading,
    error,
    getComments,
    addComment,
    deleteComment,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};
