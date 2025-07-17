import React from 'react';
import {
  Book,
  Message,
  VideoCall,
  Mic,
  PlayArrow,
  Star,
  Add,
  ArrowForward,
  Person,
  Settings,
  Dashboard as DashboardIcon,
  LibraryBooks,
  RecordVoiceOver,
  Chat,
  Phone,
  Edit,
  Delete,
  Visibility,
  Download,
  Share,
  Favorite,
  History,
  Notifications,
  Help,
  Info,
  Warning,
  Error,
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  Sort,
  Refresh,
  MoreVert,
  Menu,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';

const iconMap: Record<string, React.ComponentType<any>> = {
  Book,
  Message,
  VideoCall,
  Mic,
  PlayArrow,
  Star,
  Add,
  ArrowForward,
  Person,
  Settings,
  Dashboard: DashboardIcon,
  LibraryBooks,
  RecordVoiceOver,
  Chat,
  Phone,
  Edit,
  Delete,
  Visibility,
  Download,
  Share,
  Favorite,
  History,
  Notifications,
  Help,
  Info,
  Warning,
  Error,
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  Sort,
  Refresh,
  MoreVert,
  Menu,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardArrowLeft,
  KeyboardArrowRight
};

export const getIcon = (iconName: string, props?: any): React.ReactElement => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found, using default icon`);
    return <Info {...props} />;
  }
  return <IconComponent {...props} />;
};

export const getIconComponent = (iconName: string): React.ComponentType<any> => {
  return iconMap[iconName] || Info;
}; 