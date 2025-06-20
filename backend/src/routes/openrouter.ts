import { Router } from "express";
import { getAvailableModels, checkApiKeyStatus } from "../utils/openRouter";

const router = Router();

// Get available free models
router.get("/models", async (req, res) => {
  try {
    const models = await getAvailableModels();
    res.json({
      success: true,
      models,
      message: "Available free models retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch models",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Check API key status and usage
router.get("/status", async (req, res) => {
  try {
    const status = await checkApiKeyStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check API key status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
