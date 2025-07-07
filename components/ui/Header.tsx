import React from 'react';
import { BackIcon } from './icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, children }) => {
  return (
    <header className="w-full bg-brand-background sticky top-0 z-10 border-b border-brand-surface/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-2 sm:mr-4 text-brand-text-secondary hover:text-brand-text-primary p-2 rounded-full hover:bg-brand-surface/80 transition-colors"
              aria-label="Go back"
            >
              <BackIcon className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary font-serif">{title}</h1>
        </div>
        <div>
            {children}
        </div>
      </div>
    </header>
  );
};

export default Header;