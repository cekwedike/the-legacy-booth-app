import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Legacy Booth API',
      version: '1.0.0',
      description: 'API documentation for The Legacy Booth - A private storytelling space for seniors in assisted living facilities',
      contact: {
        name: 'Legacy Booth Team',
        email: 'support@legacybooth.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://legacybooth.com/license'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.legacybooth.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'Full name' },
            email: { type: 'string', format: 'email', description: 'Email address' },
            role: { 
              type: 'string', 
              enum: ['faculty', 'senior', 'admin'],
              description: 'User role'
            },
            roomNumber: { type: 'string', description: 'Room number (for seniors)' },
            dateOfBirth: { type: 'string', format: 'date', description: 'Date of birth' },
            isActive: { type: 'boolean', description: 'Account status' },
            preferences: {
              type: 'object',
              properties: {
                theme: { type: 'string', enum: ['light', 'dark', 'high-contrast'] },
                fontSize: { type: 'string', enum: ['small', 'medium', 'large'] },
                audioEnabled: { type: 'boolean' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Story: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Story ID' },
            resident: { type: 'string', description: 'Resident ID' },
            title: { type: 'string', description: 'Story title' },
            prompt: { type: 'string', description: 'Story prompt' },
            category: { 
              type: 'string', 
              enum: ['childhood', 'family', 'career', 'travel', 'hobbies', 'life-lessons', 'memories', 'other'],
              description: 'Story category'
            },
            recording: {
              type: 'object',
              properties: {
                audioUrl: { type: 'string' },
                videoUrl: { type: 'string' },
                duration: { type: 'number' },
                fileSize: { type: 'number' },
                format: { type: 'string', enum: ['audio', 'video'] }
              }
            },
            transcription: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                confidence: { type: 'number' },
                language: { type: 'string' },
                status: { 
                  type: 'string', 
                  enum: ['pending', 'processing', 'completed', 'failed']
                }
              }
            },
            content: {
              type: 'object',
              properties: {
                originalText: { type: 'string' },
                editedText: { type: 'string' },
                summary: { type: 'string' },
                keywords: { type: 'array', items: { type: 'string' } },
                sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] }
              }
            },
            status: {
              type: 'string',
              enum: ['draft', 'recorded', 'transcribed', 'edited', 'published']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Message ID' },
            sender: { type: 'string', description: 'Sender ID' },
            recipient: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                relationship: { type: 'string' },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string' }
              }
            },
            title: { type: 'string', description: 'Message title' },
            type: {
              type: 'string',
              enum: ['birthday', 'anniversary', 'holiday', 'daily', 'encouragement', 'memory', 'other']
            },
            content: {
              type: 'object',
              properties: {
                videoUrl: { type: 'string' },
                audioUrl: { type: 'string' },
                duration: { type: 'number' },
                fileSize: { type: 'number' }
              }
            },
            status: {
              type: 'string',
              enum: ['draft', 'recorded', 'scheduled', 'sent', 'delivered', 'viewed']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        LegacyBook: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Legacy Book ID' },
            resident: { type: 'string', description: 'Resident ID' },
            title: { type: 'string', description: 'Book title' },
            subtitle: { type: 'string' },
            dedication: { type: 'string' },
            stories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  story: { type: 'string' },
                  order: { type: 'number' },
                  pageNumber: { type: 'number' }
                }
              }
            },
            status: {
              type: 'string',
              enum: ['draft', 'in-progress', 'review', 'approved', 'published', 'delivered']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            message: { type: 'string', description: 'Detailed error message' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.ts',
    './models/*.ts',
    './server.ts'
  ]
};

const specs = swaggerJsdoc(options);

export default specs; 