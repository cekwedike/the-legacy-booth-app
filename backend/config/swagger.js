const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Legacy Booth API',
      version: '1.0.0',
      description: 'API documentation for The Legacy Booth - A storytelling platform for seniors in assisted living facilities',
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
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['resident', 'staff', 'admin'] },
            roomNumber: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            emergencyContact: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                relationship: { type: 'string' },
                phone: { type: 'string' },
                email: { type: 'string' }
              }
            },
            preferences: {
              type: 'object',
              properties: {
                theme: { type: 'string', enum: ['light', 'dark', 'high-contrast'] },
                fontSize: { type: 'string', enum: ['small', 'medium', 'large'] },
                audioEnabled: { type: 'boolean' }
              }
            },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Story: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            resident: { type: 'string' },
            title: { type: 'string' },
            prompt: { type: 'string' },
            category: { 
              type: 'string', 
              enum: ['childhood', 'family', 'career', 'travel', 'hobbies', 'life-lessons', 'memories', 'other'] 
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
                status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] }
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
            _id: { type: 'string' },
            sender: { type: 'string' },
            recipient: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                relationship: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' }
              }
            },
            title: { type: 'string' },
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
            message: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                mood: { type: 'string', enum: ['happy', 'loving', 'thoughtful', 'encouraging', 'nostalgic', 'other'] }
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
            _id: { type: 'string' },
            resident: { type: 'string' },
            title: { type: 'string' },
            subtitle: { type: 'string' },
            dedication: { type: 'string' },
            stories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  story: { type: 'string' },
                  order: { type: 'number' },
                  pageNumber: { type: 'number' },
                  chapter: { type: 'string' }
                }
              }
            },
            design: {
              type: 'object',
              properties: {
                theme: { type: 'string', enum: ['classic', 'modern', 'vintage', 'elegant', 'simple'] },
                colorScheme: {
                  type: 'object',
                  properties: {
                    primary: { type: 'string' },
                    secondary: { type: 'string' },
                    accent: { type: 'string' }
                  }
                },
                fontFamily: { type: 'string' },
                fontSize: { type: 'string', enum: ['small', 'medium', 'large'] }
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
            error: { type: 'string' },
            message: { type: 'string' }
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
    './routes/*.js',
    './models/*.js',
    './server.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 