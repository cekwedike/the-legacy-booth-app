import { Request, Response, NextFunction } from 'express';
import { Document, Model } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'resident' | 'staff' | 'admin';
  roomNumber?: string;
  dateOfBirth?: Date;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'high-contrast';
    fontSize: 'small' | 'medium' | 'large';
    audioEnabled: boolean;
  };
  isActive: boolean;
  lastLogin: Date;
  age?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
}

// Story Types
export interface IStory extends Document {
  _id: string;
  resident: string | IUser;
  title: string;
  prompt?: string;
  category: 'childhood' | 'family' | 'career' | 'travel' | 'hobbies' | 'life-lessons' | 'memories' | 'other';
  recording?: {
    audioUrl?: string;
    videoUrl?: string;
    duration?: number;
    fileSize?: number;
    format: 'audio' | 'video';
  };
  transcription?: {
    text?: string;
    confidence?: number;
    language?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'not_available';
  };
  content?: {
    originalText?: string;
    editedText?: string;
    summary?: string;
    keywords?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastModified?: Date;
  };
  privacy?: {
    isPublic: boolean;
    sharedWith?: string[];
  };
  legacyBook?: {
    included: boolean;
    pageNumber?: number;
    chapter?: string;
  };
  status: 'draft' | 'recorded' | 'transcribed' | 'edited' | 'published';
  createdAt: Date;
  updatedAt: Date;
  wordCount?: number;
}

// Message Types
export interface IMessage extends Document {
  _id: string;
  sender: string | IUser;
  recipient: {
    name: string;
    relationship: string;
    email?: string;
    phone?: string;
  };
  title: string;
  message?: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'daily' | 'encouragement' | 'memory' | 'other';
  content?: {
    videoUrl?: string;
    audioUrl?: string;
    duration?: number;
    fileSize?: number;
  };
  transcription?: {
    text?: string;
    confidence?: number;
    language?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'not_available';
  };
  privacy?: {
    isPrivate: boolean;
    sharedWith?: string[];
  };
  metadata?: {
    tags?: string[];
    notes?: string;
  };
  status: 'draft' | 'recorded' | 'scheduled' | 'sent' | 'delivered' | 'viewed';
  scheduledFor?: Date;
  deliveredAt?: Date;
  viewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy Book Types
export interface ILegacyBook extends Document {
  _id: string;
  resident: string | IUser;
  title: string;
  subtitle?: string;
  dedication?: string;
  coverImage?: {
    url?: string;
    alt?: string;
  };
  content?: {
    chapters?: Array<{
      title: string;
      content: string;
      order: number;
    }>;
    introduction?: string;
    conclusion?: string;
  };
  design?: {
    theme: string;
    fontFamily: string;
    fontSize: number;
    spacing: number;
    colorScheme: string;
  };
  files?: {
    pdf?: string;
    epub?: string;
    print?: string;
  };
  format?: {
    wordCount?: number;
    pageCount?: number;
    estimatedReadingTime?: number;
  };
  metadata?: {
    lastModified?: Date;
    version?: number;
  };
  recipients?: Array<{
    name: string;
    relationship: string;
    email?: string;
    phone?: string;
  }>;
  stories: Array<{
    story: string | IStory;
    order: number;
    pageNumber?: number;
  }>;
  messages?: Array<{
    message: string | IMessage;
    order: number;
    pageNumber?: number;
  }>;
  status: 'draft' | 'in-progress' | 'review' | 'approved' | 'published' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
  addStory(storyId: string, order?: number): Promise<ILegacyBook>;
  removeStory(storyId: string): Promise<ILegacyBook>;
  updateStatus(newStatus: string): Promise<ILegacyBook>;
  addRecipient(recipientData: any): Promise<ILegacyBook>;
}

// Request Types
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'resident' | 'staff' | 'admin';
  roomNumber?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
}

export interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

// File Upload Types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Socket.IO Types
export interface SocketData {
  roomId: string;
  offer?: any;
  answer?: any;
  candidate?: any;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalStories: number;
  totalMessages: number;
  totalBooks: number;
  activeUsers: number;
  recentActivity: Array<{
    type: 'story' | 'message' | 'book' | 'user';
    action: string;
    timestamp: Date;
    userId: string;
  }>;
}

// Model Types
export interface UserModel extends Model<IUser> {}
export interface StoryModel extends Model<IStory> {}
export interface MessageModel extends Model<IMessage> {}
export interface LegacyBookModel extends Model<ILegacyBook> {} 