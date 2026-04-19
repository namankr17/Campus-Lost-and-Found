import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { usePosts } from "../../contexts/post/PostContext";

const EditPost = ({ isOpen, onClose, post }) => {
  const { updatePost } = usePosts();
  const [formData, setFormData] = useState({
    title: post?.title || "",
    description: post?.description || "",
    city: post?.city || "",
    state: post?.state || "",
    itemType: post?.itemType || "lost",
    category: post?.category || "",
    tags: post?.tags?.join(", ") || "",
    status: post?.status || "unresolved",
  });
  const [existingImages, setExistingImages] = useState(post?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + files.length > 3) {
      setError("Maximum 3 images allowed");
      return;
    }
    setNewImages(files);
    setError("");
  };

  const handleRemoveExistingImage = (imageToRemove) => {
    setExistingImages((prevImages) =>
      prevImages.filter((image) => image.url !== imageToRemove.url)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Only append fields that have changed
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== post[key]) {
          if (key === "tags") {
            const tagsArray = formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag); // Remove empty tags
            formDataToSend.append("tags", JSON.stringify(tagsArray));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Append existing images
      formDataToSend.append("existingImages", JSON.stringify(existingImages));

      // Append new images
      newImages.forEach((image) => {
        formDataToSend.append("images", image);
      });
      await updatePost(post._id, formDataToSend);
      onClose();
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.response?.data?.message || "Error updating post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Post</h2>
          <FaTimes onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <label>
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <div className="location-fields">
            <label>
              Location 1
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </label>

            <label>
              Location 2
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Post Label
            <div className="post-label">
              <label>
                <input
                  type="radio"
                  name="itemType"
                  value="lost"
                  checked={formData.itemType === "lost"}
                  onChange={handleChange}
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
                />
                Found
              </label>
            </div>
          </label>

          <label>
            Category
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="pets">Pets</option>
              <option value="documents">Documents</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Tags (comma separated)
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., urgent, reward, campus"
            />
          </label>

          <label>
            Images
            <div className="existing-images">
              {existingImages.map((image, index) => (
                <div key={index} className="existing-image">
                  <img src={image.url} alt={`Existing ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image)}
                    className="remove-image"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={existingImages.length + newImages.length >= 3}
            />
          </label>

          <div className="submit-section">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
