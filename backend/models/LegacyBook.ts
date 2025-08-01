import mongoose, { Schema, Document } from 'mongoose';
import { ILegacyBook } from '../types';

const legacyBookSchema = new Schema<ILegacyBook>({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: String,
  dedication: String,
  coverImage: {
    url: String,
    altText: String
  },
  stories: [{
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    pageNumber: Number,
    chapter: String
  }],
  messages: [{
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    order: Number,
    pageNumber: Number
  }],
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
    chapters: [{
      title: String,
      stories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
      }],
      order: Number
    }],
    conclusion: String,
    acknowledgments: String
  },
  design: {
    theme: {
      type: String,
      enum: ['classic', 'modern', 'vintage', 'elegant', 'simple'],
      default: 'classic'
    },
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
    type: {
      type: String,
      enum: ['digital', 'print', 'both'],
      default: 'both'
    },
    pageCount: Number,
    wordCount: Number,
    estimatedReadingTime: Number, // in minutes
    dimensions: {
      width: Number, // in inches
      height: Number // in inches
    }
  },
  files: {
    digital: {
      pdf: String,
      epub: String,
      mobi: String
    },
    print: {
      cover: String,
      interior: String,
      printReady: String
    },
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
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'review', 'approved', 'published', 'delivered'],
    default: 'draft'
  },
  publishing: {
    printQuantity: {
      type: Number,
      default: 1
    },
    printCost: Number,
    shippingCost: Number,
    totalCost: Number,
    printProvider: String,
    orderId: String,
    estimatedDelivery: Date,
    trackingNumber: String
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tags: [String],
    notes: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
legacyBookSchema.index({ resident: 1, status: 1 });
legacyBookSchema.index({ 'recipients.email': 1 });
legacyBookSchema.index({ status: 1, 'publishing.estimatedDelivery': 1 });

// Virtual for book completion percentage
legacyBookSchema.virtual('completionPercentage').get(function(this: ILegacyBook): number {
  if (this.status === 'delivered') return 100;
  if (this.status === 'published') return 90;
  if (this.status === 'approved') return 80;
  if (this.status === 'review') return 60;
  if (this.status === 'in-progress') return 40;
  return 20;
});

// Virtual for total word count
legacyBookSchema.virtual('totalWordCount').get(function(this: ILegacyBook): number {
  return this.format?.wordCount || 0;
});

// Method to add story to book
legacyBookSchema.methods.addStory = function(this: ILegacyBook, storyId: string, order: number = 0): Promise<ILegacyBook> {
  const existingStory = this.stories.find(s => s.story.toString() === storyId.toString());
  if (!existingStory) {
    this.stories.push({ story: storyId, order });
    this.stories.sort((a, b) => a.order - b.order);
  }
  return this.save();
};

// Method to remove story from book
legacyBookSchema.methods.removeStory = function(this: ILegacyBook, storyId: string): Promise<ILegacyBook> {
  this.stories = this.stories.filter(s => s.story.toString() !== storyId.toString());
  return this.save();
};

// Method to update book status
legacyBookSchema.methods.updateStatus = function(this: ILegacyBook, newStatus: string): Promise<ILegacyBook> {
  this.status = newStatus as any;
  this.metadata.lastModified = new Date();
  return this.save();
};

// Method to add recipient
legacyBookSchema.methods.addRecipient = function(this: ILegacyBook, recipientData: any): Promise<ILegacyBook> {
  this.recipients.push(recipientData);
  return this.save();
};

export default mongoose.model<ILegacyBook>('LegacyBook', legacyBookSchema); 