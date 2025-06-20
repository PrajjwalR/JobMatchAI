import { analyzeResumeWithOpenRouter } from "./openRouter";

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  model: string = "llama-3.1-8b"
) {
  try {
    const analysis = await analyzeResumeWithOpenRouter(
      resumeText,
      jobDescription,
      model
    );
    return analysis;
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw error;
  }
}
