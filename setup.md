# The Legacy Booth - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install-all
```

### 2. Environment Setup

Create environment files for both backend and frontend:

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/legacy-booth
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```bash
cd frontend
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Database Setup

Start MongoDB:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

### 4. Start the Application

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Accounts

The application includes demo accounts for testing:

### Resident Account
- Email: resident@demo.com
- Password: password123

### Staff Account
- Email: staff@demo.com
- Password: password123

## Features

### For Residents
- **Story Recording**: Record life stories with guided prompts
- **Message Recording**: Send video messages to family members
- **Legacy Books**: Create printed/digital storybooks
- **Video Calling**: Connect with family members
- **Accessibility**: Large text, high contrast, audio support

### For Staff
- **User Management**: Manage resident accounts
- **Content Management**: Review and organize stories/messages
- **Analytics**: View facility statistics
- **Legacy Book Creation**: Generate and manage storybooks

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (staff only)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Stories
- `GET /api/stories` - Get user's stories
- `POST /api/stories` - Create new story
- `POST /api/stories/:id/recording` - Upload story recording
- `GET /api/stories/prompts/:category` - Get story prompts

### Messages
- `GET /api/messages` - Get user's messages
- `POST /api/messages` - Create new message
- `POST /api/messages/:id/recording` - Upload message recording
- `POST /api/messages/:id/send` - Send message

### Legacy Books
- `GET /api/legacy-books` - Get user's legacy books
- `POST /api/legacy-books` - Create new legacy book
- `POST /api/legacy-books/:id/generate` - Generate book

### Admin
- `GET /api/admin/stats` - Get facility statistics
- `GET /api/admin/residents` - Get all residents
- `GET /api/admin/stories` - Get all stories
- `GET /api/admin/messages` - Get all messages

## File Structure

```
legacy-booth-app/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   ├── uploads/         # File uploads
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── App.js       # Main app component
│   └── public/          # Static files
├── package.json         # Root package.json
└── README.md           # Project documentation
```

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database Management
```bash
# Access MongoDB shell
mongosh legacy-booth

# View collections
show collections

# View users
db.users.find()
```

## Production Deployment

### Environment Variables
Set production environment variables:
- `NODE_ENV=production`
- `MONGODB_URI` (production MongoDB connection)
- `JWT_SECRET` (strong secret key)
- `OPENAI_API_KEY` (for transcription)
- `FRONTEND_URL` (production frontend URL)

### Build Frontend
```bash
cd frontend
npm run build
```

### Start Production Server
```bash
cd backend
npm start
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **Port Already in Use**
   - Change PORT in backend .env file
   - Update frontend proxy in package.json

3. **File Upload Errors**
   - Check upload directory permissions
   - Verify file size limits

4. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly
   - Check CORS configuration in server.js

### Logs
- Backend logs: Check console output
- Frontend logs: Check browser console
- Database logs: Check MongoDB logs

## Support

For technical support or questions:
- Check the documentation
- Review error logs
- Contact the development team

## License

This project is proprietary software for The Legacy Booth. 