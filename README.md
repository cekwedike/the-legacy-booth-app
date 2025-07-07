# The Legacy Booth App

A React-based application for recording and preserving life stories and messages in assisted living facilities.

## Project Structure

```
the-legacy-booth-app/
├── frontend/          # React frontend application
│   ├── src/          # Source code
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # Data services and API calls
│   │   ├── types/       # TypeScript type definitions
│   │   ├── styles/      # CSS and styling
│   │   └── utils/       # Utility functions
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Backend services (future)
└── README.md         # This file
```

## Getting Started

### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Features

- User authentication and profile management
- Life story recording with prompts
- Message recording for family members
- Staff management interface
- Transcription and AI summarization
- Family contact management

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: (Future implementation)
- **AI**: Google Gemini API for transcription and summarization
