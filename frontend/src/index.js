import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/main.scss";
import App from "./App";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { UserProvider } from "./contexts/user/UserContext";
import { PostProvider } from "./contexts/post/PostContext";
import { CommentProvider } from "./contexts/comment/CommentContext";
import { SearchProvider } from "./contexts/search/SearchContext";
import { FilterProvider } from "./contexts/filter/FilterContext";
import reportWebVitals from "./reportWebVitals";
import { NotificationProvider } from "./contexts/notification/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <CommentProvider>
            <NotificationProvider>
              <SearchProvider>
                <FilterProvider>
                  <App />
                </FilterProvider>
              </SearchProvider>
            </NotificationProvider>
          </CommentProvider>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
