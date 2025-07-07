import React from 'react';
import type { View } from '../types/types';
import { RecordingType } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import Header from './ui/Header';
import { StoryIcon, VideoIcon, LogoutIcon, PhoneIcon, CameraIcon } from './ui/icons';

interface ResidentHomeProps {
  navigate: (view: View, context?: any) => void;
}

interface HomeCardProps {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

const HomeCard: React.FC<HomeCardProps> = ({ onClick, icon, title, description, className }) => (
    <button onClick={onClick} className="w-full text-left focus:outline-none group">
        <div className={`h-full bg-brand-surface rounded-2xl p-8 text-center transition-all duration-300 ease-in-out group-hover:shadow-[0_0_20px_rgba(229,122,68,0.15)] group-hover:-translate-y-1 group-hover:ring-1 group-hover:ring-brand-accent/30 group-focus:ring-1 group-focus:ring-brand-accent ${className}`}>
            <div className="flex flex-col items-center">
                 <div className="flex-shrink-0 text-brand-accent mb-5">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-brand-text-primary font-serif">{title}</h2>
                    <p className="text-base text-brand-text-secondary mt-1">{description}</p>
                </div>
            </div>
        </div>
    </button>
);


const ResidentHome: React.FC<ResidentHomeProps> = ({ navigate }) => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
       <Header title={`Welcome, ${currentUser.name.split(' ')[0]}!`}>
        <button onClick={logout} className="flex items-center font-semibold text-base text-brand-text-secondary hover:text-brand-text-primary transition-colors" aria-label="Logout">
          <LogoutIcon className="h-6 w-6 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </Header>
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary font-serif">Share Your Legacy</h1>
                <p className="text-xl text-brand-text-secondary mt-3">How would you like to connect today?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <HomeCard 
                onClick={() => navigate('PROMPTS_LIST')}
                icon={<StoryIcon className="h-12 w-12" />}
                title="Life Stories"
                description="Answer questions about your life."
              />
              <HomeCard 
                onClick={() => navigate('RECORDING', { recordingType: RecordingType.Message })}
                icon={<VideoIcon className="h-12 w-12" />}
                title="Leave a Video Message"
                description="Record a message for loved ones."
              />
               <HomeCard 
                onClick={() => navigate('CONTACT_FAMILY')}
                icon={<PhoneIcon className="h-12 w-12" />}
                title="Contact Your Family"
                description="Call or email a loved one."
              />
              <HomeCard 
                onClick={() => navigate('SEND_GREETING')}
                icon={<CameraIcon className="h-12 w-12" />}
                title="Send a Greeting"
                description="Share a photo and a message."
              />
            </div>
        </div>
      </main>
    </div>
  );
};

export default ResidentHome;