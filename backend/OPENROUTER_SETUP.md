# OpenRouter Integration Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_HTTP_REFERER=http://localhost:3000

# MongoDB Configuration (if using)
MONGODB_URI=mongodb://localhost:27017/jobmatch-ai

# JWT Secret (if using authentication)
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Getting OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## Free Tier Models Available

The following free models are configured:

- `llama-3.1-8b` - Meta's Llama 3.1 8B (default)
- `mistral-7b` - Mistral 7B Instruct
- `gemma-2b` - Google's Gemma 2B
- `phi-3-mini` - Microsoft's Phi-3 Mini

## API Endpoints

### Resume Analysis

```
POST /api/upload
Content-Type: multipart/form-data

Body:
- resume: PDF/DOCX file
- jobDescription: string
- model: string (optional, defaults to llama-3.1-8b)
```

### Get Available Models

```
GET /api/openrouter/models
```

### Check API Key Status

```
GET /api/openrouter/status
```

## Rate Limits

Free tier limits:

- 20 requests per minute
- 50 requests per day (if no credits purchased)
- 1000 requests per day (if at least 10 credits purchased)

## Usage Example

```javascript
// Frontend example
const formData = new FormData();
formData.append("resume", file);
formData.append("jobDescription", "Software Engineer position...");
formData.append("model", "llama-3.1-8b"); // optional

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result.analysis);
```

## Response Format

```json
{
  "message": "Resume analyzed successfully",
  "analysis": {
    "matchScore": 85,
    "missingKeywords": ["React", "TypeScript"],
    "suggestions": ["Add React experience", "Include TypeScript projects"],
    "strengths": ["Strong Python skills", "Good problem solving"],
    "weaknesses": ["Limited frontend experience"]
  },
  "model": "llama-3.1-8b",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```
