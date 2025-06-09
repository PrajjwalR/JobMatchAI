# JobMatch AI

An AI-powered resume enhancement tool that helps job seekers optimize their resumes for specific job descriptions.

## Features

- Upload and parse resumes (PDF or text)
- Analyze job descriptions
- Calculate match score between resume and job description
- Identify missing keywords and skills
- AI-powered resume content enhancement
- Download enhanced resume

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- AI: Google Gemini API
- File Processing: PDF.js for PDF parsing
- Styling: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Set up environment variables:

   - Create `.env` file in the backend directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Project Structure

```
jobmatch-ai/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js Express backend
├── package.json       # Root package.json
└── README.md         # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
