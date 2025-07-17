import {
  Book,
  Message,
  VideoCall,
  Mic,
  PlayArrow,
  Star,
  Add,
  ArrowForward
} from '@mui/icons-material';

export interface QuickAction {
  title: string;
  description: string;
  iconName: string;
  path: string;
  color: string;
  stats: string;
  buttonText?: string;
}

export interface Stat {
  label: string;
  value: string;
  iconName: string;
  color: string;
}

export interface RecentStory {
  id: number;
  title: string;
  category: string;
  duration: string;
  date: string;
  status: 'published' | 'transcribed' | 'draft';
}

export interface ProgressGoal {
  label: string;
  current: number;
  target: number;
  color: string;
}

export interface DashboardConfig {
  quickActions: QuickAction[];
  stats: Stat[];
  recentStories: RecentStory[];
  progressGoals: ProgressGoal[];
  welcomeMessage: string;
  subtitle: string;
  sections: {
    quickActions: string;
    recentStories: string;
    progressOverview: string;
    viewAllButton: string;
    recordNewButton: string;
  };
}

export const dashboardConfig: Record<string, DashboardConfig> = {
  resident: {
    quickActions: [
      {
        title: 'Share Your Story',
        description: 'Record and preserve your life memories',
        iconName: 'Mic',
        path: '/stories/record',
        color: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        stats: '15 stories shared'
      },
      {
        title: 'Send Love Notes',
        description: 'Create personal messages for family',
        iconName: 'Message',
        path: '/messages/record',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        stats: '23 messages sent'
      },
      {
        title: 'Family Connect',
        description: 'Video chat with loved ones',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        stats: '7 calls this month'
      },
      {
        title: 'Create Legacy Book',
        description: 'Compile stories into beautiful books',
        iconName: 'Book',
        path: '/legacy-books',
        color: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        stats: '4 books created'
      }
    ],
    stats: [
      { label: 'Stories Shared', value: '32', iconName: 'Book', color: '#059669' },
      { label: 'Love Notes', value: '28', iconName: 'Message', color: '#16a34a' },
      { label: 'Family Calls', value: '18', iconName: 'VideoCall', color: '#10b981' },
      { label: 'Legacy Books', value: '4', iconName: 'Star', color: '#047857' }
    ],
    recentStories: [
      {
        id: 1,
        title: 'My Wedding Day',
        category: 'Love & Family',
        duration: '12:45',
        date: 'Yesterday',
        status: 'published'
      },
      {
        id: 2,
        title: 'First Car Purchase',
        category: 'Life Milestones',
        duration: '7:22',
        date: '3 days ago',
        status: 'transcribed'
      },
      {
        id: 3,
        title: 'College Graduation',
        category: 'Education & Growth',
        duration: '9:18',
        date: '1 week ago',
        status: 'published'
      }
    ],
    progressGoals: [
      { label: 'Stories Goal', current: 32, target: 50, color: '#059669' },
      { label: 'Messages Goal', current: 28, target: 40, color: '#16a34a' },
      { label: 'Legacy Books', current: 4, target: 8, color: '#047857' }
    ],
    welcomeMessage: 'Hello {name}! Ready to share more memories? 🌟',
    subtitle: 'Your legacy is being beautifully preserved today.',
    sections: {
      quickActions: 'Quick Actions',
      recentStories: 'Recent Stories',
      progressOverview: 'Progress Overview',
      viewAllButton: 'View All',
      recordNewButton: 'Record New'
    }
  },
  family: {
    quickActions: [
      {
        title: 'Read Messages',
        description: 'View heartfelt messages from your loved one',
        iconName: 'Message',
        path: '/messages/library',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        stats: '28 messages waiting'
      },
      {
        title: 'Start Video Call',
        description: 'Connect face-to-face with your loved one',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        stats: 'Last call: 2 days ago'
      },
      {
        title: 'Browse Legacy Books',
        description: 'Read your loved one\'s life stories',
        iconName: 'Book',
        path: '/legacy-books',
        color: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        stats: '4 books available'
      }
    ],
    stats: [
      { label: 'Messages Received', value: '28', iconName: 'Message', color: '#16a34a' },
      { label: 'Video Calls', value: '12', iconName: 'VideoCall', color: '#10b981' },
      { label: 'Legacy Books', value: '4', iconName: 'Book', color: '#047857' },
      { label: 'Stories Read', value: '32', iconName: 'Star', color: '#059669' }
    ],
    recentStories: [],
    progressGoals: [],
    welcomeMessage: 'Welcome back, {name}! 💕',
    subtitle: 'Your loved one has been busy creating memories for you.',
    sections: {
      quickActions: 'Quick Actions',
      recentStories: 'Recent Stories',
      progressOverview: 'Progress Overview',
      viewAllButton: 'View All',
      recordNewButton: 'Record New'
    }
  },
  caregiver: {
    quickActions: [
      {
        title: 'Assist with Stories',
        description: 'Help residents record their life experiences',
        iconName: 'Book',
        path: '/stories/library',
        color: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        stats: '12 residents active'
      },
      {
        title: 'Message Support',
        description: 'Help residents send messages to family',
        iconName: 'Message',
        path: '/messages/library',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        stats: '18 messages pending'
      },
      {
        title: 'Activity Monitor',
        description: 'Track resident engagement and progress',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        stats: '8 calls today'
      }
    ],
    stats: [
      { label: 'Active Residents', value: '12', iconName: 'Book', color: '#059669' },
      { label: 'Pending Messages', value: '18', iconName: 'Message', color: '#16a34a' },
      { label: 'Today\'s Calls', value: '8', iconName: 'VideoCall', color: '#10b981' },
      { label: 'Stories Recorded', value: '67', iconName: 'Star', color: '#047857' }
    ],
    recentStories: [],
    progressGoals: [],
    welcomeMessage: 'Good morning, {name}! 🌅',
    subtitle: 'You\'re helping create beautiful legacies today.',
    sections: {
      quickActions: 'Quick Actions',
      recentStories: 'Recent Stories',
      progressOverview: 'Progress Overview',
      viewAllButton: 'View All',
      recordNewButton: 'Record New'
    }
  }
};

export const getDashboardConfig = (role: string): DashboardConfig => {
  return dashboardConfig[role] || dashboardConfig.resident;
}; 