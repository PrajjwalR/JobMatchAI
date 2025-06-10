import { useState, useEffect } from "react";
import "../index.css";

interface MatchResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
}

const JobMatches = () => {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatchResult = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/match-results");
        if (response.ok) {
          const data = await response.json();
          setMatchResult(data);
        }
      } catch (error) {
        console.error("Error fetching match results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchResult();
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!matchResult) {
    return (
      <div className="no-results">
        <h2>No Match Results Found</h2>
        <p>
          Please upload your resume and job description to see match results.
        </p>
      </div>
    );
  }

  return (
    <div className="jobmatches-wrapper">
      <h1>Resume Analysis Results</h1>

      <div className="score-card">
        <div className="score-header">
          <h2>Match Score</h2>
          <div className="score-value">{matchResult.matchScore}%</div>
        </div>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{ width: `${matchResult.matchScore}%` }}
          ></div>
        </div>
      </div>

      <div className="results-grid">
        <div className="result-box">
          <h2>Missing Keywords</h2>
          <ul>
            {matchResult.missingKeywords.map((keyword, index) => (
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
            ))}
          </ul>
        </div>

        <div className="result-box">
          <h2>Improvement Suggestions</h2>
          <ul>
            {matchResult.suggestions.map((suggestion, index) => (
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
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobMatches;
