import React, { useState, useContext } from "react";
import { FiX } from "react-icons/fi";
import { Spinner, Alert } from "../common";
import { AuthContext } from "../../contexts/auth/AuthContext";
import { usePosts } from "../../contexts/post/PostContext";
import { postService } from "../../services/postService";

const PostItem = ({ isOpen, onClose }) => {
  const { updateUserCounts } = useContext(AuthContext);
  const { addPost } = usePosts();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    itemType: "lost",
    category: "",
    tags: "",
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 9000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setFormData((prev) => ({
        ...prev,
        tags: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setSelectedImages(files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          const tagsArray = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
          formDataToSend.append("tags", tagsArray);
        } else if (key !== "images") {
          formDataToSend.append(key, formData[key]);
        }
      });

      selectedImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      await addPost(formDataToSend);

      await updateUserCounts("post", "create");

      showAlert("Post created successfully!", "success");

      setFormData({
        title: "",
        description: "",
        city: "",
        state: "",
        itemType: "lost",
        category: "",
        tags: "",
        images: [],
      });
      setSelectedImages([]);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error creating post",
        "error"
      );
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Post</h2>
          <FiX className="close-button" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Post Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Details:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <div className="location-fields">
            <label>
              Location 1:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Location 2:
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Post Label:
            <div className="post-label">
              <label>
                <input
                  type="radio"
                  name="itemType"
                  value="lost"
                  checked={formData.itemType === "lost"}
                  onChange={handleChange}
                  required
                />
                Lost
              </label>
              <label>
                <input
                  type="radio"
                  name="itemType"
                  value="found"
                  checked={formData.itemType === "found"}
                  onChange={handleChange}
                  required
                />
                Found
              </label>
            </div>
          </label>
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
              }}
            >
              <option value="">All Categories</option>
              <option value="pets">Pets</option>
              <option value="electronic">Electronic</option>
              <option value="jewelry">Jewelry</option>
              <option value="accessory">Accessory</option>
              <option value="clothing">Clothing</option>
              <option value="documents">Documents</option>
              <option value="keys">Keys</option>
              <option value="bags">Bags & Wallets</option>
            </select>
          </label>
          <label>
            Add Tags:
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas"
            />
          </label>
          <label>
            Upload Image (Max 3):
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </label>
          <div className="submit-section">
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            <button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
