import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Ensure you import the CSS file

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !jobDescription) {
      alert("Please upload a resume and provide a job description");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("http://localhost:3001/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/matches");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
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

        <button type="submit" disabled={isUploading} className="submit-button">
          {isUploading ? "Uploading..." : "Analyze Resume"}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;
