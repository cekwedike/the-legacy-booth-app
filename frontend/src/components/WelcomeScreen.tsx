import React from 'react';
import type { View } from '../types/types';
import Button from './ui/Button';

interface WelcomeScreenProps {
  navigate: (view: View) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-brand-text-primary font-serif">The Legacy Booth</h1>
        <p className="text-xl md:text-2xl text-brand-text-secondary mt-4 max-w-2xl mx-auto">
          Your digital keepsake for life's most precious stories and memories.
        </p>
      </div>
      <div className="mt-16 w-full max-w-sm space-y-4">
        <Button onClick={() => navigate('LOGIN')} variant="accent" className="py-4 text-lg">
          Sign In
        </Button>
        <Button onClick={() => navigate('SIGN_UP')} variant="secondary" className="py-4 text-lg">
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;