import React, { useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FaUserEdit, FaFilter, FaCog, FaPlus } from "react-icons/fa";
import Posts from "../components/posts/Posts";
import PostItem from "../components/modals/PostItem";
import EditProfile from "../components/modals/EditProfile";
import { UserContext } from "../contexts/user/UserContext";
import { AuthContext } from "../contexts/auth/AuthContext";
import { usePosts } from "../contexts/post/PostContext";
import { Spinner } from "../components/common";
import defaultAvatar from "../assets/images/avatar.png";
import defaultCover from "../assets/images/maze.jpg";
import FilterMenu from "../components/filter/FilterMenu";

function Profile() {
  const location = useLocation();
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { loading: userLoading } = useContext(UserContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const { posts, loading: postsLoading } = usePosts();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    itemType: "all",
    sortBy: "newest",
  });

  const userPosts = posts.filter((post) => post.userId._id === user?._id);
  const resolvedPosts = userPosts.filter((post) => post.status === "resolved");
  const unresolvedPosts = userPosts.filter(
    (post) => post.status === "unresolved"
  );

  const openPostModal = () => setPostModalOpen(true);
  const closePostModal = () => setPostModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleApplyFilters = (filters) => {
    let filtered = [...userPosts];

    if (filters.status !== "all") {
      filtered = filtered.filter((post) => post.status === filters.status);
    }

    if (filters.itemType !== "all") {
      filtered = filtered.filter((post) => post.itemType === filters.itemType);
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredPosts(filtered);
    setActiveFilters(filters);
    setFilterMenuOpen(false);
  };

  if (authLoading || userLoading || postsLoading) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="profile-page">
      <div className="profile-info">
        <div className="cover-photo">
          <img
            src={user?.coverPic?.url || defaultCover}
            alt="Cover"
            className="cover-image"
          />
        </div>
        <img
          src={user?.profilePic?.url || defaultAvatar}
          alt="User Avatar"
          className="user-avatar"
        />
        <h2>{user?.username.toUpperCase()}</h2>
        <div className="button-group">
          <button className="edit-profile-button" onClick={openEditModal}>
            <FaUserEdit /> Edit Profile
          </button>
          <button className="create-post-button" onClick={openPostModal}>
            <FaPlus /> Create Post
          </button>
        </div>
      </div>
      <div className="subsections">
        <div className="user-stats">
          <h3>User Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Posts</h4>
              <p>{userPosts.length}</p>
            </div>
            <div className="stat-card">
              <h4>Unresolved</h4>
              <p>{unresolvedPosts.length}</p>
            </div>
            <div className="stat-card">
              <h4>Resolved</h4>
              <p>{resolvedPosts.length}</p>
            </div>
            <div className="stat-card">
              <h4>Location</h4>
              <p>
                {user?.city && user?.state
                  ? `${user.city}, ${user.state}`
                  : "Location not set"}
              </p>
            </div>
            <div className="stat-card">
              <h4>Email</h4>
              <p>{user?.email || "Loading..."}</p>
            </div>
          </div>
        </div>

        <div className="posts-section">
          <h3>Posts</h3>
          <div className="posts-controls">
            <div className="filter-container">
              <button
                className="filter-button"
                onClick={() => setFilterMenuOpen(!isFilterMenuOpen)}
              >
                <FaFilter /> Filters
              </button>
              {isFilterMenuOpen && (
                <FilterMenu
                  onApplyFilters={handleApplyFilters}
                  initialFilters={activeFilters}
                />
              )}
            </div>
          </div>
          {filteredPosts.length > 0 ||
          activeFilters.status !== "all" ||
          activeFilters.itemType !== "all" ? (
            <Posts posts={filteredPosts} view="profile" />
          ) : userPosts.length > 0 ? (
            <Posts posts={userPosts} view="profile" />
          ) : (
            <p>No posts found</p>
          )}
        </div>
      </div>
      <PostItem isOpen={isPostModalOpen} onClose={closePostModal} />
      <EditProfile isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
}

export default Profile;
