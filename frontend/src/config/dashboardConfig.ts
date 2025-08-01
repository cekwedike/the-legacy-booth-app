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
  faculty: {
    quickActions: [
      {
        title: 'Guide Story Creation',
        description: 'Help seniors record and preserve their life memories',
        iconName: 'Mic',
        path: '/stories/record',
        color: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        buttonText: 'Start Session'
      },
      {
        title: 'Message Support',
        description: 'Assist seniors in sending messages to family',
        iconName: 'Message',
        path: '/messages/record',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        buttonText: 'Help with Messages'
      },
      {
        title: 'Legacy Books',
        description: 'Create beautiful legacy books with seniors',
        iconName: 'Book',
        path: '/legacy-books',
        color: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
        buttonText: 'Create Legacy Book'
      },
      {
        title: 'Video Sessions',
        description: 'Connect with seniors for remote sessions',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        buttonText: 'Start Session'
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
  senior: {
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
        title: 'Send Messages',
        description: 'Create messages for your loved ones',
        iconName: 'Message',
        path: '/messages/record',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        buttonText: 'Create Message'
      },
      {
        title: 'View Legacy Books',
        description: 'See your beautiful legacy books',
        iconName: 'Book',
        path: '/legacy-books',
        color: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
        buttonText: 'View Books'
      },
      {
        title: 'Video Call',
        description: 'Connect with family and friends',
        iconName: 'VideoCall',
        path: '/video-call',
        color: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        buttonText: 'Start Call'
      }
    ],
    stats: [], // Will be populated from actual data
    recentStories: [], // Will be populated from actual data
    progressGoals: [], // Will be populated from actual data
    welcomeMessage: 'Good Morning, {name}!',
    subtitle: 'Your Legacy Awaits - Let\'s Create Something Beautiful Together.',
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
  admin: {
    quickActions: [
      {
        title: 'User Management',
        description: 'Manage faculty and senior accounts',
        iconName: 'Book',
        path: '/admin/users',
        color: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        buttonText: 'Manage Users'
      },
      {
        title: 'Content Review',
        description: 'Review and moderate content',
        iconName: 'Message',
        path: '/admin/content',
        color: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        buttonText: 'Review Content'
      },
      {
        title: 'System Overview',
        description: 'View system statistics and analytics',
        iconName: 'VideoCall',
        path: '/admin/dashboard',
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        buttonText: 'View Analytics'
      }
    ],
    stats: [], // Will be populated from actual data
    recentStories: [], // Will be populated from actual data
    progressGoals: [], // Will be populated from actual data
    welcomeMessage: 'Good Morning, {name}!',
    subtitle: 'System Administration Dashboard.',
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
      showRecentStories: false, // Admin doesn't need recent stories
      showProgressOverview: false, // Admin doesn't need progress
      showStats: true,
      showQuickActions: true,
    }
  }
};

export const getDashboardConfig = (role: string): DashboardConfig => {
  return dashboardConfig[role] || dashboardConfig.faculty;
}; 