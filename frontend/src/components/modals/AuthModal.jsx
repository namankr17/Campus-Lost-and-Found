import React, { useState, useContext, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup, error, loading, setError } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    city: "",
    state: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  useEffect(() => {
    setError(null);
  }, [isSignup, setError]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        });

        if (profilePic) {
          formDataToSend.append("profilePic", profilePic);
        }

        if (coverPic) {
          formDataToSend.append("coverPic", coverPic);
        }

        await signup(formDataToSend);
      } else {
        await login({
          username: formData.username,
          password: formData.password,
        });
      }
      onClose();
    } catch (err) {
      console.error("Auth failed:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          <FiX className="close-button" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          {isSignup ? (
            <>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Profile Picture:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </label>
              <label>
                State:
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </label>
              <label>
                Create Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Cover Photo:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverPic(e.target.files[0])}
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p style={{ color: "white", marginTop: "1.5rem" }}>
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignup(false)}
                style={{
                  cursor: "pointer",
                  color: "#60a5fa",
                }}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignup(true)}
                style={{
                  cursor: "pointer",
                  color: "#60a5fa",
                }}
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
