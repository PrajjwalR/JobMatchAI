import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { config } from "../config";
import "../index.css";

interface Usage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  model: string;
  usage?: Usage;
}

interface ResumeEnhancement {
  originalText: string;
  enhancedText: string;
  changes: {
    section: string;
    original: string;
    improved: string;
    reason: string;
  }[];
  summary: string;
  atsScore: number;
}

type EnhancedResumeObject = {
  Summary?: string;
  Experience?: {
    JobTitle?: string;
    Company?: string;
    Duration?: string;
    Achievements?: string[];
    Responsibilities?: string[];
  }[];
  Education?: {
    Degree?: string;
    University?: string;
    Duration?: string;
  };
  Skills?: string[];
  [key: string]: unknown;
};

const JobMatches = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancement, setEnhancement] = useState<ResumeEnhancement | null>(
    null
  );
  const [showEnhancement, setShowEnhancement] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if analysis data was passed from ResumeUpload
    if (location.state?.analysis) {
      setAnalysisResult(location.state.analysis);
      setIsLoading(false);
    } else {
      // If no analysis data, redirect back to upload
      navigate("/upload");
    }
  }, [location.state, navigate]);

  const handleEnhanceResume = async () => {
    if (!analysisResult) return;

    setIsEnhancing(true);
    try {
      // Get the original resume text and job description from location state
      const originalResumeText =
        location.state?.originalResumeText ||
        "Original resume text not available";
      const originalJobDescription =
        location.state?.originalJobDescription ||
        "Job description not available";

      // Debug logging
      console.log("Enhancement request data:", {
        resumeText: originalResumeText,
        jobDescription: originalJobDescription,
        model: "llama-3.1-8b",
      });

      const response = await fetch(
        `${config.API_BASE_URL}/api/resume-enhancement/enhance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText: originalResumeText,
            jobDescription: originalJobDescription,
            model: "llama-3.1-8b",
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log("Enhancement result:", result);
        setEnhancement(result.enhancement);
        setShowEnhancement(true);
      } else {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(
          `Failed to enhance resume: ${response.status} ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error enhancing resume:", error);
      alert("Failed to enhance resume. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // const handleDownloadEnhancedResume = () => {
  //   if (!enhancement) return;

  //   // Create a blob with the enhanced resume text
  //   const blob = new Blob([enhancement.enhancedText], { type: "text/plain" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "enhanced-resume.txt";
  //   document.body.appendChild(a);
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   document.body.removeChild(a);
  // };

  const handleDownloadEnhancedResume = () => {
    if (!enhancement) return;

    let resumeContent = "";

    if (typeof enhancement.enhancedText === "string") {
      resumeContent = enhancement.enhancedText;
    } else if (
      typeof enhancement.enhancedText === "object" &&
      enhancement.enhancedText !== null
    ) {
      // Use the EnhancedResumeObject type for safe property access
      const enhancedObj = enhancement.enhancedText as EnhancedResumeObject;
      if (enhancedObj.Summary) {
        resumeContent += `Summary:\n${enhancedObj.Summary}\n\n`;
      }
      if (enhancedObj.Experience) {
        resumeContent += "Experience:\n";
        enhancedObj.Experience.forEach((exp) => {
          resumeContent += `- ${exp.JobTitle || ""} at ${exp.Company || ""} (${
            exp.Duration || ""
          })\n`;
          if (exp.Achievements) {
            resumeContent += `  Achievements:\n    - ${exp.Achievements.join(
              "\n    - "
            )}\n`;
          }
          if (exp.Responsibilities) {
            resumeContent += `  Responsibilities:\n    - ${exp.Responsibilities.join(
              "\n    - "
            )}\n`;
          }
          resumeContent += "\n";
        });
      }
      if (enhancedObj.Education) {
        resumeContent += "Education:\n";
        const edu = enhancedObj.Education;
        resumeContent += `- ${edu.Degree || ""}, ${edu.University || ""} (${
          edu.Duration || ""
        })\n\n`;
      }
      if (enhancedObj.Skills) {
        resumeContent += `Skills:\n- ${enhancedObj.Skills.join("\n- ")}\n`;
      }
    } else {
      resumeContent = String(enhancement.enhancedText);
    }

    const blob = new Blob([resumeContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enhanced-resume.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="no-results">
        <h2>No Analysis Results Found</h2>
        <p>
          Please upload your resume and job description to see analysis results.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="cta-button"
          style={{ marginTop: "1rem" }}
        >
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div className="jobmatches-wrapper">
      <h1>Resume Analysis Results</h1>

      <div
        style={{
          background: "#f8fafc",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
          fontSize: "0.875rem",
          color: "#64748b",
        }}
      >
        <strong>Model used:</strong> {analysisResult.model} |
        <strong> Tokens used:</strong>{" "}
        {analysisResult.usage?.total_tokens || "N/A"}
      </div>

      <div className="score-card">
        <div className="score-header">
          <h2>Match Score</h2>
          <div className="score-value">{analysisResult.matchScore}%</div>
        </div>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{ width: `${analysisResult.matchScore}%` }}
          ></div>
        </div>
      </div>

      {/* AI Resume Enhancement Section */}
      <div
        style={{
          background: "#f0f9ff",
          border: "2px solid #0ea5e9",
          borderRadius: "0.5rem",
          padding: "1.5rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#0c4a6e", marginBottom: "1rem" }}>
          🤖 AI-Powered Resume Enhancement
        </h3>
        <p style={{ color: "#0369a1", marginBottom: "1.5rem" }}>
          Get AI suggestions to improve your resume based on the job description
          and analysis results.
        </p>

        {!showEnhancement ? (
          <button
            onClick={handleEnhanceResume}
            disabled={isEnhancing}
            className="cta-button"
            style={{
              background: "linear-gradient(to right, #0ea5e9, #0284c7)",
              marginRight: "1rem",
            }}
          >
            {isEnhancing ? "Enhancing..." : "Update My Resume"}
          </button>
        ) : (
          <div>
            <button
              onClick={handleDownloadEnhancedResume}
              className="cta-button"
              style={{
                background: "linear-gradient(to right, #10b981, #059669)",
                marginRight: "1rem",
              }}
            >
              Download Enhanced Resume
            </button>
            <button
              onClick={() => setShowEnhancement(false)}
              className="cta-button"
              style={{
                background: "linear-gradient(to right, #6b7280, #4b5563)",
              }}
            >
              Hide Enhancement
            </button>
          </div>
        )}
      </div>

      {/* Enhancement Results */}
      {showEnhancement && enhancement && (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
            📈 Enhancement Summary
          </h3>
          <p style={{ color: "#4b5563", marginBottom: "1rem" }}>
            {enhancement.summary}
          </p>
          <div
            style={{
              background: "#f3f4f6",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          >
            <strong>ATS Compatibility Score:</strong> {enhancement.atsScore}%
          </div>

          <h4 style={{ color: "#374151", marginBottom: "0.5rem" }}>
            Key Changes Made:
          </h4>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {enhancement.changes.map((change, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  background: "#f9fafb",
                }}
              >
                <strong style={{ color: "#1f2937" }}>{change.section}:</strong>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    margin: "0.5rem 0",
                  }}
                >
                  <strong>Reason:</strong> {change.reason}
                </p>
                <div style={{ fontSize: "0.875rem" }}>
                  <div style={{ color: "#dc2626" }}>
                    <strong>Before:</strong> {change.original}
                  </div>
                  <div style={{ color: "#059669" }}>
                    <strong>After:</strong> {change.improved}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-grid">
        <div className="result-box">
          <h2>Your Strengths</h2>
          <ul>
            {analysisResult.strengths?.map((strength, index) => (
              <li key={index}>
                <span className="icon green">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                {strength}
              </li>
            )) || <li>No specific strengths identified</li>}
          </ul>
        </div>

        <div className="result-box">
          <h2>Areas for Improvement</h2>
          <ul>
            {analysisResult.weaknesses?.map((weakness, index) => (
              <li key={index}>
                <span className="icon red">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </span>
                {weakness}
              </li>
            )) || <li>No specific weaknesses identified</li>}
          </ul>
        </div>

        <div className="result-box">
          <h2>Missing Keywords</h2>
          <ul>
            {analysisResult.missingKeywords?.map((keyword, index) => (
              <li key={index}>
                <span className="icon red">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </span>
                {keyword}
              </li>
            )) || <li>No missing keywords identified</li>}
          </ul>
        </div>

        <div className="result-box">
          <h2>Improvement Suggestions</h2>
          <ul>
            {analysisResult.suggestions?.map((suggestion, index) => (
              <li key={index}>
                <span className="icon green">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                {suggestion}
              </li>
            )) || <li>No specific suggestions provided</li>}
          </ul>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          padding: "1rem",
        }}
      >
        <button onClick={() => navigate("/upload")} className="cta-button">
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
};

export default JobMatches;
