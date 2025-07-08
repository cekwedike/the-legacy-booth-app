# The Legacy Booth

A modern React TypeScript application for seniors to preserve their memories and connect with loved ones through storytelling.

## 🚀 Features

- **Story Recording**: Audio/video recording with automatic transcription
- **Message Creation**: Personal messages for family and friends
- **Legacy Books**: Compile stories and messages into beautiful books
- **Video Calls**: Real-time communication with loved ones
- **Accessibility**: Built-in accessibility features for seniors
- **Admin Panel**: User and content management
- **Modern Tech Stack**: React 18, TypeScript, Vite, Material-UI

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Material-UI** for consistent UI components
- **React Router v6** for navigation
- **React Query** for data fetching
- **Socket.IO Client** for real-time features

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with role-based access
- **Socket.IO** for real-time communication
- **OpenAI Whisper** for audio transcription (optional)
- **Multer** for file uploads

## 📋 Prerequisites

- Node.js 18+
- MongoDB 5+
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Environment Setup
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legacy-booth
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
UPLOAD_PATH=./uploads
```

### 3. Start MongoDB
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 4. Initialize Database (Optional)
```bash
cd backend
node scripts/init-db.js
```

### 5. Start Development Servers
```bash
npm run dev
```

This starts both servers:
- Frontend: http://localhost:3000 (Vite dev server)
- Backend: http://localhost:5000 (Express API)

## 📁 Project Structure

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

## 🎯 Core Features

### For Residents
- **Story Recording**: Record life stories with audio/video
- **Message Recording**: Create personal messages for loved ones
- **Legacy Books**: Compile stories and messages into books
- **Video Calls**: Connect with family members
- **Accessibility Settings**: Customize the interface

### For Staff/Admins
- **User Management**: Manage resident accounts
- **Content Moderation**: Review and approve stories/messages
- **Analytics Dashboard**: View usage statistics
- **System Settings**: Configure application settings

## 🔧 Development

### Available Scripts
```bash
# Install all dependencies
npm run install-all

# Start both servers (development)
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build frontend for production
npm run build

# Start production server
npm start
```

### TypeScript
The project uses strict TypeScript configuration for better type safety:
```bash
# Check TypeScript errors
cd frontend && npx tsc --noEmit

# Lint code
cd frontend && npm run lint
```

### API Documentation
Access the Swagger API docs at: http://localhost:5000/api-docs

## 🚀 Deployment

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

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- CORS configuration

## ♿ Accessibility

- High contrast mode
- Large text options
- Screen reader support
- Reduced motion preferences
- Keyboard navigation
- ARIA labels and semantic HTML

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   npx kill-port 3000  # Frontend
   npx kill-port 5000  # Backend
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

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Material-UI components consistently
3. Implement proper error handling
4. Add TypeScript types for all new features
5. Test both frontend and backend functionality

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review console logs
- Verify environment variables
- Test API endpoints with Swagger docs

---

**The Legacy Booth** - Preserving memories, connecting generations. 