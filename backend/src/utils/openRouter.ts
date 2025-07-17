import OpenAI from "openai";

// Debug: Check if API key is available
console.log("OpenRouter API Key available:", !!process.env.OPENROUTER_API_KEY);
console.log(
  "OpenRouter API Key length:",
  process.env.OPENROUTER_API_KEY?.length || 0
);

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer":
      process.env.OPENROUTER_HTTP_REFERER || "http://localhost:3000",
    "X-Title": "JobMatch AI",
  },
});

// Updated free tier models with correct OpenRouter model IDs
export const FREE_MODELS = {
  "mistral-7b": "mistralai/mistral-7b-instruct:free",
  "gemma-2b": "google/gemma-2b-it:free",
  "phi-3-mini": "microsoft/phi-3-mini-4k-instruct:free",
  "claude-instant": "anthropic/claude-instant-1:free",
  "llama-2-7b": "meta-llama/llama-2-7b-chat:free",
} as const;

type ModelKey = keyof typeof FREE_MODELS;
type ModelValue = (typeof FREE_MODELS)[ModelKey];

export async function analyzeResumeWithOpenRouter(
  resumeText: string,
  jobDescription: string,
  model: string = "llama-3.1-8b"
) {
  try {
    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    console.log(
      "Using OpenRouter API key:",
      process.env.OPENROUTER_API_KEY.substring(0, 10) + "..."
    );

    const prompt = `You are a resume analysis assistant. Given the following resume and job description, provide a detailed analysis in JSON format.

Resume:
${resumeText}

Job Description:
${jobDescription}

Please analyze and respond with a JSON object containing:
{
  "matchScore": number (0-100),
  "missingKeywords": [string array of missing skills/keywords],
  "suggestions": [string array of improvement suggestions],
  "strengths": [string array of candidate's strengths],
  "weaknesses": [string array of areas for improvement]
}

Ensure the response is valid JSON format only.`;

    // Get the model string, defaulting to llama-3.1-8b if not found
    const modelString: ModelValue =
      FREE_MODELS[model as ModelKey] || FREE_MODELS["llama-3.1-8b"];

    console.log("Making request to OpenRouter with model:", modelString);

    const completion = await openai.chat.completions.create({
      model: modelString,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // Extract JSON from response
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("Invalid JSON response from AI model");
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd);
    const analysis = JSON.parse(jsonString);

    return {
      ...analysis,
      model: model,
      usage: completion.usage,
    };
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error(
      `Failed to analyze resume: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getAvailableModels() {
  try {
    const models = await openai.models.list();
    return models.data.filter(
      (model) =>
        model.id.includes(":free") ||
        Object.values(FREE_MODELS).includes(model.id as ModelValue)
    );
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}

export async function checkApiKeyStatus() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
