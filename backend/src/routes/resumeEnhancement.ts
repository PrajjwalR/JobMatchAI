import { Router } from "express";
import { enhanceResume, generateResumeSection } from "../utils/resumeEnhancer";

const router = Router();

// Enhance entire resume
router.post("/enhance", async (req, res): Promise<void> => {
  const { resumeText, jobDescription, model } = req.body;

  if (!resumeText || !jobDescription) {
    res.status(400).json({
      message: "Resume text and job description are required",
    });
    return;
  }

  try {
    const enhancement = await enhanceResume(
      resumeText,
      jobDescription,
      model || "claude-instant"
    );

    res.json({
      success: true,
      message: "Resume enhanced successfully",
      enhancement,
      model: model || "claude-instant",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Resume enhancement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enhance resume",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Generate specific resume section
router.post("/generate-section", async (req, res): Promise<void> => {
  const { sectionType, jobDescription, userInfo, model } = req.body;

  if (!sectionType || !jobDescription) {
    res.status(400).json({
      message: "Section type and job description are required",
    });
    return;
  }

  if (!["summary", "experience", "skills", "education"].includes(sectionType)) {
    res.status(400).json({
      message:
        "Invalid section type. Must be: summary, experience, skills, or education",
    });
    return;
  }

  try {
    const sectionContent = await generateResumeSection(
      sectionType as "summary" | "experience" | "skills" | "education",
      jobDescription,
      userInfo || {},
      model || "claude-instant"
    );

    res.json({
      success: true,
      message: "Resume section generated successfully",
      sectionType,
      content: sectionContent,
      model: model || "claude-instant",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Resume section generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate resume section",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
