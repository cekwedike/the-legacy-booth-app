import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LegacyDataProvider } from './hooks/useLegacyData';
import type { View } from './types/types';
import LoginScreen from './components/LoginScreen';
import ResidentHome from './components/ResidentHome';
import PromptsList from './components/PromptsList';
import RecordingScreen from './components/RecordingScreen';
import StaffHome from './components/StaffHome';
import RecordingDetail from './components/RecordingDetail';
import StaffManagePrompts from './components/StaffManagePrompts';
import ContactFamilyScreen from './components/ContactFamilyScreen';
import SendGreetingScreen from './components/SendGreetingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SignUpScreen from './components/SignUpScreen';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [view, setView] = useState<View>('WELCOME');
  const [viewContext, setViewContext] = useState<any>(null);

  const navigate = (newView: View, context: any = null) => {
    setView(newView);
    setViewContext(context);
  };
  
  useEffect(() => {
    if (currentUser) {
      // If user logs in, navigate them to their respective home screen
      setView(currentUser.isStaff ? 'STAFF_HOME' : 'RESIDENT_HOME');
    } else {
      // If user logs out, or is not logged in initially, ensure they are on a public screen.
      // If they were on a private screen, send them to WELCOME.
       if (view !== 'WELCOME' && view !== 'LOGIN' && view !== 'SIGN_UP') {
         setView('WELCOME');
         setViewContext(null);
      }
    }
  }, [currentUser]);

  if (!currentUser) {
     switch (view) {
      case 'LOGIN':
        return <LoginScreen navigate={navigate} />;
      case 'SIGN_UP':
        return <SignUpScreen navigate={navigate} />;
      case 'WELCOME':
      default:
        return <WelcomeScreen navigate={navigate} />;
    }
  }

  // ---- Logged In Views ----

  switch (view) {
    case 'RESIDENT_HOME':
      return <ResidentHome navigate={navigate} />;
    case 'PROMPTS_LIST':
      return <PromptsList navigate={navigate} />;
    case 'RECORDING':
      return <RecordingScreen navigate={navigate} context={viewContext} />;
    case 'CONTACT_FAMILY':
      return <ContactFamilyScreen navigate={navigate} />;
    case 'SEND_GREETING':
        return <SendGreetingScreen navigate={navigate} />;
    case 'STAFF_HOME':
      return <StaffHome navigate={navigate} />;
    case 'STAFF_RECORDING_DETAIL':
      return <RecordingDetail navigate={navigate} context={viewContext} />;
    case 'STAFF_MANAGE_PROMPTS':
      return <StaffManagePrompts navigate={navigate} />;
    default:
      // Fallback to home if state is invalid for a logged-in user
      setView(currentUser.isStaff ? 'STAFF_HOME' : 'RESIDENT_HOME');
      return currentUser.isStaff ? <StaffHome navigate={navigate} /> : <ResidentHome navigate={navigate} />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LegacyDataProvider>
        <AppContent />
      </LegacyDataProvider>
    </AuthProvider>
  );
};

export default App;