import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";

function RightSidebar() {
  return (
    <aside className="sidebar sidebar-right">
      <div className="sidebar-section about-us">
        <h3>About Us</h3>
        <img
          src="https://media.istockphoto.com/id/1663143692/photo/digital-key-authentication-modern-technology-background-with-futuristic-key-icon-holographic.jpg?s=2048x2048&w=is&k=20&c=-vF2daYGu9RR6T7rRvNTRaN-yU_KiK8yuIe1EF8eLMc="
          alt="Lost and Found Community"
          className="about-us-image"
        />
        <p>
          Welcome to our Campus Lost & Found platform! We're here to help students, faculty, and staff reconnect with their lost belongings—whether it's ID cards, wallets, books, or gadgets. By reporting and finding items, you contribute to a more organized and supportive campus community where everyone looks out for each other.
        </p>
      </div>

      <div className="sidebar-section quick-stats">
        <h3>Community Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">1,234</span>
            <span className="stat-label">Items Found</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">789</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">432</span>
            <span className="stat-label">Success Stories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">56</span>
            <span className="stat-label">Today's Posts</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section recent-updates">
        <h3>Recent Updates</h3>
        <ul>
          <li>🎉 New image upload feature added!</li>
          <li>📱 Mobile app coming soon</li>
          <li>🌟 Community milestone: 1000+ items found</li>
          <li>🔔 New notification system launched</li>
        </ul>
      </div>

      <div className="sidebar-section trending-tags">
        <h3>Trending Tags</h3>
        <div className="tags-container">
          <span className="tag">#Phone</span>
          <span className="tag">#Keys</span>
          <span className="tag">#Wallet</span>
          <span className="tag">#StudentID</span>
          <span className="tag">#Laptop</span>
        </div>
      </div>

      <div className="sidebar-section contact-us">
        <h3>Contact Us</h3>
        <div className="contact-email">
          <FaEnvelope className="icon" />
          <span>dummyemail@email.com</span>
        </div>
        <div className="social-icons">
          <FaFacebook className="icon" />
          <FaTwitter className="icon" />
          <FaInstagram className="icon" />
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
