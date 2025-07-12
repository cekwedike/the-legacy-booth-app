const mongoose = require('mongoose');

const legacyBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  theme: {
    type: String,
    enum: ['classic', 'modern', 'vintage', 'minimal'],
    default: 'classic'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  dedication: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  acknowledgments: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  coverImage: {
    url: String,
    altText: String
  },
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  archivedAt: Date,
  content: {
    introduction: String,
    tableOfContents: [{
      title: String,
      pageNumber: Number,
      type: {
        type: String,
        enum: ['story', 'message', 'chapter']
      }
    }],
    conclusion: String
  },
  design: {
    colorScheme: {
      primary: String,
      secondary: String,
      accent: String
    },
    fontFamily: {
      type: String,
      default: 'serif'
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    layout: {
      type: String,
      enum: ['single-column', 'two-column', 'magazine'],
      default: 'single-column'
    }
  },
  format: {
    pageCount: Number,
    wordCount: Number,
    estimatedReadingTime: Number, // in minutes
    dimensions: {
      width: Number, // in inches
      height: Number // in inches
    }
  },
  files: {
    pdf: String,
    epub: String,
    preview: {
      thumbnail: String,
      samplePages: [String]
    }
  },
  recipients: [{
    name: {
      type: String,
      required: true
    },
    relationship: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    deliveryMethod: {
      type: String,
      enum: ['email', 'mail', 'download', 'pickup'],
      default: 'email'
    },
    deliveredAt: Date,
    viewedAt: Date
  }],
  metadata: {
    tags: [String],
    notes: String,
    lastGenerated: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
legacyBookSchema.index({ user: 1, status: 1 });
legacyBookSchema.index({ user: 1, isFavorite: 1 });
legacyBookSchema.index({ status: 1, isPublic: 1 });
legacyBookSchema.index({ 'recipients.email': 1 });

// Virtual for book completion percentage
legacyBookSchema.virtual('completionPercentage').get(function() {
  if (this.status === 'published') return 100;
  if (this.status === 'draft') {
    const totalItems = this.stories.length + this.messages.length;
    if (totalItems === 0) return 0;
    if (totalItems >= 5) return 80;
    if (totalItems >= 3) return 60;
    if (totalItems >= 1) return 40;
    return 20;
  }
  return 0;
});

// Virtual for total word count
legacyBookSchema.virtual('totalWordCount').get(function() {
  return this.format.wordCount || 0;
});

// Virtual for estimated reading time
legacyBookSchema.virtual('estimatedReadingTime').get(function() {
  return this.format.estimatedReadingTime || 0;
});

// Method to add story to book
legacyBookSchema.methods.addStory = function(storyId) {
  if (!this.stories.includes(storyId)) {
    this.stories.push(storyId);
  }
  return this.save();
};

// Method to remove story from book
legacyBookSchema.methods.removeStory = function(storyId) {
  this.stories = this.stories.filter(id => id.toString() !== storyId.toString());
  return this.save();
};

// Method to add message to book
legacyBookSchema.methods.addMessage = function(messageId) {
  if (!this.messages.includes(messageId)) {
    this.messages.push(messageId);
  }
  return this.save();
};

// Method to remove message from book
legacyBookSchema.methods.removeMessage = function(messageId) {
  this.messages = this.messages.filter(id => id.toString() !== messageId.toString());
  return this.save();
};

// Method to update book status
legacyBookSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'published') {
    this.publishedAt = new Date();
  } else if (newStatus === 'archived') {
    this.archivedAt = new Date();
  }
  return this.save();
};

// Method to toggle favorite status
legacyBookSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Method to add recipient
legacyBookSchema.methods.addRecipient = function(recipientData) {
  this.recipients.push(recipientData);
  return this.save();
};

// Method to remove recipient
legacyBookSchema.methods.removeRecipient = function(recipientId) {
  this.recipients = this.recipients.filter(r => r._id.toString() !== recipientId.toString());
  return this.save();
};

// Pre-save middleware to update word count
legacyBookSchema.pre('save', function(next) {
  // Calculate estimated word count based on stories and messages
  const storyCount = this.stories.length;
  const messageCount = this.messages.length;
  const estimatedWords = (storyCount * 500) + (messageCount * 200); // Rough estimates
  this.format.wordCount = estimatedWords;
  this.format.estimatedReadingTime = Math.ceil(estimatedWords / 200); // Average reading speed
  next();
});

module.exports = mongoose.model('LegacyBook', legacyBookSchema); 