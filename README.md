# The Legacy Booth

A private, tech-enabled storytelling space for seniors in assisted living facilities. This application allows residents to record life stories, leave messages for loved ones, and create legacy books.

## Features

- **Life Story Recording**: Guided prompts for meaningful life stories
- **Message Recording**: Video messages for family members
- **Legacy Book Creation**: Digital and printed storybooks
- **Video Calling**: Optional family communication feature
- **Admin Dashboard**: Staff management interface

## Project Structure

```
legacy-booth-app/
├── frontend/          # React application
├── backend/           # Node.js/Express API
├── package.json       # Root package.json
└── README.md         # This file
```

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start Development Servers**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Setup

Create `.env` files in both `frontend/` and `backend/` directories with your configuration.

## Technology Stack

- **Frontend**: React, Material-UI, React Router
- **Backend**: Node.js, Express, MongoDB
- **Media**: WebRTC for video/audio recording
- **Transcription**: OpenAI Whisper API
- **Storage**: Cloud storage for recordings and files

## MVP Timeline

- **Week 1-2**: Setup and configuration
- **Week 3-4**: Testing with residents
- **Week 5**: Content delivery and legacy book creation
- **Week 6**: Feedback collection and evaluation

## Success Criteria

- 5+ residents complete storytelling sessions
- 3+ families receive legacy books
- Staff reports positive experience
- Facility uses booth in marketing tours 