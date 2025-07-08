// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'resident' | 'family' | 'caregiver' | 'staff' | 'admin';
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Story Types
export interface Story {
  _id: string;
  title: string;
  description?: string;
  category: string;
  status: 'draft' | 'recorded' | 'transcribed' | 'published';
  user: User;
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
    summary?: string;
    keywords?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    originalText?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Message Types
export interface Message {
  _id: string;
  recipientName: string;
  messageType: 'personal' | 'birthday' | 'anniversary' | 'holiday' | 'advice' | 'memory';
  description?: string;
  user: User;
  recording?: {
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
  status?: 'draft' | 'recorded' | 'published';
  createdAt: string;
  updatedAt: string;
}

// Legacy Book Types
export interface LegacyBook {
  _id: string;
  title: string;
  description?: string;
  user: User;
  stories?: Story[];
  messages?: Message[];
  status: 'draft' | 'published';
  storiesCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'resident' | 'family' | 'caregiver' | 'staff' | 'admin';
  roomNumber?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
}

// Accessibility Types
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  fontSize: number;
  volume: number;
  autoPlay: boolean;
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface StoryFormData {
  title: string;
  description?: string;
  category?: string;
}

export interface MessageFormData {
  recipientName: string;
  messageType: string;
  description?: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalStories: number;
  totalMessages: number;
  totalBooks: number;
  activeUsers: number;
} 