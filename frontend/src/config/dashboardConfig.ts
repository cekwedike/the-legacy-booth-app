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
  stats?: string; // Made optional since it will be populated from actual data
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
  layout: {
    quickActionsGrid: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
    };
    cardHeight: string;
    iconSize: number;
    iconBorderRadius: string;
    cardBackground: string;
    cardBorderRadius: number;
    cardPadding: number;
    hoverEffect: {
      transform: string;
      boxShadow: string;
      borderColor: string;
    };
    typography: {
      titleColor: string;
      descriptionColor: string;
      statsColor: string;
    };
  };
  features: {
    showRecentStories: boolean;
    showProgressOverview: boolean;
    showStats: boolean;
    showQuickActions: boolean;
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
        buttonText: 'Start Recording'
      },
      {
        title: 'Send Love Notes',
        description: 'Create personal messages for family',
        iconName: 'Message',
        path: '/messages/record',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        buttonText: 'Send Message'
      },
      {
        title: 'Family Connect',
        description: 'Video chat with loved ones',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        buttonText: 'Start Call'
      },
      {
        title: 'Create Legacy Book',
        description: 'Compile stories into beautiful books',
        iconName: 'Book',
        path: '/legacy-books',
        color: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        buttonText: 'Create Book'
      }
    ],
    stats: [], // Will be populated from actual data
    recentStories: [], // Will be populated from actual data
    progressGoals: [], // Will be populated from actual data
    welcomeMessage: 'Hello {name}! Ready To Share More Memories?',
    subtitle: 'Your Legacy Is Being Beautifully Preserved Today.',
    sections: {
      quickActions: 'Quick Actions',
      recentStories: 'Recent Stories',
      progressOverview: 'Progress Overview',
      viewAllButton: 'View All',
      recordNewButton: 'Record New'
    },
    layout: {
      quickActionsGrid: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
      },
      cardHeight: '150px',
      iconSize: 40,
      iconBorderRadius: '8px',
      cardBackground: 'transparent',
      cardBorderRadius: 0,
      cardPadding: 0,
      hoverEffect: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        borderColor: 'transparent',
      },
      typography: {
        titleColor: '#333',
        descriptionColor: '#666',
        statsColor: '#059669',
      },
    },
    features: {
      showRecentStories: true,
      showProgressOverview: true,
      showStats: true,
      showQuickActions: true,
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
        buttonText: 'Read Messages'
      },
      {
        title: 'Start Video Call',
        description: 'Connect face-to-face with your loved one',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        buttonText: 'Start Call'
      },
      {
        title: 'Browse Legacy Books',
        description: 'Read your loved one\'s life stories',
        iconName: 'Book',
        path: '/legacy-books',
        color: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        buttonText: 'Browse Books'
      }
    ],
    stats: [], // Will be populated from actual data
    recentStories: [], // Will be populated from actual data
    progressGoals: [], // Will be populated from actual data
    welcomeMessage: 'Welcome Back, {name}!',
    subtitle: 'Your Loved One Has Been Busy Creating Memories For You.',
    sections: {
      quickActions: 'Quick Actions',
      recentStories: 'Recent Stories',
      progressOverview: 'Progress Overview',
      viewAllButton: 'View All',
      recordNewButton: 'Record New'
    },
    layout: {
      quickActionsGrid: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
      },
      cardHeight: '150px',
      iconSize: 40,
      iconBorderRadius: '8px',
      cardBackground: 'transparent',
      cardBorderRadius: 0,
      cardPadding: 0,
      hoverEffect: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        borderColor: 'transparent',
      },
      typography: {
        titleColor: '#333',
        descriptionColor: '#666',
        statsColor: '#16a34a',
      },
    },
    features: {
      showRecentStories: false, // Family doesn't need recent stories
      showProgressOverview: false, // Family doesn't need progress
      showStats: true,
      showQuickActions: true,
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
        buttonText: 'Assist Stories'
      },
      {
        title: 'Message Support',
        description: 'Help residents send messages to family',
        iconName: 'Message',
        path: '/messages/library',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        buttonText: 'Support Messages'
      },
      {
        title: 'Activity Monitor',
        description: 'Track resident engagement and progress',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        buttonText: 'Monitor Activity'
      }
    ],
    stats: [], // Will be populated from actual data
    recentStories: [], // Will be populated from actual data
    progressGoals: [], // Will be populated from actual data
    welcomeMessage: 'Good Morning, {name}!',
    subtitle: 'You\'re Helping Create Beautiful Legacies Today.',
    sections: {
      quickActions: 'Quick Actions',
      recentStories: 'Recent Stories',
      progressOverview: 'Progress Overview',
      viewAllButton: 'View All',
      recordNewButton: 'Record New'
    },
    layout: {
      quickActionsGrid: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
      },
      cardHeight: '150px',
      iconSize: 40,
      iconBorderRadius: '8px',
      cardBackground: 'transparent',
      cardBorderRadius: 0,
      cardPadding: 0,
      hoverEffect: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        borderColor: 'transparent',
      },
      typography: {
        titleColor: '#333',
        descriptionColor: '#666',
        statsColor: '#10b981',
      },
    },
    features: {
      showRecentStories: true,
      showProgressOverview: true,
      showStats: true,
      showQuickActions: true,
    }
  }
};

export const getDashboardConfig = (role: string): DashboardConfig => {
  return dashboardConfig[role] || dashboardConfig.resident;
}; 