const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  prompt: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['childhood', 'family', 'career', 'travel', 'hobbies', 'life-lessons', 'memories', 'other'],
    required: true
  },
  recording: {
    audioUrl: String,
    videoUrl: String,
    duration: Number, // in seconds
    fileSize: Number, // in bytes
    format: String // 'audio' or 'video'
  },
  transcription: {
    text: String,
    confidence: Number, // 0-1
    language: {
      type: String,
      default: 'en'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  content: {
    originalText: String, // Raw transcription
    editedText: String, // Cleaned and edited version
    summary: String, // AI-generated summary
    keywords: [String], // Extracted keywords
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    }
  },
  metadata: {
    recordingDate: {
      type: Date,
      default: Date.now
    },
    location: String,
    weather: String,
    mood: {
      type: String,
      enum: ['happy', 'calm', 'excited', 'thoughtful', 'nostalgic', 'other']
    },
    tags: [String]
  },
  privacy: {
    isPublic: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    allowFacilityUse: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['draft', 'recorded', 'transcribed', 'edited', 'published'],
    default: 'draft'
  },
  legacyBook: {
    included: {
      type: Boolean,
      default: false
    },
    pageNumber: Number,
    chapter: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
storySchema.index({ user: 1, category: 1 });
storySchema.index({ 'transcription.status': 1 });
storySchema.index({ status: 1 });

// Virtual for story length
storySchema.virtual('wordCount').get(function() {
  if (!this.content.editedText) return 0;
  return this.content.editedText.split(/\s+/).length;
});

// Virtual for reading time (average 200 words per minute)
storySchema.virtual('readingTime').get(function() {
  return Math.ceil(this.wordCount / 200);
});

// Method to get story summary
storySchema.methods.getSummary = function() {
  if (this.content.summary) return this.content.summary;
  
  if (this.content.editedText) {
    const words = this.content.editedText.split(' ');
    return words.slice(0, 50).join(' ') + (words.length > 50 ? '...' : '');
  }
  
  return 'No content available';
};

module.exports = mongoose.model('Story', storySchema); 