import { useEffect, useMemo } from "react";
import { usePosts } from "../../contexts/post/PostContext";
import { useSearch } from "../../contexts/search/SearchContext";
import { useFilter } from "../../contexts/filter/FilterContext";
import Post from "./Post";
import { Spinner } from "../common";
import { useLocation, useNavigate } from "react-router-dom";

function Posts({ view = "all", posts: userPosts }) {
  const { posts, loading, error } = usePosts();
  const { searchQuery, searchPosts } = useSearch();
  const { applyFilters } = useFilter();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollToPostId && !loading) {
      setTimeout(() => {
        const postElement = document.getElementById(
          location.state.scrollToPostId
        );

        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
        }

        navigate(location.pathname, { replace: true });
      }, 500);
    }
  }, [
    location.state?.scrollToPostId,
    loading,
    posts,
    navigate,
    location.pathname,
  ]);

  // Memoize all filtering operations
  const finalFilteredPosts = useMemo(() => {
    if (loading || error) return [];

    // First filter by view type (all/profile)
    const viewFilteredPosts =
      view === "profile"
        ? userPosts
        : location.state?.includeResolved
        ? posts // If includeResolved is true, show all posts
        : posts.filter((post) => post.status === "unresolved");

    // Then apply search filter
    const searchFilteredPosts = searchPosts(viewFilteredPosts, searchQuery);

    // Finally apply sidebar filters
    return applyFilters(searchFilteredPosts);
  }, [
    view,
    userPosts,
    posts,
    location.state?.includeResolved,
    searchQuery,
    searchPosts,
    applyFilters,
    loading,
    error,
  ]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {finalFilteredPosts.length === 0 ? (
          <div className="no-posts">
            {searchQuery
              ? "No posts found matching your search."
              : view === "profile"
              ? "You haven't created any posts yet."
              : "No posts found matching your filters."}
          </div>
        ) : (
          finalFilteredPosts.map((post) => {
            return (
              <div id={post._id} key={post._id}>
                <Post
                  post={post}
                  openComments={post._id === location.state?.scrollToPostId}
                  highlightCommentId={location.state?.highlightCommentId}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Posts;
