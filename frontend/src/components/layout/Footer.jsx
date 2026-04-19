import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Campus Lost & Found</h4>
          <p>
            Helping our community reconnect with their lost items since 2024.
            Making a difference, one item at a time.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="https://github.com" aria-label="Github">
              <FaGithub />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="mailto:contact@example.com" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Developed by{" "}
          <a
            href="https://www.ericcapiz.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eric Capiz
          </a>{" "}
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
