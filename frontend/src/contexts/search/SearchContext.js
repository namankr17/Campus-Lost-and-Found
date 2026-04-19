import { createContext, useContext, useState } from "react";

export const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchPosts = (posts, query) => {
    if (!query.trim()) return posts;

    return posts.filter((post) => {
      const searchTerm = query.toLowerCase();
      return (
        post.title?.toLowerCase().includes(searchTerm) ||
        post.description?.toLowerCase().includes(searchTerm) ||
        post.category?.toLowerCase().includes(searchTerm) ||
        post.itemType?.toLowerCase().includes(searchTerm) ||
        post.city?.toLowerCase().includes(searchTerm) ||
        post.state?.toLowerCase().includes(searchTerm) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    });
  };

  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, searchPosts }}
    >
      {children}
    </SearchContext.Provider>
  );
};
