import "../index.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <svg
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="footer-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="footer-title">JobMatch AI</span>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} JobMatch AI. All rights reserved.
      </div>
      <div className="footer-links">
        <a
          href="https://github.com/yourusername/jobmatch-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
