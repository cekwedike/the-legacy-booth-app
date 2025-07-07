// Environment Configuration
// Copy this to .env file and update values as needed

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/legacy-booth',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // OpenAI Configuration (Optional - for transcription)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',

  // File Upload Configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '50MB',
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug'
}; 