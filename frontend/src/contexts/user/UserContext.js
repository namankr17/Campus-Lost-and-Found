import { createContext, useState, useContext, useEffect } from "react";
import { userService } from "../../services/userService";
import { AuthContext } from "../auth/AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchUserProfile = async () => {
    try {
      setLoading(false);
      setError(null);
      const data = await userService.getUserProfile(user.id);
      setUserProfile(data.user);
      setUserPosts(data.posts);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.response?.data?.message || "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  const getUserStats = () => {
    return userService.getUserStats(userPosts);
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateProfile(formData);
      setUserProfile(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        userPosts,
        loading,
        error,
        getUserStats,
        fetchUserProfile,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
