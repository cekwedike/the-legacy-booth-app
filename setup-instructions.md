# The Legacy Booth - Setup Instructions

## Overview
The Legacy Booth is a React TypeScript application built with Vite for the frontend and Node.js/Express for the backend. It provides a storytelling space for seniors to preserve their memories and connect with loved ones.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Material-UI, React Router, React Query
- **Backend**: Node.js, Express, MongoDB, JWT Authentication, Socket.IO
- **Features**: Audio/Video recording, OpenAI Whisper transcription, file uploads, real-time communication

## Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

## Installation

### 1. Install Dependencies
From the project root, run:
```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Frontend (React, TypeScript, Vite, Material-UI)
- Backend (Express, MongoDB, JWT, Socket.IO)

### 2. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `backend` directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legacy-booth
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
UPLOAD_PATH=./uploads
```

**Note**: The OpenAI API key is optional. If not provided, transcription features will be disabled but the app will still function.

#### Frontend Configuration
The frontend is configured to proxy API requests to the backend automatically via Vite's proxy configuration.

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
mongod

# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 4. Initialize Database (Optional)
Run the database initialization script:
```bash
cd backend
node scripts/init-db.js
```

This creates:
- Admin user (admin@legacybooth.com / admin123)
- Sample categories and content

### 5. Start the Application

#### Development Mode
From the project root:
```bash
npm run dev
```

This starts both servers concurrently:
- Frontend: http://localhost:3000 (Vite dev server)
- Backend: http://localhost:5000 (Express API)

#### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Project Structure

```
the-legacy-booth-app/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, Accessibility)
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── index.html          # HTML template
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic
│   ├── scripts/            # Database scripts
│   └── package.json        # Backend dependencies
└── package.json            # Root package.json with scripts
```

## Features

### Frontend (React TypeScript + Vite)
- **Modern Development**: Vite for fast HMR and builds
- **Type Safety**: Full TypeScript implementation
- **UI Framework**: Material-UI with custom theme
- **State Management**: React Context + React Query
- **Routing**: React Router v6 with protected routes
- **Accessibility**: Built-in accessibility features

### Backend (Node.js + Express)
- **Authentication**: JWT-based auth with role-based access
- **Database**: MongoDB with Mongoose ODM
- **File Uploads**: Multer for audio/video file handling
- **AI Integration**: OpenAI Whisper for transcription (optional)
- **Real-time**: Socket.IO for video calls
- **API Documentation**: Swagger/OpenAPI docs

### Core Features
1. **User Management**
   - Registration/Login
   - Role-based access (resident, staff, admin)
   - Profile management

2. **Story Recording**
   - Audio/video recording
   - Automatic transcription (OpenAI Whisper)
   - Story categorization and management
   - Playback and editing

3. **Message Recording**
   - Personal message creation
   - Message types (birthday, anniversary, etc.)
   - Audio recording and playback

4. **Legacy Books**
   - Compile stories and messages
   - Create personalized books
   - Export and sharing options

5. **Video Calls**
   - Real-time video communication
   - Family and friend connections
   - Screen sharing capabilities

6. **Admin Features**
   - User management
   - Content moderation
   - Analytics and reporting

7. **Accessibility**
   - High contrast mode
   - Large text options
   - Screen reader support
   - Reduced motion preferences

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   
   # Kill process on port 5000
   npx kill-port 5000
   ```

2. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

3. **OpenAI API Issues**
   - API key is optional - app works without it
   - Transcription features will be disabled
   - Check API key format and permissions

4. **TypeScript Errors**
   ```bash
   cd frontend
   npm run lint
   ```

5. **Build Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reloading
2. **TypeScript**: Use strict mode for better type safety
3. **API Testing**: Use the Swagger docs at `/api-docs`
4. **Database**: Use MongoDB Compass for database management
5. **Logs**: Check console logs for both frontend and backend

## Deployment

### Frontend (Vite Build)
```bash
cd frontend
npm run build
```
The built files will be in `frontend/dist/`

### Backend (Production)
```bash
cd backend
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB connection for production
- Set up proper CORS settings

## Contributing

1. Follow TypeScript best practices
2. Use Material-UI components consistently
3. Implement proper error handling
4. Add TypeScript types for all new features
5. Test both frontend and backend functionality

## Support

For issues and questions:
- Check the troubleshooting section
- Review console logs
- Verify environment variables
- Test API endpoints with Swagger docs 