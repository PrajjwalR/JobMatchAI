import OpenAI from "openai";

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

// Free tier models for resume enhancement
const ENHANCEMENT_MODELS = {
  "llama-3.1-8b": "meta-llama/llama-3.1-8b-instruct:free",
  "mistral-7b": "mistralai/mistral-7b-instruct:free",
  "qwen-3-14b": "qwen/qwen3-14b:free",
  "qwen-3-4b": "qwen/qwen3-4b:free",
} as const;

type EnhancementModelKey = keyof typeof ENHANCEMENT_MODELS;
type EnhancementModelValue = (typeof ENHANCEMENT_MODELS)[EnhancementModelKey];

export interface ResumeEnhancement {
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

export async function enhanceResume(
  resumeText: string,
  jobDescription: string,
  model: string = "llama-3.1-8b"
): Promise<ResumeEnhancement> {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    const modelString: EnhancementModelValue =
      ENHANCEMENT_MODELS[model as EnhancementModelKey] ||
      ENHANCEMENT_MODELS["llama-3.1-8b"];

    const prompt = `You are an expert resume writer and ATS optimization specialist. 

Given the following resume and job description, provide a comprehensive enhancement that includes:

1. **Enhanced Resume Text**: A complete, improved version of the resume
2. **Specific Changes**: Detailed list of what was changed and why
3. **ATS Optimization**: Make it more ATS-friendly
4. **Keyword Integration**: Add relevant keywords from the job description
5. **Action Verbs**: Improve action verbs and achievements
6. **Formatting**: Optimize structure and readability

**Original Resume:**
${resumeText}

**Job Description:**
${jobDescription}

Please respond with a JSON object containing:
{
  "enhancedText": "Complete enhanced resume text",
  "changes": [
    {
      "section": "section name (e.g., 'Experience', 'Skills', 'Summary')",
      "original": "original text",
      "improved": "improved text", 
      "reason": "why this change was made"
    }
  ],
  "summary": "Brief summary of key improvements made",
  "atsScore": number (0-100, estimated ATS compatibility score)
}

Respond ONLY with valid JSON. Do not include any explanation or extra text.
`;

    console.log("Making resume enhancement request with model:", modelString);

    const completion = await openai.chat.completions.create({
      model: modelString,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    // const responseText = completion.choices[0]?.message?.content || "";

    // // Extract JSON from response
    // const jsonStart = responseText.indexOf("{");
    // const jsonEnd = responseText.lastIndexOf("}") + 1;

    // if (jsonStart === -1 || jsonEnd === 0) {
    //   throw new Error("Invalid JSON response from AI model");
    // }

    // const jsonString = responseText.substring(jsonStart, jsonEnd);
    // const enhancement = JSON.parse(jsonString);

    const responseText = completion.choices[0]?.message?.content || "";
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("AI model response (no JSON found):", responseText);
      throw new Error("Invalid JSON response from AI model");
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd);

    let enhancement;
    try {
      enhancement = JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse AI model JSON:", jsonString);
      throw new Error(
        "AI model returned invalid JSON. Please try again or use a different model."
      );
    }

    return {
      originalText: resumeText,
      enhancedText: enhancement.enhancedText,
      changes: enhancement.changes || [],
      summary: enhancement.summary || "",
      atsScore: enhancement.atsScore || 0,
    };
  } catch (error) {
    console.error("Resume enhancement error:", error);
    throw new Error(
      `Failed to enhance resume: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function generateResumeSection(
  sectionType: "summary" | "experience" | "skills" | "education",
  jobDescription: string,
  userInfo: any,
  model: string = "llama-3.1-8b"
): Promise<string> {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    const modelString: EnhancementModelValue =
      ENHANCEMENT_MODELS[model as EnhancementModelKey] ||
      ENHANCEMENT_MODELS["llama-3.1-8b"];

    const sectionPrompts = {
      summary: `Write a compelling professional summary for a resume based on this job description: ${jobDescription}. 
      Include relevant skills and experience that match the job requirements.`,

      experience: `Write 2-3 bullet points for a work experience section based on this job description: ${jobDescription}. 
      Use strong action verbs and quantify achievements where possible.`,

      skills: `Based on this job description: ${jobDescription}, list the most relevant technical and soft skills 
      that should be included in a resume skills section.`,

      education: `Based on this job description: ${jobDescription}, suggest appropriate education and certifications 
      that would be relevant for this position.`,
    };

    const completion = await openai.chat.completions.create({
      model: modelString,
      messages: [
        {
          role: "user",
          content: sectionPrompts[sectionType],
        },
      ],
      temperature: 0.4,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Resume section generation error:", error);
    throw new Error(
      `Failed to generate resume section: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
