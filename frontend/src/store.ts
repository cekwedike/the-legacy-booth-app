import { create } from 'zustand';

export type MediaType = 'audio' | 'video';

export interface Story {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  mediaType: MediaType;
  mediaUrl: string;
  favorite: boolean;
  duration: string;
  date: string;
  status: string;
  tags: string[];
  createdAt?: string;
  recording?: {
    duration?: number;
    audioUrl?: string;
  };
  transcription?: {
    text?: string;
  };
  content?: {
    summary?: string;
  };
}

export interface Message {
  _id: string;
  recipientName: string;
  messageType: 'personal' | 'birthday' | 'anniversary' | 'holiday' | 'advice' | 'memory';
  description?: string;
  recording?: {
    audioUrl?: string;
    duration?: number;
    fileSize?: number;
  };
  status?: 'draft' | 'recorded' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface LegacyBook {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  storiesCount: number;
  messagesCount: number;
  status: 'draft' | 'published';
  theme: 'classic' | 'modern' | 'vintage' | 'elegant';
  createdAt: string;
  updatedAt: string;
}

export interface MediaState {
  type: MediaType;
  blob: Blob | null;
  url: string;
}

export interface UserPreferences {
  theme: string;
  accessibility: Record<string, any>;
}

interface StoreState {
  stories: Story[];
  addStory: (story: Story) => void;
  updateStory: (id: string, story: Partial<Story>) => void;
  removeStory: (id: string) => void;

  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  removeMessage: (id: string) => void;

  legacyBooks: LegacyBook[];
  addLegacyBook: (book: LegacyBook) => void;
  updateLegacyBook: (id: string, book: Partial<LegacyBook>) => void;
  removeLegacyBook: (id: string) => void;

  currentMedia: MediaState;
  setCurrentMedia: (media: MediaState) => void;
  clearCurrentMedia: () => void;

  userPreferences: UserPreferences;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
}

export const useAppStore = create<StoreState>((set) => ({
  stories: [],
  addStory: (story) => set((state) => ({ stories: [story, ...state.stories] })),
  updateStory: (id, story) => set((state) => ({
    stories: state.stories.map((s) => (s.id === id ? { ...s, ...story } : s)),
  })),
  removeStory: (id) => set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),

  messages: [
    {
      _id: '1',
      recipientName: 'Sarah Johnson',
      messageType: 'birthday',
      description: 'A special birthday message for my daughter who turns 25 today. Wishing her all the happiness in the world.',
      recording: {
        audioUrl: '/mock-audio.mp3',
        duration: 120,
        fileSize: 2048000
      },
      status: 'published',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      recipientName: 'Michael Chen',
      messageType: 'anniversary',
      description: 'Celebrating 30 years of marriage with my wonderful husband. Here\'s to many more years together.',
      recording: {
        audioUrl: '/mock-audio.mp3',
        duration: 180,
        fileSize: 3072000
      },
      status: 'published',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-10T14:20:00Z'
    },
    {
      _id: '3',
      recipientName: 'Emma Davis',
      messageType: 'advice',
      description: 'Life lessons I\'ve learned over the years that I want to pass on to my granddaughter.',
      recording: {
        audioUrl: '/mock-audio.mp3',
        duration: 240,
        fileSize: 4096000
      },
      status: 'published',
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T09:15:00Z'
    },
    {
      _id: '4',
      recipientName: 'David Wilson',
      messageType: 'memory',
      description: 'Sharing some of my favorite childhood memories with my son.',
      recording: {
        audioUrl: '/mock-audio.mp3',
        duration: 150,
        fileSize: 2560000
      },
      status: 'published',
      createdAt: '2024-01-01T16:45:00Z',
      updatedAt: '2024-01-01T16:45:00Z'
    }
  ],
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  updateMessage: (id, message) => set((state) => ({
    messages: state.messages.map((m) => (m._id === id ? { ...m, ...message } : m)),
  })),
  removeMessage: (id) => set((state) => ({ messages: state.messages.filter((m) => m._id !== id) })),

  legacyBooks: [
    {
      _id: '1',
      title: 'My Life Story',
      description: 'A collection of my most cherished memories and life lessons for my family.',
      coverImage: '/mock-cover-1.jpg',
      storiesCount: 12,
      messagesCount: 8,
      status: 'published',
      theme: 'classic',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      _id: '2',
      title: 'Family Wisdom',
      description: 'Advice and wisdom I want to pass down to future generations.',
      coverImage: '/mock-cover-2.jpg',
      storiesCount: 6,
      messagesCount: 15,
      status: 'published',
      theme: 'elegant',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      _id: '3',
      title: 'Childhood Memories',
      description: 'Stories from my childhood and early years that shaped who I am today.',
      coverImage: '/mock-cover-3.jpg',
      storiesCount: 8,
      messagesCount: 4,
      status: 'draft',
      theme: 'vintage',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z'
    },
    {
      _id: '4',
      title: 'Career Journey',
      description: 'My professional journey, achievements, and the lessons learned along the way.',
      coverImage: '/mock-cover-4.jpg',
      storiesCount: 10,
      messagesCount: 6,
      status: 'published',
      theme: 'modern',
      createdAt: '2024-01-05T16:45:00Z',
      updatedAt: '2024-01-05T16:45:00Z'
    }
  ],
  addLegacyBook: (book) => set((state) => ({ legacyBooks: [book, ...state.legacyBooks] })),
  updateLegacyBook: (id, book) => set((state) => ({
    legacyBooks: state.legacyBooks.map((b) => (b._id === id ? { ...b, ...book } : b)),
  })),
  removeLegacyBook: (id) => set((state) => ({ legacyBooks: state.legacyBooks.filter((b) => b._id !== id) })),

  currentMedia: { type: 'audio', blob: null, url: '' },
  setCurrentMedia: (media) => set(() => ({ currentMedia: media })),
  clearCurrentMedia: () => set(() => ({ currentMedia: { type: 'audio', blob: null, url: '' } })),

  userPreferences: { theme: 'dark', accessibility: {} },
  setUserPreferences: (prefs) => set((state) => ({ userPreferences: { ...state.userPreferences, ...prefs } })),
})); 