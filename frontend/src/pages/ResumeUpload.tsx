import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../config";
import "../index.css";

// Available free models with updated descriptions
const FREE_MODELS = [
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B Instruct (Meta)",
    description: "Fast and efficient",
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B Instruct",
    description: "Good balance of speed and quality",
  },
  {
    id: "gemma-2b",
    name: "Gemma 2B (Google)",
    description: "Lightweight and fast",
  },
  {
    id: "phi-3-mini",
    name: "Phi-3 Mini (Microsoft)",
    description: "Small but capable",
  },
  {
    id: "claude-instant",
    name: "Claude Instant (Anthropic)",
    description: "High quality responses",
  },
  {
    id: "llama-2-7b",
    name: "Llama 2 7B Chat (Meta)",
    description: "Reliable and well-tested",
  },
];

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedModel, setSelectedModel] = useState("mistral-7b");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF or DOCX file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      alert("Please select a file and enter a job description");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    formData.append("model", selectedModel);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Analysis result:", result);

        // Navigate to results page with analysis data AND original content
        navigate("/matches", {
          state: {
            analysis: result.analysis,
            originalResumeText:
              result.parsedText || "Resume text not available",
            originalJobDescription: jobDescription,
          },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze resume");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="resume-container">
      <h1 className="resume-heading">Upload Your Resume</h1>

      <form onSubmit={handleSubmit} className="resume-form">
        <div className="form-group">
          <label className="label">Resume (PDF or DOCX)</label>
          <div className="upload-box">
            <div className="upload-inner">
              <div className="upload-icon">
                <svg
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="upload-text">
                <label htmlFor="file-upload" className="upload-button">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="hidden-input"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="drag-text">or drag and drop</p>
              </div>
              <p className="file-hint">PDF or DOCX up to 10MB</p>
            </div>
          </div>
          {file && <p className="file-selected">Selected file: {file.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="job-description" className="label">
            Job Description
          </label>
          <textarea
            id="job-description"
            name="job-description"
            rows={6}
            className="textarea"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="model-select" className="label">
            AI Model (Free Tier)
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="select-input"
          >
            {FREE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
          {/* <p className="model-hint">
            Free tier: 20 requests/minute, 50 requests/day
          </p> */}
        </div>

        <button type="submit" disabled={isUploading} className="submit-button">
          {isUploading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {error && (
          <div
            style={{
              color: "#dc2626",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.375rem",
              padding: "0.75rem",
              marginTop: "1rem",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ResumeUpload;
