import { Link } from "react-router-dom";
import "../index.css";

const features = [
  {
    title: "Resume Analysis",
    desc: "Get detailed insights into your resume's strengths and areas for improvement",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16h8M8 12h8m-8-4h8M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    bgClass: "feature-icon-blue",
  },
  {
    title: "Job Matching",
    desc: "Find the perfect job match with AI-powered analysis and scoring",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7V6a4 4 0 10-8 0v2m12 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2z"
        />
      </svg>
    ),
    bgClass: "feature-icon-green",
  },
  {
    title: "AI Enhancement",
    desc: "Enhance your resume with AI suggestions to improve your chances",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h1v-4h1m-4 0h1v4h1"
        />
      </svg>
    ),
    bgClass: "feature-icon-indigo",
  },
];

const Home = () => {
  return (
    <div className="home-wrapper">
      <section className="home-hero">
        <h1 className="home-heading">
          Supercharge Your <span className="highlight">Resume</span> with AI
        </h1>
        <p className="home-subtext">
          Enhance your resume and find the perfect job match using cutting-edge
          AI technology.
        </p>
        <Link to="/upload" className="cta-button">
          Get Started
        </Link>
      </section>
      <section className="home-features">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className={`feature-icon ${feature.bgClass}`}>
                <div className="feature-svg">{feature.icon}</div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
