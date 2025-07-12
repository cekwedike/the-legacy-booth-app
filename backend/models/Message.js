const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
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
  recipientName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  recipientEmail: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  recipientRelationship: {
    type: String,
    trim: true,
    maxlength: 50
  },
  messageType: {
    type: String,
    enum: ['birthday', 'anniversary', 'holiday', 'daily', 'encouragement', 'memory', 'advice', 'gratitude', 'love', 'wisdom', 'personal'],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  audioFile: {
    type: String,
    required: true
  },
  audioPath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0,
    min: 0
  },
  transcription: {
    text: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    confidence: Number,
    language: {
      type: String,
      default: 'en'
    }
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'scheduled', 'sent', 'delivered', 'viewed', 'archived'],
    default: 'active'
  },
  deliveredAt: Date,
  viewedAt: Date,
  metadata: {
    recordingDate: {
      type: Date,
      default: Date.now
    },
    location: String,
    weather: String,
    device: String,
    recordingQuality: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  delivery: {
    method: {
      type: String,
      enum: ['email', 'sms', 'link', 'download', 'facility'],
      default: 'email'
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttempt: Date,
    errorMessage: String,
    success: {
      type: Boolean,
      default: false
    }
  },
  analytics: {
    playCount: {
      type: Number,
      default: 0
    },
    lastPlayed: Date,
    favoriteCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
messageSchema.index({ sender: 1, status: 1 });
messageSchema.index({ sender: 1, messageType: 1 });
messageSchema.index({ recipientEmail: 1 });
messageSchema.index({ scheduledFor: 1, status: 1 });
messageSchema.index({ 'delivery.attempts': 1 });
messageSchema.index({ isScheduled: 1, scheduledFor: 1 });
messageSchema.index({ tags: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual for message age in days
messageSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for delivery status
messageSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered' || this.status === 'viewed';
});

// Virtual for scheduled status
messageSchema.virtual('isScheduledForFuture').get(function() {
  return this.isScheduled && this.scheduledFor && this.scheduledFor > new Date();
});

// Virtual for audio duration in formatted string
messageSchema.virtual('durationFormatted').get(function() {
  if (!this.duration) return '0:00';
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  this.delivery.success = true;
  return this.save();
};

// Method to mark as viewed
messageSchema.methods.markAsViewed = function() {
  this.status = 'viewed';
  this.viewedAt = new Date();
  this.analytics.playCount += 1;
  this.analytics.lastPlayed = new Date();
  return this.save();
};

// Method to increment play count
messageSchema.methods.incrementPlayCount = function() {
  this.analytics.playCount += 1;
  this.analytics.lastPlayed = new Date();
  return this.save();
};

// Method to get delivery status
messageSchema.methods.getDeliveryStatus = function() {
  if (this.status === 'viewed') return 'Viewed';
  if (this.status === 'delivered') return 'Delivered';
  if (this.status === 'sent') return 'Sent';
  if (this.status === 'scheduled') return 'Scheduled';
  if (this.status === 'active') return 'Active';
  if (this.status === 'archived') return 'Archived';
  return 'Draft';
};

// Method to schedule message
messageSchema.methods.schedule = function(scheduledDate) {
  this.isScheduled = true;
  this.scheduledFor = scheduledDate;
  this.status = 'scheduled';
  return this.save();
};

// Method to unschedule message
messageSchema.methods.unschedule = function() {
  this.isScheduled = false;
  this.scheduledFor = null;
  this.status = 'active';
  return this.save();
};

// Method to archive message
messageSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Method to unarchive message
messageSchema.methods.unarchive = function() {
  this.status = 'active';
  return this.save();
};

// Static method to get scheduled messages that are due
messageSchema.statics.getDueScheduledMessages = function() {
  return this.find({
    isScheduled: true,
    status: 'scheduled',
    scheduledFor: { $lte: new Date() }
  });
};

// Static method to get messages by type
messageSchema.statics.getByType = function(senderId, messageType) {
  return this.find({
    sender: senderId,
    messageType: messageType
  }).sort({ createdAt: -1 });
};

// Static method to get messages by status
messageSchema.statics.getByStatus = function(senderId, status) {
  return this.find({
    sender: senderId,
    status: status
  }).sort({ createdAt: -1 });
};

// Static method to search messages
messageSchema.statics.search = function(senderId, query) {
  return this.find({
    sender: senderId,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { recipientName: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }).sort({ createdAt: -1 });
};

// Pre-save middleware to validate scheduled date
messageSchema.pre('save', function(next) {
  if (this.isScheduled && this.scheduledFor) {
    if (this.scheduledFor <= new Date()) {
      return next(new Error('Scheduled date must be in the future'));
    }
  }
  next();
});

// Pre-save middleware to update status based on scheduling
messageSchema.pre('save', function(next) {
  if (this.isScheduled && this.scheduledFor) {
    this.status = 'scheduled';
  } else if (this.status === 'scheduled' && !this.isScheduled) {
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema); 