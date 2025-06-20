import { Router } from "express";
import multer from "multer";
import { parseResume } from "../utils/parseResume";
import { analyzeResume } from "../utils/analyzeResume";

const upload = multer({ dest: "src/uploads/" });
const router = Router();

router.post("/", upload.single("resume"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  // Debug information
  console.log("File received:", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
  });

  const jobDescription = req.body.jobDescription || "";
  if (!jobDescription) {
    res.status(400).json({ message: "No job description provided" });
    return;
  }

  // Get model from request body, default to llama-3.1-8b
  const model = req.body.model || "llama-3.1-8b";

  try {
    const text = await parseResume(req.file.path, req.file.mimetype);
    const analysis = await analyzeResume(text, jobDescription, model);

    // Optionally, delete the file after parsing:
    // fs.unlinkSync(req.file.path);

    res.json({
      message: "Resume analyzed successfully",
      analysis,
      parsedText: text,
      model: model,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Resume analysis error:", err);
    res.status(500).json({
      message: "Failed to analyze resume",
      error: err instanceof Error ? err.message : "Unknown error",
      model: model,
    });
  }
});

export default router;
