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

export interface MediaState {
  type: MediaType;
  blob: Blob | null;
  url: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  fontSize: number;
  volume: number;
  autoPlay: boolean;
}

export interface UserPreferences {
  theme: string;
  accessibility: AccessibilitySettings;
}

interface StoreState {
  stories: Story[];
  addStory: (story: Story) => void;
  updateStory: (id: string, story: Partial<Story>) => void;
  removeStory: (id: string) => void;

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

  currentMedia: { type: 'audio', blob: null, url: '' },
  setCurrentMedia: (media) => set(() => ({ currentMedia: media })),
  clearCurrentMedia: () => set(() => ({ currentMedia: { type: 'audio', blob: null, url: '' } })),

  userPreferences: { 
    theme: 'dark', 
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reducedMotion: false,
      fontSize: 16,
      volume: 50,
      autoPlay: false
    }
  },
  setUserPreferences: (prefs) => set((state) => ({ userPreferences: { ...state.userPreferences, ...prefs } })),
})); 