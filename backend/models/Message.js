const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    relationship: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: String
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['birthday', 'anniversary', 'holiday', 'daily', 'encouragement', 'memory', 'other'],
    required: true
  },
  content: {
    videoUrl: String,
    audioUrl: String,
    duration: Number, // in seconds
    fileSize: Number, // in bytes
    thumbnail: String
  },
  transcription: {
    text: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  message: {
    text: String, // Optional text message to accompany video
    mood: {
      type: String,
      enum: ['happy', 'loving', 'thoughtful', 'encouraging', 'nostalgic', 'other']
    }
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date,
  viewedAt: Date,
  status: {
    type: String,
    enum: ['draft', 'recorded', 'scheduled', 'sent', 'delivered', 'viewed'],
    default: 'draft'
  },
  privacy: {
    isPrivate: {
      type: Boolean,
      default: true
    },
    expiresAt: Date, // Optional expiration date
    allowFacilityUse: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    recordingDate: {
      type: Date,
      default: Date.now
    },
    location: String,
    weather: String,
    tags: [String]
  },
  delivery: {
    method: {
      type: String,
      enum: ['email', 'sms', 'link', 'download'],
      default: 'email'
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttempt: Date,
    errorMessage: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
messageSchema.index({ sender: 1, status: 1 });
messageSchema.index({ 'recipient.email': 1 });
messageSchema.index({ scheduledFor: 1, status: 1 });
messageSchema.index({ 'delivery.attempts': 1 });

// Virtual for message age
messageSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for delivery status
messageSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered' || this.status === 'viewed';
});

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// Method to mark as viewed
messageSchema.methods.markAsViewed = function() {
  this.status = 'viewed';
  this.viewedAt = new Date();
  return this.save();
};

// Method to get delivery status
messageSchema.methods.getDeliveryStatus = function() {
  if (this.status === 'viewed') return 'Viewed';
  if (this.status === 'delivered') return 'Delivered';
  if (this.status === 'sent') return 'Sent';
  if (this.status === 'scheduled') return 'Scheduled';
  if (this.status === 'recorded') return 'Recorded';
  return 'Draft';
};

module.exports = mongoose.model('Message', messageSchema); 